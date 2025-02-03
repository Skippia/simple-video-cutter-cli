import path from 'node:path'
import process from 'node:process'
import { PRESETS_MAP } from './presets'

function usage(): never {
  console.error(
    'Usage: script --disk <disk> --filename <filename> --start <start_time> --end <end_time> --preset <preset_name>',
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
  const parts = timeStr.split(':').map(Number)!
  if (parts.length === 3) {
    return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
  }
  else if (parts.length === 2) {
    return parts[0]! * 60 + parts[1]!
  }
  else if (parts.length === 1) {
    return parts[0]!
  }

  throw new Error('Invalid time format')
}

export function parseUserInput(args: string[]): {
  disk: string
  filename: string
  startTime: string
  endTime: string
  preset: string[]
} {
  let disk: string | undefined
  let filename: string | undefined
  let startTime: string | undefined
  let endTime: string | undefined
  let preset: string[] = PRESETS_MAP['540p']

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
        preset = PRESETS_MAP[maybeValidPresetName as keyof typeof PRESETS_MAP]
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
    disk: disk as string,
    filename: filename as string,
    startTime: startTime as string,
    endTime: endTime as string,
  }
}

export function getPresetName(preset: string[]) {
  return Object.entries(PRESETS_MAP).find(([_, value]) => value === preset)?.[0]
}

export const checkFilenameIsPath = (path: string): boolean => path.includes('/') || path.includes('\\')
