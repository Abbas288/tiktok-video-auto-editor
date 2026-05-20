import { Effect, Scene } from "../../types/template";

export type EditableSceneEffectType = Extract<
  Effect["type"],
  "brightness" | "contrast" | "zoom"
>;

export interface SceneFilterValues {
  brightness: number;
  contrast: number;
  zoom: number;
  zoomPositionX: number;
  zoomPositionY: number;
}

export interface SceneEffectLimit {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ZoomFocusPosition {
  positionX: number;
  positionY: number;
}

export const SCENE_EFFECT_LIMITS: Record<
  EditableSceneEffectType,
  SceneEffectLimit
> = {
  brightness: {
    min: 0.5,
    max: 1.5,
    step: 0.1,
    defaultValue: 1,
  },
  contrast: {
    min: 0.5,
    max: 1.5,
    step: 0.1,
    defaultValue: 1,
  },
  zoom: {
    min: 1,
    max: 2,
    step: 0.1,
    defaultValue: 1,
  },
};

/**
 * Returns safe filter values from scene effects.
 *
 * @param effects Scene effects from template data.
 * @returns Normalized filter values used by the video preview.
 */
export function getSceneFilterValues(
  effects: Effect[] = [],
): SceneFilterValues {
  const values: SceneFilterValues = {
    brightness: SCENE_EFFECT_LIMITS.brightness.defaultValue,
    contrast: SCENE_EFFECT_LIMITS.contrast.defaultValue,
    zoom: SCENE_EFFECT_LIMITS.zoom.defaultValue,
    zoomPositionX: 0.5,
    zoomPositionY: 0.5,
  };

  for (const effect of effects) {
    if (!isEditableSceneEffectType(effect.type)) {
      continue;
    }

    if (effect.type === "zoom") {
      values.zoom = sanitizeSceneEffectValue(
        "zoom",
        getNumericEffectValue(effect),
      );
      values.zoomPositionX = clamp01(effect.positionX ?? 0.5);
      values.zoomPositionY = clamp01(effect.positionY ?? 0.5);
      continue;
    }

    values[effect.type] = sanitizeSceneEffectValue(
      effect.type,
      getNumericEffectValue(effect),
    );
  }

  return values;
}

/**
 * Returns effects for the scene that is active at the provided playback time.
 *
 * @param scenes Scenes to search through.
 * @param currentTime Current playback time in seconds.
 * @returns Scene effects for the active scene, or an empty array.
 */
export function getSceneEffectsAtTime(
  scenes: Scene[],
  currentTime: number,
): Effect[] {
  if (!Number.isFinite(currentTime)) {
    return [];
  }

  const activeScene = scenes.find(
    (scene) =>
      currentTime >= scene.startSeconds &&
      currentTime < scene.startSeconds + scene.durationSeconds,
  );

  return activeScene?.effects ?? [];
}

/**
 * Adds or updates an editable scene effect without mutating the original array.
 *
 * @param effects Existing effects.
 * @param type Effect type to add or update.
 * @param value New effect value.
 * @returns Updated effects array.
 */
export function upsertSceneEffect(
  effects: Effect[],
  type: EditableSceneEffectType,
  value: number,
): Effect[] {
  const previousZoom = effects.find((effect) => effect.type === "zoom");
  const nextEffect = createSceneEffect(type, value, previousZoom);
  const otherEffects = effects.filter((effect) => effect.type !== type);

  return [...otherEffects, nextEffect];
}

/**
 * Updates the zoom focus position while preserving the current zoom intensity.
 *
 * @param effects Existing effects.
 * @param position New normalized zoom focus position.
 * @returns Updated effects array.
 */
export function upsertSceneZoomFocus(
  effects: Effect[],
  position: ZoomFocusPosition,
): Effect[] {
  const previousZoom = effects.find((effect) => effect.type === "zoom");
  const otherEffects = effects.filter((effect) => effect.type !== "zoom");

  return [
    ...otherEffects,
    {
      type: "zoom",
      intensity: sanitizeSceneEffectValue(
        "zoom",
        getNumericEffectValue(previousZoom),
      ),
      positionX: clamp01(position.positionX),
      positionY: clamp01(position.positionY),
    },
  ];
}

/**
 * Removes editable visual filters from an effects array.
 *
 * Non-editable effects are preserved.
 *
 * @param effects Existing effects.
 * @returns Effects array without brightness, contrast and zoom.
 */
export function resetEditableSceneEffects(effects: Effect[]): Effect[] {
  return effects.filter((effect) => !isEditableSceneEffectType(effect.type));
}

/**
 * Sanitizes a filter value so it stays inside the supported range.
 *
 * @param type Editable effect type.
 * @param value Input value.
 * @returns Safe effect value.
 */
export function sanitizeSceneEffectValue(
  type: EditableSceneEffectType,
  value: number,
): number {
  const limit = SCENE_EFFECT_LIMITS[type];

  if (!Number.isFinite(value)) {
    return limit.defaultValue;
  }

  return clamp(value, limit.min, limit.max);
}

/**
 * Checks whether an effect type can be edited in the current UI.
 *
 * @param type Effect type from template data.
 * @returns True if the effect is editable in the scene filter panel.
 */
export function isEditableSceneEffectType(
  type: Effect["type"],
): type is EditableSceneEffectType {
  return type === "brightness" || type === "contrast" || type === "zoom";
}

/**
 * Creates a typed scene effect from an editable filter value.
 *
 * @param type Editable effect type.
 * @param value Input value.
 * @param previousEffect Optional previous effect used to preserve zoom focus.
 * @returns Scene effect object.
 */
export function createSceneEffect(
  type: EditableSceneEffectType,
  value: number,
  previousEffect?: Effect,
): Effect {
  const safeValue = sanitizeSceneEffectValue(type, value);

  if (type === "zoom") {
    return {
      type,
      intensity: safeValue,
      positionX: clamp01(previousEffect?.positionX ?? 0.5),
      positionY: clamp01(previousEffect?.positionY ?? 0.5),
    };
  }

  return {
    type,
    value: safeValue,
  };
}

function getNumericEffectValue(effect: Effect | undefined): number {
  if (!effect) {
    return 1;
  }

  if (typeof effect.value === "number") {
    return effect.value;
  }

  if (typeof effect.intensity === "number") {
    return effect.intensity;
  }

  return 1;
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
