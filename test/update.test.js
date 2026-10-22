import assert from 'node:assert/strict'
import { test } from 'node:test'
import { commands, fetchLatest, isNewer, parseVersion, readLatest, registryBases, sourceKind } from '../update.js'

const document = (extra = {}) => ({ name: 'dsh-request-params', version: '0.7.0', dist: { tarball: 'https://registry.npmjs.org/dsh-request-params/-/dsh-request-params-0.7.0.tgz' }, ...extra })
const answer = (body, status = 200) => async () => ({ ok: status === 200, status, json: async () => body })

test('compares versions numerically and never offers a prerelease', () => {
  assert.equal(isNewer('0.7.0', '0.6.1'), true)
  assert.equal(isNewer('0.10.0', '0.9.9'), true)
  assert.equal(isNewer('1.0.0', '0.99.99'), true)
  assert.equal(isNewer('0.6.1', '0.6.1'), false)
  assert.equal(isNewer('0.6.0', '0.6.1'), false)
  assert.equal(isNewer('0.7.0-rc.1', '0.6.1'), false)
  assert.equal(isNewer('0.7.0', '0.7.0-rc.1'), true)
  assert.equal(isNewer('nope', '0.6.1'), false)
  assert.deepEqual(parseVersion('1.2.3-beta.4+build'), { core: [1, 2, 3], pre: 'beta.4' })
  assert.equal(parseVersion('1.2'), undefined)
})

test('tells how the profile depends on the package from the manager\'s source spec', () => {
  assert.equal(sourceKind('0.6.1'), 'registry')
  assert.equal(sourceKind('latest'), 'registry')
  assert.equal(sourceKind('^0.6.0'), 'registry')
  assert.equal(sourceKind('https://registry.npmjs.org/dsh-request-params/-/dsh-request-params-0.6.1.tgz'), 'tarball')
  assert.equal(sourceKind('github:xiaohai-78/dsh-request-params'), 'git')
  assert.equal(sourceKind('github:xiaohai-78/dsh-request-params#97fd46f'), 'git')
  assert.equal(sourceKind('xiaohai-78/dsh-request-params'), 'git')
  assert.equal(sourceKind('git+https://github.com/xiaohai-78/dsh-request-params.git'), 'git')
  assert.equal(sourceKind('link:/Users/me/dsh-request-params'), 'link')
  assert.equal(sourceKind('/Users/me/dsh-request-params'), 'link')
  assert.equal(sourceKind('file:../dsh-request-params'), 'link')
  assert.equal(sourceKind('C:\\Users\\me\\dsh-request-params'), 'link')
  assert.equal(sourceKind('D:/work/dsh-request-params'), 'link')
  assert.equal(sourceKind('link:C:\\Users\\me\\dsh-request-params'), 'link')
  assert.equal(sourceKind('\\\\server\\share\\dsh-request-params'), 'link')
  assert.equal(sourceKind(undefined), 'unknown')
})

test('lists the configured registries first, without duplicates, and falls back to public npm', () => {
  assert.deepEqual(registryBases({ registry: 'https://registry.npmmirror.com', fallbackRegistries: ['https://registry.npmjs.org/', 'https://registry.npmmirror.com/'], resolved: null }),
    ['https://registry.npmmirror.com/', 'https://registry.npmjs.org/'])
  assert.deepEqual(registryBases({ registry: null, fallbackRegistries: [], resolved: 'https://mirror.example/npm' }), ['https://mirror.example/npm/'])
  assert.deepEqual(registryBases({ registry: null, fallbackRegistries: [], resolved: null }), ['https://registry.npmjs.org/'])
  assert.deepEqual(registryBases(undefined), ['https://registry.npmjs.org/'])
  assert.deepEqual(registryBases({ registry: 'ftp://x/', fallbackRegistries: ['https://user:pw@r.example/?q=1#h'] }), ['https://r.example/'])
})

test('accepts only this package\'s tarball on the registry that answered', () => {
  const base = 'https://registry.npmjs.org/'
  assert.deepEqual(readLatest(document(), base), { ok: true, version: '0.7.0', tarball: 'https://registry.npmjs.org/dsh-request-params/-/dsh-request-params-0.7.0.tgz' })
  const refused = tarball => readLatest(document({ dist: { tarball } }), base).ok
  assert.equal(refused('https://evil.example/dsh-request-params/-/dsh-request-params-0.7.0.tgz'), false)
  assert.equal(refused('https://registry.npmjs.org/other/-/other-0.7.0.tgz'), false)
  assert.equal(refused('https://registry.npmjs.org/dsh-request-params/-/dsh-request-params-0.6.0.tgz'), false)
  assert.equal(refused('https://registry.npmjs.org/dsh-request-params/-/dsh-request-params-0.7.0.tgz?token=1'), false)
  assert.equal(refused('https://user:pw@registry.npmjs.org/dsh-request-params/-/dsh-request-params-0.7.0.tgz'), false)
  assert.equal(refused('http://registry.npmjs.org/dsh-request-params/-/dsh-request-params-0.7.0.tgz'), false)
  assert.equal(readLatest(document({ name: 'other' }), base).ok, false)
  assert.equal(readLatest(document({ version: '0.8.0-rc.1' }), base).ok, false)
  assert.equal(readLatest(document({ dist: {} }), base).ok, false)
  assert.equal(readLatest(null, base).ok, false)
})

test('follows a registry served under a path', () => {
  const body = document({ dist: { tarball: 'https://host.example/npm/dsh-request-params/-/dsh-request-params-0.7.0.tgz' } })
  assert.equal(readLatest(body, 'https://host.example/npm/').ok, true)
  assert.equal(readLatest(body, 'https://host.example/').ok, false)
})

test('asks the registries in turn and reports every failure when none answers', async () => {
  const calls = []
  const fetchImpl = async (url) => {
    calls.push(url)
    if (url.startsWith('https://down.example')) throw new Error('connect refused')
    if (url.startsWith('https://bad.example')) return { ok: false, status: 503 }
    return { ok: true, status: 200, json: async () => document() }
  }
  const found = await fetchLatest(['https://down.example/', 'https://bad.example/', 'https://registry.npmjs.org/'], fetchImpl)
  assert.equal(found.ok, true)
  assert.equal(found.registry, 'https://registry.npmjs.org/')
  assert.deepEqual(calls, ['https://down.example/dsh-request-params/latest', 'https://bad.example/dsh-request-params/latest', 'https://registry.npmjs.org/dsh-request-params/latest'])
  const none = await fetchLatest(['https://down.example/', 'https://bad.example/'], fetchImpl)
  assert.equal(none.ok, false)
  assert.match(none.error, /down\.example: connect refused; bad\.example: HTTP 503/)
  assert.equal((await fetchLatest(['https://registry.npmjs.org/'], answer(document({ name: 'other' })))).ok, false)
})

test('builds the commands for upgrading and rolling back', () => {
  assert.deepEqual(commands('web', '0.6.1'), {
    upgrade: 'dsh plugin --profile web add dsh-request-params@latest',
    git: 'dsh plugin --profile web add github:xiaohai-78/dsh-request-params',
    rollback: 'dsh plugin --profile web add dsh-request-params@0.6.1',
  })
})
