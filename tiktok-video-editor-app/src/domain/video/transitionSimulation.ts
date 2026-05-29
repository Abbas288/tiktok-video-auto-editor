import { Scene, Transition } from "../../types/template";
import { getSceneTransition } from "./transitions";

export interface TransitionSimulation {
  type: Exclude<Transition["type"], "cut">;
  direction: NonNullable<Transition["direction"]>;
  progress: number;
  easedProgress: number;
  intensity: number;
  previewTimeSeconds: number;
  transitionKey: string;
}

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

    const transitionDurationSeconds = transition.durationSeconds;
    const cutPoint = currentScene.startSeconds + currentScene.durationSeconds;
    const transitionStart = cutPoint - transitionDurationSeconds / 2;
    const transitionEnd = cutPoint + transitionDurationSeconds / 2;

    if (currentTime < transitionStart || currentTime > transitionEnd) {
      continue;
    }

    const progress = clamp01(
      (currentTime - transitionStart) / transitionDurationSeconds,
    );

    return {
      type: transition.type,
      direction: transition.direction ?? "left",
      progress,
      easedProgress: easeInOutCubic(progress),
      intensity: getBellCurveIntensity(progress),
      previewTimeSeconds: getPreviewTimeSeconds(
        nextScene,
        transitionDurationSeconds,
        progress,
      ),
      transitionKey: `${currentScene.id}:${nextScene.id}:${transition.type}`,
    };
  }

  return null;
}

function getPreviewTimeSeconds(
  nextScene: Scene,
  transitionDurationSeconds: number,
  progress: number,
): number {
  return nextScene.startSeconds + transitionDurationSeconds * clamp01(progress);
}

function easeInOutCubic(value: number): number {
  const t = clamp01(value);

  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getBellCurveIntensity(value: number): number {
  const t = clamp01(value);
  const linearBell = 1 - Math.abs(t * 2 - 1);

  return linearBell * linearBell * (3 - 2 * linearBell);
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
}
