import { describe, expect, it } from "vitest";
import { CompilePayload } from "../domain/compilePayloadSchema";
import { compileSession } from "./compileService";

function createPayload(): CompilePayload {
  return {
    templateId: "bunny-intro-2026",
    sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
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
    const result = await compileSession(createPayload(), {
      port: 3030,
    });

    expect(result.status).toBe("completed");
    expect(result.compiledVideoUrl).toBe(
      "https://www.w3schools.com/html/mov_bbb.mp4",
    );
    expect(result.summary.renderer).toBe("placeholder");
  });

  it("uses configured placeholder video when provided", async () => {
    const result = await compileSession(createPayload(), {
      port: 3030,
      placeholderVideoUrl: "https://example.com/compiled.mp4",
    });

    expect(result.compiledVideoUrl).toBe("https://example.com/compiled.mp4");
  });

  it("returns payload summary", async () => {
    const payload = createPayload();
    payload.music = {
      url: "https://example.com/music.mp3",
      volume: 0.5,
      beatSync: false,
    };

    const result = await compileSession(payload, {
      port: 3030,
    });

    expect(result.summary).toEqual({
      templateId: "bunny-intro-2026",
      sceneCount: 1,
      hasMusic: true,
      renderer: "placeholder",
    });
  });
});