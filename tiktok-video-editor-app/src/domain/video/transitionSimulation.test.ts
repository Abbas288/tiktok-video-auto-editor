import { Scene } from "../../types/template";
import { DEFAULT_TRANSITION_DURATION_SECONDS } from "./transitions";
import { getActiveTransitionSimulation } from "./transitionSimulation";

function createScenes(): Scene[] {
  return [
    {
      id: "scene-1",
      orderIndex: 0,
      startSeconds: 0,
      durationSeconds: 3,
      instruction: "First scene",
      transition: {
        type: "fade",
        durationSeconds: DEFAULT_TRANSITION_DURATION_SECONDS,
      },
      textOverlays: [],
      effects: [],
    },
    {
      id: "scene-2",
      orderIndex: 1,
      startSeconds: 3,
      durationSeconds: 4,
      instruction: "Second scene",
      textOverlays: [],
      effects: [],
    },
  ];
}

describe("transitionSimulation", () => {
  it("returns null when time is outside transition window", () => {
    expect(getActiveTransitionSimulation(createScenes(), 2)).toBeNull();
  });

  it("returns fade simulation inside transition window", () => {
    const result = getActiveTransitionSimulation(createScenes(), 3);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("fade");
    expect(result?.direction).toBe("left");
    expect(result?.progress).toBeCloseTo(0.5, 5);
    expect(result?.easedProgress).toBeCloseTo(0.5, 5);
    expect(result?.intensity).toBeCloseTo(1, 5);
    expect(result?.previewTimeSeconds).toBeCloseTo(
      3 + DEFAULT_TRANSITION_DURATION_SECONDS / 2,
      5,
    );
    expect(result?.transitionKey).toBe("scene-1:scene-2:fade");
  });

  it("returns null for cut transitions", () => {
    const scenes = createScenes();
    scenes[0].transition = {
      type: "cut",
      durationSeconds: 0,
    };

    expect(getActiveTransitionSimulation(scenes, 3)).toBeNull();
  });

  it("returns slide direction when slide transition is active", () => {
    const scenes = createScenes();
    scenes[0].transition = {
      type: "slide",
      durationSeconds: DEFAULT_TRANSITION_DURATION_SECONDS,
      direction: "left",
    };

    const result = getActiveTransitionSimulation(scenes, 3);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("slide");
    expect(result?.direction).toBe("left");
    expect(result?.progress).toBeCloseTo(0.5, 5);
    expect(result?.easedProgress).toBeCloseTo(0.5, 5);
    expect(result?.intensity).toBeCloseTo(1, 5);
    expect(result?.previewTimeSeconds).toBeCloseTo(
      3 + DEFAULT_TRANSITION_DURATION_SECONDS / 2,
      5,
    );
    expect(result?.transitionKey).toBe("scene-1:scene-2:slide");
  });

  it("returns null for invalid playback time", () => {
    expect(
      getActiveTransitionSimulation(createScenes(), Number.NaN),
    ).toBeNull();
  });
});
