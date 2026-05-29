import { useCallback, useRef, useState } from "react";
import { getActiveSceneIdAtTime } from "../domain/video/getActiveSceneIdAtTime";
import { Template } from "../types/template";
import { SeekRequest } from "./useVideoSync";

interface UseEditorTimelineControllerProps {
  currentTemplate: Template | null;
  activeSceneId: string | null;
  selectScene: (sceneId: string) => void;
}

interface UseEditorTimelineControllerResult {
  seekRequest: SeekRequest | undefined;
  currentTime: number;
  isDraggingOverlay: boolean;
  handleSceneClick: (sceneId: string) => void;
  handleTimeUpdate: (time: number) => void;
  handleDragStart: () => void;
  handleDragEnd: () => void;
}

const MANUAL_SEEK_GUARD_MS = 900;

export function useEditorTimelineController({
  currentTemplate,
  activeSceneId,
  selectScene,
}: UseEditorTimelineControllerProps): UseEditorTimelineControllerResult {
  const manualSeekGuardUntilRef = useRef<number>(0);

  const [seekRequest, setSeekRequest] = useState<SeekRequest>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState<boolean>(false);

  const handleSceneClick = useCallback(
    (sceneId: string): void => {
      const scene = currentTemplate?.scenes.find((item) => item.id === sceneId);

      if (!scene) {
        return;
      }

      manualSeekGuardUntilRef.current = Date.now() + MANUAL_SEEK_GUARD_MS;

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

  return {
    seekRequest,
    currentTime,
    isDraggingOverlay,
    handleSceneClick,
    handleTimeUpdate,
    handleDragStart,
    handleDragEnd,
  };
}
