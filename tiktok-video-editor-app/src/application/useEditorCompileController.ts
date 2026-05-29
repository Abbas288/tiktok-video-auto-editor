import { useCallback, useState } from "react";
import {
  CompileOutputKind,
  CompileStatus,
  SaveCompiledVideoStatus,
} from "../components/CompilePanel";
import { buildCompilePayload } from "../domain/compile/compilePayload";
import { getSceneVideoReadiness } from "../domain/scene-video/sceneVideoReadiness";
import { compileService } from "../infrastructure/compileService";
import { saveCompiledVideoToDevice } from "../infrastructure/saveCompiledVideo";
import {
  ensureVideoReferenceAvailable,
  openVideoReference,
  UNAVAILABLE_VIDEO_MESSAGE,
} from "../infrastructure/videoReference";
import { Template } from "../types/template";
import {
  createMissingSceneVideosMessage,
  createSuccessfulCompileMessage,
  toCompileOutputKind,
} from "./editorCompileController";

interface UseEditorCompileControllerProps {
  currentTemplate: Template | null;
  selectScene: (sceneId: string) => void;
  updateCompiledVideo: (compiledVideoUrl: string) => void;
}

interface UseEditorCompileControllerResult {
  compileStatus: CompileStatus;
  compileMessage: string | null;
  compiledOutputUrl: string | null;
  compiledOutputKind: CompileOutputKind;
  saveStatus: SaveCompiledVideoStatus;
  saveMessage: string | null;
  resetFinishedOutput: () => void;
  handleCompileProject: () => Promise<void>;
  handleSaveCompiledVideo: () => Promise<void>;
  handleOpenCompiledVideo: () => Promise<void>;
}

export function useEditorCompileController({
  currentTemplate,
  selectScene,
  updateCompiledVideo,
}: UseEditorCompileControllerProps): UseEditorCompileControllerResult {
  const [compileStatus, setCompileStatus] = useState<CompileStatus>("idle");
  const [compileMessage, setCompileMessage] = useState<string | null>(null);
  const [compiledOutputUrl, setCompiledOutputUrl] = useState<string | null>(
    null,
  );
  const [compiledOutputKind, setCompiledOutputKind] =
    useState<CompileOutputKind>("unknown");
  const [saveStatus, setSaveStatus] = useState<SaveCompiledVideoStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const resetFinishedOutput = useCallback((): void => {
    setCompiledOutputUrl(null);
    setCompiledOutputKind("unknown");
    setSaveStatus("idle");
    setSaveMessage(null);

    setCompileStatus((currentStatus) => {
      if (currentStatus === "compiling") {
        return currentStatus;
      }

      setCompileMessage(null);
      return "idle";
    });
  }, []);

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
      setCompileMessage(createMissingSceneVideosMessage());
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
      setCompileMessage(createSuccessfulCompileMessage(outputKind));
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
    compileStatus,
    compileMessage,
    compiledOutputUrl,
    compiledOutputKind,
    saveStatus,
    saveMessage,
    resetFinishedOutput,
    handleCompileProject,
    handleSaveCompiledVideo,
    handleOpenCompiledVideo,
  };
}
