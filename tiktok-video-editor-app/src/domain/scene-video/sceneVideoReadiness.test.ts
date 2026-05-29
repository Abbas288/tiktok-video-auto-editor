import { Scene } from "../../types/template";
import {
  getSceneUploadMetadata,
  getSceneVideoReadiness,
} from "./sceneVideoReadiness";

function createScene(overrides: Partial<Scene> = {}): Scene {
  return {
    id: "scene-1",
    orderIndex: 0,
    startSeconds: 0,
    durationSeconds: 4,
    instruction: "Butterfly flies above a giant bunny",
    textOverlays: [],
    effects: [],
    ...overrides,
  };
}

function createApprovedScene(overrides: Partial<Scene> = {}): Scene {
  return createScene({
    videoSource: {
      type: "user",
      localUri: "file:///scene-clip.mp4",
      uploadUrl: "http://localhost:3030/assets/videos/scene-clip.mp4",
      fileName: "scene-clip.mp4",
      originalDurationSeconds: 8,
      sourceStartSeconds: 1,
      durationSeconds: 4,
    },
    ...overrides,
  });
}

describe("sceneVideoReadiness", () => {
  it("marks scene videos as incomplete when at least one scene is missing video", () => {
    const scenes = [
      createApprovedScene({
        id: "scene-1",
        orderIndex: 0,
      }),
      createScene({
        id: "scene-2",
        orderIndex: 1,
        startSeconds: 4,
        durationSeconds: 6,
      }),
    ];

    const result = getSceneVideoReadiness(scenes);

    expect(result.readyCount).toBe(1);
    expect(result.totalCount).toBe(2);
    expect(result.isReadyForCompile).toBe(false);
    expect(result.missingScenes).toHaveLength(1);
    expect(result.firstMissingScene?.id).toBe("scene-2");
  });

  it("marks scene videos as ready when all scenes have approved videos", () => {
    const scenes = [
      createApprovedScene({
        id: "scene-1",
        orderIndex: 0,
      }),
      createApprovedScene({
        id: "scene-2",
        orderIndex: 1,
        startSeconds: 4,
        durationSeconds: 6,
      }),
    ];

    const result = getSceneVideoReadiness(scenes);

    expect(result.readyCount).toBe(2);
    expect(result.totalCount).toBe(2);
    expect(result.isReadyForCompile).toBe(true);
    expect(result.missingScenes).toEqual([]);
    expect(result.firstMissingScene).toBeNull();
  });

  it("returns compact metadata for scene upload cards", () => {
    const scene = createScene({
      id: "scene-2",
      orderIndex: 1,
      durationSeconds: 6,
      instruction:
        "The bunny follows the butterfly until it lands on a flower.",
    });

    const metadata = getSceneUploadMetadata(scene);

    expect(metadata).toEqual({
      title: "Scene 2",
      description:
        "The bunny follows the butterfly until it lands on a flower.",
      durationLabel: "6.0s",
    });
  });

  it("uses fallback description when scene instruction is empty", () => {
    const scene = createScene({
      instruction: "",
    });

    const metadata = getSceneUploadMetadata(scene);

    expect(metadata.description).toBe("No description.");
  });
});
