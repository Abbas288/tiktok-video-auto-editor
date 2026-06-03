import { CompilePayload } from "../domain/compile/compilePayload";
import { createCompileService } from "./compileService";

function createPayload(): CompilePayload {
  return {
    templateId: "bunny-intro-2026",
    sourceVideoUrl: "https://example.com/source.mp4",
    orientation: "landscape",
    originalVolume: 1,
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 4,
        instruction: "Test scene",
        transition: {
          type: "cut",
          durationSeconds: 0,
        },
        textOverlays: [],
        effects: [],
      },
    ],
  };
}

describe("compileService", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("includes server error details when compile request fails", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () =>
        JSON.stringify({
          error: "FFmpeg render failed during scene media preparation.",
          details: ["Could not read uploaded media for scene 1."],
        }),
    }) as typeof fetch;

    const client = createCompileService("https://example.com/api");

    await expect(client.compile(createPayload())).rejects.toThrow(
      "Compile request failed with status 500: FFmpeg render failed during scene media preparation.: Could not read uploaded media for scene 1.",
    );
  });

  it("falls back to status message when server error body cannot be parsed", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "not-json",
    }) as typeof fetch;

    const client = createCompileService("https://example.com/api");

    await expect(client.compile(createPayload())).rejects.toThrow(
      "Compile request failed with status 500.",
    );
  });
});
