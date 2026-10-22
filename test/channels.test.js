import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DEEPSEEK_PUBLIC_BASE_URL, collectChannels, describeChannels } from '../channels.js'

const piEntry = (provider, fields = {}) => ({ provider, displayName: provider, settingsNs: 'llm-pi-ai', settingsPath: ['providers', provider], ...fields })
const input = fields => ({ providers: [], directory: [], descriptors: [], models: new Map(), endpoints: [], env: {}, ...fields })

test('takes the endpoint a user set over the catalog default', () => {
  const [channel] = describeChannels(input({
    providers: [{ id: 'openrouter', name: 'OpenRouter' }],
    directory: [piEntry('openrouter', { defaultBaseURL: 'https://openrouter.ai/api/v1' })],
    descriptors: [{ ns: 'llm-pi-ai', value: { providers: { openrouter: { baseURL: 'https://proxy.example.com:8443/or/v1/' } } } }],
    models: new Map([['openrouter', [{ id: 'deepseek/deepseek-chat', name: 'DeepSeek' }]]]),
  }))
  assert.deepEqual(channel, {
    id: 'openrouter', name: 'OpenRouter', baseURL: 'https://proxy.example.com:8443/or/v1/', host: 'proxy.example.com:8443', basePath: '/or/v1',
    source: 'settings', seen: false, openrouter: false, models: [{ id: 'deepseek/deepseek-chat', name: 'DeepSeek' }], modelCount: 1, sharedHost: false, sameEndpoint: false,
  })
})

test('falls back to the catalog default and marks OpenRouter', () => {
  const [channel] = describeChannels(input({
    providers: [{ id: 'openrouter', name: 'OpenRouter' }],
    directory: [piEntry('openrouter', { defaultBaseURL: 'https://openrouter.ai/api/v1' })],
    descriptors: [{ ns: 'llm-pi-ai', value: { providers: { openrouter: { apiKeyEnv: 'OPENROUTER_API_KEY' } } } }],
  }))
  assert.equal(channel.source, 'default')
  assert.equal(channel.host, 'openrouter.ai')
  assert.equal(channel.basePath, '/api/v1')
  assert.equal(channel.openrouter, true)
})

test('finds the official DeepSeek endpoint in its own settings, then the environment, then the public API', () => {
  const official = { providers: [{ id: 'deepseek-official', name: 'DeepSeek' }] }
  const own = describeChannels(input({
    ...official,
    directory: [{ provider: 'deepseek-official', settingsNs: 'llm-deepseek-api-key', settingsPath: [] }],
    descriptors: [{ ns: 'llm-deepseek-api-key', value: { baseURL: 'https://internal.example/anthropic' } }, { ns: 'deepseek-tools', value: { baseURL: 'https://api.deepseek.com/v1/tools' } }],
  }))[0]
  assert.deepEqual([own.source, own.host], ['settings', 'internal.example'])
  const unrelated = describeChannels(input({ ...official, descriptors: [{ ns: 'deepseek-tools', value: { baseURL: 'https://api.deepseek.com/v1/tools' } }] }))[0]
  assert.equal(unrelated.baseURL, DEEPSEEK_PUBLIC_BASE_URL, 'another plugin that happens to have DeepSeek in its name is not read')
  const fromEnv = describeChannels(input({ ...official, env: { DEEPSEEK_BASE_URL: 'http://127.0.0.1:8130/v1' } }))[0]
  assert.deepEqual([fromEnv.source, fromEnv.host, fromEnv.basePath], ['environment', '127.0.0.1:8130', '/v1'])
  const fallback = describeChannels(input(official))[0]
  assert.deepEqual([fallback.source, fallback.baseURL], ['default', DEEPSEEK_PUBLIC_BASE_URL])
  // The API-key and account routes are in the directory with no catalog default, and resolve the same way.
  const listed = describeChannels(input({
    providers: [{ id: 'deepseek-official', name: 'DeepSeek' }, { id: 'deepseek-account', name: 'DeepSeek Account' }],
    directory: [{ provider: 'deepseek-official', settingsNs: 'llm-deepseek-api-key', settingsPath: [] }, { provider: 'deepseek-account', settingsNs: 'llm-deepseek-account', settingsPath: [] }],
    descriptors: [{ ns: 'llm-deepseek-api-key', value: {} }],
    env: { DEEPSEEK_BASE_URL: 'http://127.0.0.1:8130/v1' },
  }))
  assert.deepEqual(listed.map(channel => [channel.source, channel.host, channel.sharedHost, channel.sameEndpoint]), [['environment', '127.0.0.1:8130', true, true], ['environment', '127.0.0.1:8130', true, true]])
})

test('confirms an endpoint from logged requests, and uses one when nothing else names it', () => {
  const models = new Map([['gw', [{ id: 'm1', name: 'M1' }]], ['azure', [{ id: 'gpt-x', name: 'GPT X' }]]])
  const endpoints = [{ scheme: 'http', host: '127.0.0.1:8130', path: '/oa/chat/completions', models: ['m1'] }, { scheme: 'https', host: 'res.openai.azure.com', path: '/openai/v1/chat/completions', models: ['gpt-x'] }]
  const [gw, azure] = describeChannels(input({
    providers: [{ id: 'gw', name: 'Gateway' }, { id: 'azure', name: 'Azure' }],
    directory: [piEntry('gw'), piEntry('azure')],
    descriptors: [{ ns: 'llm-pi-ai', value: { providers: { gw: { baseURL: 'http://127.0.0.1:8130/oa' } } } }],
    models,
    endpoints,
  }))
  assert.deepEqual([gw.source, gw.seen], ['settings', true])
  assert.deepEqual([azure.source, azure.host, azure.seen], ['seen', 'res.openai.azure.com', true])
})

test('says when two channels send to the same host, and when a model list failed', () => {
  const channels = describeChannels(input({
    providers: [{ id: 'a', name: 'A' }, { id: 'b', name: '' }, { id: 'c', name: 'C' }],
    directory: [piEntry('a', { defaultBaseURL: 'http://127.0.0.1:8130/oa' }), piEntry('b', { defaultBaseURL: 'http://127.0.0.1:8130/ant' }), piEntry('c', { defaultBaseURL: 'not a url' })],
    models: new Map([['c', new Error('offline')]]),
  }))
  assert.deepEqual(channels.map(channel => [channel.id, channel.name, channel.sharedHost, channel.host ?? null]), [['a', 'A', true, '127.0.0.1:8130'], ['b', 'b', true, '127.0.0.1:8130'], ['c', 'C', false, null]])
  assert.equal(channels[2].source, 'unknown')
  assert.equal(channels[2].modelsError, 'offline')
})

test('reads the services, survives missing ones, and gives up on a slow model list', { timeout: 10000 }, async () => {
  assert.deepEqual(await collectChannels({ get: () => undefined }, [], {}), { available: false, channels: [] })
  const llm = {
    listProviders: () => [{ id: 'fast', name: 'Fast' }, { id: 'slow', name: 'Slow' }],
    listConfigurableProviders: () => { throw new Error('no directory') },
    listModels: id => (id === 'fast' ? Promise.resolve([{ id: 'f1', name: 'F1' }]) : new Promise(() => {})),
  }
  const started = Date.now()
  const result = await collectChannels({ get: name => (name === 'llm' ? llm : name === 'settings' ? { describe: () => { throw new Error('no forms') } } : undefined) }, [], {})
  assert.equal(result.available, true)
  assert.deepEqual(result.channels.map(channel => [channel.id, channel.models.length, channel.modelsError ?? null]), [['fast', 1, null], ['slow', 0, 'timed out']])
  assert.ok(Date.now() - started < 6000)
})
