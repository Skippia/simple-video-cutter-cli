## Simple Video Cutter

## Description

- A CLI tool to cut a segment from a video and compress it using FFmpeg (with one of predefined presets). Built with Node.js and TypeScript using [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) and [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static).

## Features

- **Cross-Platform**: Works on Linux and Windows
- **Video Segment Cutting**: Specify start and end times to extract a portion of the video
- **Compression**: Compress video with preset options

## Pre-requisites

- Node.js (tested on v22.13)
  ```

## Installation

1. Clone actual version of app
```sh
git clone --depth 1 https://github.com/Skippia/simple-video-cutter-cli.git
```
2. Install dependencies
```sh
cd ./simple-video-cutter-cli && pnpm i
```
3. Set env variables as **output directory for result of compression**
- Rename **.env.example** -> **.env** and update variables (for example):
![](https://github.com/Skippia/simple-video-cutter-cli/blob/master/docs/env.png?raw=true)


4. Build
```sh
pnpm build
```
5. Run script
```sh
pnpm start --disk $disk --filename $filename --start $start --end $end
```

## Demo

1. Suppose we have video on the following path:
  - `D:\cats\video-about-cat.mkv` (windows style path)
  - `/mnt/d/cats/video-about-cat.mkv` (linux style path)
  - In order to cut fragment of this video from 1h 1m 1s till 1h 5m 5s use following command:
```sh
pnpm start --disk /mnt/d --filename "video-about-cat.mkv" --start 01:01:01 --end 01:05:05
```
Video with such name automatically will be found on disk (regardless of the depth of the folder). If you want to avoid possible collision names, use absolute path instead of filename (see below).

2. If you already know the absolute path to the file, `--disk` is not needed:
```sh
pnpm start --filename "/mnt/d/cats/video-about-cat.mkv" --start 01:01:01 --end 01:05:05
```

3. By default is used `540p` preset (FFmpeg options):
- [
  '-crf 28',
  '-preset ultrafast',
  '-b:a 128k',
  '-movflags +faststart',
  '-vf scale=-2:540,format=yuv420p'
]

- Other available presets: `720p` and `lossless`. To set preset use `--preset` option, f.e:
```sh
pnpm start \
  --filename "/mnt/d/cats/video-about-cat.mkv" \
  --start 01:01:01 \
  --end 01:05:05 \
  --preset lossless
```
4. Illustation:
![](https://github.com/Skippia/simple-video-cutter-cli/blob/master/docs/demo.png?raw=true)
