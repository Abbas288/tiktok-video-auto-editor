import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  getSceneUploadMetadata,
  SceneVideoReadiness,
} from "../../domain/scene-video/sceneVideoReadiness";
import { colors } from "../../styles/theme";

interface VideoStageEmptyStateProps {
  readiness: SceneVideoReadiness;
}

export function VideoStageEmptyState({
  readiness,
}: VideoStageEmptyStateProps): React.JSX.Element {
  const nextScene = readiness.firstMissingScene;
  const metadata = nextScene ? getSceneUploadMetadata(nextScene) : null;

  return (
    <View style={styles.container} testID="video-stage-empty-state">
      <View style={styles.card}>
        <Text style={styles.title}>Add all scene videos first</Text>

        <View style={styles.progressShell}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  readiness.totalCount > 0
                    ? `${(readiness.readyCount / readiness.totalCount) * 100}%`
                    : "0%",
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {readiness.readyCount}/{readiness.totalCount} ready
        </Text>

        {metadata ? (
          <View style={styles.nextBox}>
            <Text style={styles.nextLabel}>Next missing</Text>
            <Text style={styles.nextTitle}>{metadata.title}</Text>
            <Text style={styles.nextDuration}>{metadata.durationLabel}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050505",
    padding: 20,
  },
  card: {
    width: "82%",
    maxWidth: 480,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "rgba(18, 18, 18, 0.96)",
    padding: 22,
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  progressShell: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#2A2A2A",
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  progressText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  nextBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#0B0B0B",
    padding: 14,
    gap: 5,
    marginTop: 4,
  },
  nextLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  nextTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  nextDuration: {
    color: "#FACC15",
    fontSize: 13,
    fontWeight: "900",
  },
});
