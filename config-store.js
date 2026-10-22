/**
 * The rules, kept beside the profile patch in `<profile>/.dsh-request-params/config.json`.
 *
 * The file holds `{ version, revision, enabled, rules }`. `revision` counts saves, so a page that loaded an older
 * revision learns that another page or a hand edit changed the file instead of overwriting it. Writes replace the file
 * atomically (temporary file, then rename) and run one at a time within this process. A file that exists but cannot be
 * read is reported and never overwritten.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { renameWithRetry } from './fs-retry.js'
import { normalizeConfig } from './rules.js'

const FILE = 'config.json'
const VERSION = 1
/** The largest config file read, in bytes. */
export const MAX_BYTES = 4 * 1024 * 1024

/** A config file that exists but cannot be used. */
export class ConfigFileError extends Error {
  constructor(path, cause) {
    super(`${path} cannot be read (${cause instanceof Error ? cause.message : String(cause)}); fix or delete it`)
    this.code = 'config-damaged'
    this.path = path
  }
}

/** A save made from a revision that is no longer the current one. */
export class ConflictError extends Error {
  constructor(revision) {
    super('The rules changed since this page loaded them')
    this.code = 'conflict'
    this.details = { revision }
  }
}

export class ConfigStore {
  /** @param {string} dir - directory holding `config.json`; created on the first write. */
  constructor(dir) {
    this.dir = dir
    this.path = join(dir, FILE)
    this.queue = Promise.resolve()
  }

  /**
   * @returns {Promise<{ revision: number, config: { enabled: boolean, rules: object[] } }>} the stored rules, or an
   *   empty configuration at revision 0 when there is no file.
   * @throws {ConfigFileError} when the file exists but is not a JSON object or is too large.
   */
  async read() {
    let text
    try {
      text = await readFile(this.path, 'utf8')
    } catch (error) {
      if (error?.code === 'ENOENT') return { revision: 0, config: { enabled: true, rules: [] } }
      throw new ConfigFileError(this.path, error)
    }
    if (text.length > MAX_BYTES) throw new ConfigFileError(this.path, 'larger than 4 MB')
    let value
    try {
      value = JSON.parse(text)
    } catch (error) {
      throw new ConfigFileError(this.path, error)
    }
    if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new ConfigFileError(this.path, 'expected a JSON object')
    return { revision: Number.isInteger(value.revision) && value.revision >= 0 ? value.revision : 0, config: normalizeConfig(value) }
  }

  /**
   * Replace the rules.
   * @param {{ enabled: boolean, rules: object[] }} config - the new configuration.
   * @param {number} [expectedRevision] - the revision the caller last read; omit to overwrite.
   * @returns {Promise<{ revision: number, config: object }>} what is on disk now.
   * @throws {ConflictError} when `expectedRevision` is not the current one.
   * @throws {ConfigFileError} when the existing file cannot be read.
   */
  save(config, expectedRevision) {
    const run = this.queue.then(async () => {
      const current = await this.read()
      if (expectedRevision !== undefined && expectedRevision !== current.revision) throw new ConflictError(current.revision)
      const next = { revision: current.revision + 1, config: normalizeConfig(config) }
      await mkdir(this.dir, { recursive: true })
      const temporary = `${this.path}.${process.pid}.${Date.now()}.tmp`
      await writeFile(temporary, `${JSON.stringify({ version: VERSION, revision: next.revision, ...next.config }, null, 2)}\n`)
      await renameWithRetry(temporary, this.path)
      return next
    })
    this.queue = run.catch(() => undefined)
    return run
  }
}
