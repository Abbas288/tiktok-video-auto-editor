import { describe, expect, it } from "vitest";
import { CompilePayloadScene } from "../../domain/compilePayloadSchema";
import {
  buildSceneVideoFilter,
  buildVideoTransitionFilterGraph,
  createAssSubtitleFileContent,
  getEditorReferenceDimensions,
  getRenderDimensions,
} from "./ffmpegRenderPlan";

function createScene(
  overrides: Partial<CompilePayloadScene> = {},
): CompilePayloadScene {
  return {
    id: "scene-1",
    startSeconds: 0,
    durationSeconds: 4,
    textOverlays: [],
    effects: [],
    ...overrides,
  };
}

describe("ffmpegRenderPlan", () => {
  it("returns dimensions for each supported orientation", () => {
    expect(getRenderDimensions("landscape")).toEqual({
      width: 1280,
      height: 720,
    });
    expect(getRenderDimensions("portrait")).toEqual({
      width: 720,
      height: 1280,
    });
    expect(getRenderDimensions("square")).toEqual({
      width: 1080,
      height: 1080,
    });
  });

  it("returns fallback editor reference dimensions for each supported orientation", () => {
    expect(getEditorReferenceDimensions("landscape")).toEqual({
      width: 720,
      height: 405,
    });
    expect(getEditorReferenceDimensions("portrait")).toEqual({
      width: 405,
      height: 720,
    });
    expect(getEditorReferenceDimensions("square")).toEqual({
      width: 720,
      height: 720,
    });
  });

  it("builds scene filters with effects and subtitle overlay", () => {
    const filter = buildSceneVideoFilter({
      scene: createScene({
        effects: [
          { type: "brightness", value: 1.2 },
          { type: "contrast", value: 0.8 },
          { type: "zoom", intensity: 1.5, positionX: 0.25, positionY: 0.75 },
        ],
        textOverlays: [
          {
            id: "text-1",
            text: "Hello",
            positionX: 0.5,
            positionY: 0.5,
            fontSizePt: 24,
            color: "#FF0000",
            style: "bold",
            animationIn: "none",
            startSeconds: 0.5,
            durationSeconds: 2,
          },
        ],
      }),
      orientation: "landscape",
      subtitleFilePath: "C:\\tmp\\scene-0.ass",
    });

    expect(filter).toContain("setpts=PTS-STARTPTS");
    expect(filter).toContain("scale=1280:720");
    expect(filter).toContain("crop=1280:720");
    expect(filter).toContain("scale=1920:1080");
    expect(filter).toContain("eq=brightness=0.05:contrast=0.88");
    expect(filter).toContain("ass='C\\:/tmp/scene-0.ass'");
    expect(filter).toContain("format=yuv420p");
    expect(filter).not.toContain("drawtext=");
  });

  it("creates ASS subtitle content using payload layout lines", () => {
    const content = createAssSubtitleFileContent(
      createScene({
        textOverlays: [
          {
            id: "text-1",
            text: "This raw text should not be rewrapped if layout lines exist.",
            positionX: 0.5,
            positionY: 0.5,
            fontSizePt: 32,
            color: "#FF0000",
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
              lines: ["Line one", "Line two"],
            },
          },
        ],
      }),
      "landscape",
    );

    expect(content).toContain("[Script Info]");
    expect(content).toContain("PlayResX: 1280");
    expect(content).toContain("PlayResY: 720");
    expect(content).toContain("Dialogue:");
    expect(content).toContain("\\an5");
    expect(content).toContain("\\pos(640,360)");
    expect(content).toContain("\\fs59");
    expect(content).toContain("\\c&H0000FF&");
    expect(content).toContain("\\b1");
    expect(content).toContain("Line one\\NLine two");
  });

  it("falls back to wrapping when layout lines are not provided", () => {
    const content = createAssSubtitleFileContent(
      createScene({
        textOverlays: [
          {
            id: "text-1",
            text: "One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty one twenty two twenty three twenty four twenty five twenty six twenty seven.",
            positionX: 0.5,
            positionY: 0.5,
            fontSizePt: 32,
            color: "#FF0000",
            style: "bold",
            animationIn: "none",
            startSeconds: 0.5,
            durationSeconds: 2,
          },
        ],
      }),
      "landscape",
    );

    const dialogueLine = content
      .split("\n")
      .find((line) => line.startsWith("Dialogue:"));

    expect(dialogueLine).toBeDefined();
    expect(dialogueLine?.split("\\N").length).toBeGreaterThan(1);
    expect(dialogueLine?.split("\\N").length).toBeLessThanOrEqual(4);
  });

  it("clamps fixed text box center near media edges", () => {
    const content = createAssSubtitleFileContent(
      createScene({
        textOverlays: [
          {
            id: "text-1",
            text: "Left edge text",
            positionX: 0,
            positionY: 0.5,
            fontSizePt: 24,
            color: "#FFFFFF",
            style: "normal",
            animationIn: "none",
            startSeconds: 0,
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
              lines: ["Left edge text"],
            },
          },
        ],
      }),
      "landscape",
    );

    expect(content).toContain("\\pos(550,360)");
  });

  it("builds transition graph for multiple scenes", () => {
    const graph = buildVideoTransitionFilterGraph([
      createScene({
        id: "scene-1",
        durationSeconds: 4,
        transition: {
          type: "fade",
          durationSeconds: 0.3,
        },
      }),
      createScene({
        id: "scene-2",
        durationSeconds: 6,
        transition: {
          type: "slide",
          durationSeconds: 0.4,
          direction: "left",
        },
      }),
      createScene({
        id: "scene-3",
        durationSeconds: 2,
      }),
    ]);

    expect(graph.filterGraph).toContain("xfade=transition=fade");
    expect(graph.filterGraph).toContain("xfade=transition=slideleft");
    expect(graph.filterGraph).toContain("format=yuv420p[vout]");
    expect(graph.outputLabel).toBe("vout");
    expect(graph.outputDurationSeconds).toBeCloseTo(11.3);
  });

  it("uses concat for cut transitions", () => {
    const graph = buildVideoTransitionFilterGraph([
      createScene({
        id: "scene-1",
        durationSeconds: 4,
        transition: {
          type: "cut",
          durationSeconds: 0,
        },
      }),
      createScene({
        id: "scene-2",
        durationSeconds: 6,
      }),
    ]);

    expect(graph.filterGraph).toContain("concat=n=2:v=1:a=0");
    expect(graph.filterGraph).not.toContain("xfade");
    expect(graph.outputLabel).toBe("vout");
    expect(graph.outputDurationSeconds).toBe(10);
  });
});