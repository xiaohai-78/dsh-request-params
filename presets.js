/**
 * Presets: forms that build the body and header changes of a rule, for the parameters people most often add.
 *
 * Each preset has a form (plain JSON, stored in the rule as `preset.form` so the page can reopen it), a `normalizeForm`
 * step that coerces whatever was stored or typed into the form's types, and a `build` step that returns the rule's
 * `body` and `headers`. A rule keeps working after its preset form is no longer reopened: the rule holds the result.
 */

export const PRESET_IDS = ['openrouter-routing', 'reasoning', 'sampling', 'session', 'attribution', 'strip']
/** The `provider.quantizations` values OpenRouter accepts. */
export const QUANTIZATIONS = ['int4', 'int8', 'fp4', 'mxfp4', 'nvfp4', 'fp6', 'fp8', 'mxfp8', 'fp16', 'bf16', 'fp32', 'unknown']
export const SORTS = ['price', 'throughput', 'latency']
export const EFFORTS = ['xhigh', 'high', 'medium', 'low', 'minimal', 'none']
const MAX_LIST = 40
const MAX_TEXT = 256

const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value)

function strings(value, { allowed, max = MAX_LIST } = {}) {
  if (!Array.isArray(value)) return []
  const out = []
  for (const item of value) {
    if (typeof item !== 'string') continue
    const text = item.trim().slice(0, MAX_TEXT)
    if (text === '' || out.includes(text) || (allowed !== undefined && !allowed.includes(text))) continue
    out.push(text)
    if (out.length >= max) break
  }
  return out
}

/** @returns {number | null} the value as a non-negative finite number, or null when it is empty or not one. */
function amount(value) {
  if (value === '' || value === null || value === undefined) return null
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

const text = value => (typeof value === 'string' ? value.trim().slice(0, MAX_TEXT) : '')
const choice = (value, allowed) => (allowed.includes(value) ? value : '')

const FORMS = {
  'openrouter-routing': {
    empty: () => ({ order: [], only: [], ignore: [], allowFallbacks: true, requireParameters: false, dataCollection: '', zdr: false, distillable: false, quantizations: [], sort: '', maxPrompt: null, maxCompletion: null, minThroughput: null, maxLatency: null, models: [] }),
    normalize: raw => ({
      order: strings(raw.order),
      only: strings(raw.only),
      ignore: strings(raw.ignore),
      allowFallbacks: raw.allowFallbacks !== false,
      requireParameters: raw.requireParameters === true,
      dataCollection: choice(raw.dataCollection, ['allow', 'deny']),
      zdr: raw.zdr === true,
      distillable: raw.distillable === true,
      quantizations: strings(raw.quantizations, { allowed: QUANTIZATIONS }),
      sort: choice(raw.sort, SORTS),
      maxPrompt: amount(raw.maxPrompt),
      maxCompletion: amount(raw.maxCompletion),
      minThroughput: amount(raw.minThroughput),
      maxLatency: amount(raw.maxLatency),
      models: strings(raw.models, { max: 10 }),
    }),
    build(form) {
      const provider = {}
      if (form.order.length > 0) provider.order = form.order
      if (form.only.length > 0) provider.only = form.only
      if (form.ignore.length > 0) provider.ignore = form.ignore
      if (!form.allowFallbacks) provider.allow_fallbacks = false
      if (form.requireParameters) provider.require_parameters = true
      if (form.dataCollection !== '') provider.data_collection = form.dataCollection
      if (form.zdr) provider.zdr = true
      if (form.distillable) provider.enforce_distillable_text = true
      if (form.quantizations.length > 0) provider.quantizations = form.quantizations
      if (form.sort !== '') provider.sort = form.sort
      if (form.maxPrompt !== null || form.maxCompletion !== null) provider.max_price = { ...form.maxPrompt !== null ? { prompt: form.maxPrompt } : {}, ...form.maxCompletion !== null ? { completion: form.maxCompletion } : {} }
      if (form.minThroughput !== null) provider.preferred_min_throughput = form.minThroughput
      if (form.maxLatency !== null) provider.preferred_max_latency = form.maxLatency
      const merge = {}
      if (Object.keys(provider).length > 0) merge.provider = provider
      if (form.models.length > 0) merge.models = form.models
      return { body: { merge }, headers: {} }
    },
    hosts: ['openrouter.ai'],
  },
  reasoning: {
    empty: () => ({ effort: '', maxTokens: null, exclude: false }),
    normalize: raw => ({ effort: choice(raw.effort, EFFORTS), maxTokens: amount(raw.maxTokens) === null ? null : Math.floor(amount(raw.maxTokens)), exclude: raw.exclude === true }),
    build(form) {
      const reasoning = {}
      if (form.effort !== '') reasoning.effort = form.effort
      if (form.maxTokens !== null) reasoning.max_tokens = form.maxTokens
      if (form.exclude) reasoning.exclude = true
      return { body: { merge: Object.keys(reasoning).length > 0 ? { reasoning } : {} }, headers: {} }
    },
    hosts: ['openrouter.ai'],
  },
  sampling: {
    empty: () => ({ topK: null, minP: null, topA: null, repetitionPenalty: null }),
    normalize: raw => ({ topK: amount(raw.topK) === null ? null : Math.floor(amount(raw.topK)), minP: amount(raw.minP), topA: amount(raw.topA), repetitionPenalty: amount(raw.repetitionPenalty) }),
    build(form) {
      const merge = {}
      if (form.topK !== null) merge.top_k = form.topK
      if (form.minP !== null) merge.min_p = form.minP
      if (form.topA !== null) merge.top_a = form.topA
      if (form.repetitionPenalty !== null) merge.repetition_penalty = form.repetitionPenalty
      return { body: { merge }, headers: {} }
    },
    hosts: ['openrouter.ai'],
  },
  session: {
    empty: () => ({ body: true, header: true }),
    normalize: raw => ({ body: raw.body !== false, header: raw.header !== false }),
    build: form => ({ body: { merge: form.body ? { session_id: '{{session}}' } : {} }, headers: form.header ? { set: { 'x-session-id': '{{session}}' } } : {} }),
    hosts: ['openrouter.ai'],
  },
  attribution: {
    empty: () => ({ referer: '', title: '' }),
    normalize: raw => ({ referer: text(raw.referer), title: text(raw.title) }),
    build(form) {
      const set = {}
      if (form.referer !== '') set['HTTP-Referer'] = form.referer
      if (form.title !== '') set['X-OpenRouter-Title'] = form.title
      return { body: { merge: {} }, headers: { set } }
    },
    hosts: ['openrouter.ai'],
  },
  strip: {
    empty: () => ({ fields: ['store'] }),
    normalize: raw => ({ fields: strings(raw.fields) }),
    build: form => ({ body: { merge: {}, remove: form.fields }, headers: {} }),
    hosts: [],
  },
}

/**
 * @param {string} id - a preset id from {@link PRESET_IDS}.
 * @returns {object} an empty form of that preset.
 */
export function emptyForm(id) {
  return FORMS[id].empty()
}

/**
 * @param {string} id - a preset id.
 * @param {unknown} raw - a stored or typed form.
 * @returns {object} the form with every field in its type; missing fields take the empty form's value.
 */
export function normalizeForm(id, raw) {
  const form = FORMS[id]
  const source = isObject(raw) ? raw : {}
  return { ...form.empty(), ...form.normalize({ ...form.empty(), ...source }) }
}

/**
 * Build the changes a preset form stands for.
 * @param {string} id - a preset id.
 * @param {unknown} raw - the form.
 * @returns {{ form: object, body: { merge: object, remove?: string[] }, headers: { set?: Record<string, string> }, empty: boolean }}
 *   the cleaned form, the rule's `body` and `headers` parts, and whether the form changes nothing.
 */
export function buildPreset(id, raw) {
  const form = normalizeForm(id, raw)
  const built = FORMS[id].build(form)
  const empty = Object.keys(built.body.merge ?? {}).length === 0 && (built.body.remove ?? []).length === 0 && Object.keys(built.headers.set ?? {}).length === 0
  return { form, body: built.body, headers: built.headers, empty }
}

/**
 * @param {string} id - a preset id.
 * @returns {string[]} the hosts a new rule from this preset matches (empty when the user must name one).
 */
export function presetHosts(id) {
  return [...FORMS[id].hosts]
}

/**
 * Read a rule's preset back into the form, if the rule still holds exactly what the preset builds.
 * @param {{ preset?: { id: string, form: object }, body: object, headers: object }} rule - a normalized rule.
 * @returns {object | undefined} the form when the rule's body and headers equal the preset's output; undefined when
 *   the rule was not made from a preset or has been edited since, so the page does not show a form that no longer
 *   describes it.
 */
export function formOfRule(rule) {
  if (rule.preset === undefined || !PRESET_IDS.includes(rule.preset.id)) return undefined
  const built = buildPreset(rule.preset.id, rule.preset.form)
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const bodyMatches = same(built.body.merge ?? {}, rule.body.merge) && same(built.body.remove ?? [], rule.body.remove) && same(rule.body.defaults, {})
  const headersMatch = same(built.headers.set ?? {}, rule.headers.set) && rule.headers.remove.length === 0
  return bodyMatches && headersMatch ? built.form : undefined
}
