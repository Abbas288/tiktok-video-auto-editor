# Compile Server MVP

This server receives a compile payload from the Expo app and returns a playable compiled video URL.

The current version is an MVP placeholder renderer. It validates the payload and returns either `COMPILE_PLACEHOLDER_VIDEO_URL` or the payload `sourceVideoUrl`. Real FFmpeg rendering can be added behind the same `compileSession` interface later.

## Install

```bash
npm install