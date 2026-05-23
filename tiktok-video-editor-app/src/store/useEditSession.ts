import { create } from "zustand";
import {
  EditableSceneEffectType,
  resetEditableSceneEffects,
  upsertSceneEffect,
  upsertSceneZoomFocus,
  ZoomFocusPosition,
} from "../domain/video/sceneEffects";
import { Template, TextOverlay } from "../types/template";
import {
  clearEditedTemplateDraftsStorage,
  EditedTemplatesById,
  loadEditedTemplateDrafts,
  saveEditedTemplateDrafts,
} from "./editSessionDrafts";

/**
 * Defines editable text overlay fields.
 */
export type TextOverlayUpdate = Partial<
  Pick<TextOverlay, "text" | "positionX" | "positionY" | "fontSizePt" | "color">
>;

/**
 * Represents the state and actions for an active video editing session.
 */
export interface EditSessionState {
  /** The currently loaded template project. */
  currentTemplate: Template | null;

  /** Cached edited templates by template id. */
  editedTemplatesById: EditedTemplatesById;

  /** The ID of the currently active or selected scene in the timeline. */
  activeSceneId: string | null;

  /** The ID of the currently selected text overlay. */
  selectedOverlayId: string | null;

  /**
   * Loads a validated template into the active session.
   *
   * @param template The validated template data.
   */
  loadTemplate: (template: Template) => void;

  /**
   * Clears the currently opened editing session without deleting saved drafts.
   */
  clearSession: () => void;

  /**
   * Clears all cached edited template drafts.
   */
  clearDrafts: () => void;

  /**
   * Selects the active scene.
   *
   * @param sceneId The scene ID to select.
   */
  selectScene: (sceneId: string) => void;

  /**
   * Selects a text overlay for editing.
   *
   * @param overlayId The selected overlay ID, or null to clear selection.
   */
  selectOverlay: (overlayId: string | null) => void;

  /**
   * Updates a specific text overlay.
   *
   * @param sceneId The scene that owns the overlay.
   * @param overlayId The overlay to update.
   * @param patch Editable overlay fields to update.
   */
  updateTextOverlay: (
    sceneId: string,
    overlayId: string,
    patch: TextOverlayUpdate,
  ) => void;

  /**
   * Adds or updates one visual filter effect for a scene.
   *
   * @param sceneId The scene to update.
   * @param effectType Editable effect type.
   * @param value New effect value.
   */
  updateSceneEffect: (
    sceneId: string,
    effectType: EditableSceneEffectType,
    value: number,
  ) => void;

  /**
   * Updates the zoom focus for a scene.
   *
   * @param sceneId The scene to update.
   * @param position New normalized zoom focus position.
   */
  updateSceneZoomFocus: (sceneId: string, position: ZoomFocusPosition) => void;

  /**
   * Resets editable visual filters for one scene.
   *
   * @param sceneId The scene to reset.
   */
  resetSceneEffects: (sceneId: string) => void;

  /**
   * Updates original and background music volumes.
   *
   * @param originalVolume Original video volume.
   * @param musicVolume Optional background music volume.
   */
  updateVolumes: (originalVolume: number, musicVolume?: number) => void;
}

/**
 * Zustand store managing the global state for the video editing session.
 */
export const useEditSession = create<EditSessionState>((set) => ({
  currentTemplate: null,
  editedTemplatesById: loadEditedTemplateDrafts(),
  activeSceneId: null,
  selectedOverlayId: null,

  loadTemplate: (template: Template) => {
    set((state) => {
      const templateToLoad = mergeTemplateWithDraft(
        template,
        state.editedTemplatesById[template.id],
      );

      return {
        currentTemplate: templateToLoad,
        activeSceneId:
          templateToLoad.scenes.length > 0 ? templateToLoad.scenes[0].id : null,
        selectedOverlayId: null,
      };
    });
  },

  clearSession: () => {
    set({
      currentTemplate: null,
      activeSceneId: null,
      selectedOverlayId: null,
    });
  },

  clearDrafts: () => {
    clearEditedTemplateDraftsStorage();

    set({
      editedTemplatesById: {},
    });
  },

  selectScene: (sceneId: string) => {
    set({
      activeSceneId: sceneId,
      selectedOverlayId: null,
    });
  },

  selectOverlay: (overlayId: string | null) => {
    set({
      selectedOverlayId: overlayId,
    });
  },

  updateTextOverlay: (
    sceneId: string,
    overlayId: string,
    patch: TextOverlayUpdate,
  ) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      const updatedTemplate = updateTemplateTextOverlay(
        state.currentTemplate,
        sceneId,
        overlayId,
        patch,
      );

      return persistTemplateUpdate(state, updatedTemplate);
    });
  },

  updateSceneEffect: (
    sceneId: string,
    effectType: EditableSceneEffectType,
    value: number,
  ) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      const updatedTemplate = updateTemplateSceneEffect(
        state.currentTemplate,
        sceneId,
        effectType,
        value,
      );

      return persistTemplateUpdate(state, updatedTemplate);
    });
  },

  updateSceneZoomFocus: (sceneId: string, position: ZoomFocusPosition) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      const updatedTemplate = updateTemplateSceneZoomFocus(
        state.currentTemplate,
        sceneId,
        position,
      );

      return persistTemplateUpdate(state, updatedTemplate);
    });
  },

  resetSceneEffects: (sceneId: string) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      const updatedTemplate = resetTemplateSceneEffects(
        state.currentTemplate,
        sceneId,
      );

      return persistTemplateUpdate(state, updatedTemplate);
    });
  },

  updateVolumes: (originalVolume: number, musicVolume?: number) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      const updatedTemplate = updateTemplateVolumes(
        state.currentTemplate,
        originalVolume,
        musicVolume,
      );

      return persistTemplateUpdate(state, updatedTemplate);
    });
  },
}));

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
  const safeOriginalVolume = clamp01(originalVolume);
  const safeMusicVolume =
    musicVolume === undefined ? undefined : clamp01(musicVolume);

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

/**
 * Merges an existing draft with the latest template shape.
 *
 * @param sourceTemplate Current template from the repository.
 * @param draft Saved draft, if one exists.
 * @returns Template with preserved user edits and current template fields.
 */
export function mergeTemplateWithDraft(
  sourceTemplate: Template,
  draft: Template | undefined,
): Template {
  if (!draft) {
    return sourceTemplate;
  }

  return {
    ...sourceTemplate,
    ...draft,
    id: sourceTemplate.id,
    sourceVideoUrl: draft.sourceVideoUrl || sourceTemplate.sourceVideoUrl,
    orientation: draft.orientation ?? sourceTemplate.orientation,
    originalVolume: draft.originalVolume ?? sourceTemplate.originalVolume,
    music: mergeMusic(sourceTemplate, draft),
    scenes: mergeScenes(sourceTemplate, draft),
  };
}

function persistTemplateUpdate(
  state: EditSessionState,
  updatedTemplate: Template,
): Partial<EditSessionState> | EditSessionState {
  if (updatedTemplate === state.currentTemplate) {
    return state;
  }

  const editedTemplatesById = {
    ...state.editedTemplatesById,
    [updatedTemplate.id]: updatedTemplate,
  };

  saveEditedTemplateDrafts(editedTemplatesById);

  return {
    currentTemplate: updatedTemplate,
    editedTemplatesById,
  };
}

function mergeMusic(
  sourceTemplate: Template,
  draft: Template,
): Template["music"] {
  if (!sourceTemplate.music) {
    return draft.music;
  }

  if (!draft.music) {
    return sourceTemplate.music;
  }

  return {
    ...sourceTemplate.music,
    volume: draft.music.volume ?? sourceTemplate.music.volume,
    beatSync: draft.music.beatSync ?? sourceTemplate.music.beatSync,
  };
}

function mergeScenes(
  sourceTemplate: Template,
  draft: Template,
): Template["scenes"] {
  const draftScenesById = new Map(
    draft.scenes.map((scene) => [scene.id, scene]),
  );

  return sourceTemplate.scenes.map((sourceScene) => {
    const draftScene = draftScenesById.get(sourceScene.id);

    if (!draftScene) {
      return sourceScene;
    }

    return {
      ...sourceScene,
      ...draftScene,
      id: sourceScene.id,
      orderIndex: sourceScene.orderIndex,
      startSeconds: sourceScene.startSeconds,
      durationSeconds: sourceScene.durationSeconds,
      instruction: draftScene.instruction ?? sourceScene.instruction,
      transition: draftScene.transition ?? sourceScene.transition,
      textOverlays: draftScene.textOverlays ?? sourceScene.textOverlays,
      effects: draftScene.effects ?? sourceScene.effects,
    };
  });
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(Math.max(value, 0), 1);
}
