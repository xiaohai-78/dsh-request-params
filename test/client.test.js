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
  for (const match of source.matchAll(/'((?:explore\.col|sampling|route|reasoning)\.[A-Za-z0-9_.-]+)'/g)) used.add(match[1])
  for (const id of ['openrouter-routing', 'reasoning', 'sampling', 'session', 'attribution', 'strip', 'custom']) for (const part of ['name', 'desc', 'example']) used.add(`preset.${id}.${part}`)
  for (const id of ['vllm-thinking', 'helicone', 'cloudflare', 'openai-cache']) for (const part of ['name', 'desc', 'example']) used.add(`recipe.${id}.${part}`)
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
  const lineDiff = extract('const MAX_DIFF_LINES', 'const SIGNS', 'lineDiff')
  const before = JSON.stringify({ model: 'm', store: false }, null, 2)
  const after = JSON.stringify({ model: 'm', store: false, provider: { sort: 'price' } }, null, 2)
  assert.deepEqual(lineDiff(before, after).filter(line => line.type !== 'same').map(line => line.text.trim()), ['"provider": {', '"sort": "price"', '}'])
  assert.deepEqual(lineDiff(before, JSON.stringify({ model: 'm' }, null, 2)).filter(line => line.type === 'del').map(line => line.text.trim()), ['"store": false'])
})

test('a gateway error is matched to the fields a rule set, by whole words', () => {
  const mentionedFields = extract('/** Fields a rule set that the gateway', 'function RequestsTab', 'mentionedFields')
  const entry = (errorText, ...paths) => ({ errorText, changes: paths.map(path => ({ kind: 'set', path })) })
  assert.deepEqual(mentionedFields(entry('Unrecognized request argument supplied: provider', 'provider.sort', 'top_k')), ['provider'])
  assert.deepEqual(mentionedFields(entry('No endpoints found matching your data policy', 'provider.sort', 'session_id')), [])
  assert.deepEqual(mentionedFields(entry('session_id is too long', 'session_id', 'x-session-id')), ['session_id'])
  assert.deepEqual(mentionedFields({ errorText: undefined, changes: [] }), [])
  assert.deepEqual(mentionedFields({ errorText: 'store is not supported', changes: [{ kind: 'remove', path: 'store' }] }), [], 'a removed field was not sent')
})
