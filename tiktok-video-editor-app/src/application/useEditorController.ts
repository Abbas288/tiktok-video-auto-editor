import { useCallback, useMemo, useRef, useState } from "react";
import {
  CompileOutputKind,
  CompileStatus,
  SaveCompiledVideoStatus,
} from "../components/CompilePanel";
import { SceneVideoTrimDraft } from "../components/SceneVideoPanel";
import { buildCompilePayload } from "../domain/compile/compilePayload";
import {
  clampSceneVideoStart,
  createSceneVideoDecision,
} from "../domain/scene-video/sceneVideoSelection";
import { getSceneVideoReadiness } from "../domain/scene-video/sceneVideoReadiness";
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
import {
  compileService,
  CompileRendererName,
} from "../infrastructure/compileService";
import {
  pickSceneVideoCandidate,
  uploadSceneVideoCandidate,
} from "../infrastructure/sceneVideoAssetService";
import { saveCompiledVideoToDevice } from "../infrastructure/saveCompiledVideo";
import {
  ensureVideoReferenceAvailable,
  openVideoReference,
  UNAVAILABLE_VIDEO_MESSAGE,
} from "../infrastructure/videoReference";
import { TextOverlayUpdate } from "../store/useEditSession";
import {
  Scene,
  SceneVideoSource,
  Template,
  Transition,
} from "../types/template";
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
  compileStatus: CompileStatus;
  compileMessage: string | null;
  compiledOutputUrl: string | null;
  compiledOutputKind: CompileOutputKind;
  saveStatus: SaveCompiledVideoStatus;
  saveMessage: string | null;
  sceneVideoMessage: string | null;
  sceneVideoTrimDraft: SceneVideoTrimDraft | null;
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

const MANUAL_SEEK_GUARD_MS = 900;

export function useEditorController({
  templateId,
  onExitEditor,
}: UseEditorControllerProps): EditorControllerResult {
  const manualSeekGuardUntilRef = useRef<number>(0);

  const [seekRequest, setSeekRequest] = useState<SeekRequest>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState<boolean>(false);
  const [compileStatus, setCompileStatus] = useState<CompileStatus>("idle");
  const [compileMessage, setCompileMessage] = useState<string | null>(null);
  const [compiledOutputUrl, setCompiledOutputUrl] = useState<string | null>(
    null,
  );
  const [compiledOutputKind, setCompiledOutputKind] =
    useState<CompileOutputKind>("unknown");
  const [saveStatus, setSaveStatus] = useState<SaveCompiledVideoStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [sceneVideoMessage, setSceneVideoMessage] = useState<string | null>(
    null,
  );
  const [sceneVideoTrimDraft, setSceneVideoTrimDraft] =
    useState<SceneVideoTrimDraft | null>(null);
  const [isSceneVideoBusy, setIsSceneVideoBusy] = useState<boolean>(false);
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

  const resetFinishedOutput = useCallback((): void => {
    setCompiledOutputUrl(null);
    setCompiledOutputKind("unknown");
    setSaveStatus("idle");
    setSaveMessage(null);

    if (compileStatus !== "compiling") {
      setCompileStatus("idle");
      setCompileMessage(null);
    }
  }, [compileStatus]);

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

      manualSeekGuardUntilRef.current = Date.now() + MANUAL_SEEK_GUARD_MS;

      setSelectedTransitionSceneId(null);
      setCurrentTime(scene.startSeconds);
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
      if (Date.now() < manualSeekGuardUntilRef.current) {
        return;
      }

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

  const saveSceneVideoSource = useCallback(
    async (options: {
      sceneId: string;
      candidate: SceneVideoTrimDraft["candidate"];
      sourceStartSeconds: number;
      durationSeconds: number;
    }): Promise<void> => {
      const upload = await uploadSceneVideoCandidate(options.candidate);
      const source: SceneVideoSource = {
        type: "user",
        localUri: options.candidate.localUri,
        uploadUrl: upload.uploadUrl,
        fileName: upload.fileName,
        originalDurationSeconds: options.candidate.durationSeconds,
        sourceStartSeconds: options.sourceStartSeconds,
        durationSeconds: options.durationSeconds,
      };

      updateSceneVideoSource(options.sceneId, source);
      resetFinishedOutput();
      setSceneVideoMessage("Video approved.");
    },
    [resetFinishedOutput, updateSceneVideoSource],
  );

  const handlePickSceneVideo = useCallback(
    async (sceneId: string): Promise<void> => {
      const scene = currentTemplate?.scenes.find((item) => item.id === sceneId);

      if (!scene || isSceneVideoBusy) {
        return;
      }

      try {
        setIsSceneVideoBusy(true);
        setSceneVideoMessage(null);
        setSceneVideoTrimDraft(null);

        const candidate = await pickSceneVideoCandidate();

        if (!candidate) {
          return;
        }

        const decision = createSceneVideoDecision(
          candidate,
          scene.durationSeconds,
        );

        if (decision.type === "too-short") {
          setSceneVideoMessage(
            `Video is too short. Required: ${decision.requiredDurationSeconds}s.`,
          );
          return;
        }

        if (decision.type === "needs-trim") {
          setSceneVideoTrimDraft({
            sceneId,
            candidate: decision.candidate,
            maxStartSeconds: decision.maxStartSeconds,
            durationSeconds: decision.durationSeconds,
          });
          return;
        }

        await saveSceneVideoSource({
          sceneId,
          candidate: decision.candidate,
          sourceStartSeconds: decision.sourceStartSeconds,
          durationSeconds: decision.durationSeconds,
        });
      } catch (error) {
        setSceneVideoMessage(
          error instanceof Error ? error.message : "Could not select video.",
        );
      } finally {
        setIsSceneVideoBusy(false);
      }
    },
    [currentTemplate, isSceneVideoBusy, saveSceneVideoSource],
  );

  const handleConfirmSceneVideoTrim = useCallback(
    async (startSeconds: number): Promise<void> => {
      if (!sceneVideoTrimDraft || isSceneVideoBusy) {
        return;
      }

      try {
        setIsSceneVideoBusy(true);

        await saveSceneVideoSource({
          sceneId: sceneVideoTrimDraft.sceneId,
          candidate: sceneVideoTrimDraft.candidate,
          sourceStartSeconds: clampSceneVideoStart(
            startSeconds,
            sceneVideoTrimDraft.maxStartSeconds,
          ),
          durationSeconds: sceneVideoTrimDraft.durationSeconds,
        });

        setSceneVideoTrimDraft(null);
      } catch (error) {
        setSceneVideoMessage(
          error instanceof Error ? error.message : "Could not save video.",
        );
      } finally {
        setIsSceneVideoBusy(false);
      }
    },
    [isSceneVideoBusy, saveSceneVideoSource, sceneVideoTrimDraft],
  );

  const handleCancelSceneVideoTrim = useCallback((): void => {
    setSceneVideoTrimDraft(null);
  }, []);

  const handleRemoveSceneVideo = useCallback(
    (sceneId: string): void => {
      updateSceneVideoSource(sceneId, null);
      resetFinishedOutput();
      setSceneVideoTrimDraft(null);
      setSceneVideoMessage("Video removed.");
    },
    [resetFinishedOutput, updateSceneVideoSource],
  );

  const handleCompileProject = useCallback(async (): Promise<void> => {
    if (!currentTemplate || compileStatus === "compiling") {
      return;
    }

    const readiness = getSceneVideoReadiness(currentTemplate.scenes);

    if (!readiness.isReadyForCompile) {
      if (readiness.firstMissingScene) {
        selectScene(readiness.firstMissingScene.id);
      }

      setCompileStatus("error");
      setCompileMessage("Add videos for all scenes first.");
      return;
    }

    try {
      setCompileStatus("compiling");
      setCompileMessage("Compiling video...");
      setCompiledOutputUrl(null);
      setCompiledOutputKind("unknown");
      setSaveStatus("idle");
      setSaveMessage(null);

      const payload = buildCompilePayload(currentTemplate);
      const result = await compileService.compile(payload);
      const outputKind = toCompileOutputKind(result.renderer);
      const availableVideoUrl = await ensureVideoReferenceAvailable(
        result.compiledVideoUrl,
      );

      updateCompiledVideo(availableVideoUrl);
      setCompiledOutputUrl(availableVideoUrl);
      setCompiledOutputKind(outputKind);
      setCompileStatus("success");
      setCompileMessage(
        outputKind === "placeholder"
          ? "Preview output is ready."
          : "Rendered video is ready.",
      );
    } catch (error) {
      setCompiledOutputUrl(null);
      setCompiledOutputKind("unknown");
      setCompileStatus("error");
      setCompileMessage(
        error instanceof Error
          ? error.message
          : "Compile failed. Please try again.",
      );
    }
  }, [compileStatus, currentTemplate, selectScene, updateCompiledVideo]);

  const handleSaveCompiledVideo = useCallback(async (): Promise<void> => {
    if (!compiledOutputUrl || saveStatus === "saving") {
      return;
    }

    try {
      setSaveStatus("saving");
      setSaveMessage("Preparing video...");

      const result = await saveCompiledVideoToDevice(compiledOutputUrl);

      setSaveStatus("success");
      setSaveMessage(result.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The video could not be saved.";

      if (message === UNAVAILABLE_VIDEO_MESSAGE) {
        setCompiledOutputUrl(null);
        setCompiledOutputKind("unknown");
      }

      setSaveStatus("error");
      setSaveMessage(message);
    }
  }, [compiledOutputUrl, saveStatus]);

  const handleOpenCompiledVideo = useCallback(async (): Promise<void> => {
    if (!compiledOutputUrl) {
      return;
    }

    try {
      setSaveStatus("idle");
      setSaveMessage(null);
      await openVideoReference(compiledOutputUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The video could not be opened.";

      if (message === UNAVAILABLE_VIDEO_MESSAGE) {
        setCompiledOutputUrl(null);
        setCompiledOutputKind("unknown");
      }

      setSaveStatus("error");
      setSaveMessage(message);
    }
  }, [compiledOutputUrl]);

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
    compileStatus,
    compileMessage,
    compiledOutputUrl,
    compiledOutputKind,
    saveStatus,
    saveMessage,
    sceneVideoMessage,
    sceneVideoTrimDraft,
    isSceneVideoBusy,
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
    handleCompileProject,
    handleSaveCompiledVideo,
    handleOpenCompiledVideo,
    handlePickSceneVideo,
    handleConfirmSceneVideoTrim,
    handleCancelSceneVideoTrim,
    handleRemoveSceneVideo,
  };
}

function toCompileOutputKind(
  renderer: CompileRendererName | undefined,
): CompileOutputKind {
  if (renderer === "placeholder") {
    return "placeholder";
  }

  if (renderer === "ffmpeg") {
    return "rendered";
  }

  return "unknown";
}
