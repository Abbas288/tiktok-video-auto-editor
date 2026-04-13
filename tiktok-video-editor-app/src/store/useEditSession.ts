import { create } from "zustand";
import { Template } from "../types/schema";

interface EditSessionState {
  currentTemplate: Template | null;
  loadTemplate: (template: Template) => void;
  clearSession: () => void;
}

export const useEditSession = create<EditSessionState>((set) => ({
  currentTemplate: null,

  loadTemplate: (template) => {
    set({ currentTemplate: template });
  },

  clearSession: () => set({ currentTemplate: null }),
}));
