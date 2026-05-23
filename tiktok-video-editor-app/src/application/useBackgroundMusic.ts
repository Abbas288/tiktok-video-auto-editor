import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { SeekRequest } from "./useVideoSync";

/**
 * Properties required for background music playback synchronization.
 */
export interface UseBackgroundMusicProps {
  url?: string;
  volume: number;
  isPlaying: boolean;
  seekRequest?: SeekRequest;
}

/**
 * Controller returned by the background music hook.
 */
export interface BackgroundMusicController {
  isAvailable: boolean;
  isPlaying: boolean;
  playFromUserGesture: () => void;
  pause: () => void;
}

const PLAY_SYNC_DELAY_MS = 80;

/**
 * Synchronizes a background audio layer with the main video player.
 *
 * @param props Background music synchronization properties.
 * @returns Background music controller.
 */
export function useBackgroundMusic({
  url,
  volume,
  isPlaying,
  seekRequest,
}: UseBackgroundMusicProps): BackgroundMusicController {
  const sourceUrl = useMemo(() => normalizePlayableAudioUrl(url), [url]);
  const player = useAudioPlayer(sourceUrl, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  const desiredPlayingRef = useRef<boolean>(false);
  const operationIdRef = useRef<number>(0);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPlayTimer = useCallback((): void => {
    if (!playTimerRef.current) {
      return;
    }

    clearTimeout(playTimerRef.current);
    playTimerRef.current = null;
  }, []);

  const pause = useCallback((): void => {
    desiredPlayingRef.current = false;
    operationIdRef.current += 1;
    clearPlayTimer();

    if (player.playing) {
      runAudioCommand(() => player.pause());
    }
  }, [clearPlayTimer, player]);

  const playNow = useCallback((): void => {
    if (!sourceUrl || player.playing) {
      return;
    }

    runAudioCommand(() => player.play());
  }, [player, sourceUrl]);

  const schedulePlay = useCallback((): void => {
    if (!sourceUrl) {
      pause();
      return;
    }

    desiredPlayingRef.current = true;

    const operationId = operationIdRef.current + 1;
    operationIdRef.current = operationId;

    clearPlayTimer();

    playTimerRef.current = setTimeout(() => {
      const isCurrentOperation = operationId === operationIdRef.current;

      if (!isCurrentOperation || !desiredPlayingRef.current) {
        return;
      }

      playNow();
    }, PLAY_SYNC_DELAY_MS);
  }, [clearPlayTimer, pause, playNow, sourceUrl]);

  const playFromUserGesture = useCallback((): void => {
    if (!sourceUrl) {
      return;
    }

    desiredPlayingRef.current = true;
    operationIdRef.current += 1;
    clearPlayTimer();
    playNow();
  }, [clearPlayTimer, playNow, sourceUrl]);

  useEffect(() => {
    const safeVolume = clampVolume(volume);

    player.loop = true;
    player.volume = safeVolume;
    player.muted = safeVolume === 0;
  }, [player, volume]);

  useEffect(() => {
    if (!sourceUrl) {
      pause();
      return;
    }

    if (isPlaying) {
      schedulePlay();
      return;
    }

    pause();
  }, [isPlaying, pause, schedulePlay, sourceUrl]);

  useEffect(() => {
    if (!sourceUrl || !seekRequest) {
      return;
    }

    void player.seekTo(Math.max(seekRequest.time, 0)).catch(handleAudioError);
  }, [player, seekRequest, sourceUrl]);

  useEffect(
    () => () => {
      desiredPlayingRef.current = false;
      clearPlayTimer();

      if (player.playing) {
        runAudioCommand(() => player.pause());
      }
    },
    [clearPlayTimer, player],
  );

  return {
    isAvailable: Boolean(sourceUrl),
    isPlaying: status.playing,
    playFromUserGesture,
    pause,
  };
}

function normalizePlayableAudioUrl(url: string | undefined): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmedUrl = url.trim();

  return trimmedUrl.length > 0 ? trimmedUrl : null;
}

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(Math.max(value, 0), 1);
}

function runAudioCommand(command: () => void): void {
  try {
    command();
  } catch (error) {
    handleAudioError(error);
  }
}

function handleAudioError(error: unknown): void {
  console.warn("Unable to control background music.", error);
}
