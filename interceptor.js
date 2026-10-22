/**
 * Applies the rules to the model requests this process sends.
 *
 * dsh's model adapters all send requests through the global `fetch`, so wrapping it is the one place that sees every
 * route (the DeepSeek adapter and the `llm-pi-ai` providers). The wrapper only touches POST requests whose body is a JSON
 * object and whose URL looks like a model endpoint or is a path a rule names; everything else passes straight through. An
 * internal failure never stops a request: it is sent unchanged and the failure is shown in the request log.
 */
import { applyRules, invalidTargets, requestModel, rulesFor, targetsUrl } from './rules.js'

/** The header the DeepSeek adapter sets to the dsh session id; `{{session}}` uses it when present. */
export const SESSION_HEADER = 'x-deepseek-harness-session-id'
/** Bodies longer than this many characters are not read (attachments inline as base64 can be that large). */
export const MAX_PARSE_CHARS = 32 * 1024 * 1024
/** Bodies of requests no rule matches are logged only up to this many characters. */
export const MAX_OBSERVE_CHARS = 1024 * 1024
/** How much of a non-2xx response body is kept for the request log. */
export const ERROR_TEXT_CHARS = 2048
const VALUE_TEXT_CHARS = 300
const MAX_CHANGES_PER_ENTRY = 60
const MAX_ENDPOINTS = 50
const MAX_MODELS_PER_ENDPOINT = 10

const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value)
const hasRequest = input => typeof Request !== 'undefined' && input instanceof Request

/**
 * @param {RequestInfo | URL} input - the first argument of `fetch`.
 * @returns {URL | undefined} the absolute URL, or undefined when it cannot be read.
 */
function urlOf(input) {
  try {
    if (input instanceof URL) return input
    return new URL(typeof input === 'string' ? input : input.url)
  } catch {
    // A relative or malformed URL is not a model endpoint; `fetch` reports it.
    return undefined
  }
}

/**
 * @param {RequestInfo | URL} input - the first argument of `fetch`.
 * @param {RequestInit | undefined} init - the second argument.
 * @returns {Promise<string | undefined>} the request body as text, or undefined when the body is absent or is a stream.
 */
async function bodyTextOf(input, init) {
  const body = init?.body
  if (typeof body === 'string') return body
  if (body === undefined && hasRequest(input)) return input.body === null ? undefined : await input.clone().text()
  if (body instanceof Uint8Array || body instanceof ArrayBuffer) return new TextDecoder().decode(body)
  return undefined
}

/**
 * @param {Response} response - a cloned response.
 * @param {number} limit - the most characters to read.
 * @returns {Promise<string>} the start of the body.
 */
async function readHead(response, limit) {
  const reader = response.body?.getReader()
  if (reader === undefined) return ''
  const decoder = new TextDecoder()
  let text = ''
  try {
    while (text.length < limit) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    reader.cancel().catch(() => {
      // The clone's other branch is the one the caller reads; a failed cancel here changes nothing for it.
    })
  }
  return text.slice(0, limit)
}

/** @param {unknown} value - a change value. @returns {string | undefined} its JSON text, cut for the log. */
function valueText(value) {
  if (value === undefined) return undefined
  const text = JSON.stringify(value)
  return text.length > VALUE_TEXT_CHARS ? `${text.slice(0, VALUE_TEXT_CHARS)}…` : text
}

/**
 * Create the fetch wrapper and its request log.
 * @param {{ getConfig: () => { enabled: boolean, rules: object[] }, beforeRequest?: () => Promise<void>,
 *   env?: Record<string, string | undefined>, now?: () => number, target?: { fetch: typeof fetch }, maxRecent?: number }} options -
 *   where the current rules come from (read on every request), a hook awaited before the rules are read on each POST
 *   (the host reloads rules changed on disk there; a rejection is ignored), the environment `{{env:NAME}}` reads, the clock,
 *   the object whose `fetch` is wrapped, and how many requests the log keeps.
 * @returns {{ install: () => void, uninstall: () => void, recent: () => object[], endpoints: () => object[],
 *   clearRecent: () => void }} `install` wraps `target.fetch`; `uninstall` restores it when the wrapper is still the outermost
 *   one and otherwise turns the wrapper into a pass-through; `recent` lists the logged requests newest first;
 *   `endpoints` lists the model endpoints seen; `clearRecent` empties the log and keeps the endpoints.
 */
export function createInterceptor({ getConfig, beforeRequest = async () => {}, env = process.env, now = Date.now, target = globalThis, maxRecent = 50 }) {
  let original
  let active = false
  let seq = 0
  const log = []
  const endpoints = new Map()

  const remember = (entry, url, model) => {
    log.push(entry)
    if (log.length > maxRecent) log.shift()
    const key = `${url.host}${url.pathname}`
    let endpoint = endpoints.get(key)
    if (endpoint === undefined) {
      endpoint = { scheme: url.protocol.slice(0, -1), host: url.host, path: url.pathname, count: 0, models: [], lastAt: entry.at }
      endpoints.set(key, endpoint)
    }
    endpoint.count += 1
    endpoint.lastAt = entry.at
    if (model !== undefined && !endpoint.models.includes(model) && endpoint.models.length < MAX_MODELS_PER_ENDPOINT) endpoint.models.push(model)
    if (endpoints.size > MAX_ENDPOINTS) {
      const oldest = [...endpoints.values()].reduce((a, b) => (a.lastAt <= b.lastAt ? a : b))
      endpoints.delete(`${oldest.host}${oldest.path}`)
    }
  }

  /**
   * Work out what to send for one call, and log it.
   * @returns {Promise<{ input: RequestInfo | URL, init: RequestInit | undefined, entry?: object, secrets?: string[] }>} the
   *   arguments to pass on, and the environment values the rules put into this request.
   */
  const prepare = async (input, init) => {
    const method = (init?.method ?? (hasRequest(input) ? input.method : 'GET')).toUpperCase()
    const url = urlOf(input)
    if (method !== 'POST' || url === undefined) return { input, init }
    await beforeRequest().catch(() => {
      // A failed reload keeps the rules already in memory.
    })
    const config = getConfig()
    const { modelEndpoint, rules } = rulesFor(config, url)
    if (!modelEndpoint && !rules.some(rule => targetsUrl(rule, url))) return { input, init }
    const text = await bodyTextOf(input, init)
    // A request no rule can touch is read only to log it, so a large one (attachments inline as base64) is skipped.
    if (text === undefined || text.length > (rules.some(rule => targetsUrl(rule, url)) ? MAX_PARSE_CHARS : MAX_OBSERVE_CHARS)) return { input, init }
    let body
    try {
      body = JSON.parse(text)
    } catch {
      // Not JSON: not a model call this plugin can change.
      return { input, init }
    }
    if (!isObject(body)) return { input, init }
    const model = requestModel(body, url)
    const entry = { id: ++seq, at: now(), method, host: url.host, path: url.pathname, model, paused: !config.enabled, matched: [], changed: false, changes: [], skipped: [] }
    remember(entry, url, model)
    try {
      const headers = new Headers(init?.headers ?? (hasRequest(input) ? input.headers : undefined))
      const result = applyRules({ ...config, rules }, { url, body }, { env, session: headers.get(SESSION_HEADER) ?? undefined })
      entry.matched = result.matched
      entry.invalid = invalidTargets({ rules }, url, model)
      entry.skipped = result.skipped.map(({ rule, kind, path, reason, detail }) => ({ rule, kind, path, reason, detail }))
      entry.changes = result.changes.slice(0, MAX_CHANGES_PER_ENTRY).map(change => ({ rule: change.rule, kind: change.kind, path: change.path, value: valueText(change.value), secret: change.secret === true }))
      if (result.changes.length > MAX_CHANGES_PER_ENTRY) entry.moreChanges = result.changes.length - MAX_CHANGES_PER_ENTRY
      if (!result.changed) return { input, init, entry, secrets: result.secrets }
      for (const name of result.headers.remove) headers.delete(name)
      for (const [name, value] of Object.entries(result.headers.set)) headers.set(name, value)
      // The body length changes, so a declared length would be wrong; fetch computes it again.
      headers.delete('content-length')
      entry.changed = true
      return { input, init: { ...init, headers, body: JSON.stringify(result.body) }, entry, secrets: result.secrets }
    } catch (error) {
      entry.changed = false
      entry.failed = error instanceof Error ? error.message : String(error)
      return { input, init, entry }
    }
  }

  const wrapped = async function (input, init) {
    if (!active) return original.call(this, input, init)
    let prepared
    try {
      prepared = await prepare(input, init)
    } catch {
      // Reading the request failed (for example a consumed Request); send it as it was.
      prepared = { input, init }
    }
    const { entry, secrets = [] } = prepared
    const started = now()
    let response
    try {
      response = await original.call(this, prepared.input, prepared.init)
    } catch (error) {
      if (entry !== undefined) {
        // A request the caller cancelled (the stop button) is not a connection failure.
        if (error?.name === 'AbortError') entry.aborted = true
        else entry.networkError = error instanceof Error ? error.message : String(error)
      }
      throw error
    }
    if (entry !== undefined) {
      entry.status = response.status
      entry.durationMs = now() - started
      if (!response.ok) {
        const copy = response.clone()
        const hidden = [...new Set(secrets)].filter(value => value.length >= 4)
        // A gateway may echo a value back in its error; a value that came from the environment is never kept.
        readHead(copy, ERROR_TEXT_CHARS).then(text => { entry.errorText = hidden.reduce((out, value) => out.split(value).join('[env]'), text) }, () => {
          // The error body could not be read; the status is still logged.
        })
      }
    }
    return response
  }

  return {
    install() {
      if (active) return
      original = target.fetch
      target.fetch = wrapped
      active = true
    },
    uninstall() {
      if (!active) return
      active = false
      if (target.fetch === wrapped) target.fetch = original
    },
    recent: () => log.map(entry => structuredClone(entry)).reverse(),
    endpoints: () => [...endpoints.values()].map(endpoint => structuredClone(endpoint)).sort((a, b) => b.lastAt - a.lastAt),
    clearRecent() {
      log.length = 0
    },
  }
}
