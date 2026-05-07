import { useState, useEffect } from "react";
import { useEditSession } from "../store/useEditSession";
import { templateRepository } from "../infrastructure/templateRepository";
import { Template } from "../types/template";

interface EditorInitializationResult {
  isLoading: boolean;
  error: string | null;
  currentTemplate: Template | null;
  activeSceneId: string | null;
  selectScene: (sceneId: string) => void;
  clearSession: () => void;
}

/**
 * Custom hook to orchestrate the initialization of the editor session.
 * Handles data fetching, error states, and syncing with the global store.
 *
 * @param {string | undefined} id - The template ID from the route parameters.
 * @returns An object containing loading state, error state, and session actions.
 */
export function useInitializeEditor(
  id: string | undefined,
): EditorInitializationResult {
  const {
    currentTemplate,
    activeSceneId,
    loadTemplate,
    clearSession,
    selectScene,
  } = useEditSession();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndLoadTemplate = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const template = await templateRepository.getTemplateById(id);

        if (template) {
          loadTemplate(template);
        } else {
          setError("Could not find the template. It may have been removed.");
        }
      } catch (err) {
        console.error("Failed to load template:", err);
        setError(
          "An error occurred while loading the template. The data format might be invalid.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndLoadTemplate();
  }, [id, loadTemplate]);

  return {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectScene,
    clearSession,
  };
}
