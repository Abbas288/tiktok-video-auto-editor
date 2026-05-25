import { useCallback, useEffect, useMemo, useRef } from "react";
import { useVideoPlayer } from "expo-video";
import { TransitionSimulation } from "../domain/video/transitionSimulation";

interface UseTransitionPreviewPlayerProps {
  videoUrl: string | undefined;
  simulation: TransitionSimulation | null;
  isPlaying: boolean;
}

/**
 * Controls a muted secondary video player used for slide transition preview.
 *
 * Fade transitions are intentionally not handled here because they are rendered
 * as a pure overlay to avoid sync glitches.
 *
 * @param props Video source, active transition simulation and playback state.
 * @returns Secondary preview video player.
 */
export function useTransitionPreviewPlayer({
  videoUrl,
  simulation,
  isPlaying,
}: UseTransitionPreviewPlayerProps) {
  const sourceUrl = useMemo(() => normalizeMediaUrl(videoUrl), [videoUrl]);
  const activeTransitionKeyRef = useRef<string | null>(null);

  const player = useVideoPlayer(sourceUrl, (createdPlayer) => {
    createdPlayer.loop = false;
    createdPlayer.muted = true;
    createdPlayer.volume = 0;
    createdPlayer.timeUpdateEventInterval = 0.033;
  });

  const pausePreview = useCallback((): void => {
    if (player.playing) {
      player.pause();
    }
  }, [player]);

  const playPreview = useCallback((): void => {
    if (!player.playing) {
      runPreviewCommand(() => player.play());
    }
  }, [player]);

  useEffect(() => {
    player.muted = true;
    player.volume = 0;
  }, [player]);

  useEffect(() => {
    if (!simulation) {
      activeTransitionKeyRef.current = null;
      pausePreview();
      return;
    }

    const didTransitionChange =
      activeTransitionKeyRef.current !== simulation.transitionKey;

    if (didTransitionChange || !isPlaying) {
      player.currentTime = Math.max(simulation.previewTimeSeconds, 0);
      activeTransitionKeyRef.current = simulation.transitionKey;
    }

    if (isPlaying) {
      playPreview();
      return;
    }

    pausePreview();
  }, [isPlaying, pausePreview, playPreview, player, simulation]);

  useEffect(
    () => () => {
      pausePreview();
    },
    [pausePreview],
  );

  return player;
}

function normalizeMediaUrl(url: string | undefined): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmedUrl = url.trim();

  return trimmedUrl.length > 0 ? trimmedUrl : null;
}

function runPreviewCommand(command: () => void): void {
  try {
    command();
  } catch (error) {
    handlePreviewError(error);
  }
}

function handlePreviewError(error: unknown): void {
  console.warn("Unable to control transition preview player.", error);
}
