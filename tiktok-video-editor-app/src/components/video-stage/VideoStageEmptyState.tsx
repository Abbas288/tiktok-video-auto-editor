import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

type ProgressWidth = `${number}%`;

export function VideoStageEmptyState({
  readiness,
}: VideoStageEmptyStateProps): React.JSX.Element {
  const nextScene = readiness.firstMissingScene;
  const metadata = nextScene ? getSceneUploadMetadata(nextScene) : null;
  const progressWidth = getProgressWidth(
    readiness.readyCount,
    readiness.totalCount,
  );

  return (
    <View style={styles.container} testID="video-stage-empty-state">
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconBadge}>
            <MaterialIcons
              name="video-library"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.headerTextColumn}>
            <Text style={styles.title} numberOfLines={2}>
              Add all scene videos first
            </Text>
            <Text style={styles.progressText}>
              {readiness.readyCount}/{readiness.totalCount} ready
            </Text>
          </View>
        </View>

        <View style={styles.progressShell}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        {metadata ? (
          <View style={styles.nextBox}>
            <View style={styles.nextTextColumn}>
              <Text style={styles.nextLabel}>Next missing</Text>
              <Text style={styles.nextTitle} numberOfLines={1}>
                {metadata.title}
              </Text>
            </View>

            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{metadata.durationLabel}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function getProgressWidth(
  readyCount: number,
  totalCount: number,
): ProgressWidth {
  if (!Number.isFinite(readyCount) || !Number.isFinite(totalCount)) {
    return "0%";
  }

  if (totalCount <= 0) {
    return "0%";
  }

  const percentage = Math.min(
    Math.max((readyCount / totalCount) * 100, 0),
    100,
  );

  return `${percentage}%`;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050505",
    padding: 10,
  },
  card: {
    flex: 1,
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "rgba(18, 18, 18, 0.96)",
    padding: 12,
    gap: 9,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 214, 249, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "900",
  },
  progressText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  progressShell: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#2A2A2A",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  nextBox: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#0B0B0B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nextTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  nextLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  nextTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
  durationBadge: {
    borderRadius: 999,
    backgroundColor: "#111111",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  durationText: {
    color: "#FACC15",
    fontSize: 12,
    fontWeight: "900",
  },
});
