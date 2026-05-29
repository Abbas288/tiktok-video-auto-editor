import { Scene, Template } from "../../types/template";
import {
  getSceneAtTimelineTime,
  getScenePreviewPlaybackSource,
  getTemplateDurationSeconds,
  getTransitionPreviewPlaybackSource,
} from "./scenePreviewTimeline";

function createScene(id: string, index: number, hasVideo: boolean): Scene {
  return {
    id,
    orderIndex: index,
    startSeconds: index === 0 ? 0 : 4,
    durationSeconds: index === 0 ? 4 : 6,
    instruction: `Scene ${index + 1}`,
    textOverlays: [],
    effects: [],
    videoSource: hasVideo
      ? {
          type: "user",
          localUri: `file:///scene-${index + 1}.mp4`,
          uploadUrl: `http://localhost:3030/assets/videos/scene-${index + 1}.mp4`,
          fileName: `scene-${index + 1}.mp4`,
          originalDurationSeconds: 8,
          sourceStartSeconds: 1.5,
          durationSeconds: index === 0 ? 4 : 6,
        }
      : undefined,
  };
}

function createTemplate(scenes: Scene[]): Template {
  return {
    id: "template-1",
    title: "Template",
    sourceVideoUrl: "https://example.com/source.mp4",
    orientation: "landscape",
    scenes,
  };
}

describe("scenePreviewTimeline", () => {
  it("calculates total template duration", () => {
    expect(
      getTemplateDurationSeconds([
        createScene("scene-1", 0, true),
        createScene("scene-2", 1, true),
      ]),
    ).toBe(10);
  });

  it("finds active scene from timeline time", () => {
    const scenes = [
      createScene("scene-1", 0, true),
      createScene("scene-2", 1, true),
    ];

    expect(getSceneAtTimelineTime(scenes, 0)?.id).toBe("scene-1");
    expect(getSceneAtTimelineTime(scenes, 4)?.id).toBe("scene-2");
  });

  it("returns null when any scene video is missing", () => {
    const template = createTemplate([
      createScene("scene-1", 0, true),
      createScene("scene-2", 1, false),
    ]);

    expect(getScenePreviewPlaybackSource(template, 0)).toBeNull();
  });

  it("returns selected scene video when all scenes are ready", () => {
    const template = createTemplate([
      createScene("scene-1", 0, true),
      createScene("scene-2", 1, true),
    ]);

    const result = getScenePreviewPlaybackSource(template, 5);

    expect(result?.scene.id).toBe("scene-2");
    expect(result?.videoUrl).toBe("file:///scene-2.mp4");
    expect(result?.sourceStartSeconds).toBe(1.5);
    expect(result?.sourceEndSeconds).toBe(7.5);
  });

  it("maps transition preview to the incoming scene selected clip", () => {
    const template = createTemplate([
      createScene("scene-1", 0, true),
      createScene("scene-2", 1, true),
    ]);

    const result = getTransitionPreviewPlaybackSource(template, {
      type: "slide",
      direction: "left",
      progress: 0.5,
      easedProgress: 0.5,
      intensity: 1,
      previewTimeSeconds: 4.2,
      transitionKey: "scene-1:scene-2:slide",
    });

    expect(result?.videoUrl).toBe("file:///scene-2.mp4");
    expect(result?.sourcePreviewTimeSeconds).toBeCloseTo(1.7);
  });

  it("returns null for transition preview when incoming scene video is missing", () => {
    const template = createTemplate([
      createScene("scene-1", 0, true),
      createScene("scene-2", 1, false),
    ]);

    const result = getTransitionPreviewPlaybackSource(template, {
      type: "slide",
      direction: "left",
      progress: 0.5,
      easedProgress: 0.5,
      intensity: 1,
      previewTimeSeconds: 4.2,
      transitionKey: "scene-1:scene-2:slide",
    });

    expect(result).toBeNull();
  });

  it("returns null for transition preview when transition key does not match", () => {
    const template = createTemplate([
      createScene("scene-1", 0, true),
      createScene("scene-2", 1, true),
    ]);

    const result = getTransitionPreviewPlaybackSource(template, {
      type: "slide",
      direction: "left",
      progress: 0.5,
      easedProgress: 0.5,
      intensity: 1,
      previewTimeSeconds: 4.2,
      transitionKey: "missing:scene-2:slide",
    });

    expect(result).toBeNull();
  });
});
