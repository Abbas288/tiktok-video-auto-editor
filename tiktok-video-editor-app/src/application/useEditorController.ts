import { useCallback, useMemo, useState } from "react";
import { findTextOverlayById } from "../domain/video/findTextOverlay";
import { getActiveSceneIdAtTime } from "../domain/video/getActiveSceneIdAtTime";
import { NormalizedOverlayPosition } from "../domain/video/overlayPosition";
import {
  EditableSceneEffectType,
  getSceneFilterValues,
  SceneFilterValues,
  ZoomFocusPosition,
} from "../domain/video/sceneEffects";
import { TextOverlayUpdate } from "../store/useEditSession";
import { Scene, Template } from "../types/template";
import { useInitializeEditor } from "./useInitializeEditor";
import { SeekRequest } from "./useVideoSync";

interface UseEditorControllerProps {
  templateId: string | undefined;
  onExitEditor: () => void;
}

interface EditorControllerResult {
  isLoading: boolean;
  error: string | null;
  currentTemplate: Template | null;
  activeSceneId: string | null;
  selectedOverlayId: string | null;
  selectedOverlayResult: ReturnType<typeof findTextOverlayById>;
  activeScene: Scene | null;
  activeSceneFilterValues: SceneFilterValues | null;
  seekRequest: SeekRequest | undefined;
  currentTime: number;
  isDraggingOverlay: boolean;
  selectOverlay: (overlayId: string | null) => void;
  updateVolumes: (originalVolume: number, musicVolume?: number) => void;
  handleGoBack: () => void;
  handleSceneClick: (sceneId: string) => void;
  handleTimeUpdate: (time: number) => void;
  handleDragStart: () => void;
  handleDragEnd: () => void;
  handleCommitOverlayPosition: (
    overlayId: string,
    position: NormalizedOverlayPosition,
  ) => void;
  handleChangeSelectedOverlay: (patch: TextOverlayUpdate) => void;
  handleChangeSceneEffect: (
    effectType: EditableSceneEffectType,
    value: number,
  ) => void;
  handleResetSceneEffects: () => void;
  handleCommitZoomFocus: (sceneId: string, position: ZoomFocusPosition) => void;
}

/**
 * Coordinates editor state, scene selection, overlays, effects and seek requests.
 *
 * @param props Editor controller properties.
 * @returns Editor state and handlers used by the editor screen.
 */
export function useEditorController({
  templateId,
  onExitEditor,
}: UseEditorControllerProps): EditorControllerResult {
  const [seekRequest, setSeekRequest] = useState<SeekRequest>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState<boolean>(false);

  const {
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
    clearSession,
  } = useInitializeEditor(templateId);

  const selectedOverlayResult = useMemo(
    () =>
      currentTemplate
        ? findTextOverlayById(currentTemplate.scenes, selectedOverlayId)
        : null,
    [currentTemplate, selectedOverlayId],
  );

  const activeScene = useMemo(
    () =>
      currentTemplate?.scenes.find((scene) => scene.id === activeSceneId) ??
      null,
    [activeSceneId, currentTemplate],
  );

  const activeSceneFilterValues = useMemo(
    () => (activeScene ? getSceneFilterValues(activeScene.effects) : null),
    [activeScene],
  );

  const handleGoBack = useCallback((): void => {
    clearSession();
    onExitEditor();
  }, [clearSession, onExitEditor]);

  const handleSceneClick = useCallback(
    (sceneId: string): void => {
      const scene = currentTemplate?.scenes.find((item) => item.id === sceneId);

      if (!scene) {
        return;
      }

      selectScene(sceneId);
      setSeekRequest({
        time: scene.startSeconds,
        timestamp: Date.now(),
      });
    },
    [currentTemplate, selectScene],
  );

  const handleTimeUpdate = useCallback(
    (time: number): void => {
      setCurrentTime(time);

      if (!currentTemplate) {
        return;
      }

      const matchedSceneId = getActiveSceneIdAtTime(
        currentTemplate.scenes,
        time,
      );

      if (matchedSceneId && matchedSceneId !== activeSceneId) {
        selectScene(matchedSceneId);
      }
    },
    [activeSceneId, currentTemplate, selectScene],
  );

  const handleDragStart = useCallback((): void => {
    setIsDraggingOverlay(true);
  }, []);

  const handleDragEnd = useCallback((): void => {
    setIsDraggingOverlay(false);
  }, []);

  const handleCommitOverlayPosition = useCallback(
    (overlayId: string, position: NormalizedOverlayPosition): void => {
      if (!currentTemplate) {
        return;
      }

      const result = findTextOverlayById(currentTemplate.scenes, overlayId);

      if (!result) {
        return;
      }

      updateTextOverlay(result.sceneId, overlayId, position);
    },
    [currentTemplate, updateTextOverlay],
  );

  const handleChangeSelectedOverlay = useCallback(
    (patch: TextOverlayUpdate): void => {
      if (!selectedOverlayResult) {
        return;
      }

      updateTextOverlay(
        selectedOverlayResult.sceneId,
        selectedOverlayResult.overlay.id,
        patch,
      );
    },
    [selectedOverlayResult, updateTextOverlay],
  );

  const handleChangeSceneEffect = useCallback(
    (effectType: EditableSceneEffectType, value: number): void => {
      if (!activeScene) {
        return;
      }

      updateSceneEffect(activeScene.id, effectType, value);
    },
    [activeScene, updateSceneEffect],
  );

  const handleResetSceneEffects = useCallback((): void => {
    if (!activeScene) {
      return;
    }

    resetSceneEffects(activeScene.id);
  }, [activeScene, resetSceneEffects]);

  const handleCommitZoomFocus = useCallback(
    (sceneId: string, position: ZoomFocusPosition): void => {
      updateSceneZoomFocus(sceneId, position);
    },
    [updateSceneZoomFocus],
  );

  return {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectedOverlayId,
    selectedOverlayResult,
    activeScene,
    activeSceneFilterValues,
    seekRequest,
    currentTime,
    isDraggingOverlay,
    selectOverlay,
    updateVolumes,
    handleGoBack,
    handleSceneClick,
    handleTimeUpdate,
    handleDragStart,
    handleDragEnd,
    handleCommitOverlayPosition,
    handleChangeSelectedOverlay,
    handleChangeSceneEffect,
    handleResetSceneEffects,
    handleCommitZoomFocus,
  };
}
