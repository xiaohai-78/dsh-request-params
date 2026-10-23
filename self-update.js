/**
 * The plugin's own update, as five page actions:
 *
 * - `updateStatus` reports the installed version and, when a check is due or `refresh` asks for one, the latest
 *   release on the registries DSH is configured with (update.js).
 * - `setUpdateCheck` turns the automatic check on or off; the switch is kept in `settings.json` in the plugin's state
 *   folder.
 * - `upgrade` installs the latest release with DSH's plugin manager from the registry's tarball address and answers at
 *   once; `upgradeStatus` reports that install, and `cancelUpgrade` stops it.
 * - `dismissUpgraded` forgets the note an upgrade leaves in `settings.json`, which lets the new version, loaded on the
 *   spot or after a restart, say that it is now running.
 *
 * A development install (`link:`) is never checked, and only an install from a registry or a registry tarball can be
 * upgraded from the page. The plugin manager restores the profile's manifest and lockfile when an install fails or is
 * cancelled.
 */
import { readFileSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { renameWithRetry } from './fs-retry.js'
import { CHANGES_URL, CHECK_ERROR_TTL_MS, CHECK_TTL_MS, PACKAGE_NAME, commands, fetchLatest, isNewer, registryBases, sourceKind } from './update.js'

/** How many lines of the installer's output a failed upgrade keeps. */
const UPGRADE_LOG_LINES = 12
const SETTINGS_FILE = 'settings.json'

/** The version this plugin runs, read once from its own package.json; `unknown` when it cannot be read. */
export const PACKAGE_VERSION = (() => {
  try {
    return JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version
  } catch {
    // The package.json beside this file is unreadable; the page then reports an unknown version and offers no upgrade.
    return 'unknown'
  }
})()

const message = error => (error instanceof Error ? error.message : String(error))

/**
 * Build the update actions for one mounted plugin.
 * @param {{ ctx: { get: (name: string) => any, on: (event: string, listener: Function) => () => void, logger: { warn: (text: string) => void }, configEditor: { documentPath: string } }, stateDir: string, refuse: (code: string, message: string, details?: object) => Error }} options -
 *   the plugin context (`pluginManager` is read when an action runs), the folder that holds `settings.json`, and how
 *   to build a refusal the page words in its own language.
 * @returns {{ updateStatus: (body: { refresh?: unknown }) => Promise<object>, setUpdateCheck: (body: { enabled?: unknown }) => Promise<object>, dismissUpgraded: () => Promise<object>, upgrade: (body: { version?: unknown }) => Promise<object>, upgradeStatus: () => Promise<object>, cancelUpgrade: () => Promise<object> }}
 *   the page actions by name.
 */
export function selfUpdateActions({ ctx, stateDir, refuse }) {
  const profileDir = dirname(ctx.configEditor.documentPath)
  const m = { check: undefined, upgrade: undefined, writes: Promise.resolve() }

  /**
   * The settings file: the switch, and the upgrade last started from the page (`{ from, to, at }`). A missing or
   * damaged file reads as the defaults, and the damage is logged.
   */
  async function readSettings() {
    try {
      const value = JSON.parse(await readFile(join(stateDir, SETTINGS_FILE), 'utf8'))
      const upgraded = value?.upgraded
      return {
        checkUpdates: value?.checkUpdates !== false,
        ...typeof upgraded?.from === 'string' && typeof upgraded?.to === 'string' ? { upgraded: { from: upgraded.from, to: upgraded.to, at: Number(upgraded.at) || 0 } } : {},
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') ctx.logger.warn(`${PACKAGE_NAME} could not read ${SETTINGS_FILE}: ${message(error)}`)
      return { checkUpdates: true }
    }
  }

  /** Change the settings file; `change` gets the current settings and returns the new ones. Writes run one at a time. */
  function updateSettings(change) {
    const write = async () => {
      const next = change(await readSettings())
      await mkdir(stateDir, { recursive: true })
      const path = join(stateDir, SETTINGS_FILE)
      const temporary = `${path}.${process.pid}.${Date.now()}.tmp`
      await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`)
      await renameWithRetry(temporary, path)
    }
    m.writes = m.writes.then(write, write)
    return m.writes
  }

  /** Forget the upgrade note when it is about the release `to`; a failed note write is logged, since the upgrade itself is unaffected. */
  function forgetUpgrade(to) {
    return updateSettings(({ upgraded, ...rest }) => (upgraded === undefined || upgraded.to === to ? rest : { ...rest, upgraded }))
      .catch(error => ctx.logger.warn(`${PACKAGE_NAME} could not update ${SETTINGS_FILE}: ${message(error)}`))
  }

  /** How the profile depends on this package, from the dependency spec its package.json records. */
  async function installSource() {
    try {
      const manifest = JSON.parse(await readFile(join(profileDir, 'package.json'), 'utf8'))
      return sourceKind(manifest.dependencies?.[PACKAGE_NAME])
    } catch (error) {
      ctx.logger.warn(`could not read how ${PACKAGE_NAME} is installed: ${message(error)}`)
      return 'unknown'
    }
  }

  /** Ask the registries DSH is configured with for the latest release, and remember the answer. */
  async function checkLatest(manager) {
    let registries
    try {
      registries = await manager?.registries()
    } catch (error) {
      ctx.logger.warn(`could not read the configured registries: ${message(error)}`)
    }
    const found = await fetchLatest(registryBases(registries), globalThis.fetch)
    m.check = found.ok
      ? { at: Date.now(), latest: { version: found.version, tarball: found.tarball, registry: found.registry } }
      : { at: Date.now(), error: found.error }
    return m.check
  }

  /**
   * What the page shows about this plugin's version. A check runs when the switch allows it and the last answer is
   * older than its lifetime, or when `refresh` asks for one; a development install is never checked.
   */
  async function updateStatus(refresh) {
    const manager = ctx.get('pluginManager')
    const settings = await readSettings()
    const source = await installSource()
    const profile = basename(profileDir)
    let check = m.check
    const lifetime = check?.error === undefined ? CHECK_TTL_MS : CHECK_ERROR_TTL_MS
    const stale = check === undefined || Date.now() - check.at > lifetime
    if (source !== 'link' && (refresh || (settings.checkUpdates && stale))) check = await checkLatest(manager)
    const newer = check?.latest !== undefined && isNewer(check.latest.version, PACKAGE_VERSION)
    return {
      name: PACKAGE_NAME,
      version: PACKAGE_VERSION,
      profile,
      source,
      checkUpdates: settings.checkUpdates,
      changesUrl: CHANGES_URL,
      ...check === undefined ? {} : { checkedAt: check.at },
      ...check?.error === undefined ? {} : { error: check.error },
      ...check?.latest === undefined ? {} : { latest: check.latest.version, newer, host: new URL(check.latest.registry).host },
      ...settings.upgraded?.to === PACKAGE_VERSION ? { upgraded: { from: settings.upgraded.from, to: settings.upgraded.to } } : {},
      canUpgrade: newer && manager !== undefined && (source === 'registry' || source === 'tarball'),
      commands: commands(profile, PACKAGE_VERSION),
      upgrade: publicUpgrade(m.upgrade),
    }
  }

  /**
   * Install the latest release with the plugin manager without waiting for it; the page polls `upgradeStatus`.
   * @param {{ version?: unknown }} body - the version the user confirmed; a newer release since then is refused.
   */
  async function startUpgrade(body) {
    const manager = ctx.get('pluginManager')
    if (manager === undefined) throw refuse('unavailable', 'The plugin manager is not available')
    if (m.upgrade?.state === 'installing') throw refuse('upgrade-running', 'An upgrade is already running')
    const source = await installSource()
    if (source !== 'registry' && source !== 'tarball') throw refuse('not-upgradable', 'This install cannot be upgraded from the page', { source })
    const check = await checkLatest(manager)
    if (check.latest === undefined) throw refuse('check-failed', `Could not read the latest version: ${check.error}`, { error: check.error })
    if (!isNewer(check.latest.version, PACKAGE_VERSION)) throw refuse('up-to-date', 'This is already the latest version')
    if (body.version !== check.latest.version) throw refuse('update-changed', `The latest version is now ${check.latest.version}`, { latest: check.latest.version })
    const requestId = `${PACKAGE_NAME}-upgrade-${Date.now()}`
    const upgrade = { state: 'installing', from: PACKAGE_VERSION, to: check.latest.version, phase: 'installing', startedAt: Date.now(), requestId }
    m.upgrade = upgrade
    // Written before the install: DSH may replace this plugin while it runs, and the new version reads the note. The
    // note only lets the new version say it is running, so the upgrade goes ahead without it.
    await updateSettings(settings => ({ ...settings, upgraded: { from: upgrade.from, to: upgrade.to, at: upgrade.startedAt } }))
      .catch(error => ctx.logger.warn(`${PACKAGE_NAME} could not write the upgrade note to ${SETTINGS_FILE}: ${message(error)}`))
    const stop = ctx.on('plugin-manager/install-state', (progress) => {
      if (progress.requestId === requestId) upgrade.phase = progress.phase
    })
    let installing
    try {
      installing = manager.installBundle(check.latest.tarball, { requestId })
    } catch (error) {
      // A manager that throws instead of rejecting ends the upgrade the same way.
      installing = Promise.reject(error)
    }
    installing.then((result) => {
      // The profile already depends on this very release (installed earlier, not loaded yet): a restart loads it.
      const waiting = result.application === 'failed' && result.error?.code === 'already-installed'
      const applied = waiting || result.application === 'applied' || result.application === 'restart-required' || result.application === 'overridden'
      const reason = waiting ? 'already-installed' : result.restartReason
      Object.assign(upgrade, {
        state: applied ? 'done' : result.application === 'cancelled' ? 'cancelled' : 'failed',
        endedAt: Date.now(),
        ...applied ? { restartRequired: result.application !== 'applied', ...reason === undefined ? {} : { reason } } : {},
        ...applied || result.application === 'cancelled' ? {} : { failure: upgradeFailure(result) },
      })
      if (!applied) return forgetUpgrade(upgrade.to)
    }, (error) => {
      Object.assign(upgrade, { state: 'failed', endedAt: Date.now(), failure: { message: message(error) } })
      return forgetUpgrade(upgrade.to)
    }).finally(stop)
    return publicUpgrade(upgrade)
  }

  /** Stop the running installation; the manager restores the profile files before it answers `cancelled`. */
  async function cancelUpgrade() {
    const manager = ctx.get('pluginManager')
    if (manager === undefined || m.upgrade?.state !== 'installing') throw refuse('not-running', 'No upgrade is running')
    const outcome = await manager.cancelInstall(m.upgrade.requestId)
    return { status: outcome.status }
  }

  return {
    updateStatus: body => updateStatus(body.refresh === true),
    setUpdateCheck: async (body) => {
      await updateSettings(settings => ({ ...settings, checkUpdates: body.enabled === true }))
      return updateStatus(false)
    },
    dismissUpgraded: async () => {
      await updateSettings(({ upgraded: _upgraded, ...rest }) => rest)
      return updateStatus(false)
    },
    upgrade: body => startUpgrade(body),
    upgradeStatus: async () => publicUpgrade(m.upgrade),
    cancelUpgrade: () => cancelUpgrade(),
  }
}

/** The part of an upgrade the page may see. */
function publicUpgrade(upgrade) {
  if (upgrade === undefined) return { state: 'idle' }
  const { requestId: _requestId, ...visible } = upgrade
  return visible
}

/** The failure an installation reports, reduced to what the page words. */
function upgradeFailure(result) {
  const output = typeof result.packageResult?.output === 'string'
    ? result.packageResult.output.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '').trim().split(/\r?\n/).slice(-UPGRADE_LOG_LINES).join('\n')
    : undefined
  return {
    ...result.error?.code === undefined ? {} : { code: result.error.code },
    ...result.error?.diagnostic === undefined ? {} : { message: result.error.diagnostic },
    ...result.packageResult?.kind === undefined ? {} : { kind: result.packageResult.kind },
    ...output === undefined || output === '' ? {} : { output },
  }
}
