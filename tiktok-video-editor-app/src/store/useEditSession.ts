import { create } from "zustand";
import { Template } from "../types/template";

/**
 * State interface for the editing session.
 */
interface EditSessionState {
  currentTemplate: Template | null;
  loadTemplate: (template: Template) => void;
  clearSession: () => void;
}

/**
 * Store for managing the current video editing session.
 */
export const useEditSession = create<EditSessionState>((set) => ({
  currentTemplate: null,

  /**
   * Loads a template into the session.
   * @param template - The template to load.
   */
  loadTemplate: (template) => {
    set({ currentTemplate: template });
  },

  /**
   * Clears the current session.
   */
  clearSession: () => set({ currentTemplate: null }),
}));
