import { useCallback, useMemo, useState } from "react";
import { findTextOverlayById } from "../domain/video/findTextOverlay";
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
import { useEditorCompileController } from "./useEditorCompileController";
import { useEditorTimelineController } from "./useEditorTimelineController";
import { useInitializeEditor } from "./useInitializeEditor";
import { useSceneVideoController } from "./useSceneVideoController";
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
  compileStatus: ReturnType<typeof useEditorCompileController>["compileStatus"];
  compileMessage: string | null;
  compiledOutputUrl: string | null;
  compiledOutputKind: ReturnType<
    typeof useEditorCompileController
  >["compiledOutputKind"];
  saveStatus: ReturnType<typeof useEditorCompileController>["saveStatus"];
  saveMessage: string | null;
  sceneVideoMessage: string | null;
  sceneVideoTrimDraft: ReturnType<
    typeof useSceneVideoController
  >["sceneVideoTrimDraft"];
  isSceneVideoBusy: boolean;
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
  handleCompileProject: () => Promise<void>;
  handleSaveCompiledVideo: () => Promise<void>;
  handleOpenCompiledVideo: () => Promise<void>;
  handlePickSceneVideo: (sceneId: string) => Promise<void>;
  handleConfirmSceneVideoTrim: (startSeconds: number) => Promise<void>;
  handleCancelSceneVideoTrim: () => void;
  handleRemoveSceneVideo: (sceneId: string) => void;
}

export function useEditorController({
  templateId,
  onExitEditor,
}: UseEditorControllerProps): EditorControllerResult {
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
    updateSceneVideoSource,
    updateCompiledVideo,
    clearSession,
  } = useInitializeEditor(templateId);

  const timelineController = useEditorTimelineController({
    currentTemplate,
    activeSceneId,
    selectScene,
  });

  const compileController = useEditorCompileController({
    currentTemplate,
    selectScene,
    updateCompiledVideo,
  });

  const sceneVideoController = useSceneVideoController({
    currentTemplate,
    updateSceneVideoSource,
    resetFinishedOutput: compileController.resetFinishedOutput,
  });

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
      setSelectedTransitionSceneId(null);
      timelineController.handleSceneClick(sceneId);
    },
    [timelineController],
  );

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
      if (activeScene) {
        updateSceneEffect(activeScene.id, effectType, value);
      }
    },
    [activeScene, updateSceneEffect],
  );

  const handleResetSceneEffects = useCallback((): void => {
    if (activeScene) {
      resetSceneEffects(activeScene.id);
    }
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
      if (selectedTransitionSceneId) {
        updateSceneTransition(selectedTransitionSceneId, transitionType);
      }
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
    seekRequest: timelineController.seekRequest,
    currentTime: timelineController.currentTime,
    isDraggingOverlay: timelineController.isDraggingOverlay,
    compileStatus: compileController.compileStatus,
    compileMessage: compileController.compileMessage,
    compiledOutputUrl: compileController.compiledOutputUrl,
    compiledOutputKind: compileController.compiledOutputKind,
    saveStatus: compileController.saveStatus,
    saveMessage: compileController.saveMessage,
    sceneVideoMessage: sceneVideoController.sceneVideoMessage,
    sceneVideoTrimDraft: sceneVideoController.sceneVideoTrimDraft,
    isSceneVideoBusy: sceneVideoController.isSceneVideoBusy,
    selectOverlay,
    updateVolumes,
    handleGoBack,
    handleSceneClick,
    handleTimeUpdate: timelineController.handleTimeUpdate,
    handleDragStart: timelineController.handleDragStart,
    handleDragEnd: timelineController.handleDragEnd,
    handleCommitOverlayPosition,
    handleChangeSelectedOverlay,
    handleChangeSceneEffect,
    handleResetSceneEffects,
    handleCommitZoomFocus,
    handleSelectTransition,
    handleChangeTransition,
    handleCloseTransitionPicker,
    handleCompileProject: compileController.handleCompileProject,
    handleSaveCompiledVideo: compileController.handleSaveCompiledVideo,
    handleOpenCompiledVideo: compileController.handleOpenCompiledVideo,
    handlePickSceneVideo: sceneVideoController.handlePickSceneVideo,
    handleConfirmSceneVideoTrim:
      sceneVideoController.handleConfirmSceneVideoTrim,
    handleCancelSceneVideoTrim: sceneVideoController.handleCancelSceneVideoTrim,
    handleRemoveSceneVideo: sceneVideoController.handleRemoveSceneVideo,
  };
}
