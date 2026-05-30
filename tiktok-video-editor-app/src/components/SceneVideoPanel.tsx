import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

const DESCRIPTION_COLLAPSED_LINES = 2;
const DESCRIPTION_LINE_HEIGHT = 18;
const DESCRIPTION_HEIGHT_EPSILON = 2;

const HIT_SLOP = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const [isDescriptionExpandable, setIsDescriptionExpandable] =
    useState<boolean>(false);

  useEffect(() => {
    setTrimStart(0);
  }, [trimDraft?.sceneId]);

  useEffect(() => {
    setIsDescriptionExpanded(false);
    setIsDescriptionExpandable(false);
  }, [scene?.id, scene?.instruction]);

  const handleDescriptionMeasure = useCallback(
    (event: LayoutChangeEvent): void => {
      const fullHeight = event.nativeEvent.layout.height;
      const collapsedHeight =
        DESCRIPTION_COLLAPSED_LINES * DESCRIPTION_LINE_HEIGHT;
      const shouldBeExpandable =
        fullHeight > collapsedHeight + DESCRIPTION_HEIGHT_EPSILON;

      setIsDescriptionExpandable((currentValue) =>
        currentValue === shouldBeExpandable ? currentValue : shouldBeExpandable,
      );

      if (!shouldBeExpandable) {
        setIsDescriptionExpanded(false);
      }
    },
    [],
  );

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

          <View style={styles.descriptionRow}>
            <View style={styles.descriptionTextColumn}>
              <Text
                style={styles.description}
                numberOfLines={
                  isDescriptionExpanded
                    ? undefined
                    : DESCRIPTION_COLLAPSED_LINES
                }
                ellipsizeMode="tail"
                testID="scene-video-description"
              >
                {metadata.description}
              </Text>

              <Text
                style={[styles.description, styles.hiddenDescriptionMeasure]}
                onLayout={handleDescriptionMeasure}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                {metadata.description}
              </Text>
            </View>

            {isDescriptionExpandable ? (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() =>
                  setIsDescriptionExpanded((currentValue) => !currentValue)
                }
                hitSlop={HIT_SLOP}
                testID="scene-video-description-toggle"
                accessibilityRole="button"
                accessibilityState={{ expanded: isDescriptionExpanded }}
                accessibilityLabel={
                  isDescriptionExpanded
                    ? "Collapse scene description"
                    : "Expand scene description"
                }
              >
                <MaterialIcons
                  name={isDescriptionExpanded ? "expand-less" : "expand-more"}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={styles.durationText}>{metadata.durationLabel}</Text>
        </View>

        <IconButton
          icon="photo-library"
          variant="primary"
          disabled={isBusy}
          onPress={() => onPickVideo(scene.id)}
          testID="pick-scene-video-button"
          accessibilityLabel={
            scene.videoSource ? "Replace video" : "Choose video"
          }
        />
      </View>

      {scene.videoSource ? (
        <View style={styles.selectedBox} testID="selected-scene-video">
          <View style={styles.selectedTextColumn}>
            <Text style={styles.infoTitle} numberOfLines={1}>
              {scene.videoSource.fileName}
            </Text>

            <Text style={styles.infoText}>
              {formatSceneVideoSeconds(scene.videoSource.sourceStartSeconds)} to{" "}
              {formatSceneVideoSeconds(
                scene.videoSource.sourceStartSeconds +
                  scene.videoSource.durationSeconds,
              )}
            </Text>
          </View>

          <IconButton
            icon="delete-outline"
            variant="danger"
            onPress={() => onRemoveVideo(scene.id)}
            testID="remove-scene-video-button"
            accessibilityLabel="Remove scene video"
          />
        </View>
      ) : null}

      {trimDraft && trimDraft.sceneId === scene.id ? (
        <View style={styles.trimBox} testID="scene-video-trim-box">
          <View style={styles.trimHeader}>
            <MaterialIcons
              name="content-cut"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.infoTitle}>Trim</Text>
          </View>

          <Text style={styles.trimRange}>
            {formatSceneVideoSeconds(safeTrimStart)} to{" "}
            {formatSceneVideoSeconds(safeTrimStart + trimDraft.durationSeconds)}
          </Text>

          <View style={styles.trimControlRow}>
            <TouchableOpacity
              style={styles.trimStepButton}
              onPress={() => setTrimStart((value) => value - 0.5)}
              hitSlop={HIT_SLOP}
              testID="trim-start-decrease"
            >
              <Text style={styles.trimStepText}>-0.5s</Text>
            </TouchableOpacity>

            <Text style={styles.trimValue}>
              {formatSceneVideoSeconds(safeTrimStart)}
            </Text>

            <TouchableOpacity
              style={styles.trimStepButton}
              onPress={() => setTrimStart((value) => value + 0.5)}
              hitSlop={HIT_SLOP}
              testID="trim-start-increase"
            >
              <Text style={styles.trimStepText}>+0.5s</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconActionRow}>
            <IconButton
              icon="check"
              variant="success"
              onPress={() => onConfirmTrim(safeTrimStart)}
              testID="confirm-scene-video-trim"
              accessibilityLabel="Use clip"
            />

            <IconButton
              icon="close"
              variant="ghost"
              onPress={onCancelTrim}
              testID="cancel-scene-video-trim"
              accessibilityLabel="Cancel trim"
            />
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

interface IconButtonProps {
  icon: MaterialIconName;
  variant: "primary" | "success" | "danger" | "ghost";
  onPress: () => void;
  testID: string;
  accessibilityLabel: string;
  disabled?: boolean;
}

function IconButton({
  icon,
  variant,
  onPress,
  testID,
  accessibilityLabel,
  disabled = false,
}: IconButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        getIconButtonStyle(variant),
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <MaterialIcons
        name={icon}
        size={21}
        color={variant === "ghost" ? colors.text : "#000000"}
      />
    </TouchableOpacity>
  );
}

function getIconButtonStyle(variant: IconButtonProps["variant"]): object {
  if (variant === "primary") {
    return styles.primaryIconButton;
  }

  if (variant === "success") {
    return styles.successIconButton;
  }

  if (variant === "danger") {
    return styles.dangerIconButton;
  }

  return styles.ghostIconButton;
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
    gap: 12,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleColumn: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  descriptionTextColumn: {
    flex: 1,
    minWidth: 0,
    position: "relative",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: DESCRIPTION_LINE_HEIGHT,
  },
  hiddenDescriptionMeasure: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
  },
  expandButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#2F3B45",
    alignItems: "center",
    justifyContent: "center",
  },
  durationText: {
    color: "#FACC15",
    fontSize: 12,
    fontWeight: "900",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryIconButton: {
    backgroundColor: colors.primary,
  },
  successIconButton: {
    backgroundColor: colors.accent,
  },
  dangerIconButton: {
    backgroundColor: "#FF5D73",
  },
  ghostIconButton: {
    borderWidth: 1,
    borderColor: "#2F3B45",
    backgroundColor: colors.background,
  },
  disabledButton: {
    opacity: 0.55,
  },
  selectedBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: colors.background,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectedTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  trimBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: colors.background,
    padding: 12,
    gap: 10,
    alignItems: "center",
  },
  trimHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trimRange: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  trimControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  trimStepButton: {
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2F3B45",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  trimStepText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
  trimValue: {
    color: colors.text,
    fontWeight: "900",
    minWidth: 54,
    textAlign: "center",
  },
  iconActionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  message: {
    color: "#FACC15",
    fontSize: 13,
    fontWeight: "800",
  },
});
