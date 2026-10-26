import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { ConfigFileError, ConfigStore, ConflictError, MAX_BYTES } from '../config-store.js'
import { normalizeRule } from '../rules.js'

async function withStore(run) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-request-params-'))
  try {
    await run(new ConfigStore(join(root, '.dsh-request-params')), root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

const rule = fields => normalizeRule({ id: 'r1', name: 'one', match: { hosts: ['openrouter.ai'] }, ...fields })

test('starts empty, saves atomically, and reads back what it saved', () => withStore(async (store) => {
  assert.deepEqual(await store.read(), { revision: 0, config: { enabled: true, rules: [], protocols: {} } })
  const saved = await store.save({ enabled: false, rules: [rule({ body: { merge: { a: 1 } } })] })
  assert.equal(saved.revision, 1)
  const read = await store.read()
  assert.equal(read.revision, 1)
  assert.equal(read.config.enabled, false)
  assert.deepEqual(read.config.rules[0].body.merge, { a: 1 })
  const file = JSON.parse(await readFile(store.path, 'utf8'))
  assert.equal(file.version, 1)
  assert.equal((await store.save({ enabled: true, rules: [] })).revision, 2)
}))

test('refuses a save made from an older revision, and overwrites when no revision is given', () => withStore(async (store) => {
  await store.save({ enabled: true, rules: [] })
  await store.save({ enabled: true, rules: [rule({})] }, 1)
  await assert.rejects(() => store.save({ enabled: true, rules: [] }, 1), error => error instanceof ConflictError && error.details.revision === 2)
  assert.equal((await store.read()).config.rules.length, 1, 'the refused save changed nothing')
  assert.equal((await store.save({ enabled: true, rules: [] })).revision, 3)
}))

test('runs saves one after another', () => withStore(async (store) => {
  const results = await Promise.all([1, 2, 3, 4, 5].map(index => store.save({ enabled: true, rules: [rule({ name: `n${index}` })] })))
  assert.deepEqual(results.map(result => result.revision), [1, 2, 3, 4, 5])
  assert.equal((await store.read()).config.rules[0].name, 'n5')
}))

test('reports a damaged file and never overwrites it', () => withStore(async (store) => {
  await store.save({ enabled: true, rules: [] })
  for (const text of ['{broken', '[]', 'null', '"x"']) {
    await writeFile(store.path, text)
    await assert.rejects(() => store.read(), error => error instanceof ConfigFileError && error.code === 'config-damaged' && error.path === store.path, text)
    await assert.rejects(() => store.save({ enabled: true, rules: [] }), ConfigFileError)
    assert.equal(await readFile(store.path, 'utf8'), text)
  }
  await writeFile(store.path, ' '.repeat(MAX_BYTES + 1))
  await assert.rejects(() => store.read(), /larger than 4 MB/)
}))

test('keeps going after a failed save', () => withStore(async (store) => {
  await store.save({ enabled: true, rules: [] })
  await assert.rejects(() => store.save({ enabled: true, rules: [] }, 99), ConflictError)
  assert.equal((await store.save({ enabled: true, rules: [] }, 1)).revision, 2)
}))
