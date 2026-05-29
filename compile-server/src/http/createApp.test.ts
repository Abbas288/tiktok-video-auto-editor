import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { CompileServerConfig } from "../config";
import { createApp } from "./createApp";

function createConfig(
  overrides: Partial<CompileServerConfig> = {},
): CompileServerConfig {
  const uploadDir = mkdtempSync(path.join(tmpdir(), "letrend-upload-test-"));

  return {
    port: 3030,
    publicBaseUrl: "http://localhost:3030",
    renderer: "placeholder",
    outputDir: ".compiled",
    tempDir: ".tmp",
    uploadDir,
    ffmpegPath: "ffmpeg",
    ffprobePath: "ffprobe",
    renderTimeoutMs: 120000,
    cleanupTempFiles: true,
    ...overrides,
  };
}

function createValidPayload(): Record<string, unknown> {
  return {
    templateId: "bunny-intro-2026",
    sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    orientation: "landscape",
    originalVolume: 1,
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 4,
        instruction: "First scene",
        textOverlays: [],
        effects: [],
      },
    ],
  };
}

describe("createApp", () => {
  it("returns health status", async () => {
    const app = createApp(createConfig());

    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      status: "ok",
    });
  });

  it("uploads a scene video", async () => {
    const app = createApp(createConfig());

    const response = await request(app)
      .post("/assets/videos")
      .attach("video", Buffer.from("fake-video"), {
        filename: "clip.mp4",
        contentType: "video/mp4",
      })
      .expect(201);

    expect(response.body.fileName).toMatch(/\.mp4$/);
    expect(response.body.assetUrl).toContain("/assets/videos/");
  });

  it("rejects missing scene video uploads", async () => {
    const app = createApp(createConfig());

    const response = await request(app).post("/assets/videos").expect(400);

    expect(response.body.error).toBe("No video file was uploaded.");
  });

  it("compiles a valid payload", async () => {
    const app = createApp(
      createConfig({
        placeholderVideoUrl: "https://example.com/compiled.mp4",
      }),
    );

    const response = await request(app)
      .post("/compile")
      .send(createValidPayload())
      .expect(200);

    expect(response.body.status).toBe("completed");
    expect(response.body.compiledVideoUrl).toBe(
      "https://example.com/compiled.mp4",
    );
    expect(response.body.summary.templateId).toBe("bunny-intro-2026");
  });

  it("rejects invalid payloads", async () => {
    const app = createApp(createConfig());

    const response = await request(app)
      .post("/compile")
      .send({
        templateId: "broken-template",
      })
      .expect(400);

    expect(response.body.error).toBe("Invalid compile payload.");
    expect(response.body.details.length).toBeGreaterThan(0);
  });

  it("returns JSON when compiled video file is missing for API clients", async () => {
    const app = createApp(createConfig());

    const response = await request(app)
      .get("/compiled/missing-video.mp4")
      .set("Accept", "application/json")
      .expect(404);

    expect(response.body.error).toBe("Compiled video not found.");
    expect(response.body.details).toContain("missing-video.mp4");
  });

  it("returns a friendly HTML page when compiled video file is missing in browser navigation", async () => {
    const app = createApp(createConfig());

    const response = await request(app)
      .get("/compiled/missing-video.mp4")
      .set("Accept", "text/html")
      .expect(404);

    expect(response.text).toContain("Compiled video not found");
    expect(response.text).toContain("Go back");
    expect(response.text).toContain("missing-video.mp4");
    expect(response.headers["content-type"]).toContain("text/html");
  });

  it("returns 404 for HEAD request when compiled video file is missing", async () => {
    const app = createApp(createConfig());

    await request(app).head("/compiled/missing-video.mp4").expect(404);
  });

  it("returns 404 for unknown routes", async () => {
    const app = createApp(createConfig());

    const response = await request(app).get("/missing").expect(404);

    expect(response.body.error).toBe("Route not found.");
  });
});