export const to540p = [
  '-crf 28',
  '-preset ultrafast',
  '-b:a 128k',
  '-movflags +faststart',
  '-vf scale=-2:540,format=yuv420p',
]

export const to720p = [
  '-crf 28',
  '-preset ultrafast',
  '-b:a 128k',
  '-movflags +faststart',
  '-vf scale=-2:540,format=yuv420p',
]

export const toLossless = [
  '-crf 18',
  '-preset ultrafast',
  '-b:a 128k',
  '-movflags +faststart',
  '-vf scale=-2:540,format=yuv420p',
]

export const PRESETS_MAP = {
  '540p': to540p,
  '720p': to720p,
  'lossless': toLossless,
} as const
