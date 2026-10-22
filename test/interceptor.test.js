import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createInterceptor, ERROR_TEXT_CHARS, MAX_OBSERVE_CHARS, SESSION_HEADER } from '../interceptor.js'
import { normalizeRule } from '../rules.js'

const rule = fields => normalizeRule({ id: 'r1', name: 'test', match: { hosts: ['gateway.example'] }, ...fields })
const ENDPOINT = 'https://gateway.example/v1/chat/completions'
const json = body => JSON.stringify(body)

/** A target whose `fetch` records what reached the network and answers with `respond`. */
function setup({ rules = [], enabled = true, respond = () => new Response('{}', { status: 200 }), maxRecent } = {}) {
  const sent = []
  const target = { fetch: async (input, init) => { sent.push({ input, init }); return respond(input, init) } }
  const root = target.fetch
  const config = { enabled, rules }
  let clock = 1000
  const interceptor = createInterceptor({ getConfig: () => config, env: { GW_TITLE: 'dsh', GW_SECRET: 'dsh-is-secret', GW_SHORT: 'ab' }, now: () => (clock += 5), target, maxRecent })
  interceptor.install()
  return { sent, target, root, interceptor, config }
}

test('adds body fields and headers to a matching request and leaves the rest of the call alone', async () => {
  const { sent, target, interceptor } = setup({ rules: [rule({ body: { merge: { provider: { order: ['a'] } }, remove: ['store'] }, headers: { set: { 'X-Title': '{{env:GW_TITLE}}' } } })] })
  const controller = new AbortController()
  await target.fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json', 'content-length': '10', authorization: 'Bearer k' }, body: json({ model: 'm', messages: [], store: false }), signal: controller.signal })
  const { init } = sent[0]
  assert.deepEqual(JSON.parse(init.body), { model: 'm', messages: [], provider: { order: ['a'] } })
  assert.equal(init.headers.get('x-title'), 'dsh')
  assert.equal(init.headers.get('authorization'), 'Bearer k')
  assert.equal(init.headers.get('content-type'), 'application/json')
  assert.equal(init.headers.has('content-length'), false, 'the declared length no longer fits')
  assert.equal(init.method, 'POST')
  assert.equal(init.signal, controller.signal)
  const [entry] = interceptor.recent()
  assert.equal(entry.changed, true)
  assert.equal(entry.status, 200)
  assert.equal(entry.model, 'm')
  assert.equal(entry.path, '/v1/chat/completions')
  assert.deepEqual(entry.changes.map(change => [change.kind, change.path, change.value, change.secret]), [['remove', 'store', undefined, false], ['set', 'provider', '{"order":["a"]}', false], ['header', 'X-Title', undefined, true]].map(([kind, path, value, secret]) => [kind, kind === 'set' ? 'provider.order' : path, kind === 'set' ? '["a"]' : value, secret]))
})

test('passes everything else through untouched: other methods, other hosts, non-JSON, arrays, streams, and unrelated paths', async () => {
  const { sent, target, interceptor } = setup({ rules: [rule({ body: { merge: { a: 1 } } })] })
  const stream = new ReadableStream({ start(controller) { controller.close() } })
  const calls = [
    [ENDPOINT, { method: 'GET' }],
    ['https://other.example/v1/chat/completions', { method: 'POST', body: json({ model: 'm' }) }],
    [ENDPOINT, { method: 'POST', body: 'not json' }],
    [ENDPOINT, { method: 'POST', body: json([1, 2]) }],
    [ENDPOINT, { method: 'POST', body: stream, duplex: 'half' }],
    ['https://gateway.example/v1/models', { method: 'POST', body: json({ model: 'm' }) }],
    [ENDPOINT, undefined],
  ]
  for (const [input, init] of calls) await target.fetch(input, init)
  assert.equal(sent.length, calls.length)
  sent.forEach((call, index) => assert.deepEqual([call.input, call.init], calls[index]), 'same arguments')
  assert.deepEqual(interceptor.recent().map(entry => [entry.host, entry.matched.length]), [['other.example', 0]], 'the one model call on a host no rule names is logged, unmatched')
})

test('a rule reaches a path that is not a model endpoint only when it names the path', async () => {
  const { sent, target } = setup({ rules: [rule({ match: { hosts: ['*'] }, body: { merge: { a: 1 } } }), rule({ id: 'r2', match: { hosts: ['internal.example'], paths: ['/gen'] }, body: { merge: { b: 2 } } })] })
  await target.fetch('https://anywhere.example/telemetry', { method: 'POST', body: json({ x: 1 }) })
  await target.fetch('https://anywhere.example/v1/messages', { method: 'POST', body: json({ model: 'm' }) })
  await target.fetch('https://internal.example/gen', { method: 'POST', body: json({ model: 'm' }) })
  assert.equal(sent[0].init.body, json({ x: 1 }))
  assert.deepEqual(JSON.parse(sent[1].init.body), { model: 'm', a: 1 })
  assert.deepEqual(JSON.parse(sent[2].init.body), { model: 'm', b: 2 })
})

test('reads a body given as bytes or as a Request, and a Request keeps its own headers', async () => {
  const { sent, target } = setup({ rules: [rule({ body: { merge: { a: 1 } }, headers: { set: { 'X-N': '1' } } })] })
  await target.fetch(ENDPOINT, { method: 'POST', body: new TextEncoder().encode(json({ model: 'bytes' })) })
  assert.deepEqual(JSON.parse(sent[0].init.body), { model: 'bytes', a: 1 })
  await target.fetch(ENDPOINT, { method: 'POST', body: new TextEncoder().encode(json({ model: 'buffer' })).buffer })
  assert.deepEqual(JSON.parse(sent[1].init.body), { model: 'buffer', a: 1 })
  const request = new Request(ENDPOINT, { method: 'POST', headers: { 'x-keep': 'yes', 'content-type': 'application/json' }, body: json({ model: 'req' }) })
  await target.fetch(request)
  assert.deepEqual(JSON.parse(sent[2].init.body), { model: 'req', a: 1 })
  assert.equal(sent[2].init.headers.get('x-keep'), 'yes')
  assert.equal(sent[2].init.headers.get('x-n'), '1')
  assert.equal(sent[2].input, request)
})

test('sends the request unchanged when applying fails, and says so in the log', async () => {
  const { sent, target, interceptor } = setup({ rules: [rule({ headers: { set: { 'X-N': '1' } } })] })
  const originalSet = Headers.prototype.set
  Headers.prototype.set = () => { throw new TypeError('headers are frozen') }
  try {
    await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm' }) })
  } finally {
    Headers.prototype.set = originalSet
  }
  assert.equal(sent[0].init.body, json({ model: 'm' }))
  const [entry] = interceptor.recent()
  assert.equal(entry.changed, false)
  assert.equal(entry.failed, 'headers are frozen')
})

test('logs a model call when no rule matches, and nothing is changed while paused', async () => {
  const { sent, target, interceptor, config } = setup({ rules: [rule({ match: { hosts: ['gateway.example'], models: ['gpt*'] }, body: { merge: { a: 1 } } })] })
  await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'claude' }) })
  assert.equal(sent[0].init.body, json({ model: 'claude' }))
  assert.deepEqual(interceptor.recent()[0].matched, [])
  config.enabled = false
  await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'gpt-5' }) })
  assert.equal(sent[1].init.body, json({ model: 'gpt-5' }))
  const [entry] = interceptor.recent()
  assert.equal(entry.paused, true)
  assert.equal(entry.changed, false)
})

test('uses the dsh session header for {{session}} and a conversation key otherwise', async () => {
  const { sent, target } = setup({ rules: [rule({ body: { merge: { session_id: '{{session}}' } } })] })
  await target.fetch(ENDPOINT, { method: 'POST', headers: { [SESSION_HEADER]: 'abc-123' }, body: json({ model: 'm', messages: [{ role: 'user', content: 'hi' }] }) })
  assert.equal(JSON.parse(sent[0].init.body).session_id, 'abc-123')
  await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm', messages: [{ role: 'user', content: 'hi' }] }) })
  await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm', messages: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'yo' }, { role: 'user', content: 'again' }] }) })
  const [first, second] = [1, 2].map(index => JSON.parse(sent[index].init.body).session_id)
  assert.match(first, /^[0-9a-f]{16}$/)
  assert.equal(first, second)
})

test('logs the status and the start of an error body without delaying or consuming the response', async () => {
  const body = 'x'.repeat(ERROR_TEXT_CHARS * 3)
  const { target, interceptor } = setup({ rules: [rule({ body: { merge: { a: 1 } } })], respond: () => new Response(body, { status: 400 }) })
  const response = await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm' }) })
  assert.equal(response.status, 400)
  assert.equal(await response.text(), body, 'the caller still reads all of it')
  await new Promise(resolve => setImmediate(resolve))
  const [entry] = interceptor.recent()
  assert.equal(entry.status, 400)
  assert.equal(entry.errorText.length, ERROR_TEXT_CHARS)
  assert.ok(entry.durationMs >= 0)
})

test('logs a failed connection and rethrows the same error', async () => {
  const failure = new TypeError('fetch failed')
  const { target, interceptor } = setup({ rules: [], respond: () => { throw failure } })
  await assert.rejects(() => target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm' }) }), error => error === failure)
  assert.equal(interceptor.recent()[0].networkError, 'fetch failed')
})

test('keeps the newest requests, lists endpoints with their models, and clears only the log', async () => {
  const { target, interceptor } = setup({ maxRecent: 3 })
  for (const [path, model] of [['/v1/messages', 'a'], ['/v1/messages', 'b'], ['/v1/messages', 'a'], ['/v1/chat/completions', 'c'], ['/v1/messages', 'd']]) await target.fetch(`https://gateway.example${path}`, { method: 'POST', body: json({ model }) })
  assert.deepEqual(interceptor.recent().map(entry => [entry.id, entry.model]), [[5, 'd'], [4, 'c'], [3, 'a']])
  assert.deepEqual(interceptor.endpoints().map(endpoint => [endpoint.scheme, endpoint.path, endpoint.count, endpoint.models]), [['https', '/v1/messages', 4, ['a', 'b', 'd']], ['https', '/v1/chat/completions', 1, ['c']]])
  interceptor.clearRecent()
  assert.deepEqual(interceptor.recent(), [])
  assert.equal(interceptor.endpoints().length, 2)
})

test('restores fetch when it is still the outermost wrapper, and becomes a pass-through when something wrapped it', async () => {
  const first = setup({ rules: [rule({ body: { merge: { a: 1 } } })] })
  first.interceptor.uninstall()
  assert.equal(first.target.fetch, first.root)

  const second = setup({ rules: [rule({ body: { merge: { a: 1 } } })] })
  const inner = second.target.fetch
  const outer = async (input, init) => inner(input, init)
  second.target.fetch = outer
  second.interceptor.uninstall()
  assert.equal(second.target.fetch, outer, 'the later wrapper is not removed')
  await second.target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm' }) })
  assert.equal(second.sent[0].init.body, json({ model: 'm' }), 'and the removed wrapper no longer edits')
  second.interceptor.uninstall()
})

test('reads a large body only when a rule can change it', async () => {
  const { sent, target, interceptor } = setup({ rules: [rule({ body: { merge: { a: 1 } } })] })
  const padding = 'x'.repeat(MAX_OBSERVE_CHARS + 10)
  await target.fetch('https://other.example/v1/messages', { method: 'POST', body: json({ model: 'm', padding }) })
  assert.equal(interceptor.recent().length, 0, 'a large request no rule matches is not even logged')
  await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm', padding }) })
  assert.equal(JSON.parse(sent[1].init.body).a, 1, 'a large request a rule matches is still changed')
})

test('logs and matches a Google-style request by the model in its path', async () => {
  const { sent, target, interceptor } = setup({ rules: [rule({ match: { hosts: ['gateway.example'], models: ['gemini-*'] }, body: { merge: { a: 1 } } })] })
  await target.fetch('https://gateway.example/v1beta/models/gemini-2.5-pro:streamGenerateContent', { method: 'POST', body: json({ contents: [] }) })
  assert.deepEqual(JSON.parse(sent[0].init.body), { contents: [], a: 1 })
  assert.equal(interceptor.recent()[0].model, 'gemini-2.5-pro')
})

test('never keeps an environment value that the gateway echoes back in an error', async () => {
  const { target, interceptor } = setup({
    rules: [rule({ body: { merge: { user: '{{env:GW_SECRET}}', tag: '{{env:GW_SHORT}}' } } })],
    respond: () => new Response('{"error":"unknown user dsh-is-secret, tag ab"}', { status: 400 }),
  })
  await target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm' }) })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(interceptor.recent()[0].errorText, '{"error":"unknown user [env], tag ab"}')
})

test('logs a cancelled request as cancelled, not as a failed connection', async () => {
  const cancelled = new DOMException('This operation was aborted', 'AbortError')
  const { target, interceptor } = setup({ rules: [], respond: () => { throw cancelled } })
  await assert.rejects(() => target.fetch(ENDPOINT, { method: 'POST', body: json({ model: 'm' }) }), error => error === cancelled)
  const [entry] = interceptor.recent()
  assert.equal(entry.aborted, true)
  assert.equal(entry.networkError, undefined)
})
