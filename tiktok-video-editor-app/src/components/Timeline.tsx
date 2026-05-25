import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getSceneTransition,
  getTransitionLabel,
} from "../domain/video/transitions";
import { colors } from "../styles/theme";
import { Scene } from "../types/template";

interface TimelineProps {
  scenes: Scene[];
  activeSceneId: string | null;
  onSelectScene: (id: string) => void;
  onSelectTransition: (sceneId: string) => void;
}

/**
 * Renders a horizontal timeline of video scenes and transition slots.
 *
 * @param props Timeline scenes, active scene and selection handlers.
 * @returns Timeline element.
 */
export function Timeline({
  scenes,
  activeSceneId,
  onSelectScene,
  onSelectTransition,
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
        renderItem={({ item: scene, index }) => (
          <View style={styles.timelineItem}>
            <SceneBlock
              scene={scene}
              isActive={activeSceneId === scene.id}
              onSelectScene={onSelectScene}
            />

            {index < scenes.length - 1 ? (
              <TransitionSlot
                scene={scene}
                onSelectTransition={onSelectTransition}
              />
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

interface SceneBlockProps {
  scene: Scene;
  isActive: boolean;
  onSelectScene: (id: string) => void;
}

function SceneBlock({
  scene,
  isActive,
  onSelectScene,
}: SceneBlockProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.sceneBlock, isActive && styles.sceneBlockActive]}
      onPress={() => onSelectScene(scene.id)}
      accessibilityRole="button"
      accessibilityLabel={`Select scene ${scene.orderIndex + 1}`}
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
}

interface TransitionSlotProps {
  scene: Scene;
  onSelectTransition: (sceneId: string) => void;
}

function TransitionSlot({
  scene,
  onSelectTransition,
}: TransitionSlotProps): React.JSX.Element {
  const transition = getSceneTransition(scene);

  return (
    <TouchableOpacity
      style={styles.transitionSlot}
      onPress={() => onSelectTransition(scene.id)}
      testID={`transition-slot-${scene.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Edit transition after scene ${scene.orderIndex + 1}`}
    >
      <Text style={styles.transitionIcon}>↔</Text>
      <Text style={styles.transitionLabel}>
        {getTransitionLabel(transition.type)}
      </Text>
    </TouchableOpacity>
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
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  sceneBlock: {
    width: 140,
    height: 120,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "space-between",
  },
  sceneBlockActive: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
  },
  transitionSlot: {
    width: 58,
    height: 72,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "rgba(0, 214, 249, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(0, 214, 249, 0.32)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  transitionIcon: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  transitionLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
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
