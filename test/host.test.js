import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, utimes, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { apply } from '../index.js'
import { normalizeRule } from '../rules.js'

const rule = fields => normalizeRule({ id: 'r1', name: 'routing', match: { hosts: ['gateway.example'] }, ...fields })

/** Mount the host plugin on a fake context; the fake `fetch` stands in for the network. */
async function mount({ initial, respond = () => new Response('{}', { status: 200 }), services = {} } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-request-params-host-'))
  const configDir = join(dir, '.dsh-request-params')
  if (initial !== undefined) {
    const { mkdir } = await import('node:fs/promises')
    await mkdir(configDir, { recursive: true })
    await writeFile(join(configDir, 'config.json'), typeof initial === 'string' ? initial : JSON.stringify(initial))
  }
  const routes = []
  const effects = []
  const warnings = []
  const sent = []
  const realFetch = globalThis.fetch
  globalThis.fetch = async (input, init) => { sent.push({ input, init }); return respond(input, init) }
  const ctx = {
    configEditor: { documentPath: join(dir, 'cordis.patch.yml') },
    get: name => services[name],
    effect: (setup, label) => { effects.push({ dispose: setup(), label }) },
    inject: (_names, callback) => callback({ effect: setup => { effects.push({ dispose: setup() }) }, connection: { fetch: { register: (route) => { routes.push(route); return () => {} } } } }),
    logger: { warn: text => warnings.push(text) },
  }
  apply(ctx)
  const call = async (body) => {
    const response = await routes[0].fetch({ json: async () => body })
    return response.json()
  }
  const send = (body, headers = {}) => globalThis.fetch('https://gateway.example/v1/chat/completions', { method: 'POST', headers, body: JSON.stringify(body) })
  const stop = async () => {
    for (const { dispose } of effects.reverse()) if (typeof dispose === 'function') dispose()
    globalThis.fetch = realFetch
    await rm(dir, { recursive: true, force: true })
  }
  return { call, send, sent, warnings, routes, stop, dir, configDir, configPath: join(configDir, 'config.json') }
}

const sample = { model: 'm', messages: [{ role: 'user', content: 'hi' }], store: false }

test('registers one POST route and wraps fetch while mounted, then puts fetch back', async () => {
  const before = globalThis.fetch
  const host = await mount()
  try {
    assert.equal(host.routes.length, 1)
    assert.equal(host.routes[0].path, '/api/dsh-request-params')
    assert.deepEqual(host.routes[0].methods, ['POST'])
    assert.notEqual(globalThis.fetch, before)
  } finally {
    const wrapped = globalThis.fetch
    await host.stop()
    assert.notEqual(globalThis.fetch, wrapped)
  }
})

test('starts empty, saves rules, and applies them to the next model request', async () => {
  const host = await mount()
  try {
    const first = await host.call({ action: 'get' })
    assert.equal(first.ok, true)
    assert.equal(first.value.revision, 0)
    assert.deepEqual(first.value.rules, [])
    assert.equal(first.value.enabled, true)
    assert.equal(first.value.path, host.configPath)
    assert.deepEqual(Object.keys(first.value.presets).sort(), ['attribution', 'openrouter-routing', 'reasoning', 'sampling', 'session', 'strip'])

    const saved = await host.call({ action: 'save', revision: 0, config: { enabled: true, rules: [rule({ body: { merge: { provider: { sort: 'price' } }, remove: ['store'] } })] } })
    assert.equal(saved.ok, true)
    assert.equal(saved.value.revision, 1)
    assert.deepEqual(saved.value.problems, [])
    await host.send(sample)
    assert.deepEqual(JSON.parse(host.sent.at(-1).init.body), { model: 'm', messages: sample.messages, provider: { sort: 'price' } })
    assert.equal(JSON.parse(await readFile(host.configPath, 'utf8')).rules[0].name, 'routing')

    const recent = (await host.call({ action: 'recent' })).value
    assert.equal(recent.revision, 1)
    assert.equal(recent.recent[0].changed, true)
    assert.equal(recent.recent[0].status, 200)
    assert.equal(recent.endpoints[0].host, 'gateway.example')
    assert.deepEqual((await host.call({ action: 'clearRecent' })).value.recent, [])
  } finally {
    await host.stop()
  }
})

test('applies the rules found on disk to the very first request', async () => {
  const host = await mount({ initial: { version: 1, revision: 4, enabled: true, rules: [rule({ body: { merge: { top_k: 5 } } })] } })
  try {
    await host.send(sample)
    assert.equal(JSON.parse(host.sent[0].init.body).top_k, 5)
  } finally {
    await host.stop()
  }
})

test('picks up an edit made to the file by something else, and tells a stale page about it', async () => {
  const host = await mount({ initial: { version: 1, revision: 1, enabled: true, rules: [rule({ body: { merge: { a: 1 } } })] } })
  try {
    await host.call({ action: 'get' })
    await writeFile(host.configPath, JSON.stringify({ version: 1, revision: 2, enabled: true, rules: [rule({ body: { merge: { a: 2 } } })] }))
    const future = new Date(Date.now() + 5000)
    await utimes(host.configPath, future, future)
    const reread = await host.call({ action: 'get' })
    assert.equal(reread.value.revision, 2)
    assert.deepEqual(reread.value.rules[0].body.merge, { a: 2 })
    const stale = await host.call({ action: 'save', revision: 1, config: { enabled: true, rules: [] } })
    assert.deepEqual([stale.ok, stale.code, stale.details], [false, 'conflict', { revision: 2 }])
  } finally {
    await host.stop()
  }
})

test('a damaged file is reported, rules are not applied, nothing is overwritten, and it can be set aside', async () => {
  const host = await mount({ initial: '{oops' })
  try {
    const state = (await host.call({ action: 'get' })).value
    assert.equal(state.damaged.path, host.configPath)
    assert.deepEqual(state.rules, [])
    assert.match(host.warnings[0], /not applying any rule/)
    const refused = await host.call({ action: 'save', revision: 0, config: { enabled: true, rules: [] } })
    assert.deepEqual([refused.ok, refused.code], [false, 'config-damaged'])
    assert.equal(await readFile(host.configPath, 'utf8'), '{oops')
    const reset = await host.call({ action: 'resetDamaged' })
    assert.equal(reset.ok, true)
    assert.equal(reset.value.damaged, undefined)
    assert.match(await readFile(reset.value.movedTo, 'utf8'), /oops/)
    assert.ok((await readdir(host.configDir)).some(file => file.includes('.damaged-')))
    assert.equal((await host.call({ action: 'resetDamaged' })).code, 'bad-request')
    assert.equal((await host.call({ action: 'save', revision: 0, config: { enabled: true, rules: [] } })).ok, true)
  } finally {
    await host.stop()
  }
})

test('previews rules on a sample request with environment values hidden, mirroring what a real request would get', async () => {
  process.env.DSH_REQUEST_PARAMS_TEST = 'a-secret-value'
  const host = await mount({ initial: { enabled: true, rules: [rule({ body: { merge: { user: '{{env:DSH_REQUEST_PARAMS_TEST}}', provider: { sort: 'price' } } }, headers: { set: { 'X-Key': '{{env:DSH_REQUEST_PARAMS_TEST}}' } } }), rule({ id: 'r2', name: 'broken', body: { merge: { messages: [] } } })] } })
  try {
    const preview = (await host.call({ action: 'dryRun', url: 'https://gateway.example/v1/chat/completions', body: sample, session: '' })).value
    assert.equal(preview.changed, true)
    assert.equal(preview.body.user, '<env:DSH_REQUEST_PARAMS_TEST>')
    assert.deepEqual(preview.headers.set, { 'X-Key': '<env:DSH_REQUEST_PARAMS_TEST>' })
    assert.equal(preview.body.provider.sort, 'price')
    assert.deepEqual(preview.matched.map(item => item.id), ['r1'])
    assert.deepEqual(preview.invalid, [{ id: 'r2', name: 'broken', codes: ['protected'] }])
    assert.equal(preview.modelEndpoint, true)
    assert.equal(preview.secrets, undefined)
    assert.deepEqual(sample.store, false, 'the sample is not changed')

    const other = (await host.call({ action: 'dryRun', url: 'https://gateway.example/v1/embeddings', body: sample })).value
    assert.equal(other.modelEndpoint, false)
    assert.deepEqual(other.matched, [], 'a rule without a path stays on model endpoints')

    const unsaved = (await host.call({ action: 'dryRun', url: 'https://gateway.example/v1/messages', body: sample, config: { enabled: true, rules: [rule({ body: { merge: { top_p: 0.5 } } })] } })).value
    assert.equal(unsaved.body.top_p, 0.5)
    assert.equal((await host.call({ action: 'dryRun', url: 'nope', body: sample })).code, 'bad-url')
    assert.equal((await host.call({ action: 'dryRun', url: 'ftp://x/y', body: sample })).code, 'bad-url')
    assert.equal((await host.call({ action: 'dryRun', url: 'https://x.example/v1/messages', body: [] })).code, 'bad-request')
  } finally {
    delete process.env.DSH_REQUEST_PARAMS_TEST
    await host.stop()
  }
})

test('checks a configuration without saving it, and says which environment variables the rules need', async () => {
  const host = await mount()
  try {
    const checked = (await host.call({ action: 'check', config: { rules: [{ id: 'a', match: { hosts: ['x.example'] }, body: { merge: { k: '{{env:NOPE_NOT_SET_12345}}' } } }, { id: 'b' }] } })).value
    assert.equal(checked.config.rules.length, 2)
    assert.deepEqual(checked.problems.map(problem => [problem.ruleId, problem.code]), [['b', 'no-host']])
    assert.deepEqual(checked.env, { NOPE_NOT_SET_12345: false })
    assert.equal((await host.call({ action: 'get' })).value.revision, 0)
  } finally {
    await host.stop()
  }
})

test('builds preset changes and rejects unknown presets and actions', async () => {
  const host = await mount()
  try {
    const built = (await host.call({ action: 'preset', id: 'reasoning', form: { effort: 'high' } })).value
    assert.deepEqual(built.body.merge, { reasoning: { effort: 'high' } })
    assert.equal((await host.call({ action: 'preset', id: 'nope', form: {} })).code, 'bad-request')
    assert.equal((await host.call({ action: 'constructor' })).code, 'bad-request')
    assert.equal((await host.call({})).code, 'bad-request')
    const response = await host.routes[0].fetch({ json: async () => { throw new SyntaxError('x') } })
    assert.equal((await response.json()).code, 'bad-request')
  } finally {
    await host.stop()
  }
})

test('serves the OpenRouter catalog and reports it offline instead of failing the page', async () => {
  const host = await mount({ respond: () => { throw new TypeError('fetch failed') } })
  try {
    const providers = (await host.call({ action: 'orProviders' })).value
    assert.equal(providers.source, 'bundled')
    const endpoints = await host.call({ action: 'orEndpoints', model: 'deepseek/deepseek-chat' })
    assert.deepEqual([endpoints.ok, endpoints.code], [false, 'offline'])
    assert.equal((await host.call({ action: 'orEndpoints', model: '../x' })).code, 'bad-model')
  } finally {
    await host.stop()
  }
})

test('drops the preset of a rule that was edited away from what its form builds', async () => {
  const kept = rule({ id: 'a', body: { merge: { reasoning: { effort: 'high' } } }, preset: { id: 'reasoning', form: { effort: 'high' } } })
  const edited = rule({ id: 'b', body: { merge: { reasoning: { effort: 'low' } } }, preset: { id: 'reasoning', form: { effort: 'high' } } })
  const host = await mount({ initial: { enabled: true, rules: [kept, edited] } })
  try {
    const state = (await host.call({ action: 'get' })).value
    assert.deepEqual(state.rules.map(item => item.preset?.id), ['reasoning', undefined])
    assert.deepEqual(state.rules[0].preset.form, { effort: 'high', maxTokens: null, exclude: false }, 'a kept form comes back with every field, so the page can open it')
    const checked = (await host.call({ action: 'check', config: { rules: [edited] } })).value
    assert.equal(checked.config.rules[0].preset, undefined)
  } finally {
    await host.stop()
  }
})

test('lists the configured channels, with endpoints from settings and from requests seen', async () => {
  const llm = {
    listProviders: () => [{ id: 'openrouter', name: 'OpenRouter' }, { id: 'gw', name: 'Gateway' }],
    listConfigurableProviders: () => [
      { provider: 'openrouter', displayName: 'openrouter', settingsNs: 'llm-pi-ai', settingsPath: ['providers', 'openrouter'], defaultBaseURL: 'https://openrouter.ai/api/v1' },
      { provider: 'gw', displayName: 'Gateway', settingsNs: 'llm-pi-ai', settingsPath: ['providers', 'gw'] },
    ],
    listModels: async id => (id === 'gw' ? [{ provider: 'gw', id: 'm', name: 'M' }] : []),
  }
  const settings = { describe: () => [{ ns: 'llm-pi-ai', value: { providers: { gw: { baseURL: 'https://gateway.example/v1' } } } }] }
  const host = await mount({ services: { llm, settings } })
  try {
    await host.send({ model: 'm', messages: [] })
    const { value } = await host.call({ action: 'channels' })
    assert.equal(value.available, true)
    assert.deepEqual(value.channels.map(channel => [channel.id, channel.host, channel.source, channel.seen, channel.openrouter]), [
      ['openrouter', 'openrouter.ai', 'default', false, true],
      ['gw', 'gateway.example', 'settings', true, false],
    ])
  } finally {
    await host.stop()
  }
})

test('says there are no channels to list when dsh has no llm service', async () => {
  const host = await mount()
  try {
    assert.deepEqual((await host.call({ action: 'channels' })).value, { available: false, channels: [] })
  } finally {
    await host.stop()
  }
})
