import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CompileServerConfig } from "../../config";
import {
  materializeMediaSource,
  MediaSourceError,
  resolveLocalUploadedAssetPath,
} from "./mediaSourceResolver";

async function createConfig(
  overrides: Partial<CompileServerConfig> = {},
): Promise<CompileServerConfig> {
  const rootDir = await mkdtemp(path.join(tmpdir(), "letrend-media-test-"));

  const config: CompileServerConfig = {
    port: 3030,
    publicBaseUrl: "https://cu1223.camp.lnu.se/api",
    renderer: "ffmpeg",
    outputDir: path.join(rootDir, "compiled"),
    tempDir: path.join(rootDir, "tmp"),
    uploadDir: path.join(rootDir, "uploads"),
    ffmpegPath: "ffmpeg",
    ffprobePath: "ffprobe",
    renderTimeoutMs: 120000,
    cleanupTempFiles: true,
    ...overrides,
  };

  await mkdir(config.outputDir, { recursive: true });
  await mkdir(config.tempDir, { recursive: true });
  await mkdir(config.uploadDir, { recursive: true });

  return config;
}

describe("mediaSourceResolver", () => {
  it("resolves own public upload URLs to local upload paths", async () => {
    const config = await createConfig();

    expect(
      resolveLocalUploadedAssetPath(
        "https://cu1223.camp.lnu.se/api/assets/videos/scene.mp4",
        config,
      ),
    ).toBe(path.join(config.uploadDir, "scene.mp4"));
  });

  it("copies own uploaded media from uploadDir instead of downloading it", async () => {
    const config = await createConfig();
    const fileName = "scene-video.mp4";
    const uploadedFilePath = path.join(config.uploadDir, fileName);
    const outputPath = path.join(config.tempDir, "source-0.mp4");

    await writeFile(uploadedFilePath, "uploaded-media");

    await materializeMediaSource({
      url: `https://cu1223.camp.lnu.se/api/assets/videos/${fileName}`,
      outputPath,
      config,
      label: "scene 1",
    });

    await expect(readFile(outputPath, "utf8")).resolves.toBe("uploaded-media");
  });

  it("rejects unsafe uploaded media file names", async () => {
    const config = await createConfig();

    await expect(
      materializeMediaSource({
        url: "https://cu1223.camp.lnu.se/api/assets/videos/..%2Fsecret.mp4",
        outputPath: path.join(config.tempDir, "source-0.mp4"),
        config,
        label: "scene 1",
      }),
    ).rejects.toThrow(MediaSourceError);
  });

  it("throws a clear error when an own uploaded file is missing", async () => {
    const config = await createConfig();

    await expect(
      materializeMediaSource({
        url: "https://cu1223.camp.lnu.se/api/assets/videos/missing.mp4",
        outputPath: path.join(config.tempDir, "source-0.mp4"),
        config,
        label: "scene 1",
      }),
    ).rejects.toThrow("Could not read uploaded media for scene 1.");
  });
});