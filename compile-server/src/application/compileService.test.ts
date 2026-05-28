import { describe, expect, it } from "vitest";
import { CompileServerConfig } from "../config";
import { CompilePayload } from "../domain/compilePayloadSchema";
import { compileSession } from "./compileService";

function createConfig(overrides: Partial<CompileServerConfig> = {}): CompileServerConfig {
  return {
    port: 3030,
    publicBaseUrl: "http://localhost:3030",
    renderer: "placeholder",
    outputDir: ".compiled",
    tempDir: ".tmp",
    ffmpegPath: "ffmpeg",
    ffprobePath: "ffprobe",
    renderTimeoutMs: 120000,
    cleanupTempFiles: true,
    ...overrides,
  };
}

function createPayload(): CompilePayload {
  return {
    templateId: "bunny-intro-2026",
    sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    orientation: "landscape",
    originalVolume: 1,
    scenes: [
      {
        id: "scene-1",
        startSeconds: 0,
        durationSeconds: 3,
        textOverlays: [],
        effects: [],
      },
    ],
  };
}

describe("compileService", () => {
  it("returns source video as placeholder output by default", async () => {
    const result = await compileSession(createPayload(), createConfig());

    expect(result.status).toBe("completed");
    expect(result.compiledVideoUrl).toBe(
      "https://www.w3schools.com/html/mov_bbb.mp4",
    );
    expect(result.summary.renderer).toBe("placeholder");
  });

  it("uses configured placeholder video when provided", async () => {
    const result = await compileSession(
      createPayload(),
      createConfig({
        placeholderVideoUrl: "https://example.com/compiled.mp4",
      }),
    );

    expect(result.compiledVideoUrl).toBe("https://example.com/compiled.mp4");
  });

  it("returns payload summary", async () => {
    const payload = createPayload();
    payload.music = {
      url: "https://example.com/music.mp3",
      volume: 0.5,
      beatSync: false,
    };

    const result = await compileSession(payload, createConfig());

    expect(result.summary).toEqual({
      templateId: "bunny-intro-2026",
      sceneCount: 1,
      hasMusic: true,
      renderer: "placeholder",
    });
  });

  it("uses FFmpeg renderer when configured", async () => {
    const payload = createPayload();
    const config = createConfig({
      renderer: "ffmpeg",
    });

    const result = await compileSession(payload, config, {
      render: async (_payload, _config, jobId) => ({
        compiledVideoUrl: `http://localhost:3030/compiled/${jobId}.mp4`,
        outputPath: `.compiled/${jobId}.mp4`,
        renderer: "ffmpeg",
      }),
    });

    expect(result.status).toBe("completed");
    expect(result.compiledVideoUrl).toMatch(
      /^http:\/\/localhost:3030\/compiled\/.+\.mp4$/,
    );
    expect(result.summary.renderer).toBe("ffmpeg");
  });
});
