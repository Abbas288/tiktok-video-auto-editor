import React from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Scene } from "../types/template";
import { colors } from "../styles/theme";

interface TimelineProps {
  scenes: Scene[];
  activeSceneId: string | null;
  onSelectScene: (id: string) => void;
}

/**
 * Renders a horizontal timeline of video scenes.
 * Allows users to get an overview of the video structure and select an active scene.
 */
export function Timeline({
  scenes,
  activeSceneId,
  onSelectScene,
}: TimelineProps): React.JSX.Element {
  if (!scenes || scenes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No scenes available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={scenes}
        keyExtractor={(scene) => scene.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: scene }) => {
          const isActive = activeSceneId === scene.id;
          return (
            <TouchableOpacity
              style={[styles.sceneBlock, isActive && styles.sceneBlockActive]}
              onPress={() => onSelectScene(scene.id)}
            >
              <Text style={[styles.timeText, isActive && styles.textActive]}>
                {scene.startSeconds.toFixed(1)}s
              </Text>
              <Text
                style={[styles.instructionText, isActive && styles.textActive]}
                numberOfLines={3}
              >
                {scene.instruction}
              </Text>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>
                  {scene.durationSeconds.toFixed(1)} s
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.surface,
  },
  listContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  sceneBlock: {
    width: 140,
    height: 120,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "space-between",
  },
  sceneBlockActive: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  textActive: {
    color: colors.primary,
  },
  durationBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  durationText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  emptyContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.surface,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
