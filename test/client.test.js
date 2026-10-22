import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')

/** The entries of one dictionary literal in client.js. */
function dictionary(name) {
  const start = source.indexOf(`const ${name} = {`)
  const end = source.indexOf('\n    }\n', start)
  return new Map([...source.slice(start, end).matchAll(/^\s{6}'([^']+)': '((?:[^'\\]|\\.)*)',$/gm)].map(match => [match[1], match[2]]))
}

const zh = dictionary('ZH')
const en = dictionary('EN')
const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()

test('both languages have the same keys', () => {
  assert.ok(zh.size > 250)
  assert.deepEqual([...zh.keys()].filter(key => !en.has(key)), [])
  assert.deepEqual([...en.keys()].filter(key => !zh.has(key)), [])
})

test('every singular variant has its plural base', () => {
  for (const key of zh.keys()) if (key.endsWith('.one')) assert.ok(zh.has(key.slice(0, -4)), key)
})

test('both languages use the same {placeholders} for each key', () => {
  for (const [key, text] of zh) assert.deepEqual(placeholders(text), placeholders(en.get(key)), key)
})

test('every key the page names exists', () => {
  const used = new Set()
  for (const match of source.matchAll(/\b(?:ui\.)?t\(\s*'([A-Za-z0-9_.-]+)'/g)) used.add(match[1])
  for (const match of source.matchAll(/'((?:sampling|route|reasoning|card|master|nav|env|help)\.[A-Za-z0-9_.-]+)'/g)) used.add(match[1])
  for (const id of ['openrouter-routing', 'reasoning', 'sampling', 'session', 'attribution', 'strip', 'custom']) for (const part of ['name', 'desc']) used.add(`preset.${id}.${part}`)
  for (const id of ['vllm-thinking', 'helicone', 'cloudflare', 'openai-cache']) for (const part of ['name', 'desc']) used.add(`recipe.${id}.${part}`)
  for (const sort of ['price', 'throughput', 'latency']) used.add(`sum.sort.${sort}`)
  for (const source of ['settings', 'default', 'environment', 'seen', 'unknown']) used.add(`channels.source.${source}`)
  for (const kind of ['set', 'default', 'remove', 'header', 'header-remove']) used.add(`change.${kind}`)
  for (const reason of ['env-missing', 'bad-value']) used.add(`skipped.${reason}`)
  for (const code of ['no-host', 'bad-host', 'too-large', 'too-deep', 'bad-key', 'protected', 'template-env-name', 'template-unknown', 'bad-path', 'bad-header', 'forbidden-header', 'bad-header-value', 'duplicate-header']) used.add(`problem.${code}`)
  assert.deepEqual([...used].filter(key => !zh.has(key)), [])
})

test('the help text does not use a {name} the translator would fill in', () => {
  for (const [key, text] of [...zh, ...en]) {
    if (/\{\{(?:model|session)\}\}/.test(text)) assert.ok(!/\{(?:model|session)\}/.test(text.replaceAll(/\{\{(?:model|session)\}\}/g, '')), key)
  }
})

/** A function or constant block of client.js, evaluated on its own. */
function extract(from, to, returns) {
  const start = source.indexOf(from)
  const end = source.indexOf(to, start)
  assert.ok(start >= 0 && end > start, `${from} not found`)
  return new Function(`${source.slice(start, end)}\nreturn ${returns}`)()
}

test('the request diff does not show the field before an added one as changed', () => {
  const lineDiff = extract('const MAX_DIFF_LINES', 'function DiffView', 'lineDiff')
  const before = JSON.stringify({ model: 'm', store: false }, null, 2)
  const after = JSON.stringify({ model: 'm', store: false, provider: { sort: 'price' } }, null, 2)
  assert.deepEqual(lineDiff(before, after).filter(line => line.type !== 'same').map(line => line.text.trim()), ['"provider": {', '"sort": "price"', '}'])
  assert.deepEqual(lineDiff(before, JSON.stringify({ model: 'm' }, null, 2)).filter(line => line.type === 'del').map(line => line.text.trim()), ['"store": false'])
})

test('a gateway error is matched to the fields a rule set, by whole words', () => {
  const mentionedFields = extract('/** Fields a rule set that the gateway', '/** Logged requests, newest first', 'mentionedFields')
  const entry = (errorText, ...paths) => ({ errorText, changes: paths.map(path => ({ kind: 'set', path })) })
  assert.deepEqual(mentionedFields(entry('Unrecognized request argument supplied: provider', 'provider.sort', 'top_k')), ['provider'])
  assert.deepEqual(mentionedFields(entry('No endpoints found matching your data policy', 'provider.sort', 'session_id')), [])
  assert.deepEqual(mentionedFields(entry('session_id is too long', 'session_id', 'x-session-id')), ['session_id'])
  assert.deepEqual(mentionedFields({ errorText: undefined, changes: [] }), [])
  assert.deepEqual(mentionedFields({ errorText: 'store is not supported', changes: [{ kind: 'remove', path: 'store' }] }), [], 'a removed field was not sent')
})

/** The page's pure helpers for channels, summaries, and the preview, with the two small helpers they use. */
function helpers() {
  const prelude = ['const pl =', 'const filled ='].map(start => source.slice(source.indexOf(start), source.indexOf('\n', source.indexOf(start)))).join('\n')
  const start = source.indexOf("/** The engine's host test")
  const end = source.indexOf('const ICONS', start)
  assert.ok(start >= 0 && end > start)
  return new Function(`${prelude}\n${source.slice(start, end)}\nreturn { reaches, matchOfChannel, channelOfRequest, displayName, providerLabel, summaryOf, addedFields, requestPathOf }`)()
}

const channel = (id, baseURL, extra = {}) => {
  const url = new URL(baseURL)
  return { id, name: id, baseURL: url.href, host: url.host, basePath: url.pathname.replace(/\/+$/, ''), models: [], sharedHost: false, sameEndpoint: false, openrouter: false, ...extra }
}
const rule = (match, extra = {}) => ({ id: 'r', name: '', enabled: true, match: { hosts: [], paths: [], models: [], ...match }, body: { merge: {}, defaults: {}, remove: [] }, headers: { set: {}, remove: [] }, ...extra })

test('a rule reaches a channel by the engine host and path tests', () => {
  const { reaches, matchOfChannel } = helpers()
  const openrouter = channel('openrouter', 'https://openrouter.ai/api/v1')
  const oa = channel('oa', 'http://127.0.0.1:8130/oa', { sharedHost: true })
  const ant = channel('ant', 'http://127.0.0.1:8130/ant', { sharedHost: true })
  assert.equal(reaches(rule({ hosts: ['openrouter.ai'] }), openrouter), true)
  assert.equal(reaches(rule({ hosts: ['*.openrouter.ai'] }), openrouter), true, '*.x covers x')
  assert.equal(reaches(rule({ hosts: ['*'] }), oa), true)
  assert.equal(reaches(rule({ hosts: ['127.0.0.1'] }), oa), true, 'no port covers any port')
  assert.equal(reaches(rule({ hosts: ['127.0.0.1:9999'] }), oa), false)
  assert.equal(reaches(rule(matchOfChannel(oa)), oa), true)
  assert.equal(reaches(rule(matchOfChannel(oa)), ant), false, 'the base path tells channels on one host apart')
  assert.equal(reaches(rule({ hosts: ['127.0.0.1'], paths: ['/oa/chat'] }), oa), true, 'a longer path still reaches some of the channel')
  assert.equal(reaches(rule({ hosts: ['127.0.0.1'], paths: ['/o'] }), oa), true, 'paths match by prefix, as in the engine')
  assert.equal(reaches(rule({ hosts: ['openrouter.ai'] }), { id: 'x', name: 'x', basePath: '' }), false, 'a channel without an address')
})

test('a logged request belongs to the channel with the longest base path, then the one that lists its model', () => {
  const { channelOfRequest } = helpers()
  const root = channel('root', 'http://127.0.0.1:8130')
  const oa = channel('oa', 'http://127.0.0.1:8130/oa')
  const official = channel('official', 'https://api.deepseek.com/anthropic', { models: [{ id: 'deepseek-chat' }] })
  const account = channel('account', 'https://api.deepseek.com/anthropic', { models: [{ id: 'deepseek-v4-pro' }] })
  const channels = [root, oa, official, account]
  assert.equal(channelOfRequest(channels, { host: '127.0.0.1:8130', path: '/oa/chat/completions' }).id, 'oa')
  assert.equal(channelOfRequest(channels, { host: '127.0.0.1:8130', path: '/v1/messages' }).id, 'root')
  assert.equal(channelOfRequest(channels, { host: 'api.deepseek.com', path: '/anthropic/v1/messages', model: 'deepseek-v4-pro' }).id, 'account')
  assert.equal(channelOfRequest(channels, { host: 'api.deepseek.com', path: '/anthropic/v1/messages', model: 'other' }).id, 'official')
  assert.equal(channelOfRequest(channels, { host: 'example.com', path: '/v1/messages' }), undefined)
})

test('the preview shows the top-level fields the rules set, with their final values', () => {
  const { addedFields } = helpers()
  const result = {
    body: { model: 'm', messages: [], provider: { order: ['deepseek'], allow_fallbacks: false }, stream_options: { include_usage: true }, top_k: 40 },
    changes: [{ kind: 'set', path: 'provider.order' }, { kind: 'set', path: 'provider.allow_fallbacks' }, { kind: 'default', path: 'top_k' }, { kind: 'remove', path: 'store' }, { kind: 'header', path: 'X-Title' }],
  }
  assert.deepEqual(addedFields(result), { provider: { order: ['deepseek'], allow_fallbacks: false }, top_k: 40 })
})

test('a channel preview uses the path its requests went to, or the usual endpoint under its base path', () => {
  const { requestPathOf } = helpers()
  assert.equal(requestPathOf(channel('a', 'https://openrouter.ai/api/v1'), []), '/api/v1/chat/completions')
  assert.equal(requestPathOf(channel('b', 'https://api.deepseek.com/anthropic'), []), '/anthropic/v1/messages')
  assert.equal(requestPathOf(channel('c', 'http://127.0.0.1:8130/v1'), [{ path: '/v1/messages' }]), '/v1/messages')
})

test('a collapsed card says what its parameter adds', () => {
  const { summaryOf, displayName, providerLabel } = helpers()
  const t = (key, params = {}) => `${key}${Object.keys(params).length === 0 ? '' : JSON.stringify(params)}`
  const routing = form => rule({ hosts: ['openrouter.ai'] }, { preset: { id: 'openrouter-routing', form: { order: [], only: [], ignore: [], allowFallbacks: true, requireParameters: false, dataCollection: '', zdr: false, distillable: false, quantizations: [], sort: '', maxPrompt: null, maxCompletion: null, minThroughput: null, maxLatency: null, models: [], ...form } } })
  const names = { deepseek: 'DeepSeek', deepinfra: 'DeepInfra' }
  assert.equal(providerLabel(names, 'deepinfra/fp4'), 'DeepInfra/fp4')
  assert.equal(providerLabel(names, 'unknown'), 'unknown')
  assert.equal(summaryOf(t, routing({ order: ['deepseek', 'deepinfra/fp4'], allowFallbacks: false }), names), 'DeepSeek → DeepInfra/fp4 · sum.strict')
  assert.equal(summaryOf(t, routing({ zdr: true, maxPrompt: '0.5', sort: 'price' }), names), 'sum.sort.price · sum.zdr · sum.limits.one{"n":1}')
  assert.equal(summaryOf(t, routing({ maxPrompt: '' }), names), 'sum.empty', 'an emptied number field sets nothing')
  const custom = rule({ hosts: ['x'] }, { body: { merge: { top_k: 40, chat_template_kwargs: { enable_thinking: false } }, defaults: {}, remove: ['store'] }, headers: { set: { 'X-Title': 'a' }, remove: [] } })
  assert.equal(summaryOf(t, custom, {}), 'top_k = 40 · chat_template_kwargs · −store · X-Title')
  const openrouter = channel('openrouter', 'https://openrouter.ai/api/v1')
  assert.equal(displayName(t, { ...custom, name: 'Routing · openrouter' }, openrouter), 'Routing', 'the channel suffix new rules get is left out on the channel page')
  assert.equal(displayName(t, { ...custom, name: '' }, openrouter), 'preset.custom.name')
})
