import { useEffect, useState } from "react";
import {
  EditableSceneEffectType,
  ZoomFocusPosition,
} from "../domain/video/sceneEffects";
import { templateRepository } from "../infrastructure/templateRepository";
import { TextOverlayUpdate, useEditSession } from "../store/useEditSession";
import { SceneVideoSource, Template, Transition } from "../types/template";

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
  updateSceneVideoSource: (
    sceneId: string,
    videoSource: SceneVideoSource | null,
  ) => void;
  updateCompiledVideo: (compiledVideoUrl: string) => void;
  clearSession: () => void;
}

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
    updateSceneVideoSource,
    updateCompiledVideo,
  } = useEditSession();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function load(): Promise<void> {
      if (!id) {
        clearSession();
        setError("Missing template id.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const template = await templateRepository.getTemplateById(id);

        if (!isActive) {
          return;
        }

        if (!template) {
          clearSession();
          setError("Template not found.");
          return;
        }

        loadTemplate(template);
      } catch {
        if (isActive) {
          clearSession();
          setError("Could not load template.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [clearSession, id, loadTemplate]);

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
    updateSceneVideoSource,
    updateCompiledVideo,
    clearSession,
  };
}
