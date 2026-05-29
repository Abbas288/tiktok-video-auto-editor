import { clampVolume } from "../audio/volume";
import {
  EditableSceneEffectType,
  resetEditableSceneEffects,
  upsertSceneEffect,
  upsertSceneZoomFocus,
  ZoomFocusPosition,
} from "../video/sceneEffects";
import { createTransition, sanitizeTransition } from "../video/transitions";
import {
  Scene,
  SceneVideoSource,
  Template,
  TextOverlay,
  Transition,
} from "../../types/template";

export type TextOverlayUpdate = Partial<
  Pick<TextOverlay, "text" | "positionX" | "positionY" | "fontSizePt" | "color">
>;

export function updateTemplateTextOverlay(
  template: Template,
  sceneId: string,
  overlayId: string,
  patch: TextOverlayUpdate,
): Template {
  let didUpdateOverlay = false;

  const scenes = template.scenes.map((scene) => {
    if (scene.id !== sceneId) {
      return scene;
    }

    let didUpdateScene = false;

    const textOverlays = scene.textOverlays.map((overlay) => {
      if (overlay.id !== overlayId) {
        return overlay;
      }

      didUpdateOverlay = true;
      didUpdateScene = true;

      return {
        ...overlay,
        ...patch,
      };
    });

    if (!didUpdateScene) {
      return scene;
    }

    return {
      ...scene,
      textOverlays,
    };
  });

  if (!didUpdateOverlay) {
    return template;
  }

  return {
    ...template,
    scenes,
  };
}

export function updateTemplateSceneEffect(
  template: Template,
  sceneId: string,
  effectType: EditableSceneEffectType,
  value: number,
): Template {
  return updateTemplateScene(template, sceneId, (scene) => ({
    ...scene,
    effects: upsertSceneEffect(scene.effects, effectType, value),
  }));
}

export function updateTemplateSceneZoomFocus(
  template: Template,
  sceneId: string,
  position: ZoomFocusPosition,
): Template {
  return updateTemplateScene(template, sceneId, (scene) => ({
    ...scene,
    effects: upsertSceneZoomFocus(scene.effects, position),
  }));
}

export function resetTemplateSceneEffects(
  template: Template,
  sceneId: string,
): Template {
  return updateTemplateScene(template, sceneId, (scene) => ({
    ...scene,
    effects: resetEditableSceneEffects(scene.effects),
  }));
}

export function updateTemplateVolumes(
  template: Template,
  originalVolume: number,
  musicVolume?: number,
): Template {
  const safeOriginalVolume = clampVolume(originalVolume);
  const safeMusicVolume =
    typeof musicVolume === "number" ? clampVolume(musicVolume) : undefined;

  const originalVolumeChanged = template.originalVolume !== safeOriginalVolume;
  const musicVolumeChanged =
    typeof safeMusicVolume === "number" &&
    template.music &&
    template.music.volume !== safeMusicVolume;

  if (!originalVolumeChanged && !musicVolumeChanged) {
    return template;
  }

  return {
    ...template,
    originalVolume: safeOriginalVolume,
    music:
      template.music && typeof safeMusicVolume === "number"
        ? {
            ...template.music,
            volume: safeMusicVolume,
          }
        : template.music,
  };
}

export function updateTemplateSceneTransition(
  template: Template,
  sceneId: string,
  transitionType: Transition["type"],
): Template {
  return updateTemplateScene(template, sceneId, (scene) => ({
    ...scene,
    transition: sanitizeTransition(createTransition(transitionType)),
  }));
}

export function updateTemplateCompiledVideo(
  template: Template,
  compiledVideoUrl: string,
): Template {
  if (template.compiledVideoUrl === compiledVideoUrl) {
    return template;
  }

  return {
    ...template,
    compiledVideoUrl,
  };
}

export function updateTemplateSceneVideoSource(
  template: Template,
  sceneId: string,
  videoSource: SceneVideoSource | null,
): Template {
  return updateTemplateScene(template, sceneId, (scene) => {
    if (!videoSource) {
      const { videoSource: _removedVideoSource, ...sceneWithoutVideoSource } =
        scene;

      return sceneWithoutVideoSource;
    }

    return {
      ...scene,
      videoSource,
    };
  });
}

function updateTemplateScene(
  template: Template,
  sceneId: string,
  updater: (scene: Scene) => Scene,
): Template {
  let didUpdateScene = false;

  const scenes = template.scenes.map((scene) => {
    if (scene.id !== sceneId) {
      return scene;
    }

    didUpdateScene = true;
    return updater(scene);
  });

  if (!didUpdateScene) {
    return template;
  }

  return {
    ...template,
    scenes,
  };
}
