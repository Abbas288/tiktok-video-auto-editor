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
 * Custom hook that encapsulates all expo-video logic and timeline synchronization.
 * Handles auto-play, seeking, and interval-based time reporting.
 */
export function useVideoSync({
  videoUrl,
  seekRequest,
  onTimeUpdate,
}: UseVideoSyncProps) {
  const player = useVideoPlayer(videoUrl || "", (p) => {
    p.loop = false;
    if (videoUrl) {
      p.play();
    }
  });

  useEffect(() => {
    if (player && seekRequest) {
      player.currentTime = seekRequest.time;
    }
  }, [seekRequest, player]);

  useEffect(() => {
    if (!player || !onTimeUpdate) return;

    const interval = setInterval(() => {
      onTimeUpdate(player.currentTime);
    }, 250);

    return () => clearInterval(interval);
  }, [player, onTimeUpdate]);

  return player;
}
