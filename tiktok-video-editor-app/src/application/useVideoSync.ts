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

/**
 * Encapsulates main video player setup, seeking and time reporting.
 *
 * @param props Main video synchronization properties.
 * @returns Main video player instance.
 */
export function useVideoSync({
  videoUrl,
  seekRequest,
  onTimeUpdate,
}: UseVideoSyncProps) {
  const sourceUrl = useMemo(() => normalizeMediaUrl(videoUrl), [videoUrl]);

  const player = useVideoPlayer(sourceUrl, (createdPlayer) => {
    createdPlayer.loop = false;
    createdPlayer.timeUpdateEventInterval = 0.1;
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
    }, 100);

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
