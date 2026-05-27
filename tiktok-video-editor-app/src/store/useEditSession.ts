import { create } from "zustand";
import {
  EditableSceneEffectType,
  ZoomFocusPosition,
} from "../domain/video/sceneEffects";
import {
  resetTemplateSceneEffects,
  TextOverlayUpdate,
  updateTemplateCompiledVideo,
  updateTemplateSceneEffect,
  updateTemplateSceneTransition,
  updateTemplateSceneZoomFocus,
  updateTemplateTextOverlay,
  updateTemplateVolumes,
} from "../domain/template/templateEditing";
import { mergeTemplateWithDraft } from "../domain/template/templateDraftMerge";
import { Template, Transition } from "../types/template";
import {
  clearEditedTemplateDraftsStorage,
  EditedTemplatesById,
  loadEditedTemplateDrafts,
  saveEditedTemplateDrafts,
} from "./editSessionDrafts";

export type { TextOverlayUpdate } from "../domain/template/templateEditing";

export {
  resetTemplateSceneEffects,
  updateTemplateCompiledVideo,
  updateTemplateSceneEffect,
  updateTemplateSceneTransition,
  updateTemplateSceneZoomFocus,
  updateTemplateTextOverlay,
  updateTemplateVolumes,
} from "../domain/template/templateEditing";

export { mergeTemplateWithDraft } from "../domain/template/templateDraftMerge";

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

  /**
   * Updates the transition from one scene to the next.
   *
   * @param sceneId Scene that owns the transition.
   * @param transitionType Selected transition type.
   */
  updateSceneTransition: (
    sceneId: string,
    transitionType: Transition["type"],
  ) => void;

  /**
   * Stores the compiled video URL returned by the compile server.
   *
   * @param compiledVideoUrl Compiled video URL.
   */
  updateCompiledVideo: (compiledVideoUrl: string) => void;
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

  updateSceneTransition: (
    sceneId: string,
    transitionType: Transition["type"],
  ) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      const updatedTemplate = updateTemplateSceneTransition(
        state.currentTemplate,
        sceneId,
        transitionType,
      );

      return persistTemplateUpdate(state, updatedTemplate);
    });
  },

  updateCompiledVideo: (compiledVideoUrl: string) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      const updatedTemplate = updateTemplateCompiledVideo(
        state.currentTemplate,
        compiledVideoUrl,
      );

      return persistTemplateUpdate(state, updatedTemplate);
    });
  },
}));

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
