import { useEffect } from "react";
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
 * Encapsulates expo-video player setup, timeline seeking and time reporting.
 */
export function useVideoSync({
  videoUrl,
  seekRequest,
  onTimeUpdate,
}: UseVideoSyncProps) {
  const player = useVideoPlayer(videoUrl ?? null, (createdPlayer) => {
    createdPlayer.loop = false;
    createdPlayer.timeUpdateEventInterval = 0.1;

    if (videoUrl) {
      createdPlayer.play();
    }
  });

  useEffect(() => {
    if (!seekRequest) {
      return;
    }

    player.currentTime = seekRequest.time;
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
