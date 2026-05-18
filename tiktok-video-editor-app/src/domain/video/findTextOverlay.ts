import { Scene, TextOverlay } from "../../types/template";

/**
 * Finds a text overlay and its owning scene.
 *
 * @param scenes Scenes to search through.
 * @param overlayId Target overlay ID.
 * @returns The owning scene and overlay, or null when not found.
 */
export function findTextOverlayById(
  scenes: Scene[],
  overlayId: string | null,
): { sceneId: string; overlay: TextOverlay } | null {
  if (!overlayId) {
    return null;
  }

  for (const scene of scenes) {
    const overlay = scene.textOverlays.find((item) => item.id === overlayId);

    if (overlay) {
      return {
        sceneId: scene.id,
        overlay,
      };
    }
  }

  return null;
}
