import { Scene, Transition } from "../../types/template";
import { getSceneTransition } from "./transitions";

/**
 * Represents a transition preview state at the current playback time.
 */
export interface TransitionSimulation {
  type: Exclude<Transition["type"], "cut">;
  direction: NonNullable<Transition["direction"]>;
  progress: number;
  easedProgress: number;
  intensity: number;
  previewTimeSeconds: number;
  transitionKey: string;
}

const FADE_PREVIEW_DURATION_SECONDS = 1.15;

/**
 * Finds the active transition preview for the current playback time.
 *
 * @param scenes Ordered scene list.
 * @param currentTime Current playback time in seconds.
 * @returns Active transition preview state, or null when no transition is active.
 */
export function getActiveTransitionSimulation(
  scenes: Scene[],
  currentTime: number,
): TransitionSimulation | null {
  if (!Number.isFinite(currentTime) || scenes.length < 2) {
    return null;
  }

  for (let index = 0; index < scenes.length - 1; index += 1) {
    const currentScene = scenes[index];
    const nextScene = scenes[index + 1];
    const transition = getSceneTransition(currentScene);

    if (transition.type === "cut" || transition.durationSeconds <= 0) {
      continue;
    }

    const previewDurationSeconds = getPreviewDurationSeconds(transition);
    const cutPoint = currentScene.startSeconds + currentScene.durationSeconds;
    const transitionStart = cutPoint - previewDurationSeconds / 2;
    const transitionEnd = cutPoint + previewDurationSeconds / 2;

    if (currentTime < transitionStart || currentTime > transitionEnd) {
      continue;
    }

    const progress = clamp01(
      (currentTime - transitionStart) / previewDurationSeconds,
    );

    return {
      type: transition.type,
      direction: transition.direction ?? "left",
      progress,
      easedProgress: smootherStep(progress),
      intensity: getBellCurveIntensity(progress),
      previewTimeSeconds: getPreviewTimeSeconds(
        nextScene,
        previewDurationSeconds,
        progress,
      ),
      transitionKey: `${currentScene.id}:${nextScene.id}:${transition.type}`,
    };
  }

  return null;
}

function getPreviewDurationSeconds(transition: Transition): number {
  if (transition.type === "fade") {
    return Math.max(transition.durationSeconds, FADE_PREVIEW_DURATION_SECONDS);
  }

  return transition.durationSeconds;
}

function getPreviewTimeSeconds(
  nextScene: Scene,
  previewDurationSeconds: number,
  progress: number,
): number {
  return nextScene.startSeconds + previewDurationSeconds * clamp01(progress);
}

function smootherStep(value: number): number {
  const clampedValue = clamp01(value);

  return (
    clampedValue *
    clampedValue *
    clampedValue *
    (clampedValue * (clampedValue * 6 - 15) + 10)
  );
}

function getBellCurveIntensity(value: number): number {
  const clampedValue = clamp01(value);

  return 1 - Math.abs(clampedValue * 2 - 1);
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
}
