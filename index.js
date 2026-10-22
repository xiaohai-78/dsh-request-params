/**
 * Host half: wraps the global `fetch` so model requests carry the extra parameters the rules describe, and serves one
 * authenticated POST route, `/api/dsh-request-params`, for the Request Parameters page.
 *
 * The rules live in `<profile>/.dsh-request-params/config.json` (config-store.js). The host keeps them in memory, reads
 * them before the first request, and reloads them when the file changes on disk (another dsh process or a hand edit).
 * The interceptor (interceptor.js) applies them to every model request this process sends and keeps a short log; the
 * page reads the log, previews rules against a sample request (`dryRun`), and reads OpenRouter's public provider and
 * model catalog (openrouter.js) to fill the routing form.
 *
 * Nothing leaves the machine except those catalog reads, which carry no rules, keys, or conversation text.
 */
import { readFileSync } from 'node:fs'
import { rename, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { ConfigFileError, ConfigStore, ConflictError } from './config-store.js'
import { createInterceptor } from './interceptor.js'
import { CatalogError, createCatalog } from './openrouter.js'
import { PRESET_IDS, buildPreset, emptyForm, formOfRule, presetHosts } from './presets.js'
import { FORBIDDEN_HEADERS, LIMITS, PROTECTED_BODY, applyRules, invalidTargets, normalizeConfig, requestModel, rulesFor, validateConfig } from './rules.js'

const ROUTE = '/api/dsh-request-params'
const STATE_DIR = '.dsh-request-params'
/** How often the config file is checked for outside changes, at most, in milliseconds. */
const RELOAD_CHECK_MS = 3000
/** Largest sample request body a dry run reads, in characters, and largest configuration saved. */
const DRY_RUN_MAX_CHARS = 256 * 1024
const SAVE_MAX_CHARS = 2 * 1024 * 1024

export const name = 'dsh-request-params'
export const inject = ['configEditor']

/** A refusal the page can word in its own locale; `message` is the English fallback. */
class ActionError extends Error {
  constructor(code, message, details) {
    super(message)
    this.code = code
    this.details = details
  }
}

const message = error => (error instanceof Error ? error.message : String(error))

/**
 * Normalize a configuration and drop the preset of any rule that no longer equals what its preset form builds, so the
 * page opens only forms that still describe the rule.
 */
function settledConfig(raw) {
  const config = normalizeConfig(raw)
  for (const rule of config.rules) {
    if (rule.preset !== undefined && formOfRule(rule) === undefined) delete rule.preset
  }
  return config
}

function readVersion() {
  try {
    return JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version
  } catch {
    // A missing or unreadable package.json only leaves the version out of the page.
    return undefined
  }
}

export function apply(ctx) {
  const store = new ConfigStore(join(dirname(ctx.configEditor.documentPath), STATE_DIR))
  const m = { ctx, store, config: { enabled: true, rules: [] }, revision: 0, damaged: undefined, seen: undefined, checkedAt: 0, version: readVersion(), catalog: createCatalog() }
  // The first request waits for the rules; later ones check the file at most every few seconds.
  const settle = promise => promise.catch(error => ctx.logger.warn(`dsh-request-params could not read its rules: ${message(error)}`))
  m.loading = settle(load(m))
  m.interceptor = createInterceptor({
    getConfig: () => m.config,
    beforeRequest: () => (m.loading = settle(m.loading.then(() => refresh(m)))),
  })
  ctx.effect(() => {
    m.interceptor.install()
    return () => m.interceptor.uninstall()
  }, 'dsh-request-params: fetch')
  ctx.inject(['connection'], (c) => {
    c.effect(() => c.connection.fetch.register({
      path: ROUTE,
      methods: ['POST'],
      requestBody: 'buffered',
      fetch: request => handle(m, request),
    }), 'dsh-request-params: route')
  })
}

/** Read the rules from disk into memory; a damaged file leaves memory empty and is reported on the page. */
async function load(m) {
  try {
    const { revision, config } = await m.store.read()
    m.config = settledConfig(config)
    m.revision = revision
    m.damaged = undefined
  } catch (error) {
    if (!(error instanceof ConfigFileError)) throw error
    m.config = { enabled: true, rules: [] }
    m.damaged = { path: error.path, message: error.message }
    m.ctx.logger.warn(`dsh-request-params is not applying any rule: ${error.message}`)
  }
  m.seen = await signature(m.store.path)
  m.checkedAt = Date.now()
}

/** Size and modification time of the file, to tell whether it changed since it was read. */
async function signature(path) {
  try {
    const info = await stat(path)
    return `${info.size}:${info.mtimeMs}`
  } catch (error) {
    if (error?.code === 'ENOENT') return 'absent'
    throw error
  }
}

/** Reload the rules when the file changed since they were read. */
async function refresh(m, force = false) {
  const now = Date.now()
  if (!force && now - m.checkedAt < RELOAD_CHECK_MS) return
  m.checkedAt = now
  const current = await signature(m.store.path)
  if (current !== m.seen) await load(m)
}

/** The environment variables the rules read, and whether each is set (never its value). */
function envStatus(config) {
  const names = new Set()
  const walk = (value) => {
    if (typeof value === 'string') for (const match of value.matchAll(/\{\{\s*env:\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g)) names.add(match[1])
    else if (Array.isArray(value)) value.forEach(walk)
    else if (value !== null && typeof value === 'object') Object.values(value).forEach(walk)
  }
  for (const rule of config.rules) {
    walk(rule.body.merge)
    walk(rule.body.defaults)
    walk(rule.headers.set)
  }
  return Object.fromEntries([...names].sort().map(name => [name, typeof process.env[name] === 'string' && process.env[name] !== '']))
}

/** The state the page shows. */
function snapshot(m) {
  return {
    version: m.version,
    path: m.store.path,
    revision: m.revision,
    damaged: m.damaged,
    enabled: m.config.enabled,
    rules: m.config.rules,
    problems: validateConfig(m.config),
    env: envStatus(m.config),
    recent: m.interceptor.recent(),
    endpoints: m.interceptor.endpoints(),
    limits: { ...LIMITS, protectedBody: [...PROTECTED_BODY], forbiddenHeaders: [...FORBIDDEN_HEADERS] },
    presets: Object.fromEntries(PRESET_IDS.map(id => [id, { form: emptyForm(id), hosts: presetHosts(id) }])),
  }
}

function url(value) {
  let parsed
  try {
    parsed = new URL(value)
  } catch {
    throw new ActionError('bad-url', 'Give a full URL such as https://openrouter.ai/api/v1/chat/completions')
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new ActionError('bad-url', 'The URL must start with http:// or https://')
  return parsed
}

const ACTIONS = {
  async get(m) {
    await m.loading
    await refresh(m, true)
    return snapshot(m)
  },

  /** The request log, and the rules revision so a page can tell that the file changed elsewhere. */
  async recent(m) {
    await m.loading
    await refresh(m)
    return { recent: m.interceptor.recent(), endpoints: m.interceptor.endpoints(), revision: m.revision }
  },

  async save(m, body) {
    if (m.damaged !== undefined) throw new ActionError('config-damaged', m.damaged.message, { path: m.damaged.path })
    if (JSON.stringify(body.config ?? null).length > SAVE_MAX_CHARS) throw new ActionError('too-large', 'The rules are too large to save')
    const saved = await m.store.save(settledConfig(body.config), Number.isInteger(body.revision) ? body.revision : undefined)
    m.config = saved.config
    m.revision = saved.revision
    m.seen = await signature(m.store.path)
    return snapshot(m)
  },

  /** Normalize and validate a configuration without saving it (import preview and live checks). */
  async check(m, body) {
    if (JSON.stringify(body.config ?? null).length > SAVE_MAX_CHARS) throw new ActionError('too-large', 'The rules are too large to read')
    const config = settledConfig(body.config)
    return { config, problems: validateConfig(config), env: envStatus(config) }
  },

  /** Move a damaged file aside and start with no rules. */
  async resetDamaged(m) {
    if (m.damaged === undefined) throw new ActionError('bad-request', 'The rules file is not damaged')
    const aside = `${m.store.path}.damaged-${Date.now()}`
    await rename(m.store.path, aside)
    await load(m)
    return { ...snapshot(m), movedTo: aside }
  },

  /** Build the body and header changes of a preset form. */
  async preset(m, body) {
    if (!PRESET_IDS.includes(body.id)) throw new ActionError('bad-request', `Unknown preset: ${String(body.id)}`)
    return buildPreset(body.id, body.form)
  },

  async clearRecent(m) {
    m.interceptor.clearRecent()
    return { recent: [], endpoints: m.interceptor.endpoints() }
  },

  /** Apply the saved rules, or the rules given, to a sample request, without sending anything. */
  async dryRun(m, body) {
    const target = url(body.url)
    if (body.body === null || typeof body.body !== 'object' || Array.isArray(body.body)) throw new ActionError('bad-request', 'The sample request body must be a JSON object')
    if (JSON.stringify(body.body).length > DRY_RUN_MAX_CHARS) throw new ActionError('too-large', 'The sample request is too large')
    await m.loading
    const config = body.config === undefined ? m.config : settledConfig(body.config)
    const { modelEndpoint, rules } = rulesFor(config, target)
    const model = requestModel(body.body, target)
    // Values from the environment appear as <env:NAME>, so a preview never shows a key.
    const env = Object.fromEntries(Object.entries(process.env).filter(([, value]) => typeof value === 'string' && value !== '').map(([key]) => [key, `<env:${key}>`]))
    const result = applyRules({ ...config, rules }, { url: target, body: body.body }, { env, session: typeof body.session === 'string' && body.session !== '' ? body.session : 'SESSION-ID' })
    // `secrets` lists the values the rules took from the environment; here they are placeholders, but they are never sent to the page.
    const { secrets: _secrets, ...shown } = result
    return { ...shown, modelEndpoint, paused: !config.enabled, invalid: invalidTargets({ rules }, target, model) }
  },

  async orProviders(m, body) {
    return catalog(() => m.catalog.providers(body.refresh === true))
  },

  async orModels(m, body) {
    return catalog(() => m.catalog.models(body.refresh === true))
  },

  async orEndpoints(m, body) {
    return catalog(() => m.catalog.endpoints(body.model, body.refresh === true))
  },
}

async function catalog(read) {
  try {
    return await read()
  } catch (error) {
    if (error instanceof CatalogError) throw new ActionError(error.code, error.message)
    throw error
  }
}

function reply(body) {
  return Response.json(body, { headers: { 'cache-control': 'no-store' } })
}

async function handle(m, request) {
  let body
  try {
    body = await request.json()
  } catch {
    return reply({ ok: false, code: 'bad-request', error: 'Request body must be JSON' })
  }
  const action = Object.hasOwn(ACTIONS, body?.action) ? ACTIONS[body.action] : undefined
  if (action === undefined) return reply({ ok: false, code: 'bad-request', error: `Unknown action: ${String(body?.action)}` })
  try {
    return reply({ ok: true, value: await action(m, body) })
  } catch (error) {
    const known = error instanceof ActionError || error instanceof ConflictError || error instanceof ConfigFileError
    return reply({
      ok: false,
      code: known ? error.code : 'failed',
      error: message(error),
      ...known && error.details !== undefined ? { details: error.details } : {},
      ...error instanceof ConfigFileError ? { details: { path: error.path } } : {},
    })
  }
}
