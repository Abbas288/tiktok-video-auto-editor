import { create } from "zustand";
import { Template } from "../types/template";

/**
 * Interface representing the state and actions for an active video editing session.
 *
 * @interface EditSessionState
 */
interface EditSessionState {
  /** The currently loaded template project. */
  currentTemplate: Template | null;

  /** The ID of the currently active/selected scene in the timeline. */
  activeSceneId: string | null;

  /**
   * Loads a validated template into the active session.
   * Automatically sets the first scene as active if available.
   *
   * @param {Template} template - The validated template data.
   */
  loadTemplate: (template: Template) => void;

  /**
   * Clears the current session, removing the active template and scene.
   */
  clearSession: () => void;

  /**
   * Updates the active scene ID based on user selection.
   *
   * @param {string} sceneId - The ID of the scene to select.
   */
  selectScene: (sceneId: string) => void;
}

/**
 * Zustand store managing the global state for the video editing session.
 * This acts as the central hub for the UI to read and manipulate the active project.
 */
export const useEditSession = create<EditSessionState>((set) => ({
  currentTemplate: null,
  activeSceneId: null,

  loadTemplate: (template: Template) => {
    set({
      currentTemplate: template,
      activeSceneId: template.scenes.length > 0 ? template.scenes[0].id : null,
    });
  },

  clearSession: () => {
    set({ currentTemplate: null, activeSceneId: null });
  },

  selectScene: (sceneId: string) => {
    set({ activeSceneId: sceneId });
  },
}));
