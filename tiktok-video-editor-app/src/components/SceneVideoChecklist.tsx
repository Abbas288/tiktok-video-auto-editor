import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  getSceneUploadMetadata,
  getSceneVideoReadiness,
} from "../domain/scene-video/sceneVideoReadiness";
import { colors } from "../styles/theme";
import { Scene } from "../types/template";

interface SceneVideoChecklistProps {
  scenes: Scene[];
  activeSceneId: string | null;
  onSelectScene: (sceneId: string) => void;
}

export function SceneVideoChecklist({
  scenes,
  activeSceneId,
  onSelectScene,
}: SceneVideoChecklistProps): React.JSX.Element {
  const readiness = getSceneVideoReadiness(scenes);

  return (
    <View style={styles.panel} testID="scene-video-checklist">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Scene videos</Text>
          <Text style={styles.description}>
            {readiness.readyCount}/{readiness.totalCount} ready
          </Text>
        </View>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {readiness.isReadyForCompile ? "Ready" : "Incomplete"}
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {scenes.map((scene) => {
          const isActive = scene.id === activeSceneId;
          const isReady = Boolean(scene.videoSource);
          const metadata = getSceneUploadMetadata(scene);

          return (
            <TouchableOpacity
              key={scene.id}
              style={[styles.item, isActive && styles.activeItem]}
              onPress={() => onSelectScene(scene.id)}
              testID={`scene-video-status-${scene.id}`}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{metadata.title}</Text>
                <Text style={isReady ? styles.readyText : styles.missingText}>
                  {isReady ? "Approved" : "Missing"}
                </Text>
              </View>

              <Text style={styles.metaText}>{metadata.description}</Text>

              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>
                  {metadata.durationLabel}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  counterBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2F3B45",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  counterText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
  list: {
    gap: 10,
  },
  item: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    padding: 12,
    gap: 8,
  },
  activeItem: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 214, 249, 0.06)",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  readyText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
  },
  missingText: {
    color: "#FACC15",
    fontSize: 12,
    fontWeight: "900",
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  durationBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#0B0B0B",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
});
