# Compile Server

This server receives a compile payload from the Expo app and returns a playable compiled video URL.

The default renderer is `placeholder` so the client-server flow stays fast and stable during development. Real rendering can be enabled with `COMPILE_RENDERER=ffmpeg`.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Verify

```bash
npm run verify
```

## Environment

```bash
PORT=3030
COMPILE_PUBLIC_BASE_URL=http://localhost:3030
COMPILE_RENDERER=placeholder
COMPILE_PLACEHOLDER_VIDEO_URL=
COMPILE_OUTPUT_DIR=.compiled
COMPILE_TEMP_DIR=
COMPILE_FFMPEG_PATH=ffmpeg
COMPILE_FFPROBE_PATH=ffprobe
COMPILE_RENDER_TIMEOUT_MS=120000
COMPILE_FONT_FILE=
COMPILE_CLEANUP_TEMP_FILES=true
```

## FFmpeg mode

Install FFmpeg and FFprobe so both commands are available in the terminal.

```bash
ffmpeg -version
ffprobe -version
```

Enable the renderer:

```bash
$env:COMPILE_RENDERER="ffmpeg"
npm run dev
```

The server will download the source video, render scene segments, burn text overlays, apply scene effects, compose transitions, mix audio/music when available and return a URL under `/compiled`.

## Endpoints

```text
GET /health
POST /compile
GET /compiled/:filename
```
