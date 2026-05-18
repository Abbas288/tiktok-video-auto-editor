import { useState, useEffect } from "react";
import { TextOverlayUpdate, useEditSession } from "../store/useEditSession";
import { templateRepository } from "../infrastructure/templateRepository";
import { Template } from "../types/template";

interface EditorInitializationResult {
  isLoading: boolean;
  error: string | null;
  currentTemplate: Template | null;
  activeSceneId: string | null;
  selectedOverlayId: string | null;
  selectScene: (sceneId: string) => void;
  selectOverlay: (overlayId: string | null) => void;
  updateTextOverlay: (
    sceneId: string,
    overlayId: string,
    patch: TextOverlayUpdate,
  ) => void;
  clearSession: () => void;
}

/**
 * Initializes the editor session from a template id.
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
    selectedOverlayId,
    loadTemplate,
    clearSession,
    selectScene,
    selectOverlay,
    updateTextOverlay,
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
    selectedOverlayId,
    selectScene,
    selectOverlay,
    updateTextOverlay,
    clearSession,
  };
}
