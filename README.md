### Description

- This github repo allows to cut fragment of video from target video and compress it using predefined presets.

### Pre-requisites

- (FFmpeg)[https://www.ffmpeg.org/download.html] should be installed locally on your PC
- Works both on Windows-based and Linux-based platforms
- Node.js (tested on v22.13)
- Pnpm package manager (
  ```sh
  npm i -g pnpm
  ```
)

### Installation

1. Clone actual version of app
```sh
git clone --depth 1 https://github.com/Skippia/simple-video-cutter.git
```
2. Install dependencies
```sh
cd ./simple-video-cutter && pnpm i
```
3. Set env (url) for output directory
- Rename .env.example -> .env and update variables

4. Build and run
```sh
npm run build && npm run start:prod
```

### Demo

1. Suppose we have video on the following path:
  - D:\cats\video-about-cat.mkv (windows style path)
  - /mnt/d/cats/video-about-cat.mkv (linux style path)
In order to cut fragment this video from 1h 1m 1s till 1h 5m 5s use following command:
```sh
npm run start:prod -- --disk x --filename "video-about-cat.mkv" --start 01:01:01 --end 01:05:05
```
. Video with such name automatically will be found on disk. If you you want to avoid possible collision names, rename video in advanced or use absolute path (in OS specific format) instead just filename.
2. By default is used `540p` preset (FFmpeg options):
- [
  '-crf 28',
  '-preset ultrafast',
  '-b:a 128k',
  '-movflags +faststart',
  '-vf scale=-2:540,format=yuv420p'
]

- Other available presets: `to720` and `toLossless`. To set preset use --preset option, f.e:
```sh
npm run start:prod -- --disk x --filename "video-about-cat.mkv" --start 01:01:01 --end 01:05:05 --preset lossless
```
