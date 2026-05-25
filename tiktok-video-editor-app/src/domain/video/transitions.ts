import { Scene, Transition } from "../../types/template";

export const DEFAULT_TRANSITION_DURATION_SECONDS = 0.3;

export const TRANSITION_TYPES: Transition["type"][] = ["cut", "fade", "slide"];

const TRANSITION_LABELS: Record<Transition["type"], string> = {
  cut: "Cut",
  fade: "Fade",
  slide: "Slide",
};

/**
 * Creates a normalized transition for a selected transition type.
 *
 * @param type Selected transition type.
 * @returns Transition data stored on a scene.
 */
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

/**
 * Returns the transition that should be shown for a scene.
 *
 * Missing transition data is treated as cut.
 *
 * @param scene Scene that owns the transition to the next scene.
 * @returns Safe transition value.
 */
export function getSceneTransition(scene: Scene): Transition {
  return sanitizeTransition(scene.transition);
}

/**
 * Returns a human-readable label for a transition type.
 *
 * @param type Transition type.
 * @returns Display label.
 */
export function getTransitionLabel(type: Transition["type"]): string {
  return TRANSITION_LABELS[type];
}

/**
 * Checks if a value is a supported transition type.
 *
 * @param value Unknown value.
 * @returns True when the value is supported.
 */
export function isTransitionType(value: unknown): value is Transition["type"] {
  return value === "cut" || value === "fade" || value === "slide";
}

/**
 * Sanitizes transition data from templates and drafts.
 *
 * @param transition Transition value to sanitize.
 * @returns Safe transition value.
 */
export function sanitizeTransition(
  transition: Transition | undefined,
): Transition {
  if (!transition || !isTransitionType(transition.type)) {
    return createTransition("cut");
  }

  if (transition.type === "cut") {
    return createTransition("cut");
  }

  const durationSeconds =
    Number.isFinite(transition.durationSeconds) &&
    transition.durationSeconds > 0
      ? transition.durationSeconds
      : DEFAULT_TRANSITION_DURATION_SECONDS;

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

function isTransitionDirection(
  value: unknown,
): value is NonNullable<Transition["direction"]> {
  return (
    value === "left" || value === "right" || value === "up" || value === "down"
  );
}
