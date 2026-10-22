/**
 * Version check and upgrade helpers, free of DSH services so they can be tested alone.
 *
 * The check asks the package registry DSH is configured with for the `latest` version of this package, and an
 * upgrade hands the registry's tarball address to DSH's own installer. A tarball address is accepted only when it
 * points at this package's file on the registry that answered, so a wrong or tampered answer cannot send the
 * installer elsewhere.
 */

export const PACKAGE_NAME = 'dsh-request-params'
/** Where the page links to for what changed. */
export const CHANGES_URL = 'https://github.com/xiaohai-78/dsh-request-params/blob/main/CHANGELOG.md'
/** How long a successful check is reused, and a failed one. */
export const CHECK_TTL_MS = 12 * 60 * 60 * 1000
export const CHECK_ERROR_TTL_MS = 30 * 60 * 1000
/** Longest wait for one registry's answer. */
export const FETCH_TIMEOUT_MS = 8000
const DEFAULT_REGISTRY = 'https://registry.npmjs.org/'
const VERSION = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/

/**
 * Split a version into its numbers and prerelease tag.
 * @param {unknown} text - a semantic version.
 * @returns {{ core: number[], pre: string | undefined } | undefined} undefined when it is not one.
 */
export function parseVersion(text) {
  const match = typeof text === 'string' ? VERSION.exec(text.trim()) : null
  return match === null ? undefined : { core: [Number(match[1]), Number(match[2]), Number(match[3])], pre: match[4] }
}

/**
 * Whether a release is newer than the installed version and may be offered: a prerelease is never offered, and a
 * prerelease build of the same numbers counts as older than its release.
 * @param {unknown} latest - the registry's `latest` version.
 * @param {unknown} installed - the installed version.
 * @returns {boolean} false when either is not a version.
 */
export function isNewer(latest, installed) {
  const next = parseVersion(latest)
  const current = parseVersion(installed)
  if (next === undefined || current === undefined || next.pre !== undefined) return false
  for (let index = 0; index < 3; index++) {
    if (next.core[index] !== current.core[index]) return next.core[index] > current.core[index]
  }
  return current.pre !== undefined
}

/**
 * How the profile depends on this package, from the spec the plugin manager reports.
 * @param {unknown} source - the bundle's `source` spec; undefined when the manager does not know it.
 * @returns {'registry' | 'tarball' | 'git' | 'link' | 'unknown'} `registry` and `tarball` can be upgraded from the page.
 */
export function sourceKind(source) {
  if (typeof source !== 'string' || source.trim() === '') return 'unknown'
  const spec = source.trim()
  if (/^(link|file|workspace):/.test(spec) || spec.startsWith('/') || spec.startsWith('\\') || spec.startsWith('~') || spec.startsWith('.') || /^[A-Za-z]:[\\/]/.test(spec)) return 'link'
  if (/^https?:\/\/.+\.(tgz|tar\.gz)(\?.*)?$/i.test(spec)) return 'tarball'
  if (/^(github|gitlab|bitbucket|git\+|git:|git@|ssh:)/.test(spec) || /^[\w.-]+\/[\w.-]+(#.*)?$/.test(spec) || /^https?:\/\/.*\.git(#.*)?$/.test(spec)) return 'git'
  return 'registry'
}

/**
 * The registries to ask, in DSH's order.
 * @param {{ registry?: string | null, fallbackRegistries?: readonly string[], resolved?: string | null } | undefined} registries -
 *   what the plugin manager reports; undefined asks the public npm registry.
 * @returns {string[]} http(s) base URLs with a trailing slash, without duplicates.
 */
export function registryBases(registries) {
  const found = []
  for (const candidate of [registries?.registry, registries?.resolved, ...registries?.fallbackRegistries ?? []]) {
    if (typeof candidate !== 'string') continue
    let url
    try {
      url = new URL(candidate)
    } catch {
      continue
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') continue
    url.username = ''
    url.password = ''
    url.search = ''
    url.hash = ''
    const base = url.href.endsWith('/') ? url.href : `${url.href}/`
    if (!found.includes(base)) found.push(base)
  }
  return found.length === 0 ? [DEFAULT_REGISTRY] : found
}

/**
 * Read a registry's `latest` document for this package.
 * @param {unknown} document - the parsed JSON the registry answered.
 * @param {string} base - the registry base URL that answered.
 * @returns {{ ok: true, version: string, tarball: string } | { ok: false, reason: string }} the release and its tarball
 *   address, or why the answer is refused: a different package, a prerelease, or a tarball address that does not
 *   point at `<base><name>/-/<name>-<version>.tgz` on the same host.
 */
export function readLatest(document, base) {
  if (document === null || typeof document !== 'object' || document.name !== PACKAGE_NAME) return { ok: false, reason: 'the registry answered for another package' }
  const parsed = parseVersion(document.version)
  if (parsed === undefined || parsed.pre !== undefined) return { ok: false, reason: 'the latest version is not a release' }
  const version = document.version
  const tarball = document.dist?.tarball
  if (typeof tarball !== 'string') return { ok: false, reason: 'the registry did not name a tarball' }
  let given
  let root
  try {
    given = new URL(tarball)
    root = new URL(base)
  } catch {
    return { ok: false, reason: 'the tarball address is not a URL' }
  }
  const expected = `${root.pathname.replace(/\/$/, '')}/${PACKAGE_NAME}/-/${PACKAGE_NAME}-${version}.tgz`
  if (given.origin !== root.origin || given.pathname !== expected || given.username !== '' || given.password !== '' || given.search !== '' || given.hash !== '') {
    return { ok: false, reason: 'the tarball address does not point at this package on that registry' }
  }
  return { ok: true, version, tarball: given.href }
}

/**
 * Ask the registries in turn for the latest release.
 * @param {string[]} bases - registry base URLs, see {@link registryBases}.
 * @param {typeof fetch} fetchImpl - the fetch to use; the process `fetch` carries DSH's outbound proxy settings.
 * @param {number} [timeoutMs] - longest wait per registry.
 * @returns {Promise<{ ok: true, version: string, tarball: string, registry: string } | { ok: false, error: string }>}
 *   the first release a registry answers with, or the reasons every registry failed.
 */
export async function fetchLatest(bases, fetchImpl, timeoutMs = FETCH_TIMEOUT_MS) {
  const reasons = []
  for (const base of bases) {
    const host = new URL(base).host
    try {
      const response = await fetchImpl(new URL(`${PACKAGE_NAME}/latest`, base).href, {
        headers: { accept: 'application/json' },
        redirect: 'error',
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (!response.ok) {
        reasons.push(`${host}: HTTP ${response.status}`)
        continue
      }
      const answer = readLatest(await response.json(), base)
      if (answer.ok) return { ...answer, registry: base }
      reasons.push(`${host}: ${answer.reason}`)
    } catch (error) {
      reasons.push(`${host}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  return { ok: false, error: reasons.join('; ') }
}

/**
 * The commands the page shows for upgrading and rolling back outside the page.
 * @param {string} profile - the profile name `dsh plugin --profile` takes.
 * @param {string} installed - the installed version, which a rollback installs again.
 * @returns {{ upgrade: string, git: string, rollback: string }} shell commands.
 */
export function commands(profile, installed) {
  return {
    upgrade: `dsh plugin --profile ${profile} add ${PACKAGE_NAME}@latest`,
    git: `dsh plugin --profile ${profile} add github:xiaohai-78/${PACKAGE_NAME}`,
    rollback: `dsh plugin --profile ${profile} add ${PACKAGE_NAME}@${installed}`,
  }
}
