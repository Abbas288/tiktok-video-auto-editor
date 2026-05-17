import React from "react";
import { StyleSheet, View } from "react-native";
import { VideoView } from "expo-video";
import { SeekRequest, useVideoSync } from "../application/useVideoSync";
import { VideoErrorState } from "./VideoErrorState";

interface VideoPlayerProps {
  videoUrl?: string;
  seekRequest?: SeekRequest;
  onTimeUpdate?: (time: number) => void;
}

/**
 * Legacy standalone video player.
 *
 * Editor preview should use VideoStage instead. This component is kept as a
 * simple video-only fallback for places where overlays are not required.
 */
export function VideoPlayer({
  videoUrl,
  seekRequest,
  onTimeUpdate,
}: VideoPlayerProps): React.JSX.Element {
  const player = useVideoSync({ videoUrl, seekRequest, onTimeUpdate });

  if (!videoUrl) {
    return <VideoErrorState />;
  }

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={false}
        contentFit="fill"
        allowsPictureInPicture={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
