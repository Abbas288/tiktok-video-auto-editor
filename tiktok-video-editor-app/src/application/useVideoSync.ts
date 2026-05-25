import { useEffect, useMemo } from "react";
import { useVideoPlayer } from "expo-video";

export interface SeekRequest {
  time: number;
  timestamp: number;
}

interface UseVideoSyncProps {
  videoUrl: string | undefined;
  seekRequest?: SeekRequest;
  onTimeUpdate?: (time: number) => void;
}

const TIME_UPDATE_INTERVAL_SECONDS = 0.033;
const TIME_UPDATE_POLL_INTERVAL_MS = 33;

/**
 * Encapsulates expo-video player setup, timeline seeking and time reporting.
 *
 * @param props Video source, optional seek request and time update handler.
 * @returns Expo video player instance.
 */
export function useVideoSync({
  videoUrl,
  seekRequest,
  onTimeUpdate,
}: UseVideoSyncProps) {
  const sourceUrl = useMemo(() => normalizeMediaUrl(videoUrl), [videoUrl]);

  const player = useVideoPlayer(sourceUrl, (createdPlayer) => {
    createdPlayer.loop = false;
    createdPlayer.timeUpdateEventInterval = TIME_UPDATE_INTERVAL_SECONDS;
  });

  useEffect(() => {
    if (!seekRequest) {
      return;
    }

    player.currentTime = Math.max(seekRequest.time, 0);
  }, [player, seekRequest]);

  useEffect(() => {
    if (!onTimeUpdate) {
      return undefined;
    }

    const interval = setInterval(() => {
      onTimeUpdate(player.currentTime);
    }, TIME_UPDATE_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [onTimeUpdate, player]);

  return player;
}

function normalizeMediaUrl(url: string | undefined): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmedUrl = url.trim();

  return trimmedUrl.length > 0 ? trimmedUrl : null;
}
