import {
  Template,
  Scene,
  Orientation,
  Music,
  Transition,
} from "../types/template";

/**
 * Parses and validates unknown input data into a typed Template object.
 *
 * @param input Raw template data.
 * @returns Validated template.
 * @throws If the data is malformed.
 */
export function parseTemplate(input: unknown): Template {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid template data: input is not an object");
  }

  const record = input as Record<string, unknown>;

  if (typeof record.id !== "string") {
    throw new Error("Missing or invalid field: id");
  }

  if (typeof record.title !== "string") {
    throw new Error("Missing or invalid field: title");
  }

  if (typeof record.sourceVideoUrl !== "string") {
    throw new Error("Missing or invalid field: sourceVideoUrl");
  }

  const sourceVideoUrl = record.sourceVideoUrl.trim();

  if (!sourceVideoUrl) {
    throw new Error("Missing or invalid field: sourceVideoUrl");
  }

  const validOrientations: Orientation[] = ["portrait", "landscape", "square"];

  if (
    typeof record.orientation !== "string" ||
    !validOrientations.includes(record.orientation as Orientation)
  ) {
    throw new Error("Missing or invalid field: orientation");
  }

  if (!Array.isArray(record.scenes)) {
    throw new Error("Missing or invalid field: scenes must be an array");
  }

  return {
    id: record.id,
    title: record.title,
    sourceVideoUrl,
    orientation: record.orientation as Orientation,
    originalVolume: parseOptionalVolume(record.originalVolume),
    music: parseMusic(record.music),
    scenes: parseScenes(record.scenes),
  };
}

function parseScenes(sceneInputs: unknown[]): Scene[] {
  return sceneInputs.map((sceneInput, index) => {
    if (!sceneInput || typeof sceneInput !== "object") {
      throw new Error(`Invalid scene at index ${index}`);
    }

    const sceneRecord = sceneInput as Record<string, unknown>;

    if (typeof sceneRecord.id !== "string") {
      throw new Error(`Scene ${index} missing id`);
    }

    if (typeof sceneRecord.startSeconds !== "number") {
      throw new Error(`Scene ${index} missing startSeconds`);
    }

    if (typeof sceneRecord.durationSeconds !== "number") {
      throw new Error(`Scene ${index} missing durationSeconds`);
    }

    if (sceneRecord.startSeconds < 0 || sceneRecord.durationSeconds <= 0) {
      throw new Error(`Scene ${index} has invalid timing`);
    }

    return {
      id: sceneRecord.id,
      orderIndex:
        typeof sceneRecord.orderIndex === "number"
          ? sceneRecord.orderIndex
          : index,
      startSeconds: sceneRecord.startSeconds,
      durationSeconds: sceneRecord.durationSeconds,
      instruction:
        typeof sceneRecord.instruction === "string"
          ? sceneRecord.instruction
          : "",
      transition: parseTransition(sceneRecord.transition),
      textOverlays: Array.isArray(sceneRecord.textOverlays)
        ? sceneRecord.textOverlays
        : [],
      effects: Array.isArray(sceneRecord.effects) ? sceneRecord.effects : [],
    };
  });
}

function parseTransition(value: unknown): Transition | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (!isTransitionType(value.type)) {
    return undefined;
  }

  if (typeof value.durationSeconds !== "number" || value.durationSeconds < 0) {
    return undefined;
  }

  return {
    type: value.type,
    durationSeconds: value.durationSeconds,
    direction: isTransitionDirection(value.direction)
      ? value.direction
      : undefined,
  };
}

function parseMusic(value: unknown): Music | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (typeof value.url !== "string") {
    return undefined;
  }

  const url = value.url.trim();

  if (!url) {
    return undefined;
  }

  return {
    url,
    volume: parseOptionalVolume(value.volume) ?? 1,
    beatSync: typeof value.beatSync === "boolean" ? value.beatSync : false,
  };
}

function parseOptionalVolume(value: unknown): number | undefined {
  if (typeof value !== "number") {
    return undefined;
  }

  return clamp01(value);
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

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(Math.max(value, 0), 1);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
