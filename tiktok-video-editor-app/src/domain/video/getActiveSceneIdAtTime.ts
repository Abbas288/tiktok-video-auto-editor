import { Scene } from "../../types/template";

type SceneTiming = Pick<Scene, "id" | "startSeconds" | "durationSeconds">;

/**
 * Finds the active scene for a playback time.
 *
 * @param scenes Scenes with timing data.
 * @param currentTime Current playback time in seconds.
 * @returns Active scene id, or null if no scene matches.
 */
export function getActiveSceneIdAtTime(
  scenes: SceneTiming[],
  currentTime: number,
): string | null {
  if (!Number.isFinite(currentTime)) {
    return null;
  }

  const matchedScene = scenes.find(
    (scene) =>
      currentTime >= scene.startSeconds &&
      currentTime < scene.startSeconds + scene.durationSeconds,
  );

  return matchedScene?.id ?? null;
}
