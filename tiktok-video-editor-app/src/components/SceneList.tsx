import React from "react";
import { FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Scene } from "../types/template";
import { colors } from "../styles/theme";

interface SceneListProps {
  scenes: Scene[];
  activeSceneId: string | null;
  onSelectScene: (id: string) => void;
}

/**
 * Renders a list of video scenes, allowing the user to select the active scene.
 */
export function SceneList({
  scenes,
  activeSceneId,
  onSelectScene,
}: SceneListProps): React.JSX.Element {
  return (
    <FlatList
      data={scenes}
      keyExtractor={(scene) => scene.id}
      renderItem={({ item: scene }) => (
        <TouchableOpacity
          style={[
            styles.sceneItem,
            activeSceneId === scene.id && styles.sceneItemActive,
          ]}
          onPress={() => onSelectScene(scene.id)}
        >
          <Text style={styles.sceneTime}>
            {scene.startSeconds.toFixed(1)}s -{" "}
            {(scene.startSeconds + scene.durationSeconds).toFixed(1)}s
          </Text>
          <Text style={styles.sceneText}>{scene.instruction}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No scenes available.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  sceneItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginHorizontal: 20,
  },
  sceneItemActive: {
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    borderColor: "#007AFF",
  },
  sceneTime: {
    fontSize: 12,
    color: colors.textSecondary || "#666",
    marginBottom: 4,
  },
  sceneText: {
    fontSize: 16,
    color: colors.text || "#000",
  },
  emptyText: {
    margin: 20,
    color: colors.textSecondary || "#666",
  },
});
