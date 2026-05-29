import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { CompileServerConfig } from "../../config";
import {
  CompilePayload,
  CompilePayloadScene,
} from "../../domain/compilePayloadSchema";
import {
  buildAudioTransitionFilterGraph,
  buildSceneVideoFilter,
  buildVideoTransitionFilterGraph,
  createAssSubtitleFileContent,
} from "./ffmpegRenderPlan";
import { runMediaProcess } from "./ffmpegProcess";

export interface FfmpegRenderResult {
  compiledVideoUrl: string;
  outputPath: string;
  renderer: "ffmpeg";
}

interface PreparedSceneInput {
  path: string;
  sourceStartSeconds: number;
}

export async function renderWithFfmpeg(
  payload: CompilePayload,
  config: CompileServerConfig,
  jobId: string,
): Promise<FfmpegRenderResult> {
  const jobDir = path.join(config.tempDir, jobId);
  const outputFileName = `${jobId}.mp4`;
  const outputPath = path.join(config.outputDir, outputFileName);
  const musicPath = payload.music ? path.join(jobDir, "music.mp3") : undefined;

  await mkdir(jobDir, { recursive: true });
  await mkdir(config.outputDir, { recursive: true });
  await writeFile(path.join(jobDir, "payload.json"), JSON.stringify(payload, null, 2));

  try {
    const sceneInputs = await prepareSceneInputs(payload, jobDir);

    if (payload.music && musicPath) {
      await downloadMedia(payload.music.url, musicPath);
    }

    const subtitleFiles = await createSubtitleFiles(payload, jobDir);
    const sceneVideoPaths = await renderSceneVideos(
      payload,
      config,
      sceneInputs,
      jobDir,
      subtitleFiles,
    );

    const composedVideoPath = path.join(jobDir, "composed-video.mp4");
    const videoDurationSeconds = await composeSceneVideos(
      payload.scenes,
      sceneVideoPaths,
      composedVideoPath,
      config,
    );

    const audioPath = await renderAudioTrack({
      payload,
      config,
      sceneInputs,
      musicPath,
      jobDir,
      outputDurationSeconds: videoDurationSeconds,
    });

    if (audioPath) {
      await muxVideoAndAudio(composedVideoPath, audioPath, outputPath, config);
    } else {
      await copyFile(composedVideoPath, outputPath);
    }

    return {
      compiledVideoUrl: `${config.publicBaseUrl.replace(/\/$/, "")}/compiled/${encodeURIComponent(
        outputFileName,
      )}`,
      outputPath,
      renderer: "ffmpeg",
    };
  } finally {
    if (config.cleanupTempFiles) {
      await rm(jobDir, { recursive: true, force: true });
    }
  }
}

async function prepareSceneInputs(
  payload: CompilePayload,
  jobDir: string,
): Promise<PreparedSceneInput[]> {
  const cache = new Map<string, string>();
  const inputs: PreparedSceneInput[] = [];

  for (const [index, scene] of payload.scenes.entries()) {
    const url = scene.videoSource?.url ?? payload.sourceVideoUrl;
    const sourceStartSeconds = scene.videoSource
      ? scene.videoSource.sourceStartSeconds
      : scene.startSeconds;

    let filePath = cache.get(url);

    if (!filePath) {
      filePath = path.join(jobDir, `source-${index}.mp4`);
      await downloadMedia(url, filePath);
      cache.set(url, filePath);
    }

    inputs.push({
      path: filePath,
      sourceStartSeconds,
    });
  }

  return inputs;
}

async function renderSceneVideos(
  payload: CompilePayload,
  config: CompileServerConfig,
  sceneInputs: PreparedSceneInput[],
  jobDir: string,
  subtitleFiles: Map<string, string>,
): Promise<string[]> {
  const outputPaths: string[] = [];

  for (const [index, scene] of payload.scenes.entries()) {
    const outputPath = path.join(jobDir, `scene-${index}.mp4`);
    const input = sceneInputs[index];
    const filter = buildSceneVideoFilter({
      scene,
      orientation: payload.orientation,
      subtitleFilePath: subtitleFiles.get(scene.id),
    });

    await runMediaProcess(
      config.ffmpegPath,
      [
        "-hide_banner",
        "-y",
        "-ss",
        formatSeconds(input.sourceStartSeconds),
        "-t",
        formatSeconds(scene.durationSeconds),
        "-i",
        input.path,
        "-vf",
        filter,
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outputPath,
      ],
      { timeoutMs: config.renderTimeoutMs },
    );

    outputPaths.push(outputPath);
  }

  return outputPaths;
}

async function composeSceneVideos(
  scenes: CompilePayloadScene[],
  sceneVideoPaths: string[],
  outputPath: string,
  config: CompileServerConfig,
): Promise<number> {
  if (sceneVideoPaths.length === 1) {
    await copyFile(sceneVideoPaths[0], outputPath);

    return scenes[0].durationSeconds;
  }

  const transitionGraph = buildVideoTransitionFilterGraph(scenes);

  await runMediaProcess(
    config.ffmpegPath,
    [
      "-hide_banner",
      "-y",
      ...sceneVideoPaths.flatMap((filePath) => ["-i", filePath]),
      "-filter_complex",
      transitionGraph.filterGraph,
      "-map",
      `[${transitionGraph.outputLabel}]`,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { timeoutMs: config.renderTimeoutMs },
  );

  return transitionGraph.outputDurationSeconds;
}

async function renderAudioTrack(options: {
  payload: CompilePayload;
  config: CompileServerConfig;
  sceneInputs: PreparedSceneInput[];
  musicPath: string | undefined;
  jobDir: string;
  outputDurationSeconds: number;
}): Promise<string | null> {
  const sourceAudioPath = await renderSourceAudio(
    options.payload,
    options.config,
    options.sceneInputs,
    options.jobDir,
  );

  const musicAudioPath =
    options.payload.music && options.musicPath
      ? await renderMusicAudio(
          options.payload.music.volume,
          options.config,
          options.musicPath,
          options.jobDir,
          options.outputDurationSeconds,
        )
      : null;

  if (sourceAudioPath && musicAudioPath) {
    const mixedAudioPath = path.join(options.jobDir, "mixed-audio.m4a");

    await runMediaProcess(
      options.config.ffmpegPath,
      [
        "-hide_banner",
        "-y",
        "-i",
        sourceAudioPath,
        "-i",
        musicAudioPath,
        "-filter_complex",
        "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]",
        "-map",
        "[aout]",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        mixedAudioPath,
      ],
      { timeoutMs: options.config.renderTimeoutMs },
    );

    return mixedAudioPath;
  }

  return sourceAudioPath ?? musicAudioPath;
}

async function renderSourceAudio(
  payload: CompilePayload,
  config: CompileServerConfig,
  sceneInputs: PreparedSceneInput[],
  jobDir: string,
): Promise<string> {
  const sceneAudioPaths: string[] = [];

  for (const [index, scene] of payload.scenes.entries()) {
    const input = sceneInputs[index];
    const outputPath = path.join(jobDir, `scene-audio-${index}.m4a`);
    const hasAudio = await probeHasAudio(input.path, config);

    if (hasAudio) {
      await runMediaProcess(
        config.ffmpegPath,
        [
          "-hide_banner",
          "-y",
          "-ss",
          formatSeconds(input.sourceStartSeconds),
          "-t",
          formatSeconds(scene.durationSeconds),
          "-i",
          input.path,
          "-vn",
          "-filter:a",
          `volume=${formatNumber(payload.originalVolume)}`,
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          outputPath,
        ],
        { timeoutMs: config.renderTimeoutMs },
      );
    } else {
      await createSilentAudio(outputPath, scene.durationSeconds, config);
    }

    sceneAudioPaths.push(outputPath);
  }

  const outputPath = path.join(jobDir, "source-audio.m4a");

  if (sceneAudioPaths.length === 1) {
    await copyFile(sceneAudioPaths[0], outputPath);

    return outputPath;
  }

  const graph = buildAudioTransitionFilterGraph(payload.scenes);

  await runMediaProcess(
    config.ffmpegPath,
    [
      "-hide_banner",
      "-y",
      ...sceneAudioPaths.flatMap((filePath) => ["-i", filePath]),
      "-filter_complex",
      graph.filterGraph,
      "-map",
      `[${graph.outputLabel}]`,
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputPath,
    ],
    { timeoutMs: config.renderTimeoutMs },
  );

  return outputPath;
}

async function createSilentAudio(
  outputPath: string,
  durationSeconds: number,
  config: CompileServerConfig,
): Promise<void> {
  await runMediaProcess(
    config.ffmpegPath,
    [
      "-hide_banner",
      "-y",
      "-f",
      "lavfi",
      "-i",
      "anullsrc=channel_layout=stereo:sample_rate=48000",
      "-t",
      formatSeconds(durationSeconds),
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputPath,
    ],
    { timeoutMs: config.renderTimeoutMs },
  );
}

async function renderMusicAudio(
  volume: number,
  config: CompileServerConfig,
  musicPath: string,
  jobDir: string,
  durationSeconds: number,
): Promise<string> {
  const outputPath = path.join(jobDir, "music-audio.m4a");

  await runMediaProcess(
    config.ffmpegPath,
    [
      "-hide_banner",
      "-y",
      "-stream_loop",
      "-1",
      "-i",
      musicPath,
      "-t",
      formatSeconds(durationSeconds),
      "-filter:a",
      `volume=${formatNumber(volume)}`,
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputPath,
    ],
    { timeoutMs: config.renderTimeoutMs },
  );

  return outputPath;
}

async function muxVideoAndAudio(
  videoPath: string,
  audioPath: string,
  outputPath: string,
  config: CompileServerConfig,
): Promise<void> {
  await runMediaProcess(
    config.ffmpegPath,
    [
      "-hide_banner",
      "-y",
      "-i",
      videoPath,
      "-i",
      audioPath,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-shortest",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { timeoutMs: config.renderTimeoutMs },
  );
}

async function probeHasAudio(
  sourcePath: string,
  config: CompileServerConfig,
): Promise<boolean> {
  const result = await runMediaProcess(
    config.ffprobePath,
    [
      "-v",
      "error",
      "-select_streams",
      "a:0",
      "-show_entries",
      "stream=index",
      "-of",
      "csv=p=0",
      sourcePath,
    ],
    { timeoutMs: config.renderTimeoutMs },
  );

  return result.stdout.trim().length > 0;
}

async function createSubtitleFiles(
  payload: CompilePayload,
  jobDir: string,
): Promise<Map<string, string>> {
  const files = new Map<string, string>();

  for (const [index, scene] of payload.scenes.entries()) {
    if (scene.textOverlays.length === 0) {
      continue;
    }

    const filePath = path.join(jobDir, `scene-${index}.ass`);
    const content = createAssSubtitleFileContent(scene, payload.orientation);

    await writeFile(filePath, content, "utf8");
    files.set(scene.id, filePath);
  }

  return files;
}

async function downloadMedia(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not download media from ${url}.`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  await writeFile(outputPath, buffer);
}

function formatSeconds(value: number): string {
  return Number(value.toFixed(4)).toString();
}

function formatNumber(value: number): string {
  return Number(value.toFixed(4)).toString();
}