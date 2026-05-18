import { create } from "zustand";
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
   * If an edited draft already exists for the same template id, the draft is
   * loaded instead of the original template.
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
   * Updates a specific text overlay immutably inside the current template and
   * saves the updated template as a browser draft.
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
      const templateToLoad = state.editedTemplatesById[template.id] ?? template;

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
