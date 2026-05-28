import request from "supertest";
import { describe, expect, it } from "vitest";
import { CompileServerConfig } from "../config";
import { createApp } from "./createApp";

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

  it("returns 404 for unknown routes", async () => {
    const app = createApp(createConfig());

    const response = await request(app).get("/missing").expect(404);

    expect(response.body.error).toBe("Route not found.");
  });
});
