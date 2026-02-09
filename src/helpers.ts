import { readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { PRESETS_MAP } from './presets'

export function loadConfigEnv(): void {
  const configPath = path.join(os.homedir(), '.config', 'cutter', '.env')

  try {
    const content = readFileSync(configPath, 'utf-8')

    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#'))
        continue

      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1)
        continue

      const key = trimmed.slice(0, eqIndex).trim()
      let value = trimmed.slice(eqIndex + 1).trim()

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
        value = value.slice(1, -1)
      }

      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  }
  catch {
    // Config file not found — silently ignore
  }
}

function usage(): never {
  console.error(
    'Usage: script --filename <filename> --start <start_time> --end <end_time>'
    + ' [--disk <search_dir>] [--preset <preset_name>]',
  )
  process.exit(1)
}

/**
 * Returns the current date formatted as YYYYMMDD_HHMMSS.
 */
export function getFormattedDate(): string {
  const now = new Date()
  const pad = (num: number): string => String(num).padStart(2, '0')

  const formattedDate = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`

  return formattedDate
}

export function generateOutputFilename(filename: string, targetDirectory: string): string {
  return path.join(targetDirectory, `${filename}-${getFormattedDate()}_extracted.mp4`)
}

/**
 * Convert a time string (hh:mm:ss, mm:ss, or ss) into seconds.
 */
export function convertTimeIntoSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number)

  if (parts.some(Number.isNaN)) {
    throw new Error(`Invalid time format: "${timeStr}". Expected hh:mm:ss, mm:ss, or ss.`)
  }

  if (parts.length === 3) {
    return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
  }
  else if (parts.length === 2) {
    return parts[0]! * 60 + parts[1]!
  }
  else if (parts.length === 1) {
    return parts[0]!
  }

  throw new Error(`Invalid time format: "${timeStr}". Expected hh:mm:ss, mm:ss, or ss.`)
}

export function parseUserInput(args: string[]): {
  disk: string
  filename: string
  startTime: string
  endTime: string
  preset: string[]
  presetName: string
} {
  let disk: string | undefined
  let filename: string | undefined
  let startTime: string | undefined
  let endTime: string | undefined
  let presetName: keyof typeof PRESETS_MAP = '540p'
  let preset: string[] = PRESETS_MAP[presetName]

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!

    if (arg === '--disk') {
      disk = args[i + 1]
    }
    else if (arg === '--filename') {
      filename = args[i + 1]
    }
    else if (arg === '--start') {
      startTime = args[i + 1]
    }
    else if (arg === '--end') {
      endTime = args[i + 1]
    }
    else if (arg === '--preset') {
      const maybeValidPresetName = args[i + 1]!
      const isPresetExists = Object.keys(PRESETS_MAP).includes(maybeValidPresetName)

      if (isPresetExists) {
        presetName = maybeValidPresetName as keyof typeof PRESETS_MAP
        preset = PRESETS_MAP[presetName]
      }
      else {
        console.warn(`Preset "${maybeValidPresetName}" does not exist.\nAvailable preset names are: ${Object.keys(PRESETS_MAP).join(', ')}.\nSelected default preset: ${getPresetName(preset)}.`)
      }
    }
    else {
      usage()
    }
    i++
  }

  if (!filename || !startTime || !endTime) {
    usage()
  }

  return {
    preset,
    presetName,
    disk: disk ?? os.homedir(),
    filename: filename as string,
    startTime: startTime as string,
    endTime: endTime as string,
  }
}

export function getPresetName(preset: string[]) {
  return Object.entries(PRESETS_MAP).find(([_, value]) => value === preset)?.[0]
}

export const checkFilenameIsPath = (path: string): boolean => path.includes('/') || path.includes('\\')
