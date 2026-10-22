import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))

test('the package publishes every module its entry points import', async () => {
  const published = new Set(manifest.files)
  const reached = new Set()
  const visit = async (name) => {
    if (reached.has(name)) return
    reached.add(name)
    const text = await readFile(new URL(name, root), 'utf8')
    for (const match of text.matchAll(/(?:from|import\()\s*'\.\/([\w.-]+\.js)'/g)) await visit(match[1])
  }
  for (const target of Object.values(manifest.exports)) if (target.endsWith('.js')) await visit(target.slice(2))
  assert.deepEqual([...reached].filter(name => !published.has(name)), [])
})
