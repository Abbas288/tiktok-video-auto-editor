import React from "react";
import { StyleSheet, View } from "react-native";
import { VideoView } from "expo-video";
import { colors } from "../styles/theme";
import { VideoErrorState } from "./VideoErrorState";
import { useVideoSync, SeekRequest } from "../application/useVideoSync";

interface VideoPlayerProps {
  videoUrl?: string;
  seekRequest?: SeekRequest;
  onTimeUpdate?: (time: number) => void;
}

/**
 * Main video player component.
 * Uses useVideoSync for logic and delegates error rendering to VideoErrorState.
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
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    margin: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: colors.surface || "#1a1a1a",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
