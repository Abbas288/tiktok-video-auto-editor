import { Template } from "../../types/template";
import { MAX_TRANSITION_DURATION_SECONDS } from "../video/transitions";
import { buildCompilePayload } from "./compilePayload";

function createTemplateFixture(): Template {
  return {
    id: "bunny-intro-2026",
    title: "The Bunny and the Butterfly",
    sourceVideoUrl: "https://example.com/video.mp4",
    orientation: "landscape",
    originalVolume: 0.7,
    music: {
      url: "https://example.com/music.mp3",
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
            text: "Edited text",
            positionX: 0.2,
            positionY: 0.3,
            fontSizePt: 24,
            color: "#FFFFFF",
            style: "bold",
            animationIn: "none",
            startSeconds: 0.5,
            durationSeconds: 2,
          },
        ],
        effects: [
          { type: "brightness", value: 1.2 },
          { type: "zoom", intensity: 1.4, positionX: 0.7, positionY: 0.3 },
        ],
      },
      {
        id: "scene-2",
        orderIndex: 1,
        startSeconds: 4,
        durationSeconds: 6,
        instruction: "Second scene",
        textOverlays: [],
        effects: [],
      },
    ],
  };
}

describe("buildCompilePayload", () => {
  it("creates a compile payload from the current edited template", () => {
    const payload = buildCompilePayload(createTemplateFixture());

    expect(payload).toEqual({
      templateId: "bunny-intro-2026",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "landscape",
      originalVolume: 0.7,
      music: {
        url: "https://example.com/music.mp3",
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
            durationSeconds: MAX_TRANSITION_DURATION_SECONDS,
          },
          textOverlays: [
            {
              id: "text-1",
              text: "Edited text",
              positionX: 0.2,
              positionY: 0.3,
              fontSizePt: 24,
              color: "#FFFFFF",
              style: "bold",
              animationIn: "none",
              startSeconds: 0.5,
              durationSeconds: 2,
              layout: {
                anchor: "center",
                textAlign: "center",
                referenceWidth: 720,
                referenceHeight: 405,
                boxWidthRatio: 0.86,
                maxLines: 4,
                lineHeightRatio: 1.15,
                paddingXRatio: 0.012,
                paddingYRatio: 0.007,
                minFontRatio: 0.028,
                maxFontRatio: 0.12,
                lines: ["Edited text"],
              },
            },
          ],
          effects: [
            { type: "brightness", value: 1.2 },
            { type: "zoom", intensity: 1.4, positionX: 0.7, positionY: 0.3 },
          ],
        },
        {
          id: "scene-2",
          orderIndex: 1,
          startSeconds: 4,
          durationSeconds: 6,
          instruction: "Second scene",
          transition: {
            type: "cut",
            durationSeconds: 0,
          },
          textOverlays: [],
          effects: [],
        },
      ],
    });
  });

  it("adds export-safe wrapped lines for long overlay text", () => {
    const template = createTemplateFixture();

    template.scenes[0].textOverlays[0].text =
      "One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty.";

    const payload = buildCompilePayload(template);
    const overlay = payload.scenes[0].textOverlays[0];

    expect(overlay.layout.lines.length).toBeGreaterThan(1);
    expect(overlay.layout.lines.length).toBeLessThanOrEqual(4);
  });
});
