/**
 * OpenRouter's public catalog: the providers it routes to, its models, and the providers serving one model.
 *
 * The page uses it to fill the provider picker and to show which providers serve the model being configured, with
 * price, speed, and the parameters each supports. All three endpoints are public and need no key. Answers are cached
 * for {@link TTL_MS}; when OpenRouter cannot be reached a cached answer is returned marked `stale`, and the provider
 * list falls back to a bundled snapshot (openrouter-providers.json), so the picker works offline.
 */
import { readFile } from 'node:fs/promises'

export const BASE = 'https://openrouter.ai/api/v1'
/** How long an answer is reused before OpenRouter is asked again. */
export const TTL_MS = 60 * 60 * 1000
/** How long one catalog request may take. */
export const TIMEOUT_MS = 10 * 1000
const MAX_CACHED_MODELS = 50
const MODEL_ID = /^[A-Za-z0-9._~-]+\/[A-Za-z0-9._:~@+-]+$/

/** A catalog request that failed; `code` is `offline`, `bad-response`, or `bad-model`. */
export class CatalogError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

/** @param {unknown} price - USD per token as a string. @returns {number | null} USD per million tokens. */
function perMillion(price) {
  const value = Number(price)
  return Number.isFinite(value) ? Math.round(value * 1e6 * 10000) / 10000 : null
}

const finite = value => (typeof value === 'number' && Number.isFinite(value) ? value : null)
/** A speed figure: a number, or the median of percentile cutoffs. */
const perf = value => finite(typeof value === 'object' && value !== null ? value.p50 : value)

/**
 * Create the catalog client.
 * @param {{ fetch?: typeof fetch, now?: () => number, bundled?: () => Promise<{ asOf: string, providers: object[] }> }} [options]
 *   the request function, the clock, and the reader of the bundled provider snapshot.
 * @returns {{ providers: (refresh?: boolean) => Promise<object>, models: (refresh?: boolean) => Promise<object>,
 *   endpoints: (id: string, refresh?: boolean) => Promise<object> }} each method resolves to the data plus
 *   `fetchedAt` (ms) and `stale` (true when OpenRouter could not be reached and an older answer is returned); `providers`
 *   may instead carry `source: 'bundled'` and `asOf`.
 */
export function createCatalog({ fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, bundled = readBundled } = {}) {
  const cache = new Map()

  const get = async (key, path, parse, refresh) => {
    const cached = cache.get(key)
    if (!refresh && cached !== undefined && now() - cached.fetchedAt < TTL_MS) return { ...cached.value, fetchedAt: cached.fetchedAt, stale: false }
    try {
      const response = await request(`${BASE}${path}`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) })
      if (!response.ok) throw new CatalogError('offline', `OpenRouter answered ${response.status}`)
      let json
      try {
        json = await response.json()
      } catch {
        throw new CatalogError('bad-response', 'OpenRouter sent an answer that is not JSON')
      }
      const value = parse(json?.data)
      if (value === undefined) throw new CatalogError('bad-response', 'OpenRouter sent an answer in an unknown form')
      cache.set(key, { value, fetchedAt: now() })
      if (cache.size > MAX_CACHED_MODELS + 2) {
        const oldest = [...cache].filter(([name]) => name.startsWith('endpoints:')).sort((a, b) => a[1].fetchedAt - b[1].fetchedAt)[0]
        if (oldest !== undefined) cache.delete(oldest[0])
      }
      return { ...value, fetchedAt: now(), stale: false }
    } catch (error) {
      if (cached !== undefined) return { ...cached.value, fetchedAt: cached.fetchedAt, stale: true }
      if (error instanceof CatalogError) throw error
      throw new CatalogError('offline', `OpenRouter could not be reached (${error instanceof Error ? error.message : String(error)})`)
    }
  }

  return {
    async providers(refresh = false) {
      try {
        return await get('providers', '/providers', parseProviders, refresh)
      } catch (error) {
        if (!(error instanceof CatalogError)) throw error
        const snapshot = await bundled()
        return { providers: snapshot.providers, source: 'bundled', asOf: snapshot.asOf, stale: true, fetchedAt: 0, reason: error.message }
      }
    },
    models: refresh => get('models', '/models', parseModels, refresh),
    endpoints(id, refresh = false) {
      if (typeof id !== 'string' || !MODEL_ID.test(id) || id.split('/').some(part => /^\.+$/.test(part))) return Promise.reject(new CatalogError('bad-model', `"${String(id)}" is not an OpenRouter model id like author/slug`))
      const path = `/models/${id.split('/').map(encodeURIComponent).join('/')}/endpoints`
      return get(`endpoints:${id}`, path, parseEndpoints, refresh)
    },
  }
}

async function readBundled() {
  return JSON.parse(await readFile(new URL('./openrouter-providers.json', import.meta.url), 'utf8'))
}

function parseProviders(data) {
  if (!Array.isArray(data)) return undefined
  const providers = data.filter(item => typeof item?.slug === 'string').map(item => ({ slug: item.slug, name: typeof item.name === 'string' ? item.name : item.slug, hq: typeof item.headquarters === 'string' ? item.headquarters : null, privacyUrl: typeof item.privacy_policy_url === 'string' ? item.privacy_policy_url : null }))
  return { providers: providers.sort((a, b) => a.name.localeCompare(b.name)) }
}

function parseModels(data) {
  if (!Array.isArray(data)) return undefined
  return {
    models: data.filter(item => typeof item?.id === 'string').map(item => ({ id: item.id, name: typeof item.name === 'string' ? item.name : item.id, context: finite(item.context_length), prompt: perMillion(item.pricing?.prompt), completion: perMillion(item.pricing?.completion) })),
  }
}

function parseEndpoints(data) {
  if (typeof data?.id !== 'string' || !Array.isArray(data.endpoints)) return undefined
  return {
    id: data.id,
    name: typeof data.name === 'string' ? data.name : data.id,
    endpoints: data.endpoints.filter(item => typeof item?.tag === 'string').map(item => ({
      provider: typeof item.provider_name === 'string' ? item.provider_name : item.tag.split('/')[0],
      tag: item.tag,
      quantization: typeof item.quantization === 'string' && item.quantization !== 'unknown' ? item.quantization : null,
      context: finite(item.context_length),
      maxCompletion: finite(item.max_completion_tokens),
      prompt: perMillion(item.pricing?.prompt),
      completion: perMillion(item.pricing?.completion),
      uptime: finite(item.uptime_last_1d),
      latency: perf(item.latency_last_30m),
      throughput: perf(item.throughput_last_30m),
      parameters: Array.isArray(item.supported_parameters) ? item.supported_parameters.filter(name => typeof name === 'string') : [],
    })),
  }
}
