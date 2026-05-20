import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  EditableSceneEffectType,
  SceneFilterValues,
  SCENE_EFFECT_LIMITS,
  sanitizeSceneEffectValue,
} from "../domain/video/sceneEffects";
import { colors } from "../styles/theme";

export interface SceneEffectsPanelProps {
  sceneTitle: string | null;
  values: SceneFilterValues | null;
  onChange: (effectType: EditableSceneEffectType, value: number) => void;
  onReset: () => void;
}

/**
 * Renders scene-specific visual filter controls.
 */
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
    <View style={styles.panel} testID="scene-effects-panel">
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Scene filters</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {sceneTitle ?? "Selected scene"}
          </Text>
        </View>

        <TouchableOpacity onPress={onReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <EffectControlRow
        label="Brightness"
        effectType="brightness"
        value={values.brightness}
        onChange={onChange}
      />

      <EffectControlRow
        label="Contrast"
        effectType="contrast"
        value={values.contrast}
        onChange={onChange}
      />

      <EffectControlRow
        label="Zoom"
        effectType="zoom"
        value={values.zoom}
        onChange={onChange}
      />
    </View>
  );
}

interface EffectControlRowProps {
  label: string;
  effectType: EditableSceneEffectType;
  value: number;
  onChange: (effectType: EditableSceneEffectType, value: number) => void;
}

function EffectControlRow({
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
    <View style={styles.effectRow}>
      <View style={styles.effectLabelColumn}>
        <Text style={styles.effectLabel}>{label}</Text>
        <Text style={styles.effectValue}>
          {formatEffectValue(effectType, value)}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.effectButton} onPress={decreaseValue}>
          <Text style={styles.effectButtonText}>Less</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.effectButton} onPress={increaseValue}>
          <Text style={styles.effectButtonText}>More</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleColumn: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  resetText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  effectRow: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  effectLabelColumn: {
    flex: 1,
  },
  effectLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  effectValue: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  effectButton: {
    minHeight: 34,
    minWidth: 62,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  effectButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
