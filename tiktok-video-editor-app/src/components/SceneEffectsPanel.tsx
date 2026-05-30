import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  EditableSceneEffectType,
  SceneFilterValues,
  SCENE_EFFECT_LIMITS,
  sanitizeSceneEffectValue,
} from "../domain/video/sceneEffects";
import { colors } from "../styles/theme";
import { EditorPanel } from "./editor-panel/EditorPanel";

export interface SceneEffectsPanelProps {
  sceneTitle: string | null;
  values: SceneFilterValues | null;
  onChange: (effectType: EditableSceneEffectType, value: number) => void;
  onReset: () => void;
}

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

export function SceneEffectsPanel({
  sceneTitle,
  values,
  onChange,
  onReset,
}: SceneEffectsPanelProps): React.JSX.Element | null {
  if (!values) {
    return null;
  }

  return (
    <EditorPanel
      title="Filters"
      subtitle={sceneTitle ?? "Selected scene"}
      actionIcon="restart-alt"
      actionAccessibilityLabel="Reset filters"
      actionTestID="scene-effects-reset"
      onAction={onReset}
      testID="scene-effects-panel"
    >
      <View style={styles.compactGrid}>
        <EffectControlRow
          icon="wb-sunny"
          label="Bright"
          effectType="brightness"
          value={values.brightness}
          onChange={onChange}
        />

        <EffectControlRow
          icon="contrast"
          label="Contrast"
          effectType="contrast"
          value={values.contrast}
          onChange={onChange}
        />

        <EffectControlRow
          icon="zoom-in"
          label="Zoom"
          effectType="zoom"
          value={values.zoom}
          onChange={onChange}
        />
      </View>
    </EditorPanel>
  );
}

interface EffectControlRowProps {
  icon: MaterialIconName;
  label: string;
  effectType: EditableSceneEffectType;
  value: number;
  onChange: (effectType: EditableSceneEffectType, value: number) => void;
}

function EffectControlRow({
  icon,
  label,
  effectType,
  value,
  onChange,
}: EffectControlRowProps): React.JSX.Element {
  const limit = SCENE_EFFECT_LIMITS[effectType];

  const decreaseValue = useCallback((): void => {
    onChange(
      effectType,
      sanitizeSceneEffectValue(effectType, value - limit.step),
    );
  }, [effectType, limit.step, onChange, value]);

  const increaseValue = useCallback((): void => {
    onChange(
      effectType,
      sanitizeSceneEffectValue(effectType, value + limit.step),
    );
  }, [effectType, limit.step, onChange, value]);

  return (
    <View style={styles.effectCard}>
      <View style={styles.effectHeader}>
        <MaterialIcons name={icon} size={17} color={colors.primary} />
        <Text style={styles.effectLabel}>{label}</Text>
        <Text style={styles.effectValue}>
          {formatEffectValue(effectType, value)}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={decreaseValue}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <MaterialIcons name="remove" size={18} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={increaseValue}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <MaterialIcons name="add" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatEffectValue(
  effectType: EditableSceneEffectType,
  value: number,
): string {
  if (effectType === "zoom") {
    return `${value.toFixed(1)}x`;
  }

  return `${Math.round(value * 100)}%`;
}

const styles = StyleSheet.create({
  compactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  effectCard: {
    flexGrow: 1,
    flexBasis: 150,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 10,
    gap: 8,
  },
  effectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  effectLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  effectValue: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    flex: 1,
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
