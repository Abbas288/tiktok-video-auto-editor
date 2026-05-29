import { Scene } from "../../types/template";
import {
  DEFAULT_TRANSITION_DURATION_SECONDS,
  MAX_TRANSITION_DURATION_SECONDS,
  createTransition,
  getSceneTransition,
  getTransitionLabel,
  sanitizeTransition,
} from "./transitions";

function createSceneFixture(overrides: Partial<Scene> = {}): Scene {
  return {
    id: "scene-1",
    orderIndex: 0,
    startSeconds: 0,
    durationSeconds: 3,
    instruction: "First scene",
    textOverlays: [],
    effects: [],
    ...overrides,
  };
}

describe("transitions", () => {
  it("creates a cut transition with zero duration", () => {
    expect(createTransition("cut")).toEqual({
      type: "cut",
      durationSeconds: 0,
    });
  });

  it("creates a fade transition with default duration", () => {
    expect(createTransition("fade")).toEqual({
      type: "fade",
      durationSeconds: DEFAULT_TRANSITION_DURATION_SECONDS,
    });
  });

  it("creates a slide transition with default duration and direction", () => {
    expect(createTransition("slide")).toEqual({
      type: "slide",
      durationSeconds: DEFAULT_TRANSITION_DURATION_SECONDS,
      direction: "left",
    });
  });

  it("treats missing scene transition as cut", () => {
    const scene = createSceneFixture();

    expect(getSceneTransition(scene)).toEqual({
      type: "cut",
      durationSeconds: 0,
    });
  });

  it("sanitizes invalid fade duration", () => {
    expect(
      sanitizeTransition({
        type: "fade",
        durationSeconds: Number.NaN,
      }),
    ).toEqual({
      type: "fade",
      durationSeconds: DEFAULT_TRANSITION_DURATION_SECONDS,
    });
  });

  it("caps slower stored transition durations", () => {
    expect(
      sanitizeTransition({
        type: "fade",
        durationSeconds: 0.3,
      }),
    ).toEqual({
      type: "fade",
      durationSeconds: MAX_TRANSITION_DURATION_SECONDS,
    });
  });

  it("sanitizes slide transition while preserving valid direction", () => {
    expect(
      sanitizeTransition({
        type: "slide",
        durationSeconds: 0.5,
        direction: "up",
      }),
    ).toEqual({
      type: "slide",
      durationSeconds: MAX_TRANSITION_DURATION_SECONDS,
      direction: "up",
    });
  });

  it("returns transition labels", () => {
    expect(getTransitionLabel("cut")).toBe("Cut");
    expect(getTransitionLabel("fade")).toBe("Fade");
    expect(getTransitionLabel("slide")).toBe("Slide");
  });
});
