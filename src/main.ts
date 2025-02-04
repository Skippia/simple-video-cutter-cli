import path from 'node:path'
import process, { argv, exit } from 'node:process'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import { findFileDirectory } from './files'

import {
  checkFilenameIsPath,
  convertTimeIntoSeconds,
  generateOutputFilename,
  getPresetName,
  parseUserInput,
} from './helpers'

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath)
}

const { disk, filename, startTime, endTime, preset } = parseUserInput(argv.slice(2))

const targetDirectory = (
  process.platform === 'win32'
    ? process.env.VITE_APP_STORAGE_WINDOWS_PATH
    : process.env.VITE_APP_STORAGE_LINUX_PATH)!

if (!targetDirectory) {
  console.error('Environment variable STORAGE_WINDOWS_PATH or STORAGE_LINUX_PATH is not set.')
}

const pathToFile = findFileDirectory(disk, filename)
const outputFile = generateOutputFilename(
  checkFilenameIsPath(filename) ? path.basename(filename) : filename,
  targetDirectory,
)

const startSeconds = convertTimeIntoSeconds(startTime)
const endSeconds = convertTimeIntoSeconds(endTime)
const durationSeconds = endSeconds - startSeconds

if (durationSeconds <= 0) {
  console.error('End time must be greater than start time.')
  exit(1)
}

ffmpeg(
  pathToFile,
)
  .seekInput(startTime)
  .duration(durationSeconds)
  .videoCodec('libx265')
  .audioCodec('aac')
  .outputOptions(preset)
  .format('mp4')
  .on('start', (_command: string) => {
    console.time('Time of compressing')
    console.log('Selected preset:', getPresetName(preset))
    console.log('Start compressing...')
  })
  .on('error', (err: Error) => {
    console.error(`Error during processing: ${err.message}`)
    exit(1)
  })
  .on('end', () => {
    console.log(`Output file created: ${outputFile}`)
    console.timeEnd('Time of compressing')
  })
  .save(outputFile)
