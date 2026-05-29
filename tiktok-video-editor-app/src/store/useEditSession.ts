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
  updateTemplateSceneVideoSource,
  updateTemplateSceneZoomFocus,
  updateTemplateTextOverlay,
  updateTemplateVolumes,
} from "../domain/template/templateEditing";
import { mergeTemplateWithDraft } from "../domain/template/templateDraftMerge";
import { SceneVideoSource, Template, Transition } from "../types/template";
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
  updateTemplateSceneVideoSource,
  updateTemplateSceneZoomFocus,
  updateTemplateTextOverlay,
  updateTemplateVolumes,
} from "../domain/template/templateEditing";

export { mergeTemplateWithDraft } from "../domain/template/templateDraftMerge";

export interface EditSessionState {
  currentTemplate: Template | null;
  editedTemplatesById: EditedTemplatesById;
  activeSceneId: string | null;
  selectedOverlayId: string | null;
  loadTemplate: (template: Template) => void;
  clearSession: () => void;
  clearDrafts: () => void;
  selectScene: (sceneId: string) => void;
  selectOverlay: (overlayId: string | null) => void;
  updateTextOverlay: (
    sceneId: string,
    overlayId: string,
    patch: TextOverlayUpdate,
  ) => void;
  updateSceneEffect: (
    sceneId: string,
    effectType: EditableSceneEffectType,
    value: number,
  ) => void;
  updateSceneZoomFocus: (sceneId: string, position: ZoomFocusPosition) => void;
  resetSceneEffects: (sceneId: string) => void;
  updateVolumes: (originalVolume: number, musicVolume?: number) => void;
  updateSceneTransition: (
    sceneId: string,
    transitionType: Transition["type"],
  ) => void;
  updateSceneVideoSource: (
    sceneId: string,
    videoSource: SceneVideoSource | null,
  ) => void;
  updateCompiledVideo: (compiledVideoUrl: string) => void;
}

export const useEditSession = create<EditSessionState>((set) => ({
  currentTemplate: null,
  editedTemplatesById: loadEditedTemplateDrafts(),
  activeSceneId: null,
  selectedOverlayId: null,

  loadTemplate: (template: Template) => {
    set((state) => {
      const draft = state.editedTemplatesById[template.id];
      const templateToLoad = draft
        ? mergeTemplateWithDraft(template, draft)
        : template;

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

      return persistTemplateUpdate(
        state,
        updateTemplateTextOverlay(
          state.currentTemplate,
          sceneId,
          overlayId,
          patch,
        ),
      );
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

      return persistTemplateUpdate(
        state,
        updateTemplateSceneEffect(
          state.currentTemplate,
          sceneId,
          effectType,
          value,
        ),
      );
    });
  },

  updateSceneZoomFocus: (sceneId: string, position: ZoomFocusPosition) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      return persistTemplateUpdate(
        state,
        updateTemplateSceneZoomFocus(state.currentTemplate, sceneId, position),
      );
    });
  },

  resetSceneEffects: (sceneId: string) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      return persistTemplateUpdate(
        state,
        resetTemplateSceneEffects(state.currentTemplate, sceneId),
      );
    });
  },

  updateVolumes: (originalVolume: number, musicVolume?: number) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      return persistTemplateUpdate(
        state,
        updateTemplateVolumes(
          state.currentTemplate,
          originalVolume,
          musicVolume,
        ),
      );
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

      return persistTemplateUpdate(
        state,
        updateTemplateSceneTransition(
          state.currentTemplate,
          sceneId,
          transitionType,
        ),
      );
    });
  },

  updateSceneVideoSource: (
    sceneId: string,
    videoSource: SceneVideoSource | null,
  ) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      return persistTemplateUpdate(
        state,
        updateTemplateSceneVideoSource(
          state.currentTemplate,
          sceneId,
          videoSource,
        ),
      );
    });
  },

  updateCompiledVideo: (compiledVideoUrl: string) => {
    set((state) => {
      if (!state.currentTemplate) {
        return state;
      }

      return persistTemplateUpdate(
        state,
        updateTemplateCompiledVideo(state.currentTemplate, compiledVideoUrl),
      );
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
