import { describe, expect, it } from "vitest";
import {
  CompilePayloadValidationError,
  parseCompilePayload,
} from "./compilePayloadSchema";

function createValidPayload(): Record<string, unknown> {
  return {
    templateId: "bunny-intro-2026",
    sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    orientation: "landscape",
    originalVolume: 0.8,
    music: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      volume: 0.4,
      beatSync: false,
    },
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 4,
        instruction: "First scene",
        transition: {
          type: "fade",
          durationSeconds: 0.3,
        },
        textOverlays: [
          {
            id: "text-1",
            text: "Hello",
            positionX: 0.5,
            positionY: 0.5,
            fontSizePt: 24,
            color: "#FFFFFF",
            style: "normal",
            animationIn: "none",
            startSeconds: 0,
            durationSeconds: 2,
          },
        ],
        effects: [
          {
            type: "brightness",
            value: 1.2,
          },
          {
            type: "zoom",
            intensity: 1.4,
            positionX: 0.7,
            positionY: 0.3,
          },
        ],
      },
    ],
  };
}

describe("compilePayloadSchema", () => {
  it("parses a valid compile payload", () => {
    const payload = parseCompilePayload(createValidPayload());

    expect(payload.templateId).toBe("bunny-intro-2026");
    expect(payload.sourceVideoUrl).toBe(
      "https://www.w3schools.com/html/mov_bbb.mp4",
    );
    expect(payload.orientation).toBe("landscape");
    expect(payload.scenes).toHaveLength(1);
    expect(payload.scenes[0].transition?.type).toBe("fade");
    expect(payload.scenes[0].textOverlays).toHaveLength(1);
    expect(payload.scenes[0].effects).toHaveLength(2);
  });

  it("supports older id and videoUrl aliases", () => {
    const payload = parseCompilePayload({
      id: "legacy-template",
      videoUrl: "https://example.com/source.mp4",
      scenes: [
        {
          id: "scene-1",
          startSeconds: 0,
          durationSeconds: 3,
        },
      ],
    });

    expect(payload.templateId).toBe("legacy-template");
    expect(payload.sourceVideoUrl).toBe("https://example.com/source.mp4");
  });

  it("defaults missing optional fields", () => {
    const payload = parseCompilePayload({
      templateId: "template-1",
      sourceVideoUrl: "https://example.com/source.mp4",
      scenes: [
        {
          id: "scene-1",
          startSeconds: 0,
          durationSeconds: 3,
        },
      ],
    });

    expect(payload.orientation).toBe("landscape");
    expect(payload.scenes[0].textOverlays).toEqual([]);
    expect(payload.scenes[0].effects).toEqual([]);
  });

  it("rejects missing template id", () => {
    expect(() =>
      parseCompilePayload({
        sourceVideoUrl: "https://example.com/source.mp4",
        scenes: [
          {
            id: "scene-1",
            startSeconds: 0,
            durationSeconds: 3,
          },
        ],
      }),
    ).toThrow(CompilePayloadValidationError);
  });

  it("rejects empty scenes", () => {
    expect(() =>
      parseCompilePayload({
        templateId: "template-1",
        sourceVideoUrl: "https://example.com/source.mp4",
        scenes: [],
      }),
    ).toThrow(CompilePayloadValidationError);
  });

  it("rejects invalid volume values", () => {
    expect(() =>
      parseCompilePayload({
        ...createValidPayload(),
        originalVolume: 2,
      }),
    ).toThrow(CompilePayloadValidationError);
  });
});
