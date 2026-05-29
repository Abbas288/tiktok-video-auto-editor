import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  clampSceneVideoStart,
  formatSceneVideoSeconds,
} from "../domain/scene-video/sceneVideoSelection";
import { getSceneUploadMetadata } from "../domain/scene-video/sceneVideoReadiness";
import { colors } from "../styles/theme";
import { SceneVideoTrimDraft } from "../types/sceneVideo";
import { Scene } from "../types/template";

interface SceneVideoPanelProps {
  scene: Scene | null;
  message: string | null;
  trimDraft: SceneVideoTrimDraft | null;
  isBusy: boolean;
  onPickVideo: (sceneId: string) => void;
  onConfirmTrim: (startSeconds: number) => void;
  onCancelTrim: () => void;
  onRemoveVideo: (sceneId: string) => void;
}

export function SceneVideoPanel({
  scene,
  message,
  trimDraft,
  isBusy,
  onPickVideo,
  onConfirmTrim,
  onCancelTrim,
  onRemoveVideo,
}: SceneVideoPanelProps): React.JSX.Element | null {
  const [trimStart, setTrimStart] = useState<number>(0);

  useEffect(() => {
    setTrimStart(0);
  }, [trimDraft?.sceneId]);

  if (!scene) {
    return null;
  }

  const metadata = getSceneUploadMetadata(scene);
  const safeTrimStart = trimDraft
    ? clampSceneVideoStart(trimStart, trimDraft.maxStartSeconds)
    : 0;

  return (
    <View style={styles.panel} testID="scene-video-panel">
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>{metadata.title}</Text>
          <Text style={styles.description}>{metadata.description}</Text>
          <Text style={styles.durationText}>{metadata.durationLabel}</Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isBusy && styles.disabledButton]}
          disabled={isBusy}
          onPress={() => onPickVideo(scene.id)}
          testID="pick-scene-video-button"
        >
          <Text style={styles.primaryButtonText}>
            {scene.videoSource ? "Replace" : "Choose video"}
          </Text>
        </TouchableOpacity>
      </View>

      {scene.videoSource ? (
        <View style={styles.infoBox} testID="selected-scene-video">
          <Text style={styles.infoTitle}>{scene.videoSource.fileName}</Text>
          <Text style={styles.infoText}>
            {formatSceneVideoSeconds(scene.videoSource.sourceStartSeconds)} to{" "}
            {formatSceneVideoSeconds(
              scene.videoSource.sourceStartSeconds +
                scene.videoSource.durationSeconds,
            )}
          </Text>

          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => onRemoveVideo(scene.id)}
            testID="remove-scene-video-button"
          >
            <Text style={styles.ghostButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {trimDraft && trimDraft.sceneId === scene.id ? (
        <View style={styles.trimBox} testID="scene-video-trim-box">
          <Text style={styles.infoTitle}>Trim clip</Text>
          <Text style={styles.infoText}>
            {formatSceneVideoSeconds(safeTrimStart)} to{" "}
            {formatSceneVideoSeconds(safeTrimStart + trimDraft.durationSeconds)}
          </Text>

          <View style={styles.trimRow}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setTrimStart((value) => value - 0.5)}
              testID="trim-start-decrease"
            >
              <Text style={styles.smallButtonText}>-0.5s</Text>
            </TouchableOpacity>

            <Text style={styles.trimValue}>
              {formatSceneVideoSeconds(safeTrimStart)}
            </Text>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setTrimStart((value) => value + 0.5)}
              testID="trim-start-increase"
            >
              <Text style={styles.smallButtonText}>+0.5s</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => onConfirmTrim(safeTrimStart)}
              testID="confirm-scene-video-trim"
            >
              <Text style={styles.secondaryButtonText}>Use clip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostButton}
              onPress={onCancelTrim}
              testID="cancel-scene-video-trim"
            >
              <Text style={styles.ghostButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {message ? (
        <Text style={styles.message} testID="scene-video-message">
          {message}
        </Text>
      ) : null}
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
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleColumn: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  durationText: {
    color: "#FACC15",
    fontSize: 13,
    fontWeight: "900",
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
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.65,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    padding: 12,
    gap: 8,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  trimBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    padding: 12,
    gap: 10,
  },
  trimRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trimValue: {
    color: colors.text,
    fontWeight: "900",
    minWidth: 56,
    textAlign: "center",
  },
  smallButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2F3B45",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: colors.text,
    fontWeight: "800",
  },
  actionRow: {
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
  },
  ghostButtonText: {
    color: colors.text,
    fontWeight: "900",
  },
  message: {
    color: "#FACC15",
    fontSize: 13,
    fontWeight: "800",
  },
});
