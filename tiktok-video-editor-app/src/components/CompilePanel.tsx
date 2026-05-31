import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

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
  const shouldShowCompileMessage =
    Boolean(message) && !(status === "success" && hasFinishedVideo);

  return (
    <View style={styles.panel} testID="compile-panel">
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Export</Text>
          <Text style={styles.description}>Compile and save.</Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isCompiling && styles.disabledButton]}
          onPress={onCompile}
          disabled={isCompiling}
          testID="compile-button"
          accessibilityRole="button"
          accessibilityLabel={isCompiling ? "Compiling video" : "Compile video"}
        >
          <MaterialIcons name="auto-awesome" size={17} color="#000000" />
          <Text style={styles.primaryButtonText}>
            {isCompiling ? "Compiling" : "Compile"}
          </Text>
        </TouchableOpacity>
      </View>

      {shouldShowCompileMessage ? (
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
            <View style={styles.outputReadyRow}>
              <View style={styles.outputIconBadge}>
                <MaterialIcons
                  name={getOutputIcon(outputKind)}
                  size={18}
                  color={colors.accent}
                />
              </View>

              <Text style={styles.outputTitle}>
                {getOutputTitle(outputKind)}
              </Text>
            </View>

            <View style={styles.formatBadge}>
              <Text style={styles.formatBadgeText}>MP4</Text>
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
              accessibilityRole="button"
              accessibilityLabel={getSaveButtonAccessibilityLabel()}
            >
              <MaterialIcons
                name={Platform.OS === "web" ? "download" : "save-alt"}
                size={17}
                color="#000000"
              />
              <Text style={styles.secondaryButtonText}>
                {isSaving ? "Saving" : getSaveButtonLabel()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostButton}
              onPress={onOpenCompiledVideo}
              testID="open-compiled-video-button"
              accessibilityRole="button"
              accessibilityLabel="Open video"
            >
              <MaterialIcons name="open-in-new" size={17} color={colors.text} />
              <Text style={styles.ghostButtonText}>Open</Text>
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
  return Platform.OS === "web" ? "Download" : "Save";
}

function getSaveButtonAccessibilityLabel(): string {
  return Platform.OS === "web" ? "Download video" : "Save video";
}

function getOutputIcon(outputKind: CompileOutputKind): MaterialIconName {
  if (outputKind === "placeholder") {
    return "science";
  }

  if (outputKind === "rendered") {
    return "task-alt";
  }

  return "check-circle";
}

function getOutputTitle(outputKind: CompileOutputKind): string {
  if (outputKind === "placeholder") {
    return "Preview ready";
  }

  return "Ready";
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 10,
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
    fontSize: 15,
    fontWeight: "900",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  primaryButton: {
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 6,
  },
  primaryButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.65,
  },
  message: {
    fontSize: 13,
    fontWeight: "800",
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: colors.background,
    padding: 12,
    gap: 10,
  },
  outputHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  outputReadyRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  outputIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 255, 208, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 208, 0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  outputTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  formatBadge: {
    borderRadius: 999,
    backgroundColor: "#1F2933",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  formatBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
  },
  outputButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  secondaryButton: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 6,
  },
  secondaryButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "900",
  },
  ghostButton: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2F3B45",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 6,
  },
  ghostButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
});
