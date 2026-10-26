/**
 * What an endpoint understands: the request format it reads (OpenAI, Anthropic, or another) and the extensions it
 * reads on top of that format (OpenRouter's `provider` and `reasoning`, vLLM's `chat_template_kwargs`, …).
 *
 * A channel's protocol is worked out from what dsh knows about it ({@link detectProtocol}); the user can declare
 * otherwise per endpoint, and the declaration is kept in the rules file under `protocols` ({@link normalizeProtocols}).
 * The protocol only decides which kinds of parameter the page suggests for an endpoint and how sure its catalog hints
 * are; the rule engine never reads it, so a rule is sent as written whatever the protocol says.
 */

/** Request formats an endpoint can read. `openai` covers Chat Completions and Responses. */
export const FORMATS = ['openai', 'anthropic', 'other']
/** Extensions an endpoint can read on top of its format; each is one that a kind of parameter on the page needs. */
export const EXTENSIONS = ['openrouter', 'vllm', 'openai', 'helicone', 'cloudflare']
/** Hosted services recognized by their host; the host or any subdomain of it. */
const HOSTED = { openrouter: 'openrouter.ai', helicone: 'helicone.ai', cloudflare: 'gateway.ai.cloudflare.com', openai: 'api.openai.com' }
/** At most this many endpoints carry a declaration. */
export const MAX_PROTOCOLS = 50
/** An endpoint key: a lower-case host, an optional port, and an optional base path. */
const KEY = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(?::\d{1,5})?(?:\/[^\s?#]*)?$/
const MAX_KEY = 300

const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * The key a declaration is kept under: the endpoint's host and base path, the address a rule for it matches.
 * @param {URL} url - the endpoint's base URL.
 * @returns {string} for example `llm.example.com/api/v1`.
 */
export function endpointKey(url) {
  return `${url.host}${url.pathname.replace(/\/+$/, '')}`
}

/** @param {string} hostname - a host without port. @param {string} domain - a domain. @returns {boolean} whether the host is the domain or under it. */
function under(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}

/**
 * Work out what an endpoint understands from what is known of it.
 * @param {{ api?: unknown, official?: boolean, url?: URL, paths?: string[] }} facts - the route's `api` setting
 *   (`anthropic-messages`, `openai-completions`, …), whether it is an official DeepSeek route, its base URL, and the
 *   paths of the requests seen going to it.
 * @returns {{ format?: 'openai' | 'anthropic' | 'other', extensions: string[] }} the format, unknown when nothing tells,
 *   and the extensions of the hosted services its host belongs to.
 */
export function detectProtocol({ api, official = false, url, paths = [] }) {
  const extensions = url === undefined ? [] : EXTENSIONS.filter(id => HOSTED[id] !== undefined && under(url.hostname, HOSTED[id]))
  let format
  if (typeof api === 'string' && api !== '') format = api.startsWith('anthropic') ? 'anthropic' : api.startsWith('openai') ? 'openai' : 'other'
  else if (official) format = 'anthropic'
  else if (extensions.includes('openrouter') || extensions.includes('openai')) format = 'openai'
  else if (paths.some(path => /\/(?:chat\/completions|responses)$/.test(path))) format = 'openai'
  else if (paths.some(path => /\/messages$/.test(path))) format = 'anthropic'
  return { ...format === undefined ? {} : { format }, extensions }
}

/**
 * Read the declared protocols from stored or pasted JSON: keep what is valid, drop what is not.
 * @param {unknown} raw - `{ "<endpoint key>": { format?, extensions?: { <id>: boolean } } }`.
 * @returns {Record<string, { format?: string, extensions?: Record<string, boolean> }>} the declarations that say
 *   something, at most {@link MAX_PROTOCOLS}, keyed in sorted order with the extensions in {@link EXTENSIONS} order, so
 *   two equal declarations serialize the same.
 */
export function normalizeProtocols(raw) {
  const out = {}
  if (!isObject(raw)) return out
  for (const [rawKey, value] of Object.entries(raw)) {
    if (Object.keys(out).length >= MAX_PROTOCOLS) break
    const key = rawKey.trim().replace(/\/+$/, '').replace(/^[^/]+/, host => host.toLowerCase())
    if (key.length > MAX_KEY || !KEY.test(key) || !isObject(value)) continue
    const entry = {}
    if (FORMATS.includes(value.format)) entry.format = value.format
    const declared = isObject(value.extensions) ? value.extensions : {}
    const extensions = Object.fromEntries(EXTENSIONS.filter(id => typeof declared[id] === 'boolean').map(id => [id, declared[id]]))
    if (Object.keys(extensions).length > 0) entry.extensions = extensions
    if (Object.keys(entry).length > 0) out[key] = entry
  }
  return Object.fromEntries(Object.keys(out).sort().map(key => [key, out[key]]))
}
