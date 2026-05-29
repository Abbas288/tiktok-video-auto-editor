import { useCallback, useState } from "react";
import {
  clampSceneVideoStart,
  createSceneVideoDecision,
} from "../domain/scene-video/sceneVideoSelection";
import {
  pickSceneVideoCandidate,
  uploadSceneVideoCandidate,
} from "../infrastructure/sceneVideoAssetService";
import { SceneVideoTrimDraft } from "../types/sceneVideo";
import { SceneVideoSource, Template } from "../types/template";
import { createSceneVideoSource } from "./sceneVideoSourceFactory";

interface UseSceneVideoControllerProps {
  currentTemplate: Template | null;
  isSceneVideoBusy?: boolean;
  updateSceneVideoSource: (
    sceneId: string,
    videoSource: SceneVideoSource | null,
  ) => void;
  resetFinishedOutput: () => void;
}

interface UseSceneVideoControllerResult {
  sceneVideoMessage: string | null;
  sceneVideoTrimDraft: SceneVideoTrimDraft | null;
  isSceneVideoBusy: boolean;
  handlePickSceneVideo: (sceneId: string) => Promise<void>;
  handleConfirmSceneVideoTrim: (startSeconds: number) => Promise<void>;
  handleCancelSceneVideoTrim: () => void;
  handleRemoveSceneVideo: (sceneId: string) => void;
}

export function useSceneVideoController({
  currentTemplate,
  updateSceneVideoSource,
  resetFinishedOutput,
}: UseSceneVideoControllerProps): UseSceneVideoControllerResult {
  const [sceneVideoMessage, setSceneVideoMessage] = useState<string | null>(
    null,
  );
  const [sceneVideoTrimDraft, setSceneVideoTrimDraft] =
    useState<SceneVideoTrimDraft | null>(null);
  const [isSceneVideoBusy, setIsSceneVideoBusy] = useState<boolean>(false);

  const saveSceneVideoSource = useCallback(
    async (options: {
      sceneId: string;
      candidate: SceneVideoTrimDraft["candidate"];
      sourceStartSeconds: number;
      durationSeconds: number;
    }): Promise<void> => {
      const upload = await uploadSceneVideoCandidate(options.candidate);
      const source = createSceneVideoSource({
        candidate: options.candidate,
        upload,
        sourceStartSeconds: options.sourceStartSeconds,
        durationSeconds: options.durationSeconds,
      });

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

  return {
    sceneVideoMessage,
    sceneVideoTrimDraft,
    isSceneVideoBusy,
    handlePickSceneVideo,
    handleConfirmSceneVideoTrim,
    handleCancelSceneVideoTrim,
    handleRemoveSceneVideo,
  };
}
