import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { colors } from "../styles/theme";

interface VideoPlayerProps {
  videoUrl?: string;
}

/**
 * Renders a video player using expo-video.
 * If the video URL is missing or invalid, it displays a clear error state.
 */
export function VideoPlayer({ videoUrl }: VideoPlayerProps): React.JSX.Element {
  const player = useVideoPlayer(videoUrl || "", (p) => {
    p.loop = true;
    if (videoUrl) {
      p.play();
    }
  });

  if (!videoUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Could not load video (might be broken link)
        </Text>
      </View>
    );
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
  errorContainer: {
    height: 250,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface || "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.error || "#FF5D73",
  },
  errorText: {
    color: colors.error || "#FF5D73",
    fontSize: 16,
    fontWeight: "bold",
  },
});
