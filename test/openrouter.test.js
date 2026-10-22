import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { CatalogError, TTL_MS, createCatalog } from '../openrouter.js'

const fixture = async name => JSON.parse(await readFile(new URL(`./fixtures/openrouter-${name}.json`, import.meta.url), 'utf8'))
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

function setup(handler) {
  const urls = []
  let clock = 1000
  const catalog = createCatalog({ fetch: async (url, init) => { urls.push(url); return handler(url, init) }, now: () => clock })
  return { catalog, urls, tick: ms => { clock += ms } }
}

test('reads providers, and asks again only after the cache expires or on request', async () => {
  const { catalog, urls, tick } = setup(async () => reply(await fixture('providers')))
  const first = await catalog.providers()
  assert.equal(first.stale, false)
  assert.equal(first.providers.length, 3)
  assert.deepEqual(Object.keys(first.providers[0]).sort(), ['hq', 'name', 'privacyUrl', 'slug'])
  assert.deepEqual(first.providers.map(item => item.name), [...first.providers.map(item => item.name)].sort((a, b) => a.localeCompare(b)))
  await catalog.providers()
  assert.equal(urls.length, 1)
  tick(TTL_MS + 1)
  await catalog.providers()
  assert.equal(urls.length, 2)
  await catalog.providers(true)
  assert.equal(urls.length, 3)
  assert.equal(urls[0], 'https://openrouter.ai/api/v1/providers')
})

test('lists the providers serving a model with prices per million tokens', async () => {
  const { catalog, urls } = setup(async () => reply(await fixture('endpoints')))
  const result = await catalog.endpoints('deepseek/deepseek-chat-v3.1')
  assert.equal(urls[0], 'https://openrouter.ai/api/v1/models/deepseek/deepseek-chat-v3.1/endpoints')
  assert.equal(result.id, 'deepseek/deepseek-chat-v3.1')
  const [first] = result.endpoints
  assert.equal(first.provider, 'DeepInfra')
  assert.equal(first.tag, 'deepinfra/fp4')
  assert.equal(first.quantization, 'fp4')
  assert.equal(first.prompt, 0.25)
  assert.equal(first.completion, 0.95)
  assert.equal(first.context, 163840)
  assert.ok(first.parameters.includes('top_k'))
  assert.equal(first.latency, null)
})

test('lists models trimmed to what the picker shows', async () => {
  const { catalog } = setup(async () => reply(await fixture('models')))
  const { models } = await catalog.models()
  assert.equal(models.length, 3)
  assert.deepEqual(Object.keys(models[0]).sort(), ['completion', 'context', 'id', 'name', 'prompt'])
})

test('refuses a model id that is not author/slug without asking OpenRouter', async () => {
  const { catalog, urls } = setup(async () => reply({}))
  for (const id of ['', 'noslash', '../x', './x', 'a/..', '../etc/passwd', 'a/b/c', 'a/b?x=1', 'a b/c', undefined]) {
    await assert.rejects(() => catalog.endpoints(id), error => error instanceof CatalogError && error.code === 'bad-model', String(id))
  }
  assert.equal(urls.length, 0)
})

test('returns the older answer marked stale when OpenRouter cannot be reached', async () => {
  let down = false
  const { catalog, tick } = setup(async () => {
    if (down) throw new TypeError('fetch failed')
    return reply(await fixture('endpoints'))
  })
  const fresh = await catalog.endpoints('deepseek/deepseek-chat-v3.1')
  tick(TTL_MS + 1)
  down = true
  const stale = await catalog.endpoints('deepseek/deepseek-chat-v3.1')
  assert.equal(stale.stale, true)
  assert.equal(stale.fetchedAt, fresh.fetchedAt)
  assert.deepEqual(stale.endpoints, fresh.endpoints)
  await assert.rejects(() => catalog.endpoints('other/model'), error => error.code === 'offline' && /could not be reached/.test(error.message))
})

test('falls back to the bundled provider list when there is no answer and nothing cached', async () => {
  const { catalog } = setup(async () => reply({}, 503))
  const result = await catalog.providers()
  assert.equal(result.source, 'bundled')
  assert.equal(result.stale, true)
  assert.match(result.reason, /503/)
  assert.ok(result.providers.length > 50)
  assert.ok(result.providers.every(item => typeof item.slug === 'string' && typeof item.name === 'string'))
  assert.match(result.asOf, /^\d{4}-\d{2}-\d{2}$/)
})

test('reports an answer in an unknown form, and keeps what it knew', async () => {
  const { catalog, tick } = setup(async () => reply({ data: 'nope' }))
  await assert.rejects(() => catalog.models(), error => error.code === 'bad-response')
  const html = createCatalog({ fetch: async () => new Response('<html>', { status: 200 }) })
  await assert.rejects(() => html.models(), error => error.code === 'bad-response')
  void tick
})

test('keeps only a bounded number of model answers', async () => {
  const { catalog, urls } = setup(async url => reply({ data: { id: url.split('/models/')[1].replace('/endpoints', ''), name: 'n', endpoints: [] } }))
  for (let index = 0; index < 60; index++) await catalog.endpoints(`a/m${index}`)
  await catalog.endpoints('a/m59')
  assert.equal(urls.length, 60, 'the newest is still cached')
  await catalog.endpoints('a/m0')
  assert.equal(urls.length, 61, 'the oldest was dropped')
})

test('reads speed figures given as a number or as percentile cutoffs', async () => {
  const body = await fixture('endpoints')
  body.data.endpoints[0].throughput_last_30m = { p50: 80, p75: 90 }
  body.data.endpoints[0].latency_last_30m = 0.4
  body.data.endpoints[1].throughput_last_30m = 'fast'
  const { catalog } = setup(async () => reply(body))
  const [first, second] = (await catalog.endpoints('deepseek/deepseek-chat-v3.1')).endpoints
  assert.deepEqual([first.throughput, first.latency, second.throughput], [80, 0.4, null])
})
