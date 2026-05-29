import { Scene, Transition } from "../../types/template";

export const DEFAULT_TRANSITION_DURATION_SECONDS = 0.18;
export const MIN_TRANSITION_DURATION_SECONDS = 0.1;
export const MAX_TRANSITION_DURATION_SECONDS = 0.2;

export const TRANSITION_TYPES: Transition["type"][] = ["cut", "fade", "slide"];

const TRANSITION_LABELS: Record<Transition["type"], string> = {
  cut: "Cut",
  fade: "Fade",
  slide: "Slide",
};

export function createTransition(type: Transition["type"]): Transition {
  if (type === "cut") {
    return {
      type,
      durationSeconds: 0,
    };
  }

  if (type === "slide") {
    return {
      type,
      durationSeconds: DEFAULT_TRANSITION_DURATION_SECONDS,
      direction: "left",
    };
  }

  return {
    type,
    durationSeconds: DEFAULT_TRANSITION_DURATION_SECONDS,
  };
}

export function getSceneTransition(scene: Scene): Transition {
  return sanitizeTransition(scene.transition);
}

export function getTransitionLabel(type: Transition["type"]): string {
  return TRANSITION_LABELS[type];
}

export function isTransitionType(value: unknown): value is Transition["type"] {
  return value === "cut" || value === "fade" || value === "slide";
}

export function sanitizeTransition(
  transition: Transition | undefined,
): Transition {
  if (!transition || !isTransitionType(transition.type)) {
    return createTransition("cut");
  }

  if (transition.type === "cut") {
    return createTransition("cut");
  }

  const durationSeconds = sanitizeTransitionDuration(
    transition.durationSeconds,
  );

  if (transition.type === "slide") {
    return {
      type: "slide",
      durationSeconds,
      direction: isTransitionDirection(transition.direction)
        ? transition.direction
        : "left",
    };
  }

  return {
    type: "fade",
    durationSeconds,
  };
}

function sanitizeTransitionDuration(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_TRANSITION_DURATION_SECONDS;
  }

  return clamp(
    value,
    MIN_TRANSITION_DURATION_SECONDS,
    MAX_TRANSITION_DURATION_SECONDS,
  );
}

function isTransitionDirection(
  value: unknown,
): value is NonNullable<Transition["direction"]> {
  return (
    value === "left" || value === "right" || value === "up" || value === "down"
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
