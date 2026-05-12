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
 * Custom hook that initializes the editor session from a template id.
 * It loads a validated template, syncs it with the global edit session,
 * and clears stale session state when the id is missing or invalid.
 *
 * @param id Template id from the editor route.
 * @returns Loading state, error state, current session data and session actions.
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
    let isActive = true;

    const fetchAndLoadTemplate = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      if (!id) {
        clearSession();

        if (isActive) {
          setError("No template id was provided.");
          setIsLoading(false);
        }

        return;
      }

      try {
        const template = await templateRepository.getTemplateById(id);

        if (!isActive) {
          return;
        }

        if (!template) {
          clearSession();
          setError("Could not find the template. It may have been removed.");
          return;
        }

        loadTemplate(template);
      } catch {
        if (!isActive) {
          return;
        }

        clearSession();
        setError(
          "An error occurred while loading the template. The data format might be invalid",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchAndLoadTemplate();

    return () => {
      isActive = false;
    };
  }, [id, loadTemplate, clearSession]);

  return {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectScene,
    clearSession,
  };
}
