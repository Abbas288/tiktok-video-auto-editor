import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatPlaybackTime } from "../../domain/video/formatPlaybackTime";

interface StageControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onToggleFullscreen: () => void;
}

/**
 * Renders custom video controls inside the same stage as video and overlays.
 */
export function StageControls({
  isPlaying,
  isFullscreen,
  currentTime,
  duration,
  onTogglePlay,
  onToggleFullscreen,
}: StageControlsProps): React.JSX.Element {
  return (
    <View style={styles.controls} pointerEvents="box-none">
      <TouchableOpacity style={styles.button} onPress={onTogglePlay}>
        <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>

      <Text style={styles.timeText}>
        {formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}
      </Text>

      <TouchableOpacity style={styles.button} onPress={onToggleFullscreen}>
        <Text style={styles.buttonText}>
          {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    minHeight: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    zIndex: 50,
    elevation: 50,
  },
  button: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  timeText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
  },
});
