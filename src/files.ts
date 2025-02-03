import { execSync } from 'node:child_process'
import fsSync from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { checkFilenameIsPath } from './helpers'

export function findFileDirectory(disk: string, filename: string): string {
  try {
    // Windows
    if (process.platform === 'win32') {
      const drive = `${disk.toUpperCase()}:\\`
      const findCommand = `dir "${drive}${filename}" /s /b`

      let pathToFile = ''

      if (checkFilenameIsPath(filename)) {
        if (!fsSync.existsSync(path.join(drive, filename))) {
          throw new Error(`File on path ${filename} does not exist`)
        }

        pathToFile = path.join(drive, filename)
      }
      else {
        pathToFile = execSync(findCommand, { encoding: 'utf8' }).trim()
      }

      if (!pathToFile) {
        throw new Error('Not found')
      }

      if (pathToFile.includes('\r\n')) {
        throw new Error('Found collision names. Use absolute path to filename location.')
      }

      return pathToFile
    }

    // Linux
    const findCommand = `find /${disk} -name "${filename}" -exec dirname {} \\; -quit`
    let pathToFile = ''

    if (checkFilenameIsPath(filename)) {
      if (!fsSync.existsSync(path.join(disk, filename))) {
        throw new Error(`File on path ${filename} does not exist`)
      }

      pathToFile = path.join(disk, filename)
    }
    else {
      // Command always return 1 path to folder even if there are collision names
      const maybeNotCollisionPathToFolder = execSync(findCommand, { encoding: 'utf8' }).trim()

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
