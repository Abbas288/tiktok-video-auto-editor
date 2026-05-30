import { parseTemplate } from "../parseTemplate";
import { Template, Transition } from "../../types/template";

export class TemplateImportValidationError extends Error {
  public readonly details: string[];

  public constructor(details: string[]) {
    super("Template import validation failed.");
    this.name = "TemplateImportValidationError";
    this.details = details;
  }
}

export function parseImportedTemplate(input: unknown): Template {
  const details = getTemplateImportValidationDetails(input);

  if (details.length > 0) {
    throw new TemplateImportValidationError(details);
  }

  try {
    return parseTemplate(input);
  } catch (error) {
    throw new TemplateImportValidationError([
      error instanceof Error ? error.message : "Template data is invalid.",
    ]);
  }
}

export function getTemplateImportValidationDetails(input: unknown): string[] {
  const details: string[] = [];

  if (!isRecord(input)) {
    return ["Template root must be a JSON object."];
  }

  validateRequiredString(input.id, "id", details);
  validateRequiredString(input.title, "title", details);
  validateRequiredString(input.sourceVideoUrl, "sourceVideoUrl", details);

  if (!isOrientation(input.orientation)) {
    details.push("orientation must be portrait, landscape or square.");
  }

  if (
    input.originalVolume !== undefined &&
    !isFiniteNumber(input.originalVolume)
  ) {
    details.push("originalVolume must be a number when provided.");
  }

  validateMusic(input.music, details);
  validateScenes(input.scenes, details);

  return details;
}

function validateScenes(value: unknown, details: string[]): void {
  if (!Array.isArray(value)) {
    details.push("scenes must be an array.");
    return;
  }

  if (value.length === 0) {
    details.push("scenes must contain at least one scene.");
    return;
  }

  value.forEach((scene, index) => {
    const path = `scenes[${index}]`;

    if (!isRecord(scene)) {
      details.push(`${path} must be an object.`);
      return;
    }

    validateRequiredString(scene.id, `${path}.id`, details);

    if (!isFiniteNumber(scene.orderIndex)) {
      details.push(`${path}.orderIndex must be a number.`);
    }

    if (!isFiniteNumber(scene.startSeconds) || scene.startSeconds < 0) {
      details.push(`${path}.startSeconds must be zero or greater.`);
    }

    if (!isFiniteNumber(scene.durationSeconds) || scene.durationSeconds <= 0) {
      details.push(`${path}.durationSeconds must be a positive number.`);
    }

    validateRequiredString(scene.instruction, `${path}.instruction`, details);
    validateTransition(scene.transition, `${path}.transition`, details);
    validateTextOverlays(scene.textOverlays, `${path}.textOverlays`, details);
    validateEffects(scene.effects, `${path}.effects`, details);
  });
}

function validateTextOverlays(
  value: unknown,
  path: string,
  details: string[],
): void {
  if (!Array.isArray(value)) {
    details.push(`${path} must be an array.`);
    return;
  }

  value.forEach((overlay, index) => {
    const overlayPath = `${path}[${index}]`;

    if (!isRecord(overlay)) {
      details.push(`${overlayPath} must be an object.`);
      return;
    }

    validateRequiredString(overlay.id, `${overlayPath}.id`, details);

    if (typeof overlay.text !== "string") {
      details.push(`${overlayPath}.text must be a string.`);
    }

    validateNormalizedNumber(
      overlay.positionX,
      `${overlayPath}.positionX`,
      details,
    );
    validateNormalizedNumber(
      overlay.positionY,
      `${overlayPath}.positionY`,
      details,
    );

    if (!isFiniteNumber(overlay.fontSizePt) || overlay.fontSizePt <= 0) {
      details.push(`${overlayPath}.fontSizePt must be a positive number.`);
    }

    validateRequiredString(overlay.color, `${overlayPath}.color`, details);

    if (!isTextStyle(overlay.style)) {
      details.push(`${overlayPath}.style must be normal, bold or italic.`);
    }

    if (!isAnimationIn(overlay.animationIn)) {
      details.push(
        `${overlayPath}.animationIn must be none, fadeUp or fadeIn.`,
      );
    }

    if (!isFiniteNumber(overlay.startSeconds) || overlay.startSeconds < 0) {
      details.push(`${overlayPath}.startSeconds must be zero or greater.`);
    }

    if (
      !isFiniteNumber(overlay.durationSeconds) ||
      overlay.durationSeconds <= 0
    ) {
      details.push(`${overlayPath}.durationSeconds must be a positive number.`);
    }
  });
}

function validateEffects(
  value: unknown,
  path: string,
  details: string[],
): void {
  if (!Array.isArray(value)) {
    details.push(`${path} must be an array.`);
    return;
  }

  value.forEach((effect, index) => {
    const effectPath = `${path}[${index}]`;

    if (!isRecord(effect)) {
      details.push(`${effectPath} must be an object.`);
      return;
    }

    if (!isEffectType(effect.type)) {
      details.push(
        `${effectPath}.type must be zoom, brightness, contrast or blur.`,
      );
      return;
    }

    if (effect.type === "zoom") {
      if (effect.intensity !== undefined && !isFiniteNumber(effect.intensity)) {
        details.push(`${effectPath}.intensity must be a number.`);
      }

      if (effect.positionX !== undefined && !isFiniteNumber(effect.positionX)) {
        details.push(`${effectPath}.positionX must be a number.`);
      }

      if (effect.positionY !== undefined && !isFiniteNumber(effect.positionY)) {
        details.push(`${effectPath}.positionY must be a number.`);
      }

      return;
    }

    if (effect.value !== undefined && !isFiniteNumber(effect.value)) {
      details.push(`${effectPath}.value must be a number.`);
    }
  });
}

function validateTransition(
  value: unknown,
  path: string,
  details: string[],
): void {
  if (value === undefined) {
    return;
  }

  if (!isRecord(value)) {
    details.push(`${path} must be an object when provided.`);
    return;
  }

  if (!isTransitionType(value.type)) {
    details.push(`${path}.type must be cut, fade or slide.`);
    return;
  }

  if (!isFiniteNumber(value.durationSeconds) || value.durationSeconds < 0) {
    details.push(`${path}.durationSeconds must be zero or greater.`);
  }

  if (
    value.direction !== undefined &&
    !isTransitionDirection(value.direction)
  ) {
    details.push(`${path}.direction must be left, right, up or down.`);
  }
}

function validateMusic(value: unknown, details: string[]): void {
  if (value === undefined) {
    return;
  }

  if (!isRecord(value)) {
    details.push("music must be an object when provided.");
    return;
  }

  validateRequiredString(value.url, "music.url", details);

  if (!isFiniteNumber(value.volume)) {
    details.push("music.volume must be a number.");
  }

  if (typeof value.beatSync !== "boolean") {
    details.push("music.beatSync must be a boolean.");
  }
}

function validateRequiredString(
  value: unknown,
  path: string,
  details: string[],
): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    details.push(`${path} is required.`);
  }
}

function validateNormalizedNumber(
  value: unknown,
  path: string,
  details: string[],
): void {
  if (!isFiniteNumber(value) || value < 0 || value > 1) {
    details.push(`${path} must be a number between 0 and 1.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOrientation(value: unknown): value is Template["orientation"] {
  return value === "portrait" || value === "landscape" || value === "square";
}

function isTransitionType(value: unknown): value is Transition["type"] {
  return value === "cut" || value === "fade" || value === "slide";
}

function isTransitionDirection(
  value: unknown,
): value is NonNullable<Transition["direction"]> {
  return (
    value === "left" || value === "right" || value === "up" || value === "down"
  );
}

function isTextStyle(
  value: unknown,
): value is Template["scenes"][number]["textOverlays"][number]["style"] {
  return value === "normal" || value === "bold" || value === "italic";
}

function isAnimationIn(
  value: unknown,
): value is Template["scenes"][number]["textOverlays"][number]["animationIn"] {
  return value === "none" || value === "fadeUp" || value === "fadeIn";
}

function isEffectType(
  value: unknown,
): value is Template["scenes"][number]["effects"][number]["type"] {
  return (
    value === "zoom" ||
    value === "brightness" ||
    value === "contrast" ||
    value === "blur"
  );
}
