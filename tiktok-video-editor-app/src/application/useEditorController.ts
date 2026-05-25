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
import { getSceneTransition } from "../domain/video/transitions";
import { TextOverlayUpdate } from "../store/useEditSession";
import { Scene, Template, Transition } from "../types/template";
import { useInitializeEditor } from "./useInitializeEditor";
import { SeekRequest } from "./useVideoSync";

interface UseEditorControllerProps {
  templateId: string | undefined;
  onExitEditor: () => void;
}

interface SelectedTransition {
  scene: Scene;
  transition: Transition;
}

interface EditorControllerResult {
  isLoading: boolean;
  error: string | null;
  currentTemplate: Template | null;
  activeSceneId: string | null;
  selectedOverlayId: string | null;
  selectedTransition: SelectedTransition | null;
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
  handleSelectTransition: (sceneId: string) => void;
  handleChangeTransition: (transitionType: Transition["type"]) => void;
  handleCloseTransitionPicker: () => void;
}

/**
 * Coordinates editor state, scene selection, overlays, effects, transitions and seek requests.
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
  const [selectedTransitionSceneId, setSelectedTransitionSceneId] = useState<
    string | null
  >(null);

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
    updateSceneTransition,
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

  const selectedTransition = useMemo<SelectedTransition | null>(() => {
    if (!currentTemplate || !selectedTransitionSceneId) {
      return null;
    }

    const sceneIndex = currentTemplate.scenes.findIndex(
      (scene) => scene.id === selectedTransitionSceneId,
    );

    const scene = currentTemplate.scenes[sceneIndex];

    if (!scene || sceneIndex >= currentTemplate.scenes.length - 1) {
      return null;
    }

    return {
      scene,
      transition: getSceneTransition(scene),
    };
  }, [currentTemplate, selectedTransitionSceneId]);

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

      setSelectedTransitionSceneId(null);
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

  const handleSelectTransition = useCallback(
    (sceneId: string): void => {
      if (!currentTemplate) {
        return;
      }

      const sceneIndex = currentTemplate.scenes.findIndex(
        (scene) => scene.id === sceneId,
      );

      if (sceneIndex < 0 || sceneIndex >= currentTemplate.scenes.length - 1) {
        return;
      }

      selectOverlay(null);
      setSelectedTransitionSceneId(sceneId);
    },
    [currentTemplate, selectOverlay],
  );

  const handleChangeTransition = useCallback(
    (transitionType: Transition["type"]): void => {
      if (!selectedTransitionSceneId) {
        return;
      }

      updateSceneTransition(selectedTransitionSceneId, transitionType);
    },
    [selectedTransitionSceneId, updateSceneTransition],
  );

  const handleCloseTransitionPicker = useCallback((): void => {
    setSelectedTransitionSceneId(null);
  }, []);

  return {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectedOverlayId,
    selectedTransition,
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
    handleSelectTransition,
    handleChangeTransition,
    handleCloseTransitionPicker,
  };
}
