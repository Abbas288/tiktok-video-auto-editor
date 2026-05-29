import { Scene } from "../../types/template";
import { getPreviewSceneFilterValues } from "./previewSceneEffects";

function createScene(overrides: Partial<Scene> = {}): Scene {
  return {
    id: "scene-1",
    orderIndex: 0,
    startSeconds: 0,
    durationSeconds: 4,
    instruction: "Scene description",
    textOverlays: [],
    effects: [],
    ...overrides,
  };
}

describe("previewSceneEffects", () => {
  it("uses active scene effects before timeline fallback", () => {
    const result = getPreviewSceneFilterValues({
      scenes: [
        createScene({
          id: "scene-1",
          effects: [{ type: "brightness", value: 0.6 }],
        }),
        createScene({
          id: "scene-2",
          orderIndex: 1,
          startSeconds: 4,
          durationSeconds: 6,
          effects: [
            { type: "brightness", value: 1.4 },
            { type: "contrast", value: 1.3 },
            {
              type: "zoom",
              intensity: 1.5,
              positionX: 0.8,
              positionY: 0.2,
            },
          ],
        }),
      ],
      currentTime: 10,
      activeSceneId: "scene-2",
    });

    expect(result).toEqual({
      brightness: 1.4,
      contrast: 1.3,
      zoom: 1.5,
      zoomPositionX: 0.8,
      zoomPositionY: 0.2,
    });
  });

  it("falls back to current time when no active scene exists", () => {
    const result = getPreviewSceneFilterValues({
      scenes: [
        createScene({
          id: "scene-1",
          effects: [{ type: "brightness", value: 0.6 }],
        }),
        createScene({
          id: "scene-2",
          orderIndex: 1,
          startSeconds: 4,
          durationSeconds: 6,
          effects: [{ type: "contrast", value: 1.4 }],
        }),
      ],
      currentTime: 5,
      activeSceneId: null,
    });

    expect(result).toEqual({
      brightness: 1,
      contrast: 1.4,
      zoom: 1,
      zoomPositionX: 0.5,
      zoomPositionY: 0.5,
    });
  });

  it("returns default filter values when no matching scene exists", () => {
    const result = getPreviewSceneFilterValues({
      scenes: [],
      currentTime: 0,
      activeSceneId: "missing-scene",
    });

    expect(result).toEqual({
      brightness: 1,
      contrast: 1,
      zoom: 1,
      zoomPositionX: 0.5,
      zoomPositionY: 0.5,
    });
  });
});
