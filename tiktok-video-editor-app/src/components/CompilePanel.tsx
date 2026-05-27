import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { colors } from "../styles/theme";

export type CompileStatus = "idle" | "compiling" | "success" | "error";

export interface CompilePanelProps {
  status: CompileStatus;
  message: string | null;
  compiledVideoUrl?: string | null;
  onCompile: () => void;
}

/**
 * Renders compile actions, compile status and compiled video preview.
 *
 * @param props Compile status, result URL and compile handler.
 * @returns Compile panel element.
 */
export function CompilePanel({
  status,
  message,
  compiledVideoUrl,
  onCompile,
}: CompilePanelProps): React.JSX.Element {
  const isCompiling = status === "compiling";

  return (
    <View style={styles.panel} testID="compile-panel">
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Compile video</Text>
          <Text style={styles.description}>
            Send the current editing session to the compile server.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isCompiling && styles.disabledButton]}
          onPress={onCompile}
          disabled={isCompiling}
          testID="compile-button"
        >
          <Text style={styles.buttonText}>
            {isCompiling ? "Compiling..." : "Start compile"}
          </Text>
        </TouchableOpacity>
      </View>

      {message ? (
        <Text
          style={[
            styles.message,
            status === "error" ? styles.errorText : styles.successText,
          ]}
          testID="compile-message"
        >
          {message}
        </Text>
      ) : null}

      {compiledVideoUrl ? (
        <CompiledVideoPreview compiledVideoUrl={compiledVideoUrl} />
      ) : null}
    </View>
  );
}

interface CompiledVideoPreviewProps {
  compiledVideoUrl: string;
}

/**
 * Renders the compiled video returned by the compile server.
 *
 * @param props Compiled video URL.
 * @returns Compiled video preview element.
 */
function CompiledVideoPreview({
  compiledVideoUrl,
}: CompiledVideoPreviewProps): React.JSX.Element {
  const player = useVideoPlayer(compiledVideoUrl, (createdPlayer) => {
    createdPlayer.loop = true;
    createdPlayer.timeUpdateEventInterval = 0.25;
  });

  return (
    <View style={styles.previewWrapper} testID="compiled-video-preview">
      <VideoView
        style={styles.previewVideo}
        player={player}
        nativeControls
        contentFit="contain"
        allowsPictureInPicture={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  button: {
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
  },
  message: {
    fontSize: 13,
    fontWeight: "700",
  },
  successText: {
    color: colors.accent,
  },
  errorText: {
    color: colors.error,
  },
  previewWrapper: {
    width: "100%",
    aspectRatio: 9 / 16,
    maxHeight: 520,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  previewVideo: {
    width: "100%",
    height: "100%",
  },
});
