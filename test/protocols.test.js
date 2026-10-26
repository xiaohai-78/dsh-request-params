import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MAX_PROTOCOLS, detectProtocol, endpointKey, normalizeProtocols } from '../protocols.js'
import { normalizeConfig } from '../rules.js'

test('recognizes hosted services by their host or a subdomain, and nothing that only ends the same', () => {
  const extensions = base => detectProtocol({ url: new URL(base) }).extensions
  assert.deepEqual(extensions('https://openrouter.ai/api/v1'), ['openrouter'])
  assert.deepEqual(extensions('https://eu.openrouter.ai/api/v1'), ['openrouter'])
  assert.deepEqual(extensions('https://notopenrouter.ai/api/v1'), [])
  assert.deepEqual(extensions('https://oai.helicone.ai/v1'), ['helicone'])
  assert.deepEqual(extensions('https://gateway.ai.cloudflare.com/v1/acct/gw/openai'), ['cloudflare'])
  assert.deepEqual(extensions('https://api.openai.com/v1'), ['openai'])
  assert.deepEqual(extensions('https://llm.company.example/api/v1'), [])
})

test('takes the format from the api setting first, then the official route, the hosted service, and the requests seen', () => {
  const company = new URL('https://llm.company.example/v1')
  assert.equal(detectProtocol({ api: 'anthropic-messages', url: new URL('https://openrouter.ai/api/v1') }).format, 'anthropic')
  assert.equal(detectProtocol({ api: 'openai-responses', url: company }).format, 'openai')
  assert.equal(detectProtocol({ api: 'google-generative-ai', url: company }).format, 'other')
  assert.equal(detectProtocol({ official: true, url: company }).format, 'anthropic')
  assert.equal(detectProtocol({ url: new URL('https://openrouter.ai/api/v1') }).format, 'openai')
  assert.equal(detectProtocol({ url: company, paths: ['/v1/chat/completions'] }).format, 'openai')
  assert.equal(detectProtocol({ url: company, paths: ['/v1/messages'] }).format, 'anthropic')
  assert.deepEqual(detectProtocol({ url: company }), { extensions: [] })
  assert.deepEqual(detectProtocol({}), { extensions: [] })
})

test('keys an endpoint by its host and base path', () => {
  assert.equal(endpointKey(new URL('https://LLM.Company.example:8443/api/V1/')), 'llm.company.example:8443/api/V1')
  assert.equal(endpointKey(new URL('https://openrouter.ai')), 'openrouter.ai')
})

test('keeps the declarations that say something and drops everything else', () => {
  const normalized = normalizeProtocols({
    'LLM.company.example/api/v1/': { format: 'openai', extensions: { openrouter: true, vllm: false, unknown: true, openai: 'yes' } },
    'openrouter.ai': { extensions: { openrouter: false } },
    'gw.example': { format: 'grpc' },
    'bad host/x': { format: 'openai' },
    'https://scheme.example': { format: 'openai' },
    'not-an-object.example': true,
  })
  assert.deepEqual(normalized, {
    'llm.company.example/api/v1': { format: 'openai', extensions: { openrouter: true, vllm: false } },
    'openrouter.ai': { extensions: { openrouter: false } },
  })
  assert.deepEqual(normalizeProtocols(['llm.example']), {})
  const many = Object.fromEntries(Array.from({ length: MAX_PROTOCOLS + 5 }, (_, index) => [`h${index}.example`, { format: 'openai' }]))
  assert.equal(Object.keys(normalizeProtocols(many)).length, MAX_PROTOCOLS)
})

test('a stored configuration keeps its declared protocols', () => {
  const config = normalizeConfig({ enabled: true, rules: [], protocols: { 'llm.company.example/api/v1': { extensions: { openrouter: true } } } })
  assert.deepEqual(config.protocols, { 'llm.company.example/api/v1': { extensions: { openrouter: true } } })
})
