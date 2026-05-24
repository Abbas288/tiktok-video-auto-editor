import {
  EditableSceneEffectType,
  resetEditableSceneEffects,
  upsertSceneEffect,
  upsertSceneZoomFocus,
  ZoomFocusPosition,
} from "../video/sceneEffects";
import { clampVolume } from "../audio/volume";
import { Template, TextOverlay } from "../../types/template";

/**
 * Defines editable text overlay fields.
 */
export type TextOverlayUpdate = Partial<
  Pick<TextOverlay, "text" | "positionX" | "positionY" | "fontSizePt" | "color">
>;

/**
 * Updates a text overlay inside a template without mutating the original object.
 *
 * @param template Source template.
 * @param sceneId Scene that owns the target overlay.
 * @param overlayId Target overlay id.
 * @param patch Editable overlay fields to update.
 * @returns Updated template, or the original template if no matching overlay exists.
 */
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

/**
 * Updates one scene visual effect without mutating the original template.
 *
 * @param template Source template.
 * @param sceneId Target scene id.
 * @param effectType Editable effect type.
 * @param value New effect value.
 * @returns Updated template, or original template if no scene matches.
 */
export function updateTemplateSceneEffect(
  template: Template,
  sceneId: string,
  effectType: EditableSceneEffectType,
  value: number,
): Template {
  let didUpdateScene = false;

  const scenes = template.scenes.map((scene) => {
    if (scene.id !== sceneId) {
      return scene;
    }

    didUpdateScene = true;

    return {
      ...scene,
      effects: upsertSceneEffect(scene.effects ?? [], effectType, value),
    };
  });

  if (!didUpdateScene) {
    return template;
  }

  return {
    ...template,
    scenes,
  };
}

/**
 * Updates one scene zoom focus without mutating the original template.
 *
 * @param template Source template.
 * @param sceneId Target scene id.
 * @param position New normalized zoom focus position.
 * @returns Updated template, or original template if no scene matches.
 */
export function updateTemplateSceneZoomFocus(
  template: Template,
  sceneId: string,
  position: ZoomFocusPosition,
): Template {
  let didUpdateScene = false;

  const scenes = template.scenes.map((scene) => {
    if (scene.id !== sceneId) {
      return scene;
    }

    didUpdateScene = true;

    return {
      ...scene,
      effects: upsertSceneZoomFocus(scene.effects ?? [], position),
    };
  });

  if (!didUpdateScene) {
    return template;
  }

  return {
    ...template,
    scenes,
  };
}

/**
 * Resets editable scene effects without mutating the original template.
 *
 * @param template Source template.
 * @param sceneId Target scene id.
 * @returns Updated template, or original template if no scene matches.
 */
export function resetTemplateSceneEffects(
  template: Template,
  sceneId: string,
): Template {
  let didUpdateScene = false;

  const scenes = template.scenes.map((scene) => {
    if (scene.id !== sceneId) {
      return scene;
    }

    didUpdateScene = true;

    return {
      ...scene,
      effects: resetEditableSceneEffects(scene.effects ?? []),
    };
  });

  if (!didUpdateScene) {
    return template;
  }

  return {
    ...template,
    scenes,
  };
}

/**
 * Updates audio volumes without mutating the original template.
 *
 * @param template Source template.
 * @param originalVolume Original video volume.
 * @param musicVolume Optional background music volume.
 * @returns Updated template, or original template if unchanged.
 */
export function updateTemplateVolumes(
  template: Template,
  originalVolume: number,
  musicVolume?: number,
): Template {
  const safeOriginalVolume = clampVolume(originalVolume);
  const safeMusicVolume =
    musicVolume === undefined ? undefined : clampVolume(musicVolume);

  const music =
    template.music && safeMusicVolume !== undefined
      ? {
          ...template.music,
          volume: safeMusicVolume,
        }
      : template.music;

  const hasSameOriginalVolume = template.originalVolume === safeOriginalVolume;
  const hasSameMusicVolume = template.music?.volume === music?.volume;

  if (hasSameOriginalVolume && hasSameMusicVolume) {
    return template;
  }

  return {
    ...template,
    originalVolume: safeOriginalVolume,
    music,
  };
}
