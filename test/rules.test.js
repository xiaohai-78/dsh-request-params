import assert from 'node:assert/strict'
import { test } from 'node:test'
import { applyRules, conversationKey, emptyRule, fillTemplates, hostMatches, looksLikeModelEndpoint, modelMatches, normalizeConfig, normalizeRule, requestModel, targetsModel, targetsUrl, validateRule } from '../rules.js'

const url = value => new URL(value)
const rule = fields => normalizeRule({ id: 'r1', name: 'test', match: { hosts: ['openrouter.ai'] }, ...fields })
const config = (...rules) => ({ enabled: true, rules })
const chat = { model: 'deepseek/deepseek-chat', messages: [{ role: 'user', content: 'hi' }], stream: true, store: false }

test('matches hosts by exact name, wildcard subdomain, port, or anything', () => {
  assert.equal(hostMatches('openrouter.ai', url('https://OpenRouter.ai/api/v1/chat/completions')), true)
  assert.equal(hostMatches('openrouter.ai', url('https://eu.openrouter.ai/x')), false)
  assert.equal(hostMatches('*.openrouter.ai', url('https://eu.openrouter.ai/x')), true)
  assert.equal(hostMatches('*.openrouter.ai', url('https://openrouter.ai/x')), true, 'the bare domain counts too')
  assert.equal(hostMatches('*.openrouter.ai', url('https://notopenrouter.ai/x')), false)
  assert.equal(hostMatches('127.0.0.1:8130', url('http://127.0.0.1:8130/v1/messages')), true)
  assert.equal(hostMatches('127.0.0.1:8130', url('http://127.0.0.1:9999/v1/messages')), false)
  assert.equal(hostMatches('127.0.0.1', url('http://127.0.0.1:9999/v1/messages')), true, 'without a port, any port')
  assert.equal(hostMatches('*', url('https://anything.example/x')), true)
})

test('matches models by glob without regard to case, and a rule with no model condition covers every model', () => {
  assert.equal(modelMatches('deepseek/*', 'DeepSeek/deepseek-chat:nitro'), true)
  assert.equal(modelMatches('*-chat', 'deepseek/deepseek-chat'), true)
  assert.equal(modelMatches('gpt-4.1', 'gpt-4.1-mini'), false)
  assert.equal(modelMatches('a.b*', 'a.bc'), true)
  assert.equal(modelMatches('a.b*', 'axbc'), false, 'a dot in a pattern is a dot')
  assert.equal(targetsModel(rule({}), undefined), true)
  assert.equal(targetsModel(rule({ match: { hosts: ['x.ai'], models: ['gpt*'] } }), undefined), false)
})

test('limits a rule to path prefixes and to enabled rules', () => {
  const scoped = rule({ match: { hosts: ['openrouter.ai'], paths: ['api/v1/chat'] } })
  assert.deepEqual(scoped.match.paths, ['/api/v1/chat'])
  assert.equal(targetsUrl(scoped, url('https://openrouter.ai/api/v1/chat/completions?x=1')), true)
  assert.equal(targetsUrl(scoped, url('https://openrouter.ai/api/v1/messages')), false)
  assert.equal(targetsUrl(rule({ enabled: false }), url('https://openrouter.ai/x')), false)
})

test('recognizes model endpoints by their path alone', () => {
  for (const path of ['/v1/messages', '/api/v1/chat/completions', '/v1/responses', '/v1/completions', '/v1beta/models/x:streamGenerateContent', '/v1/messages/']) assert.equal(looksLikeModelEndpoint(url(`https://h.example${path}`)), true, path)
  for (const path of ['/v1/models', '/login', '/v1/messages/count', '/v1/batches']) assert.equal(looksLikeModelEndpoint(url(`https://h.example${path}`)), false, path)
})

test('merges objects, replaces everything else, fills defaults only where nothing is, and removes paths', () => {
  const base = { model: 'm', messages: [], provider: { order: ['a'], zdr: true }, top_k: 5, store: false }
  const result = applyRules(config(rule({
    body: { merge: { provider: { order: ['x', 'y'], allow_fallbacks: false }, top_p: 0.9 }, defaults: { top_k: 40, min_p: 0.05, provider: { sort: 'price' } }, remove: ['store', 'provider.zdr', 'missing.path'] },
  })), { url: url('https://openrouter.ai/api/v1/chat/completions'), body: base })
  assert.deepEqual(result.body, { model: 'm', messages: [], provider: { order: ['x', 'y'], allow_fallbacks: false, sort: 'price' }, top_k: 5, top_p: 0.9, min_p: 0.05 })
  assert.deepEqual(base.provider, { order: ['a'], zdr: true }, 'the request given is not changed')
  assert.equal(result.changed, true)
  assert.deepEqual(result.changes.map(change => `${change.kind}:${change.path}`).sort(), ['default:min_p', 'default:provider.sort', 'remove:provider.zdr', 'remove:store', 'set:provider.allow_fallbacks', 'set:provider.order', 'set:top_p'])
})

test('reports no change when the request already holds the values', () => {
  const result = applyRules(config(rule({ body: { merge: { store: false }, defaults: { top_k: 40 } } })), { url: url('https://openrouter.ai/x'), body: { ...chat, top_k: 10 } })
  assert.equal(result.changed, false)
  assert.deepEqual(result.changes, [])
  assert.deepEqual(result.matched, [{ id: 'r1', name: 'test' }], 'it still matched')
})

test('applies rules in order, each seeing the one before, and a later header change wins', () => {
  const first = rule({ id: 'a', body: { merge: { provider: { order: ['one'] } } }, headers: { set: { 'X-Tag': 'first', 'X-Gone': 'later removed' }, remove: ['x-old'] } })
  const second = rule({ id: 'b', body: { merge: { provider: { sort: 'latency' } }, remove: ['provider.order'] }, headers: { set: { 'x-tag': 'second', 'X-Old': 'set again' }, remove: ['X-Gone'] } })
  const result = applyRules(config(first, second), { url: url('https://openrouter.ai/x'), body: chat })
  assert.deepEqual(result.body.provider, { sort: 'latency' })
  assert.deepEqual(result.headers, { set: { 'x-tag': 'second', 'X-Old': 'set again' }, remove: ['x-gone'] })
  assert.deepEqual(result.matched.map(match => match.id), ['a', 'b'])
})

test('leaves requests alone when the master switch is off, no rule matches, or the model differs', () => {
  const only = rule({ match: { hosts: ['openrouter.ai'], models: ['gpt*'] }, body: { merge: { a: 1 } } })
  assert.equal(applyRules({ enabled: false, rules: [only] }, { url: url('https://openrouter.ai/x'), body: { model: 'gpt-5' } }).changed, false)
  assert.equal(applyRules(config(only), { url: url('https://other.example/x'), body: { model: 'gpt-5' } }).matched.length, 0)
  assert.equal(applyRules(config(only), { url: url('https://openrouter.ai/x'), body: { model: 'claude' } }).matched.length, 0)
  assert.equal(applyRules(config(only), { url: url('https://openrouter.ai/x'), body: { model: 'gpt-5' } }).changed, true)
})

test('fills {{model}}, {{session}}, and {{env:NAME}}, masks what came from the environment, and skips a field whose variable is unset', () => {
  const env = { OR_TITLE: 'my-app' }
  const filled = fillTemplates({ a: 'x {{ model }} y', list: ['{{session}}'], n: 3 }, { model: 'm1', session: 's1', env })
  assert.deepEqual(filled, { value: { a: 'x m1 y', list: ['s1'], n: 3 }, secret: false, secrets: [] })
  assert.deepEqual(fillTemplates('{{env:OR_TITLE}}', { session: 's', env }), { value: 'my-app', secret: true, secrets: ['my-app'] })
  assert.deepEqual(fillTemplates('{{env:NOPE}}', { session: 's', env }), { value: '', secret: false, secrets: [], missing: 'NOPE' })
  const result = applyRules(config(rule({ body: { merge: { user: '{{env:OR_USER}}', session_id: '{{session}}', tag: '{{env:OR_TITLE}}' } }, headers: { set: { 'X-Title': '{{env:OR_TITLE}}', 'X-Other': '{{env:OR_NOPE}}' } } })), { url: url('https://openrouter.ai/x'), body: chat }, { env, session: 'sess-1' })
  assert.deepEqual(result.body, { ...chat, session_id: 'sess-1', tag: 'my-app' })
  assert.deepEqual(result.headers, { set: { 'X-Title': 'my-app' }, remove: [] })
  assert.deepEqual(result.skipped.map(item => [item.kind, item.path, item.detail]), [['set', 'user', 'OR_USER'], ['header', 'X-Other', 'OR_NOPE']])
  assert.ok(result.changes.filter(change => change.secret).every(change => change.value === undefined), 'a secret value is never listed')
})

test('uses a key that is the same for every request of one conversation when the session id is unknown', () => {
  const one = { messages: [{ role: 'system', content: 's' }, { role: 'user', content: 'hello' }] }
  const later = { messages: [...one.messages, { role: 'assistant', content: 'hi' }, { role: 'user', content: 'more' }] }
  assert.equal(conversationKey(one), conversationKey(later))
  assert.notEqual(conversationKey(one), conversationKey({ messages: [{ role: 'user', content: 'different' }] }))
  assert.match(conversationKey({}), /^[0-9a-f]{16}$/)
})

test('refuses protected body fields unless the rule opts in, and unusable header names always', () => {
  const codes = fields => validateRule(rule(fields)).map(problem => `${problem.code}:${problem.detail ?? ''}`)
  assert.deepEqual(codes({ body: { merge: { messages: [], keep: 1 }, remove: ['model', 'a.b'] } }), ['protected:messages', 'protected:model'])
  assert.deepEqual(codes({ allowProtected: true, body: { merge: { model: 'forced' } } }), [])
  assert.deepEqual(codes({ headers: { set: { Authorization: 'x', 'X-Fine': 'ok', 'bad name': 'x', 'X-Line': 'a\nb' }, remove: ['Cookie'] } }), ['forbidden-header:Authorization', 'bad-header:bad name', 'bad-header-value:X-Line', 'forbidden-header:cookie'])
  assert.deepEqual(codes({ allowProtected: true, headers: { set: { 'Content-Type': 'text/plain' } } }), ['forbidden-header:Content-Type'], 'opting in never frees a header')
})

test('refuses rules without a host, with odd hosts, prototype keys, deep or huge bodies, and unknown templates', () => {
  const codes = fields => validateRule(normalizeRule({ id: 'r', match: { hosts: ['openrouter.ai'] }, ...fields })).map(problem => `${problem.code}:${problem.detail ?? ''}`)
  assert.deepEqual(validateRule(emptyRule()).map(problem => problem.code), ['no-host'])
  assert.deepEqual(codes({ match: { hosts: ['bad host', 'https://x.example'] } }), ['bad-host:bad host', 'bad-host:https://x.example'])
  assert.deepEqual(codes({ body: { merge: JSON.parse('{"a":{"__proto__":{"x":1}}}') } }), ['bad-key:a.__proto__'])
  assert.deepEqual(codes({ body: { remove: ['a..b', '__proto__.x'] } }), ['bad-path:a..b', 'bad-path:__proto__.x'])
  let deep = { v: 1 }
  for (let index = 0; index < 20; index++) deep = { n: deep }
  assert.deepEqual(codes({ body: { merge: { deep } } }), ['too-deep:'])
  assert.deepEqual(codes({ body: { merge: { big: 'x'.repeat(70000) } } }), ['too-large:'])
  assert.deepEqual(codes({ body: { merge: { a: '{{nope}}', b: '{{env:bad name}}' } }, headers: { set: { 'X-A': '{{other}}' } } }), ['template-unknown:nope', 'template-env-name:env:bad name', 'template-unknown:other'])
  assert.deepEqual(codes({ headers: { set: { 'X-A': '1', 'x-a': '2' } } }), ['duplicate-header:x-a'])
})

test('does not apply a rule that is not valid', () => {
  const bad = rule({ body: { merge: { messages: [], a: 1 } } })
  assert.equal(applyRules(config(bad), { url: url('https://openrouter.ai/x'), body: chat }).matched.length, 0)
})

test('keeps what is valid when reading a stored configuration and drops the rest', () => {
  const normalized = normalizeConfig({
    enabled: false,
    rules: [
      null,
      { id: 'dup', name: ' A ', match: { hosts: [' OpenRouter.ai ', 'openrouter.ai', 7], paths: ['v1'], models: ['x', ''] }, body: { merge: { a: 1 }, remove: ['b', 3] }, headers: { set: { 'X-N': 5, 'X-Bad': {} }, remove: ['X-R'] }, extra: 1 },
      { id: 'dup', match: 'nonsense' },
    ],
  })
  assert.equal(normalized.enabled, false)
  assert.equal(normalized.rules.length, 2)
  assert.equal(normalized.rules[0].name, 'A')
  assert.deepEqual(normalized.rules[0].match, { hosts: ['openrouter.ai'], paths: ['/v1'], models: ['x'] })
  assert.deepEqual(normalized.rules[0].body, { merge: { a: 1 }, defaults: {}, remove: ['b'] })
  assert.deepEqual(normalized.rules[0].headers, { set: { 'X-N': '5' }, remove: ['x-r'] })
  assert.notEqual(normalized.rules[1].id, 'dup', 'a repeated id is replaced')
  assert.deepEqual(normalizeConfig('junk'), { enabled: true, rules: [] })
})

test('counts a header-only rule as a change', () => {
  const result = applyRules(config(rule({ headers: { set: { 'HTTP-Referer': 'https://example.com' } } })), { url: url('https://openrouter.ai/x'), body: chat })
  assert.equal(result.changed, true)
  assert.deepEqual(result.headers, { set: { 'HTTP-Referer': 'https://example.com' }, remove: [] })
  assert.deepEqual(result.body, chat)
})

test('leaves out a header whose filled value would break the request line', () => {
  const result = applyRules(config(rule({ headers: { set: { 'X-Ok': 'fine', 'X-Env': '{{env:OR_LINE}}' } } })), { url: url('https://openrouter.ai/x'), body: chat }, { env: { OR_LINE: 'a\r\nInjected: 1' } })
  assert.deepEqual(result.headers.set, { 'X-Ok': 'fine' })
  assert.deepEqual(result.skipped.map(item => [item.kind, item.path, item.reason]), [['header', 'X-Env', 'bad-value']])
})

test('takes the model from the body, or from the path of a Google-style endpoint', () => {
  assert.equal(requestModel({ model: 'gpt-5' }, url('https://x.example/v1/chat/completions')), 'gpt-5')
  assert.equal(requestModel({}, url('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:streamGenerateContent?alt=sse')), 'gemini-2.5-pro')
  assert.equal(requestModel({}, url('https://x.example/v1beta/models/gemini-2.5-pro:generateContent')), 'gemini-2.5-pro')
  assert.equal(requestModel({}, url('https://x.example/v1/messages')), undefined)
  const result = applyRules(config(rule({ match: { hosts: ['generativelanguage.googleapis.com'], models: ['gemini-*'] }, body: { merge: { cachedContent: 'c1' } } })), { url: url('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent'), body: { contents: [] } })
  assert.deepEqual(result.body, { contents: [], cachedContent: 'c1' })
})

test('uses a key for a conversation in any of the three body layouts, and one per process when there is no message', () => {
  const user = { role: 'user', content: 'hi' }
  const keys = [{ messages: [user] }, { input: [user] }, { contents: [user] }].map(conversationKey)
  assert.equal(new Set(keys).size, 1)
  assert.equal(conversationKey({}), conversationKey({ messages: [{ role: 'system', content: 's' }] }))
})
