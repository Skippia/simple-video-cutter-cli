import { execFileSync, execSync } from 'node:child_process'
import fsSync from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { checkFilenameIsPath } from './helpers'

export function findFileDirectory(disk: string, filename: string): string {
  try {
    // Absolute path provided — use directly
    if (path.isAbsolute(filename)) {
      if (!fsSync.existsSync(filename)) {
        throw new Error(`File on path ${filename} does not exist`)
      }

      return filename
    }

    // Windows
    if (process.platform === 'win32') {
      // If disk is already a full path (e.g. from os.homedir()), use it directly;
      // otherwise treat it as a single drive letter
      const drive = disk.length === 1 ? `${disk.toUpperCase()}:\\` : disk

      let pathToFile = ''

      if (checkFilenameIsPath(filename)) {
        if (!fsSync.existsSync(path.join(drive, filename))) {
          throw new Error(`File on path ${filename} does not exist`)
        }

        pathToFile = path.join(drive, filename)
      }
      else {
        // Note: dir with /s /b requires shell; filename is quoted to mitigate injection
        const findCommand = `dir "${path.join(drive, filename)}" /s /b`
        pathToFile = execSync(findCommand, { encoding: 'utf8' }).trim()
      }

      if (!pathToFile) {
        throw new Error(`File "${filename}" not found in ${drive}`)
      }

      if (pathToFile.includes('\r\n')) {
        throw new Error('Found collision names. Use absolute path to filename location.')
      }

      return pathToFile
    }

    // Linux
    const searchRoot = path.isAbsolute(disk) ? disk : `/${disk}`
    let pathToFile = ''

    if (checkFilenameIsPath(filename)) {
      if (!fsSync.existsSync(path.join(disk, filename))) {
        throw new Error(`File on path ${filename} does not exist`)
      }

      pathToFile = path.join(disk, filename)
    }
    else {
      // Use execFileSync to avoid command injection via filename
      const maybeNotCollisionPathToFolder = execFileSync(
        'find',
        [searchRoot, '-name', filename, '-exec', 'dirname', '{}', ';', '-quit'],
        { encoding: 'utf8' },
      ).trim()

      if (!maybeNotCollisionPathToFolder) {
        throw new Error(`File "${filename}" not found in ${searchRoot}`)
      }

      // Same file is located on root folder
      if (fsSync.existsSync(path.join(disk, filename)) && maybeNotCollisionPathToFolder) {
        throw new Error('Found collision names. Use absolute path to filename location.')
      }

      pathToFile = path.join(maybeNotCollisionPathToFolder, filename)
    }

    if (!pathToFile) {
      throw new Error('Not found')
    }

    return pathToFile
  }
  catch (err) {
    console.error((err as Error).message)
    process.exit(1)
  }
}
