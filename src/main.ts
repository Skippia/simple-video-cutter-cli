import { existsSync } from 'node:fs'
import path from 'node:path'
import process, { argv, exit } from 'node:process'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import { findFileDirectory } from './files'

import {
  checkFilenameIsPath,
  convertTimeIntoSeconds,
  generateOutputFilename,
  loadConfigEnv,
  parseUserInput,
} from './helpers'

loadConfigEnv()

if (ffmpegPath && existsSync(ffmpegPath)) {
  ffmpeg.setFfmpegPath(ffmpegPath)
}

const { disk, filename, startTime, endTime, preset, presetName } = parseUserInput(argv.slice(2))
const isCopyMode = presetName === 'copy'

const targetDirectory = process.platform === 'win32'
  ? process.env.VITE_APP_STORAGE_WINDOWS_PATH
  : process.env.VITE_APP_STORAGE_LINUX_PATH

if (!targetDirectory) {
  console.error('Environment variable VITE_APP_STORAGE_WINDOWS_PATH or VITE_APP_STORAGE_LINUX_PATH is not set.')
  exit(1)
}

const pathToFile = findFileDirectory(disk, filename)
const outputFile = generateOutputFilename(
  checkFilenameIsPath(filename) ? path.basename(filename) : filename,
  targetDirectory,
)

let startSeconds: number
let endSeconds: number

try {
  startSeconds = convertTimeIntoSeconds(startTime)
  endSeconds = convertTimeIntoSeconds(endTime)
}
catch (err) {
  console.error((err as Error).message)
  exit(1)
}

const durationSeconds = endSeconds - startSeconds

if (durationSeconds <= 0) {
  console.error('End time must be greater than start time.')
  exit(1)
}

const command = ffmpeg(pathToFile)
  .seekInput(startTime)
  .duration(durationSeconds)

if (isCopyMode) {
  command.videoCodec('copy').audioCodec('copy')
}
else {
  command.videoCodec('libx265').audioCodec('aac')
}

command
  .outputOptions(preset)
  .format('mp4')
  .on('start', (_command: string) => {
    console.time('Time of processing')
    console.log('Selected preset:', presetName)
    console.log(isCopyMode ? 'Start copying...' : 'Start compressing...')
  })
  .on('progress', (progress) => {
    const processedSeconds = convertTimeIntoSeconds(progress.timemark)
    const percent = Math.min(100, Math.round((processedSeconds / durationSeconds) * 100))
    process.stdout.write(`\rProgress: ${percent}%`)
  })
  .on('error', (err: Error) => {
    console.error(`Error during processing: ${err.message}`)
    exit(1)
  })
  .on('end', () => {
    process.stdout.write('\n')
    console.log(`Output file created: ${outputFile}`)
    console.timeEnd('Time of processing')
  })
  .save(outputFile)
