/**
 * The rules that add parameters to model requests, and how they apply to one request.
 *
 * A rule says which requests it is for (hosts, path prefixes, model name patterns) and what to change in them: body
 * fields to set or fill in or remove, and headers to set or remove. Rules apply in list order; each sees the result of
 * the ones before it. Nothing here touches the network or the disk, so the same code serves the live request path, the
 * dry run on the page, and the tests.
 *
 * The parts a request cannot do without stay out of reach: `messages`, `system`, `tools`, `model`, `stream`, and the
 * other fields that carry the conversation cannot be changed unless a rule opts in, and credential and framing headers
 * cannot be set at all.
 */
import { createHash } from 'node:crypto'
import { normalizeProtocols } from './protocols.js'

/** Top-level body fields that carry the conversation or its framing; a rule needs `allowProtected` to touch them. */
export const PROTECTED_BODY = new Set(['messages', 'system', 'tools', 'tool_choice', 'input', 'instructions', 'prompt', 'contents', 'stream', 'model'])
/** Headers a rule can never set or remove: credentials, and what the HTTP client computes itself. */
export const FORBIDDEN_HEADERS = new Set(['authorization', 'proxy-authorization', 'x-api-key', 'api-key', 'x-goog-api-key', 'cookie', 'host', 'content-length', 'content-type', 'transfer-encoding', 'connection'])
/** Bounds on what a configuration may hold. */
export const LIMITS = { rules: 100, name: 80, note: 400, hosts: 20, paths: 20, models: 50, headers: 40, remove: 40, bodyChars: 64 * 1024, depth: 16, valueChars: 8192 }
/** Path endings that mark a model request, so unrelated POSTs are never opened. */
const MODEL_ENDPOINT = /(?:\/messages|\/chat\/completions|\/completions|\/responses|\/generatecontent|:streamgeneratecontent|:generatecontent)\/?$/i
/** Keys that would change an object's prototype instead of adding a field. */
/** Stands in for a conversation key when a request has no message to derive one from; stable within this process. */
const PROCESS_KEY = createHash('sha256').update(`${process.pid}:${Date.now()}:${Math.random()}`).digest('hex').slice(0, 16)
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
const HEADER_NAME = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/
const TEMPLATE = /\{\{\s*([^{}]*?)\s*\}\}/g
const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * A new rule id.
 * @returns {string} `r` and eight hex digits.
 */
export function newRuleId() {
  return `r${createHash('sha256').update(`${Date.now()}:${Math.random()}`).digest('hex').slice(0, 8)}`
}

/**
 * An empty rule with the fields the page edits.
 * @param {Partial<Rule>} [fields] - fields to start from.
 * @returns {Rule} the rule, enabled, matching nothing yet.
 */
export function emptyRule(fields = {}) {
  return {
    id: newRuleId(),
    name: '',
    enabled: true,
    match: { hosts: [], paths: [], models: [] },
    body: { merge: {}, defaults: {}, remove: [] },
    headers: { set: {}, remove: [] },
    allowProtected: false,
    ...fields,
  }
}

function list(value, max, clean) {
  if (!Array.isArray(value)) return []
  const out = []
  for (const item of value) {
    const cleaned = clean(item)
    if (cleaned !== undefined && !out.includes(cleaned)) out.push(cleaned)
    if (out.length >= max) break
  }
  return out
}

function text(value) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

/**
 * Read a configuration from stored or pasted JSON: keep what is valid, drop what is not.
 * @param {unknown} raw - the parsed JSON.
 * @returns {{ enabled: boolean, rules: Rule[], protocols: Record<string, object> }} the configuration with every field in
 *   its expected form; `protocols` holds what the user declared each endpoint understands (protocols.js), which only the
 *   page reads.
 */
export function normalizeConfig(raw) {
  const source = isObject(raw) ? raw : {}
  const seen = new Set()
  const rules = []
  for (const item of Array.isArray(source.rules) ? source.rules : []) {
    if (!isObject(item) || rules.length >= LIMITS.rules) continue
    const rule = normalizeRule(item)
    while (seen.has(rule.id)) rule.id = newRuleId()
    seen.add(rule.id)
    rules.push(rule)
  }
  return { enabled: source.enabled !== false, rules, protocols: normalizeProtocols(source.protocols) }
}

/**
 * Read one rule: keep what is valid, drop what is not.
 * @param {Record<string, unknown>} raw - the rule as stored or pasted.
 * @returns {Rule} the rule with every field in its expected form.
 */
export function normalizeRule(raw) {
  const match = isObject(raw.match) ? raw.match : {}
  const body = isObject(raw.body) ? raw.body : {}
  const headers = isObject(raw.headers) ? raw.headers : {}
  const set = {}
  for (const [name, value] of Object.entries(isObject(headers.set) ? headers.set : {})) {
    if (Object.keys(set).length >= LIMITS.headers) break
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') set[name.trim()] = String(value)
  }
  const rule = {
    id: text(raw.id)?.slice(0, 40) ?? newRuleId(),
    name: (text(raw.name) ?? '').slice(0, LIMITS.name),
    enabled: raw.enabled !== false,
    match: {
      hosts: list(match.hosts, LIMITS.hosts, item => text(item)?.toLowerCase()),
      paths: list(match.paths, LIMITS.paths, (item) => { const path = text(item); return path === undefined ? undefined : path.startsWith('/') ? path : `/${path}` }),
      models: list(match.models, LIMITS.models, text),
    },
    body: {
      merge: isObject(body.merge) ? body.merge : {},
      defaults: isObject(body.defaults) ? body.defaults : {},
      remove: list(body.remove, LIMITS.remove, text),
    },
    headers: { set, remove: list(headers.remove, LIMITS.headers, item => text(item)?.toLowerCase()) },
    allowProtected: raw.allowProtected === true,
  }
  const note = text(raw.note)
  if (note !== undefined) rule.note = note.slice(0, LIMITS.note)
  if (isObject(raw.preset) && typeof raw.preset.id === 'string') rule.preset = { id: raw.preset.id, form: isObject(raw.preset.form) ? raw.preset.form : {} }
  return rule
}

function depthOf(value, depth = 0) {
  if (depth > LIMITS.depth) return depth
  if (Array.isArray(value)) return value.reduce((deepest, item) => Math.max(deepest, depthOf(item, depth + 1)), depth)
  if (isObject(value)) return Object.values(value).reduce((deepest, item) => Math.max(deepest, depthOf(item, depth + 1)), depth)
  return depth
}

function badKeys(value, path = '') {
  if (Array.isArray(value)) return value.flatMap((item, index) => badKeys(item, `${path}[${index}]`))
  if (!isObject(value)) return []
  return Object.entries(value).flatMap(([key, child]) => (UNSAFE_KEYS.has(key) ? [`${path}${path === '' ? '' : '.'}${key}`] : badKeys(child, `${path}${path === '' ? '' : '.'}${key}`)))
}

/** The template tokens in every string of a JSON value. */
function tokensIn(value) {
  if (typeof value === 'string') return [...value.matchAll(TEMPLATE)].map(match => match[1])
  if (Array.isArray(value)) return value.flatMap(tokensIn)
  if (isObject(value)) return Object.values(value).flatMap(tokensIn)
  return []
}

/** Why a template token is not usable, or undefined when it is. */
function tokenProblem(token) {
  if (token === 'model' || token === 'session') return undefined
  if (token.startsWith('env:')) return ENV_NAME.test(token.slice(4).trim()) ? undefined : 'env-name'
  return 'unknown'
}

/**
 * Everything wrong with a rule that would stop it applying, in a form the page can show next to the field.
 * @param {Rule} rule - a normalized rule.
 * @returns {{ ruleId: string, field: string, code: string, detail?: string }[]} the problems; empty when the rule is usable.
 */
export function validateRule(rule) {
  const problems = []
  const problem = (field, code, detail) => problems.push({ ruleId: rule.id, field, code, ...detail === undefined ? {} : { detail } })
  if (rule.match.hosts.length === 0) problem('match.hosts', 'no-host')
  for (const host of rule.match.hosts) {
    if (host !== '*' && !/^(?:\*\.)?[a-z0-9]([a-z0-9.-]*[a-z0-9])?(?::\d{1,5})?$/.test(host)) problem('match.hosts', 'bad-host', host)
  }
  for (const [field, value] of [['body.merge', rule.body.merge], ['body.defaults', rule.body.defaults]]) {
    if (JSON.stringify(value).length > LIMITS.bodyChars) problem(field, 'too-large')
    if (depthOf(value) > LIMITS.depth) problem(field, 'too-deep')
    for (const key of badKeys(value)) problem(field, 'bad-key', key)
    for (const key of Object.keys(value)) {
      if (PROTECTED_BODY.has(key) && !rule.allowProtected) problem(field, 'protected', key)
    }
    for (const token of tokensIn(value)) {
      const why = tokenProblem(token)
      if (why !== undefined) problem(field, `template-${why}`, token)
    }
  }
  for (const path of rule.body.remove) {
    const parts = path.split('.')
    if (parts.some(part => part === '' || UNSAFE_KEYS.has(part))) problem('body.remove', 'bad-path', path)
    else if (PROTECTED_BODY.has(parts[0]) && !rule.allowProtected) problem('body.remove', 'protected', path)
  }
  for (const [name, value] of Object.entries(rule.headers.set)) {
    if (!HEADER_NAME.test(name)) problem('headers.set', 'bad-header', name)
    else if (FORBIDDEN_HEADERS.has(name.toLowerCase())) problem('headers.set', 'forbidden-header', name)
    if (/[\r\n]/.test(value)) problem('headers.set', 'bad-header-value', name)
    if (value.length > LIMITS.valueChars) problem('headers.set', 'too-large', name)
    for (const token of tokensIn(value)) {
      const why = tokenProblem(token)
      if (why !== undefined) problem('headers.set', `template-${why}`, token)
    }
  }
  for (const name of rule.headers.remove) {
    if (!HEADER_NAME.test(name)) problem('headers.remove', 'bad-header', name)
    else if (FORBIDDEN_HEADERS.has(name)) problem('headers.remove', 'forbidden-header', name)
  }
  const duplicates = Object.keys(rule.headers.set).map(name => name.toLowerCase())
  for (const name of new Set(duplicates.filter((name, index) => duplicates.indexOf(name) !== index))) problem('headers.set', 'duplicate-header', name)
  return problems
}

/**
 * Validate every rule of a configuration.
 * @param {{ rules: Rule[] }} config - a normalized configuration.
 * @returns {{ ruleId: string, field: string, code: string, detail?: string }[]} the problems of all rules.
 */
export function validateConfig(config) {
  return config.rules.flatMap(validateRule)
}

/**
 * The model a request is for: the body's `model`, or for Google-style endpoints the name in the path
 * (`/v1beta/models/gemini-2.5-pro:generateContent`).
 * @param {Record<string, unknown>} body - the parsed request body.
 * @param {URL} url - the request URL.
 * @returns {string | undefined} the model, or undefined when the request names none.
 */
export function requestModel(body, url) {
  if (typeof body.model === 'string') return body.model
  const named = /\/models\/([^/:?]+)(?::[A-Za-z]+)?\/?$/.exec(url.pathname)
  return named === null ? undefined : decodeURIComponent(named[1])
}

/**
 * Whether a host pattern covers a URL's host.
 * @param {string} pattern - `*`, `example.com`, `*.example.com`, or either with a `:port`.
 * @param {URL} url - the request URL.
 * @returns {boolean} true when the pattern covers it; `*.example.com` also covers `example.com` itself.
 */
export function hostMatches(pattern, url) {
  if (pattern === '*') return true
  const target = pattern.includes(':') ? url.host : url.hostname
  const host = target.toLowerCase()
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(2)
    return host === suffix || host.endsWith(`.${suffix}`)
  }
  return host === pattern
}

/**
 * Whether a model pattern covers a model name; `*` stands for any run of characters and case is ignored.
 * @param {string} pattern - the glob.
 * @param {string} model - the request's `model`.
 * @returns {boolean} true when it covers it.
 */
export function modelMatches(pattern, model) {
  const parts = pattern.toLowerCase().split('*').map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`^${parts.join('.*')}$`).test(model.toLowerCase())
}

/**
 * Whether a rule's host and path conditions cover a URL; the model condition needs the body and is checked later.
 * @param {Rule} rule - the rule.
 * @param {URL} url - the request URL.
 * @returns {boolean} true when the rule can apply to requests to this URL.
 */
export function targetsUrl(rule, url) {
  return rule.enabled && rule.match.hosts.some(host => hostMatches(host, url))
    && (rule.match.paths.length === 0 || rule.match.paths.some(path => url.pathname.startsWith(path)))
}

/**
 * Whether a rule covers a request's model.
 * @param {Rule} rule - the rule.
 * @param {string | undefined} model - the request's `model`, if it has one.
 * @returns {boolean} true when the rule has no model condition, or the model matches one of its patterns.
 */
export function targetsModel(rule, model) {
  return rule.match.models.length === 0 || (typeof model === 'string' && rule.match.models.some(pattern => modelMatches(pattern, model)))
}

/**
 * Whether a URL looks like a model endpoint, judged by its path alone.
 * @param {URL} url - the request URL.
 * @returns {boolean} true for the endings model APIs use (`/messages`, `/chat/completions`, `/responses`, and so on).
 */
export function looksLikeModelEndpoint(url) {
  return MODEL_ENDPOINT.test(url.pathname)
}

/**
 * A stable key for the conversation a request belongs to: the first non-system message, hashed.
 * @param {Record<string, unknown>} body - the request body.
 * @returns {string} sixteen hex digits, the same for every request of one conversation.
 */
export function conversationKey(body) {
  const messages = [body.messages, body.input, body.contents].find(Array.isArray) ?? []
  const first = messages.find(message => isObject(message) && message.role !== 'system' && message.role !== 'developer')
  if (first === undefined) return PROCESS_KEY
  return createHash('sha256').update(JSON.stringify(first)).digest('hex').slice(0, 16)
}

/**
 * Fill the `{{...}}` tokens of a JSON value.
 * @param {unknown} value - the value; strings are filled, other types pass through.
 * @param {{ model?: string, session: string, env: Record<string, string | undefined> }} vars - what the tokens stand for.
 * @returns {{ value: unknown, secret: boolean, secrets: string[], missing?: string }} the filled value, whether it holds an
 *   environment variable's content, which values those were, and the first environment variable that was not set (the
 *   value is then unusable).
 */
export function fillTemplates(value, vars) {
  let secret = false
  const secrets = new Set()
  let missing
  const fill = (item) => {
    if (typeof item === 'string') {
      return item.replace(TEMPLATE, (whole, token) => {
        if (token === 'model') return vars.model ?? ''
        if (token === 'session') return vars.session
        if (token.startsWith('env:')) {
          const name = token.slice(4).trim()
          const found = vars.env[name]
          if (found === undefined || found === '') {
            missing ??= name
            return ''
          }
          secret = true
          secrets.add(found)
          return found
        }
        return whole
      })
    }
    if (Array.isArray(item)) return item.map(fill)
    if (isObject(item)) return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, fill(child)]))
    return item
  }
  const filled = fill(value)
  return { value: filled, secret, secrets: [...secrets], ...missing === undefined ? {} : { missing } }
}

/** Merge `source` into `target` in place: objects merge, everything else replaces. */
function mergeInto(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (UNSAFE_KEYS.has(key)) continue
    if (isObject(value) && isObject(target[key])) mergeInto(target[key], value)
    else target[key] = structuredClone(value)
  }
}

/** Fill in `source` where `target` has nothing, in place. */
function defaultInto(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (UNSAFE_KEYS.has(key)) continue
    if (!Object.hasOwn(target, key)) target[key] = structuredClone(value)
    else if (isObject(value) && isObject(target[key])) defaultInto(target[key], value)
  }
}

/** Remove a dotted path from `target` in place; true when something was there. */
function removePath(target, path) {
  const parts = path.split('.')
  let at = target
  for (const part of parts.slice(0, -1)) {
    if (!isObject(at) || !Object.hasOwn(at, part)) return false
    at = at[part]
  }
  const last = parts.at(-1)
  if (!isObject(at) || !Object.hasOwn(at, last)) return false
  delete at[last]
  return true
}

/** The top-level fields of `source` and the dotted paths of its nested ones, for the change list. */
function pathsOf(source, prefix = '') {
  return Object.entries(source).flatMap(([key, value]) => (isObject(value) && Object.keys(value).length > 0 ? pathsOf(value, `${prefix}${key}.`) : [`${prefix}${key}`]))
}

function valueAt(target, path) {
  let at = target
  for (const part of path.split('.')) {
    if (!isObject(at)) return undefined
    at = at[part]
  }
  return at
}

/**
 * Apply a configuration to one request.
 * @param {{ enabled: boolean, rules: Rule[] }} config - the normalized configuration.
 * @param {{ url: URL, body: Record<string, unknown> }} request - the request URL and its parsed JSON body (not changed).
 * @param {{ env?: Record<string, string | undefined>, session?: string }} [context] - the environment `{{env:NAME}}`
 *   reads, and the session id when the request carries one (a conversation key is used otherwise).
 * @returns {{ body: Record<string, unknown>, headers: { set: Record<string, string>, remove: string[] }, changed: boolean,
 *   matched: { id: string, name: string }[], changes: Change[], skipped: Skipped[], secrets: string[] }} the new body, the header changes
 *   to make, which rules matched, every change with the value now in place (masked when it came from the
 *   environment), and every change left out because an environment variable was not set.
 */
export function applyRules(config, request, context = {}) {
  const body = structuredClone(request.body)
  const model = requestModel(request.body, request.url)
  const result = { body, headers: { set: {}, remove: [] }, changed: false, matched: [], changes: [], skipped: [], secrets: [] }
  // Header changes by lower-case name: a later rule's change replaces an earlier one's, whether a set or a removal.
  const headers = new Map()
  if (!config.enabled) return result
  const vars = { model, session: context.session ?? conversationKey(request.body), env: context.env ?? {} }
  for (const rule of config.rules) {
    if (!targetsUrl(rule, request.url) || !targetsModel(rule, model) || validateRule(rule).length > 0) continue
    result.matched.push({ id: rule.id, name: rule.name })
    const label = { rule: rule.id }
    for (const path of rule.body.remove) {
      if (removePath(body, path)) {
        result.changes.push({ ...label, kind: 'remove', path })
        result.changed = true
      }
    }
    for (const [kind, source] of [['set', rule.body.merge], ['default', rule.body.defaults]]) {
      for (const key of Object.keys(source)) {
        const filled = fillTemplates(source[key], vars)
        result.secrets.push(...filled.secrets)
        if (filled.missing !== undefined) {
          result.skipped.push({ ...label, kind, path: key, reason: 'env-missing', detail: filled.missing })
          continue
        }
        const before = JSON.stringify(body[key])
        if (kind === 'set') mergeInto(body, { [key]: filled.value })
        else defaultInto(body, { [key]: filled.value })
        if (JSON.stringify(body[key]) !== before) {
          for (const path of pathsOf({ [key]: filled.value })) {
            result.changes.push({ ...label, kind, path, value: filled.secret ? undefined : valueAt(body, path), secret: filled.secret })
          }
          result.changed = true
        }
      }
    }
    for (const [name, raw] of Object.entries(rule.headers.set)) {
      const filled = fillTemplates(raw, vars)
      result.secrets.push(...filled.secrets)
      if (filled.missing !== undefined) {
        result.skipped.push({ ...label, kind: 'header', path: name, reason: 'env-missing', detail: filled.missing })
        continue
      }
      if (/[\r\n\0]/.test(String(filled.value))) {
        result.skipped.push({ ...label, kind: 'header', path: name, reason: 'bad-value', detail: name })
        continue
      }
      headers.set(name.toLowerCase(), { name, value: String(filled.value) })
      result.changes.push({ ...label, kind: 'header', path: name, value: filled.secret ? undefined : String(filled.value), secret: filled.secret })
      result.changed = true
    }
    for (const name of rule.headers.remove) {
      headers.set(name, null)
      result.changes.push({ ...label, kind: 'header-remove', path: name })
      result.changed = true
    }
  }
  for (const [lower, change] of headers) {
    if (change === null) result.headers.remove.push(lower)
    else result.headers.set[change.name] = change.value
  }
  return result
}

/**
 * The rules that can reach a URL at all. A rule is for model calls (/messages, /chat/completions, /responses, ...); it
 * reaches any other path only by naming it in `match.paths`.
 * @param {{ rules: Rule[] }} config - the normalized configuration.
 * @param {URL} url - the request URL.
 * @returns {{ modelEndpoint: boolean, rules: Rule[] }} whether the URL looks like a model endpoint, and the rules that may apply to it.
 */
export function rulesFor(config, url) {
  const modelEndpoint = looksLikeModelEndpoint(url)
  return { modelEndpoint, rules: modelEndpoint ? config.rules : config.rules.filter(rule => rule.match.paths.length > 0) }
}

/**
 * The rules that match a request by host, path, and model but are skipped because they are not valid.
 * @param {{ rules: Rule[] }} config - the rules to check, usually from {@link rulesFor}.
 * @param {URL} url - the request URL.
 * @param {string | undefined} model - the request's model.
 * @returns {{ id: string, name: string, codes: string[] }[]} each skipped rule with its distinct problem codes.
 */
export function invalidTargets(config, url, model) {
  return config.rules
    .filter(rule => targetsUrl(rule, url) && targetsModel(rule, model))
    .map(rule => ({ id: rule.id, name: rule.name, codes: [...new Set(validateRule(rule).map(problem => problem.code))] }))
    .filter(item => item.codes.length > 0)
}

/**
 * @typedef {object} Rule
 * @property {string} id - stable id.
 * @property {string} name - label shown on the page.
 * @property {boolean} enabled - whether the rule applies.
 * @property {{ hosts: string[], paths: string[], models: string[] }} match - which requests it is for.
 * @property {{ merge: object, defaults: object, remove: string[] }} body - body changes.
 * @property {{ set: Record<string, string>, remove: string[] }} headers - header changes.
 * @property {boolean} allowProtected - whether `body` may touch the protected fields.
 * @property {string} [note] - free text.
 * @property {{ id: string, form: object }} [preset] - the preset form the rule was made from, so the page can reopen it.
 */

/**
 * @typedef {object} Change
 * @property {string} rule - id of the rule that made the change.
 * @property {'set' | 'default' | 'remove' | 'header' | 'header-remove'} kind - what was done.
 * @property {string} path - the body path or header name.
 * @property {unknown} [value] - the value now in place; absent for removals and for secrets.
 * @property {boolean} [secret] - true when the value came from an environment variable and is not shown.
 */

/**
 * @typedef {object} Skipped
 * @property {string} rule - id of the rule.
 * @property {string} kind - `set`, `default`, or `header`.
 * @property {string} path - the body field or header name.
 * @property {'env-missing' | 'bad-value'} reason - why it was left out: an environment variable is not set, or a header
 *   value (filled from a template) holds a line break or a NUL character.
 * @property {string} detail - the environment variable that is not set, or the header with the bad value.
 */
