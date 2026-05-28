import React from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../styles/theme";

export type CompileStatus = "idle" | "compiling" | "success" | "error";
export type SaveCompiledVideoStatus = "idle" | "saving" | "success" | "error";
export type CompileOutputKind = "unknown" | "placeholder" | "rendered";

export interface CompilePanelProps {
  status: CompileStatus;
  message: string | null;
  compiledVideoUrl?: string | null;
  outputKind?: CompileOutputKind;
  saveStatus?: SaveCompiledVideoStatus;
  saveMessage?: string | null;
  onCompile: () => void;
  onSaveCompiledVideo?: () => void;
  onOpenCompiledVideo?: () => void;
}

/**
 * Renders compile actions, compile status and actions for the finished output.
 *
 * @param props Compile state, output state and handlers.
 * @returns Compile panel element.
 */
export function CompilePanel({
  status,
  message,
  compiledVideoUrl,
  outputKind = "unknown",
  saveStatus = "idle",
  saveMessage = null,
  onCompile,
  onSaveCompiledVideo,
  onOpenCompiledVideo,
}: CompilePanelProps): React.JSX.Element {
  const isCompiling = status === "compiling";
  const isSaving = saveStatus === "saving";
  const hasFinishedVideo = status === "success" && Boolean(compiledVideoUrl);

  return (
    <View style={styles.panel} testID="compile-panel">
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Export video</Text>
          <Text style={styles.description}>
            Compile the current edit, then save or open the finished video.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isCompiling && styles.disabledButton]}
          onPress={onCompile}
          disabled={isCompiling}
          testID="compile-button"
        >
          <Text style={styles.primaryButtonText}>
            {isCompiling ? "Compiling..." : "Start compile"}
          </Text>
        </TouchableOpacity>
      </View>

      {message ? (
        <Text
          style={[styles.message, getCompileMessageStyle(status)]}
          testID="compile-message"
        >
          {message}
        </Text>
      ) : null}

      {hasFinishedVideo ? (
        <View style={styles.outputCard} testID="compiled-output-card">
          <View style={styles.outputHeaderRow}>
            <View style={styles.outputTitleColumn}>
              <Text style={styles.outputTitle}>Finished video ready</Text>
              <Text style={styles.outputDescription}>
                {getOutputDescription(outputKind)}
              </Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getOutputBadge(outputKind)}</Text>
            </View>
          </View>

          <View style={styles.outputButtonRow}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isSaving && styles.disabledButton,
              ]}
              onPress={onSaveCompiledVideo}
              disabled={isSaving}
              testID="save-compiled-video-button"
            >
              <Text style={styles.secondaryButtonText}>
                {isSaving ? "Saving..." : getSaveButtonLabel()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostButton}
              onPress={onOpenCompiledVideo}
              testID="open-compiled-video-button"
            >
              <Text style={styles.ghostButtonText}>Open video</Text>
            </TouchableOpacity>
          </View>

          {saveMessage ? (
            <Text
              style={[
                styles.message,
                saveStatus === "error" ? styles.errorText : styles.successText,
              ]}
              testID="save-compiled-video-message"
            >
              {saveMessage}
            </Text>
          ) : null}
        </View>
      ) : saveMessage ? (
        <Text
          style={[
            styles.message,
            saveStatus === "error" ? styles.errorText : styles.successText,
          ]}
          testID="save-compiled-video-message"
        >
          {saveMessage}
        </Text>
      ) : null}
    </View>
  );
}

function getCompileMessageStyle(status: CompileStatus): StyleProp<TextStyle> {
  if (status === "compiling") {
    return styles.warningText;
  }

  if (status === "error") {
    return styles.errorText;
  }

  return styles.successText;
}

function getSaveButtonLabel(): string {
  return Platform.OS === "web" ? "Download video" : "Save to gallery";
}

function getOutputBadge(outputKind: CompileOutputKind): string {
  if (outputKind === "placeholder") {
    return "Preview";
  }

  if (outputKind === "rendered") {
    return "Rendered";
  }

  return "Ready";
}

function getOutputDescription(outputKind: CompileOutputKind): string {
  if (outputKind === "placeholder") {
    return "Development output is available. It can be opened or downloaded, but it may not contain all edits.";
  }

  if (outputKind === "rendered") {
    return "The latest rendered output is available for saving or opening.";
  }

  return "The latest output is available for saving or opening.";
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
  primaryButton: {
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.65,
  },
  message: {
    fontSize: 13,
    fontWeight: "700",
  },
  successText: {
    color: colors.accent,
  },
  warningText: {
    color: "#FACC15",
  },
  errorText: {
    color: colors.error,
  },
  outputCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: colors.background,
    padding: 14,
    gap: 12,
  },
  outputHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  outputTitleColumn: {
    flex: 1,
  },
  outputTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  outputDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: "#1F2933",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  outputButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  secondaryButton: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
  },
  ghostButton: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2F3B45",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  ghostButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
});
