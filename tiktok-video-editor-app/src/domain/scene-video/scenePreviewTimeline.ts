import { Scene, Template } from "../../types/template";
import { TransitionSimulation } from "../video/transitionSimulation";
import { getSceneVideoReadiness } from "./sceneVideoReadiness";

export interface ScenePreviewPlaybackSource {
  scene: Scene;
  videoUrl: string;
  timelineStartSeconds: number;
  timelineEndSeconds: number;
  sourceStartSeconds: number;
  sourceEndSeconds: number;
}

export interface TransitionPreviewPlaybackSource {
  videoUrl: string;
  sourcePreviewTimeSeconds: number;
}

const END_EPSILON_SECONDS = 0.001;

export function getTemplateDurationSeconds(scenes: Scene[]): number {
  return scenes.reduce(
    (duration, scene) =>
      Math.max(duration, scene.startSeconds + scene.durationSeconds),
    0,
  );
}

export function getSceneAtTimelineTime(
  scenes: Scene[],
  currentTime: number,
): Scene | null {
  if (scenes.length === 0) {
    return null;
  }

  const totalDuration = getTemplateDurationSeconds(scenes);
  const safeTime = clamp(
    Number.isFinite(currentTime) ? currentTime : 0,
    0,
    Math.max(totalDuration - END_EPSILON_SECONDS, 0),
  );

  return (
    scenes.find(
      (scene) =>
        safeTime >= scene.startSeconds &&
        safeTime < scene.startSeconds + scene.durationSeconds,
    ) ?? scenes[0]
  );
}

export function getScenePreviewPlaybackSource(
  template: Template,
  currentTime: number,
): ScenePreviewPlaybackSource | null {
  const readiness = getSceneVideoReadiness(template.scenes);

  if (!readiness.isReadyForCompile) {
    return null;
  }

  const scene = getSceneAtTimelineTime(template.scenes, currentTime);

  if (!scene?.videoSource) {
    return null;
  }

  const videoUrl = getPlayableSceneVideoUrl(scene);

  if (!videoUrl) {
    return null;
  }

  const sourceStartSeconds = Math.max(scene.videoSource.sourceStartSeconds, 0);
  const durationSeconds = Math.max(scene.videoSource.durationSeconds, 0);

  return {
    scene,
    videoUrl,
    timelineStartSeconds: scene.startSeconds,
    timelineEndSeconds: scene.startSeconds + scene.durationSeconds,
    sourceStartSeconds,
    sourceEndSeconds: sourceStartSeconds + durationSeconds,
  };
}

export function getTransitionPreviewPlaybackSource(
  template: Template,
  simulation: TransitionSimulation | null,
): TransitionPreviewPlaybackSource | null {
  if (
    !simulation ||
    !getSceneVideoReadiness(template.scenes).isReadyForCompile
  ) {
    return null;
  }

  const transitionScenes = findTransitionScenes(template.scenes, simulation);

  if (!transitionScenes?.nextScene.videoSource) {
    return null;
  }

  const videoUrl = getPlayableSceneVideoUrl(transitionScenes.nextScene);

  if (!videoUrl) {
    return null;
  }

  const sourceStartSeconds = Math.max(
    transitionScenes.nextScene.videoSource.sourceStartSeconds,
    0,
  );
  const sourceDurationSeconds = Math.max(
    transitionScenes.nextScene.videoSource.durationSeconds,
    0,
  );
  const sourceEndSeconds = sourceStartSeconds + sourceDurationSeconds;
  const timelineOffsetSeconds = Math.max(
    simulation.previewTimeSeconds - transitionScenes.nextScene.startSeconds,
    0,
  );

  return {
    videoUrl,
    sourcePreviewTimeSeconds: clamp(
      sourceStartSeconds + timelineOffsetSeconds,
      sourceStartSeconds,
      Math.max(sourceEndSeconds - END_EPSILON_SECONDS, sourceStartSeconds),
    ),
  };
}

function findTransitionScenes(
  scenes: Scene[],
  simulation: TransitionSimulation,
): { currentScene: Scene; nextScene: Scene } | null {
  for (let index = 0; index < scenes.length - 1; index += 1) {
    const currentScene = scenes[index];
    const nextScene = scenes[index + 1];
    const transitionKey = `${currentScene.id}:${nextScene.id}:${simulation.type}`;

    if (transitionKey === simulation.transitionKey) {
      return {
        currentScene,
        nextScene,
      };
    }
  }

  return null;
}

function getPlayableSceneVideoUrl(scene: Scene): string | null {
  const localUri = scene.videoSource?.localUri?.trim();

  if (localUri) {
    return localUri;
  }

  const uploadUrl = scene.videoSource?.uploadUrl?.trim();

  return uploadUrl || null;
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
