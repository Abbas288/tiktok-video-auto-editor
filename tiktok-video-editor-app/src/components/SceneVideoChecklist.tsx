import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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

const DESKTOP_BREAKPOINT = 768;

const HIT_SLOP = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

export function SceneVideoChecklist({
  scenes,
  activeSceneId,
  onSelectScene,
}: SceneVideoChecklistProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const readiness = getSceneVideoReadiness(scenes);
  const activeIndex = getActiveSceneIndex(scenes, activeSceneId);
  const activeScene = scenes[activeIndex] ?? null;
  const metadata = activeScene ? getSceneUploadMetadata(activeScene) : null;
  const hasMultipleScenes = scenes.length > 1;

  const selectByOffset = (offset: number): void => {
    if (!hasMultipleScenes) {
      return;
    }

    const nextIndex = (activeIndex + offset + scenes.length) % scenes.length;
    const nextScene = scenes[nextIndex];

    if (nextScene) {
      onSelectScene(nextScene.id);
    }
  };

  return (
    <View
      style={[styles.panel, isDesktop && styles.panelDesktop]}
      testID="scene-video-checklist"
    >
      <View style={styles.headerRow}>
        <View style={styles.headerTextColumn}>
          <Text style={styles.title}>Scene videos</Text>
          <Text style={styles.counterText}>
            {readiness.readyCount}/{readiness.totalCount}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            readiness.isReadyForCompile && styles.readyBadge,
            isDesktop && styles.statusBadgeDesktop,
          ]}
        >
          <MaterialIcons
            name={readiness.isReadyForCompile ? "check-circle" : "help-outline"}
            size={isDesktop ? 17 : 18}
            color={readiness.isReadyForCompile ? colors.accent : "#FACC15"}
          />
        </View>
      </View>

      {activeScene && metadata ? (
        <View
          style={[styles.navigatorRow, isDesktop && styles.navigatorRowDesktop]}
        >
          <TouchableOpacity
            style={[
              styles.arrowButton,
              isDesktop && styles.arrowButtonDesktop,
              !hasMultipleScenes && styles.disabledButton,
            ]}
            disabled={!hasMultipleScenes}
            onPress={() => selectByOffset(-1)}
            hitSlop={HIT_SLOP}
            testID="scene-video-previous"
            accessibilityRole="button"
            accessibilityLabel="Previous scene"
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={isDesktop ? 24 : 26}
              color={hasMultipleScenes ? colors.text : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.activeCard, isDesktop && styles.activeCardDesktop]}
            onPress={() => onSelectScene(activeScene.id)}
            testID={`scene-video-status-${activeScene.id}`}
            accessibilityRole="button"
            accessibilityLabel={`Select ${metadata.title}`}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {metadata.title}
                </Text>

                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {metadata.durationLabel}
                  </Text>
                </View>
              </View>

              <MaterialIcons
                name={activeScene.videoSource ? "check-circle" : "help-outline"}
                size={isDesktop ? 19 : 20}
                color={activeScene.videoSource ? colors.accent : "#FACC15"}
              />
            </View>

            <Text
              style={[
                styles.description,
                isDesktop && styles.descriptionDesktop,
              ]}
              numberOfLines={isDesktop ? 2 : 3}
            >
              {metadata.description}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.arrowButton,
              isDesktop && styles.arrowButtonDesktop,
              !hasMultipleScenes && styles.disabledButton,
            ]}
            disabled={!hasMultipleScenes}
            onPress={() => selectByOffset(1)}
            hitSlop={HIT_SLOP}
            testID="scene-video-next"
            accessibilityRole="button"
            accessibilityLabel="Next scene"
          >
            <MaterialIcons
              name="keyboard-arrow-right"
              size={isDesktop ? 24 : 26}
              color={hasMultipleScenes ? colors.text : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.emptyText}>No scenes.</Text>
      )}

      {hasMultipleScenes ? (
        <View style={[styles.dotRow, isDesktop && styles.dotRowDesktop]}>
          {scenes.map((scene) => {
            const isActive = scene.id === activeScene?.id;
            const isReady = Boolean(scene.videoSource);

            return (
              <TouchableOpacity
                key={scene.id}
                style={[
                  styles.dot,
                  isActive && styles.activeDot,
                  isReady && !isActive && styles.readyDot,
                ]}
                onPress={() => onSelectScene(scene.id)}
                hitSlop={HIT_SLOP}
                testID={`scene-video-dot-${scene.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Select scene ${scene.orderIndex + 1}`}
              >
                <MaterialIcons
                  name={isReady ? "check" : "help-outline"}
                  size={13}
                  color={
                    isActive
                      ? "#000000"
                      : isReady
                        ? colors.accent
                        : colors.textSecondary
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function getActiveSceneIndex(
  scenes: Scene[],
  activeSceneId: string | null,
): number {
  const index = scenes.findIndex((scene) => scene.id === activeSceneId);

  return index >= 0 ? index : 0;
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
  panelDesktop: {
    paddingVertical: 10,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  counterText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  statusBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeDesktop: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  readyBadge: {
    backgroundColor: "rgba(0, 255, 208, 0.12)",
  },
  navigatorRow: {
    width: "100%",
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navigatorRowDesktop: {
    minHeight: 74,
    gap: 8,
  },
  arrowButton: {
    width: 38,
    height: 64,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonDesktop: {
    width: 34,
    height: 48,
    borderRadius: 17,
  },
  disabledButton: {
    opacity: 0.35,
  },
  activeCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 112,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 214, 249, 0.06)",
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
    justifyContent: "center",
  },
  activeCardDesktop: {
    minHeight: 74,
    paddingVertical: 8,
    gap: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  cardTitle: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  durationBadge: {
    borderRadius: 999,
    backgroundColor: "#0B0B0B",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: "#FACC15",
    fontSize: 12,
    fontWeight: "900",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  descriptionDesktop: {
    lineHeight: 17,
  },
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  dotRowDesktop: {
    marginTop: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  readyDot: {
    borderWidth: 1,
    borderColor: "rgba(0, 255, 208, 0.45)",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
});
