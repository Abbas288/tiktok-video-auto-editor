import React from "react";
import { StyleSheet, View } from "react-native";
import { VideoView, type VideoPlayer as ExpoVideoPlayer } from "expo-video";
import { MediaRect } from "../../domain/video/videoCanvas";

interface VideoSurfaceProps {
  player: ExpoVideoPlayer;
  mediaRect: MediaRect;
}

/**
 * Renders only the video surface inside the exact media rectangle.
 *
 * The media rectangle is calculated by VideoStage. This component should never
 * own fullscreen or overlay layout.
 */
export function VideoSurface({
  player,
  mediaRect,
}: VideoSurfaceProps): React.JSX.Element {
  return (
    <View style={[styles.surface, mediaRect]}>
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
  surface: {
    position: "absolute",
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
