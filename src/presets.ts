export const to540p = [
  '-crf 26',
  '-preset medium',
  '-b:a 128k',
  '-movflags +faststart',
  '-vf scale=-2:540,format=yuv420p',
] as const

export const to720p = [
  '-crf 26',
  '-preset medium',
  '-b:a 128k',
  '-movflags +faststart',
  '-vf scale=-2:720,format=yuv420p',
] as const

export const toLossless = [
  '-crf 18',
  '-preset medium',
  '-b:a 128k',
] as const

export const PRESETS_MAP = {
  '540p': to540p,
  '720p': to720p,
  'lossless': toLossless,
} as const
