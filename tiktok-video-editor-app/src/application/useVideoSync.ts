import { useEffect, useMemo, useRef } from "react";
import {
  useVideoPlayer,
  type VideoPlayer as ExpoVideoPlayer,
} from "expo-video";

export interface SeekRequest {
  time: number;
  timestamp: number;
}

interface UseVideoSyncProps {
  videoUrl: string | undefined;
  seekRequest?: SeekRequest;
  onTimeUpdate?: (time: number) => void;
  timelineStartSeconds?: number;
  sourceStartSeconds?: number;
  sourceEndSeconds?: number;
}

type ReplaceableVideoPlayer = ExpoVideoPlayer & {
  replaceAsync?: (source: string) => Promise<void>;
  replace?: (source: string) => void;
};

const TIME_UPDATE_INTERVAL_SECONDS = 0.033;
const TIME_UPDATE_INTERVAL_MS = 33;
const END_TOLERANCE_SECONDS = 0.05;

export function useVideoSync({
  videoUrl,
  seekRequest,
  onTimeUpdate,
  timelineStartSeconds = 0,
  sourceStartSeconds = 0,
  sourceEndSeconds,
}: UseVideoSyncProps): ExpoVideoPlayer {
  const sourceUrl = useMemo(() => normalizeMediaUrl(videoUrl), [videoUrl]);
  const loadedSourceUrlRef = useRef<string | null>(null);
  const continuePlaybackRef = useRef<boolean>(false);
  const replaceTokenRef = useRef<number>(0);

  const player = useVideoPlayer(null, (createdPlayer) => {
    createdPlayer.loop = false;
    createdPlayer.timeUpdateEventInterval = TIME_UPDATE_INTERVAL_SECONDS;
  });

  useExpectedMediaAbortGuard();

  useEffect(() => {
    let isActive = true;
    const replaceToken = replaceTokenRef.current + 1;

    replaceTokenRef.current = replaceToken;

    async function replaceSource(): Promise<void> {
      if (!sourceUrl) {
        loadedSourceUrlRef.current = null;
        continuePlaybackRef.current = false;
        safePause(player);
        return;
      }

      if (loadedSourceUrlRef.current === sourceUrl) {
        return;
      }

      const shouldPlayAfterReplace =
        player.playing || continuePlaybackRef.current;

      safePause(player);

      try {
        await safeReplaceSource(player, sourceUrl);

        if (!isActive || replaceTokenRef.current !== replaceToken) {
          return;
        }

        loadedSourceUrlRef.current = sourceUrl;
        player.currentTime = Math.max(sourceStartSeconds, 0);

        if (shouldPlayAfterReplace) {
          safePlay(player);
        }
      } catch (error) {
        if (!isExpectedMediaAbortError(error)) {
          console.warn("Unable to replace video source.", error);
        }
      }
    }

    void replaceSource();

    return () => {
      isActive = false;
    };
  }, [player, sourceStartSeconds, sourceUrl]);

  useEffect(() => {
    if (!sourceUrl || !seekRequest) {
      return;
    }

    const localTime = Math.max(seekRequest.time - timelineStartSeconds, 0);

    player.currentTime = Math.max(sourceStartSeconds + localTime, 0);
  }, [
    player,
    seekRequest,
    sourceStartSeconds,
    sourceUrl,
    timelineStartSeconds,
  ]);

  useEffect(() => {
    if (!onTimeUpdate || !sourceUrl) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      const currentSourceTime = Math.max(player.currentTime, 0);

      if (player.playing) {
        continuePlaybackRef.current = true;
      }

      if (
        typeof sourceEndSeconds === "number" &&
        currentSourceTime >= sourceEndSeconds - END_TOLERANCE_SECONDS
      ) {
        onTimeUpdate(
          timelineStartSeconds +
            Math.max(sourceEndSeconds - sourceStartSeconds, 0),
        );
        return;
      }

      onTimeUpdate(
        timelineStartSeconds +
          Math.max(currentSourceTime - sourceStartSeconds, 0),
      );
    }, TIME_UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    onTimeUpdate,
    player,
    sourceEndSeconds,
    sourceStartSeconds,
    sourceUrl,
    timelineStartSeconds,
  ]);

  return player;
}

function useExpectedMediaAbortGuard(): void {
  useEffect(() => {
    const globalWithEvents = globalThis as typeof globalThis & {
      addEventListener?: (type: string, listener: EventListener) => void;
      removeEventListener?: (type: string, listener: EventListener) => void;
    };

    if (
      typeof globalWithEvents.addEventListener !== "function" ||
      typeof globalWithEvents.removeEventListener !== "function"
    ) {
      return undefined;
    }

    const listener: EventListener = (event) => {
      const rejectionEvent = event as Event & {
        reason?: unknown;
        preventDefault: () => void;
      };

      if (isExpectedMediaAbortError(rejectionEvent.reason)) {
        rejectionEvent.preventDefault();
      }
    };

    globalWithEvents.addEventListener("unhandledrejection", listener);

    return () => {
      globalWithEvents.removeEventListener?.("unhandledrejection", listener);
    };
  }, []);
}

async function safeReplaceSource(
  player: ExpoVideoPlayer,
  sourceUrl: string,
): Promise<void> {
  const replaceablePlayer = player as ReplaceableVideoPlayer;

  if (replaceablePlayer.replaceAsync) {
    await replaceablePlayer.replaceAsync(sourceUrl);
    return;
  }

  replaceablePlayer.replace?.(sourceUrl);
}

function safePlay(player: ExpoVideoPlayer): void {
  try {
    const result = player.play();

    void Promise.resolve(result).catch((error) => {
      if (!isExpectedMediaAbortError(error)) {
        console.warn("Unable to play video.", error);
      }
    });
  } catch (error) {
    if (!isExpectedMediaAbortError(error)) {
      console.warn("Unable to play video.", error);
    }
  }
}

function safePause(player: ExpoVideoPlayer): void {
  try {
    if (player.playing) {
      player.pause();
    }
  } catch (error) {
    if (!isExpectedMediaAbortError(error)) {
      console.warn("Unable to pause video.", error);
    }
  }
}

function normalizeMediaUrl(url: string | undefined): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmedUrl = url.trim();

  return trimmedUrl.length > 0 ? trimmedUrl : null;
}

function isExpectedMediaAbortError(error: unknown): boolean {
  if (!(error instanceof Error || typeof error === "object")) {
    return false;
  }

  const name =
    error && "name" in error && typeof error.name === "string"
      ? error.name
      : "";

  const message =
    error && "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return (
    name === "AbortError" ||
    message.includes("media resource was aborted") ||
    message.includes("play() request was interrupted") ||
    message.includes("The fetching process for the media resource was aborted")
  );
}
