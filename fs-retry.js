/**
 * Renames that tolerate Windows holding a file for a moment.
 *
 * On Windows, replacing or moving a file fails with `EPERM`, `EACCES`, or `EBUSY` while another process has it open,
 * which virus scanners, search indexers, and editors do for short periods. Elsewhere these codes mean a real permission
 * problem, so only Windows retries.
 */
import { rename } from 'node:fs/promises'

const BUSY = new Set(['EPERM', 'EACCES', 'EBUSY'])

/**
 * Rename `from` to `to`, retrying a few times on Windows while the file is busy.
 * @param {string} from - the current path.
 * @param {string} to - the new path; an existing file there is replaced.
 * @param {{ platform?: string, attempts?: number, delayMs?: number, renameImpl?: typeof rename }} [options] - the platform
 *   to behave as, how many tries in total, the wait before the second try (it grows with each try), and the rename to use.
 * @returns {Promise<void>} settles once renamed; rejects with the last error.
 */
export async function renameWithRetry(from, to, { platform = process.platform, attempts = 6, delayMs = 50, renameImpl = rename } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      await renameImpl(from, to)
      return
    } catch (error) {
      if (platform !== 'win32' || !BUSY.has(error?.code) || attempt >= attempts) throw error
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
    }
  }
}
