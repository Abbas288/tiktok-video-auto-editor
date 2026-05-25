import { useState, useEffect } from "react";
import {
  EditableSceneEffectType,
  ZoomFocusPosition,
} from "../domain/video/sceneEffects";
import { templateRepository } from "../infrastructure/templateRepository";
import { TextOverlayUpdate, useEditSession } from "../store/useEditSession";
import { Template, Transition } from "../types/template";

/**
 * The unified interface returned by the editor initialization hook.
 */
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
    updateSceneEffect,
    updateSceneZoomFocus,
    resetSceneEffects,
    updateVolumes,
    updateSceneTransition,
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
    updateSceneEffect,
    updateSceneZoomFocus,
    resetSceneEffects,
    updateVolumes,
    updateSceneTransition,
    clearSession,
  };
}
