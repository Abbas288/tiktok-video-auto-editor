import { Template, Scene, Orientation } from "../types/template";

/**
 * Parses and validates unknown input data into a typed Template object.
 * Ensures all required fields exist and that scene timings are logical.
 *
 * @param {unknown} input - The raw data to parse (e.g., from an API or JSON file).
 * @returns {Template} A validated and normalized Template object.
 * @throws {Error} If the data is malformed or validation fails.
 */
export function parseTemplate(input: unknown): Template {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid template data: input is not an object");
  }

  const record = input as Record<string, unknown>;

  if (typeof record.id !== "string")
    throw new Error("Missing or invalid field: id");
  if (typeof record.title !== "string")
    throw new Error("Missing or invalid field: title");
  if (typeof record.sourceVideoUrl !== "string")
    throw new Error("Missing or invalid field: sourceVideoUrl");

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

  const parsedScenes: Scene[] = record.scenes.map((sceneInput, index) => {
    if (!sceneInput || typeof sceneInput !== "object") {
      throw new Error(`Invalid scene at index ${index}`);
    }

    const s = sceneInput as Record<string, unknown>;

    if (typeof s.id !== "string") throw new Error(`Scene ${index} missing id`);
    if (typeof s.startSeconds !== "number")
      throw new Error(`Scene ${index} missing startSeconds`);
    if (typeof s.durationSeconds !== "number")
      throw new Error(`Scene ${index} missing durationSeconds`);

    if (s.startSeconds < 0 || s.durationSeconds <= 0) {
      throw new Error(`Scene ${index} has invalid timing`);
    }

    return {
      id: s.id,
      orderIndex: typeof s.orderIndex === "number" ? s.orderIndex : index,
      startSeconds: s.startSeconds,
      durationSeconds: s.durationSeconds,
      instruction: typeof s.instruction === "string" ? s.instruction : "",
      textOverlays: Array.isArray(s.textOverlays) ? s.textOverlays : [],
      effects: Array.isArray(s.effects) ? s.effects : [],
    };
  });

  return {
    id: record.id,
    title: record.title,
    sourceVideoUrl: record.sourceVideoUrl,
    orientation: record.orientation as Orientation,
    scenes: parsedScenes,
  };
}
