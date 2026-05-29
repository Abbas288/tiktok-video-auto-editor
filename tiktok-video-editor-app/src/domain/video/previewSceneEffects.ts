import { Scene } from "../../types/template";
import {
  getSceneEffectsAtTime,
  getSceneFilterValues,
  SceneFilterValues,
} from "./sceneEffects";

export interface PreviewSceneFilterOptions {
  scenes: Scene[];
  currentTime: number;
  activeSceneId: string | null;
}

export function getPreviewSceneFilterValues({
  scenes,
  currentTime,
  activeSceneId,
}: PreviewSceneFilterOptions): SceneFilterValues {
  const activeScene = activeSceneId
    ? scenes.find((scene) => scene.id === activeSceneId)
    : null;

  if (activeScene) {
    return getSceneFilterValues(activeScene.effects);
  }

  return getSceneFilterValues(getSceneEffectsAtTime(scenes, currentTime));
}
