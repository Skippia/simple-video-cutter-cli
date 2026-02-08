# Simple Video Cutter

## Description

A CLI tool to cut a segment from a video and compress it using FFmpeg (with one of predefined presets). Built with Node.js and TypeScript using [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) and [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static).

## Features

- **Cross-Platform**: Works on Linux and Windows
- **Video Segment Cutting**: Specify start and end times to extract a portion of the video
- **Compression**: Compress video with preset options
- **Auto-search**: Automatically finds a file by name within the specified directory

## Pre-requisites

- Node.js (tested on v22.13)
- pnpm

## Installation

1. Clone the repository
```sh
git clone --depth 1 https://github.com/Skippia/simple-video-cutter-cli.git
```
2. Install dependencies
```sh
cd ./simple-video-cutter-cli && pnpm i
```
3. Create `.env` file with output directory for compressed videos:
```sh
cp .env.example .env
```
Set the following variables:
- `VITE_APP_STORAGE_WINDOWS_PATH` — output directory on Windows (e.g. `"X:\\OBS"`)
- `VITE_APP_STORAGE_LINUX_PATH` — output directory on Linux (e.g. `"/mnt/x/OBS"`)

4. Build
```sh
pnpm build
```

## Usage

```sh
pnpm start --filename <filename_or_path> --start <start_time> --end <end_time> [--disk <search_dir>] [--preset <preset>]
```

| Argument | Required | Description |
|---|---|---|
| `--filename` | Yes | File name or absolute path to the video |
| `--start` | Yes | Start time (`hh:mm:ss`, `mm:ss`, or `ss`) |
| `--end` | Yes | End time (`hh:mm:ss`, `mm:ss`, or `ss`) |
| `--disk` | No | Directory to search for the file (default: `$HOME`) |
| `--preset` | No | Preset: `540p`, `720p`, `lossless`, `copy` (default: `540p`) |

For development (without build step):
```sh
pnpm dev --filename <filename_or_path> --start <start_time> --end <end_time>
```

## Demo

1. Search by filename — the file will be found automatically in `$HOME`:
```sh
pnpm start --filename "video-about-cat.mkv" --start 01:01:01 --end 01:05:05
```

2. Search in a specific directory:
```sh
pnpm start --disk /mnt/d --filename "video-about-cat.mkv" --start 01:01:01 --end 01:05:05
```

3. Absolute path (`--disk` is not needed):
```sh
pnpm start --filename "/mnt/d/cats/video-about-cat.mkv" --start 01:01:01 --end 01:05:05
```

4. With compression preset:
```sh
pnpm start \
  --filename "/mnt/d/cats/video-about-cat.mkv" \
  --start 01:01:01 \
  --end 01:05:05 \
  --preset lossless
```

5. Fast cut without re-encoding:
```sh
pnpm start \
  --filename "/mnt/d/cats/video-about-cat.mkv" \
  --start 01:01:01 \
  --end 01:05:05 \
  --preset copy
```

## Presets

| Preset | Mode | CRF | Audio | Resolution |
|---|---|---|---|---|
| `540p` (default) | re-encode (H.265) | 26 | 128k | 540p |
| `720p` | re-encode (H.265) | 26 | 128k | 720p |
| `lossless` | re-encode (H.265) | 18 | 128k | original |
| `copy` | stream copy | — | — | original |

`copy` copies video and audio streams without re-encoding — **~100x faster**, but no compression or resizing. Cut points snap to the nearest keyframe.

![](https://github.com/Skippia/simple-video-cutter-cli/blob/master/docs/demo.png?raw=true)
