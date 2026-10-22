/**
 * The model channels (provider routes) dsh has configured, with the endpoint each one sends to, so a rule can be made
 * for a channel without typing its host.
 *
 * The routes and their models come from dsh's `llm` service (`listProviders`, `listModels`). The endpoint comes, in
 * order, from the `baseURL` the user set for the route (the `settings` service holds it at the place the configurable
 * provider directory names), from the route's catalog default (`defaultBaseURL`), and for the official DeepSeek routes,
 * which have no catalog default, from `$DEEPSEEK_BASE_URL` or the public endpoint, as llm-deepseek does. Requests the
 * plugin has seen confirm the endpoint, and supply it when nothing else does.
 */

/** The official DeepSeek route's public endpoint, used when neither its settings nor the environment name one. */
export const DEEPSEEK_PUBLIC_BASE_URL = 'https://api.deepseek.com/anthropic'
const DEEPSEEK_BASE_URL_ENV = 'DEEPSEEK_BASE_URL'
/** The most models listed per channel. */
const MAX_MODELS = 200
/** How long one route's model list may take. */
export const MODELS_TIMEOUT_MS = 4000

const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value)

/** @param {unknown} value - a URL string. @returns {URL | undefined} the URL when it is an absolute http(s) URL. */
function httpUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return undefined
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : undefined
  } catch {
    // A template or a partial value is not an endpoint this page can use.
    return undefined
  }
}

/** @param {unknown} root - a settings value. @param {readonly string[]} path - keys from it. @returns {unknown} the value there. */
function valueAt(root, path) {
  let current = root
  for (const key of path) {
    if (!isObject(current)) return undefined
    current = current[key]
  }
  return current
}

/** The base path of an endpoint, without a trailing slash; '' for the root. */
function basePathOf(url) {
  return url.pathname.replace(/\/+$/, '')
}

/**
 * Describe the configured channels.
 * @param {{ providers: { id: string, name: string }[], directory: object[], descriptors: { ns: string, value: unknown }[],
 *   models: Map<string, { id: string, name: string }[] | Error>, endpoints: { scheme?: string, host: string, path: string,
 *   models: string[] }[], env: Record<string, string | undefined> }} input - the live routes, the configurable provider
 *   directory, the settings forms, each route's models (or the error listing them), the endpoints the plugin has seen,
 *   and the environment.
 * @returns {{ id: string, name: string, baseURL?: string, host?: string, basePath?: string, source: 'settings' | 'default'
 *   | 'environment' | 'seen' | 'unknown', seen: boolean, sharedHost: boolean, sameEndpoint: boolean, openrouter: boolean, models: { id: string,
 *   name: string }[], modelCount: number, modelsError?: string }[]} one entry per live route, in the service's order. `source` says where the
 *   endpoint came from, `seen` whether a request to it was logged, `sharedHost` whether another channel sends to the same
 *   host (a rule then needs the base path to tell them apart), and `sameEndpoint` whether one sends to the same base URL
 *   too (only the models can tell them apart then).
 */
export function describeChannels({ providers, directory, descriptors, models, endpoints, env }) {
  const settingsOf = ns => descriptors.find(descriptor => descriptor.ns === ns)?.value
  const channels = providers.map((provider) => {
    const listed = models.get(provider.id)
    const modelList = Array.isArray(listed) ? listed.slice(0, MAX_MODELS).map(model => ({ id: model.id, name: typeof model.name === 'string' ? model.name : model.id })) : []
    const ids = new Set(modelList.map(model => model.id))
    const seenAt = endpoints.filter(endpoint => endpoint.models.some(model => ids.has(model)))
    let url
    let source = 'unknown'
    const entry = directory.find(item => item.provider === provider.id)
    if (entry !== undefined) {
      const profile = valueAt(settingsOf(entry.settingsNs), entry.settingsPath)
      url = httpUrl(isObject(profile) ? profile.baseURL : undefined)
      if (url !== undefined) source = 'settings'
      else if ((url = httpUrl(entry.defaultBaseURL)) !== undefined) source = 'default'
    }
    if (url === undefined && entry?.defaultBaseURL === undefined && /deepseek/i.test(provider.id)) {
      // The official routes (API key and account) without a `baseURL` of their own use llm-deepseek's fallback: the environment, then the public API.
      if ((url = httpUrl(env[DEEPSEEK_BASE_URL_ENV])) !== undefined) source = 'environment'
      else { url = new URL(DEEPSEEK_PUBLIC_BASE_URL); source = 'default' }
    }
    if (url === undefined && seenAt.length > 0) {
      url = new URL(`${seenAt[0].scheme ?? 'https'}://${seenAt[0].host}`)
      source = 'seen'
    }
    const seen = url !== undefined && seenAt.some(endpoint => endpoint.host === url.host && endpoint.path.startsWith(basePathOf(url)))
    return {
      id: provider.id,
      name: typeof provider.name === 'string' && provider.name !== '' ? provider.name : provider.id,
      ...url === undefined ? {} : { baseURL: url.href, host: url.host, basePath: basePathOf(url) },
      source,
      seen,
      openrouter: url !== undefined && (url.hostname === 'openrouter.ai' || url.hostname.endsWith('.openrouter.ai')),
      models: modelList,
      modelCount: Array.isArray(listed) ? listed.length : 0,
      ...listed instanceof Error ? { modelsError: listed.message } : {},
    }
  })
  for (const channel of channels) {
    const others = channels.filter(other => other !== channel && other.host !== undefined && other.host === channel.host)
    channel.sharedHost = channel.host !== undefined && others.length > 0
    channel.sameEndpoint = others.some(other => other.basePath === channel.basePath)
  }
  return channels
}

/**
 * Read the inputs of {@link describeChannels} from dsh's services.
 * @param {{ get: (name: string) => any }} ctx - the plugin context; `llm` and `settings` are read when present.
 * @param {{ scheme?: string, host: string, path: string, models: string[] }[]} endpoints - the endpoints seen so far.
 * @param {Record<string, string | undefined>} env - the environment.
 * @returns {Promise<{ available: boolean, channels: object[] }>} `available` is false when dsh has no `llm` service here.
 */
export async function collectChannels(ctx, endpoints, env) {
  const llm = ctx.get('llm')
  if (llm === undefined) return { available: false, channels: [] }
  const providers = llm.listProviders()
  let directory = []
  try {
    directory = llm.listConfigurableProviders?.() ?? []
  } catch {
    // Without the directory, endpoints fall back to what requests showed.
  }
  let descriptors = []
  try {
    descriptors = ctx.get('settings')?.describe({ redactSecrets: true }) ?? []
  } catch {
    // Without the settings forms, endpoints fall back to catalog defaults and requests.
  }
  const models = new Map(await Promise.all(providers.map(async (provider) => {
    let timer
    try {
      const listed = await Promise.race([
        llm.listModels(provider.id),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timed out')), MODELS_TIMEOUT_MS) }),
      ])
      return [provider.id, Array.isArray(listed) ? listed : []]
    } catch (error) {
      return [provider.id, error instanceof Error ? error : new Error(String(error))]
    } finally {
      clearTimeout(timer)
    }
  })))
  return { available: true, channels: describeChannels({ providers, directory, descriptors, models, endpoints, env }) }
}
