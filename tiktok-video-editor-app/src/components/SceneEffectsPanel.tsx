import React, { useCallback } from "react";
import {
  EditableSceneEffectType,
  SceneFilterValues,
  SCENE_EFFECT_LIMITS,
  sanitizeSceneEffectValue,
} from "../domain/video/sceneEffects";
import { ControlRow } from "./editor-panel/ControlRow";
import { EditorPanel } from "./editor-panel/EditorPanel";
import { PanelButton } from "./editor-panel/PanelButton";

export interface SceneEffectsPanelProps {
  sceneTitle: string | null;
  values: SceneFilterValues | null;
  onChange: (effectType: EditableSceneEffectType, value: number) => void;
  onReset: () => void;
}

/**
 * Renders scene-specific visual filter controls.
 *
 * @param props Selected scene title, filter values and change handlers.
 * @returns Scene effects panel element, or null when no values exist.
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
    <EditorPanel
      title="Scene filters"
      subtitle={sceneTitle ?? "Selected scene"}
      actionLabel="Reset"
      onAction={onReset}
      testID="scene-effects-panel"
    >
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
    </EditorPanel>
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
    <ControlRow label={label} value={formatEffectValue(effectType, value)}>
      <PanelButton label="Less" minWidth={62} onPress={decreaseValue} />

      <PanelButton label="More" minWidth={62} onPress={increaseValue} />
    </ControlRow>
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
