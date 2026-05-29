import { Scene } from "../../types/template";

export interface SceneVideoReadiness {
  totalCount: number;
  readyCount: number;
  missingScenes: Scene[];
  firstMissingScene: Scene | null;
  isReadyForCompile: boolean;
}

export interface SceneUploadMetadata {
  title: string;
  description: string;
  durationLabel: string;
}

export function getSceneVideoReadiness(scenes: Scene[]): SceneVideoReadiness {
  const missingScenes = scenes.filter((scene) => !scene.videoSource);

  return {
    totalCount: scenes.length,
    readyCount: scenes.length - missingScenes.length,
    missingScenes,
    firstMissingScene: missingScenes[0] ?? null,
    isReadyForCompile: scenes.length > 0 && missingScenes.length === 0,
  };
}

export function getSceneUploadMetadata(scene: Scene): SceneUploadMetadata {
  return {
    title: `Scene ${scene.orderIndex + 1}`,
    description: normalizeSceneInstruction(scene.instruction),
    durationLabel: `${formatSceneDuration(scene.durationSeconds)}s`,
  };
}

function normalizeSceneInstruction(value: string): string {
  const trimmedValue = typeof value === "string" ? value.trim() : "";

  return trimmedValue.length > 0 ? trimmedValue : "No description.";
}

function formatSceneDuration(value: number): string {
  if (!Number.isFinite(value)) {
    return "0.0";
  }

  return value.toFixed(1);
}
