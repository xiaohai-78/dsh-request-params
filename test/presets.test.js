import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PRESET_IDS, buildPreset, emptyForm, formOfRule, normalizeForm, presetHosts } from '../presets.js'
import { applyRules, normalizeRule, validateRule } from '../rules.js'

/** A rule the page would create from a preset. */
function ruleFrom(id, raw, hosts = presetHosts(id).length > 0 ? presetHosts(id) : ['gateway.example']) {
  const built = buildPreset(id, raw)
  return normalizeRule({ id: 'r', name: id, match: { hosts }, body: built.body, headers: built.headers, preset: { id, form: built.form } })
}

test('every preset starts empty, and an empty form builds nothing', () => {
  for (const id of PRESET_IDS) {
    const empty = id === 'strip' ? { fields: [] } : emptyForm(id)
    const built = buildPreset(id, empty)
    if (id === 'session') assert.equal(built.empty, false, 'the session preset starts with both switches on')
    else assert.equal(built.empty, true, id)
  }
})

test('builds OpenRouter provider routing from the form', () => {
  const built = buildPreset('openrouter-routing', {
    order: [' deepinfra ', 'together', 'deepinfra', 7], only: ['deepinfra', 'together'], ignore: ['azure'], allowFallbacks: false, requireParameters: true,
    dataCollection: 'deny', zdr: true, distillable: true, quantizations: ['fp8', 'bf16', 'weird'], sort: 'throughput', maxPrompt: '0.5', maxCompletion: 2,
    minThroughput: 40, maxLatency: '3', models: ['anthropic/claude-sonnet-4.5', 'openai/gpt-5'],
  })
  assert.deepEqual(built.body.merge, {
    provider: {
      order: ['deepinfra', 'together'], only: ['deepinfra', 'together'], ignore: ['azure'], allow_fallbacks: false, require_parameters: true, data_collection: 'deny', zdr: true,
      enforce_distillable_text: true, quantizations: ['fp8', 'bf16'], sort: 'throughput', max_price: { prompt: 0.5, completion: 2 }, preferred_min_throughput: 40, preferred_max_latency: 3,
    },
    models: ['anthropic/claude-sonnet-4.5', 'openai/gpt-5'],
  })
  assert.deepEqual(built.headers, {})
})

test('leaves out what keeps its default, and does not send a zero where nothing was chosen', () => {
  assert.deepEqual(buildPreset('openrouter-routing', { sort: 'price', allowFallbacks: true, dataCollection: 'allow' }).body.merge, { provider: { sort: 'price', data_collection: 'allow' } })
  assert.deepEqual(buildPreset('openrouter-routing', { maxPrompt: '', maxCompletion: null, minThroughput: 'abc', maxLatency: -1 }).body.merge, {})
  assert.deepEqual(buildPreset('openrouter-routing', { maxPrompt: 0 }).body.merge, { provider: { max_price: { prompt: 0 } } }, 'a free-only limit is a real value')
})

test('builds reasoning, sampling, session, attribution and field removal', () => {
  assert.deepEqual(buildPreset('reasoning', { effort: 'high', maxTokens: '2048.9', exclude: true }).body.merge, { reasoning: { effort: 'high', max_tokens: 2048, exclude: true } })
  assert.deepEqual(buildPreset('reasoning', { effort: 'bogus' }).body.merge, {})
  assert.deepEqual(buildPreset('sampling', { topK: 40.7, minP: 0.05, topA: '0.2', repetitionPenalty: 1.1 }).body.merge, { top_k: 40, min_p: 0.05, top_a: 0.2, repetition_penalty: 1.1 })
  const session = buildPreset('session', {})
  assert.deepEqual(session.body.merge, { session_id: '{{session}}' })
  assert.deepEqual(session.headers.set, { 'x-session-id': '{{session}}' })
  assert.deepEqual(buildPreset('session', { body: false }).body.merge, {})
  assert.deepEqual(buildPreset('attribution', { referer: 'https://example.com/app', title: ' My App ' }).headers.set, { 'HTTP-Referer': 'https://example.com/app', 'X-OpenRouter-Title': 'My App' })
  assert.deepEqual(buildPreset('strip', { fields: ['store', ' stream_options.include_usage ', ''] }).body.remove, ['store', 'stream_options.include_usage'])
})

test('the rules the presets build are valid and change a request as described', () => {
  const url = new URL('https://openrouter.ai/api/v1/chat/completions')
  const body = { model: 'deepseek/deepseek-chat', messages: [{ role: 'user', content: 'hi' }], store: false, stream: true }
  for (const id of PRESET_IDS) assert.deepEqual(validateRule(ruleFrom(id, id === 'strip' ? { fields: ['store'] } : emptyForm(id), ['openrouter.ai'])), [], id)
  const rules = [
    ruleFrom('openrouter-routing', { sort: 'latency', models: ['openai/gpt-5'] }),
    ruleFrom('session', {}),
    ruleFrom('strip', { fields: ['store'] }, ['openrouter.ai']),
    ruleFrom('attribution', { title: 'dsh' }),
  ]
  const result = applyRules({ enabled: true, rules }, { url, body }, { session: 'S1' })
  assert.deepEqual(result.body, { model: 'deepseek/deepseek-chat', messages: body.messages, stream: true, provider: { sort: 'latency' }, models: ['openai/gpt-5'], session_id: 'S1' })
  assert.deepEqual(result.headers.set, { 'x-session-id': 'S1', 'X-OpenRouter-Title': 'dsh' })
})

test('refuses to remove a protected field through the removal preset', () => {
  assert.deepEqual(validateRule(ruleFrom('strip', { fields: ['messages'] }, ['openrouter.ai'])).map(problem => problem.code), ['protected'])
})

test('reopens a rule in its form only while the rule still equals what the form builds', () => {
  const rule = ruleFrom('openrouter-routing', { sort: 'price', order: ['deepinfra'] })
  assert.deepEqual(formOfRule(rule), normalizeForm('openrouter-routing', { sort: 'price', order: ['deepinfra'] }))
  rule.body.merge.provider.sort = 'latency'
  assert.equal(formOfRule(rule), undefined, 'edited by hand')
  assert.equal(formOfRule(normalizeRule({ id: 'x', body: { merge: { a: 1 } } })), undefined, 'no preset')
  assert.equal(formOfRule(normalizeRule({ id: 'x', preset: { id: 'gone', form: {} } })), undefined, 'unknown preset')
})

test('coerces a form of the wrong type to the empty form', () => {
  assert.deepEqual(normalizeForm('sampling', 'junk'), emptyForm('sampling'))
  assert.deepEqual(normalizeForm('reasoning', { effort: 3, maxTokens: {}, exclude: 'yes' }), emptyForm('reasoning'))
})
