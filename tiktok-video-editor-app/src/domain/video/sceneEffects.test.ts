import {
  getSceneEffectsAtTime,
  getSceneFilterValues,
  resetEditableSceneEffects,
  sanitizeSceneEffectValue,
  upsertSceneEffect,
  upsertSceneZoomFocus,
} from "./sceneEffects";
import { Scene } from "../../types/template";

describe("sceneEffects", () => {
  it("returns default filter values when no effects exist", () => {
    expect(getSceneFilterValues([])).toEqual({
      brightness: 1,
      contrast: 1,
      zoom: 1,
      zoomPositionX: 0.5,
      zoomPositionY: 0.5,
    });
  });

  it("reads brightness, contrast and zoom values from effects", () => {
    const result = getSceneFilterValues([
      { type: "brightness", value: 1.2 },
      { type: "contrast", value: 1.3 },
      { type: "zoom", intensity: 1.4, positionX: 0.7, positionY: 0.25 },
    ]);

    expect(result).toEqual({
      brightness: 1.2,
      contrast: 1.3,
      zoom: 1.4,
      zoomPositionX: 0.7,
      zoomPositionY: 0.25,
    });
  });

  it("clamps extreme filter and zoom focus values safely", () => {
    const result = getSceneFilterValues([
      { type: "brightness", value: 999 },
      { type: "contrast", value: -999 },
      { type: "zoom", intensity: 999, positionX: 999, positionY: -999 },
    ]);

    expect(result).toEqual({
      brightness: 1.5,
      contrast: 0.5,
      zoom: 2,
      zoomPositionX: 1,
      zoomPositionY: 0,
    });
  });

  it("falls back to defaults for invalid filter values", () => {
    expect(sanitizeSceneEffectValue("brightness", Number.NaN)).toBe(1);
    expect(sanitizeSceneEffectValue("contrast", Number.POSITIVE_INFINITY)).toBe(
      1,
    );
    expect(sanitizeSceneEffectValue("zoom", Number.NEGATIVE_INFINITY)).toBe(1);
  });

  it("adds a new editable scene effect", () => {
    const result = upsertSceneEffect([], "brightness", 1.2);

    expect(result).toEqual([{ type: "brightness", value: 1.2 }]);
  });

  it("adds zoom with a default center focus", () => {
    const result = upsertSceneEffect([], "zoom", 1.4);

    expect(result).toEqual([
      { type: "zoom", intensity: 1.4, positionX: 0.5, positionY: 0.5 },
    ]);
  });

  it("updates zoom while preserving existing focus position", () => {
    const result = upsertSceneEffect(
      [{ type: "zoom", intensity: 1.2, positionX: 0.8, positionY: 0.3 }],
      "zoom",
      1.6,
    );

    expect(result).toEqual([
      { type: "zoom", intensity: 1.6, positionX: 0.8, positionY: 0.3 },
    ]);
  });

  it("updates zoom focus while preserving zoom intensity", () => {
    const result = upsertSceneZoomFocus(
      [
        { type: "brightness", value: 1.2 },
        { type: "zoom", intensity: 1.6, positionX: 0.5, positionY: 0.5 },
      ],
      {
        positionX: 0.75,
        positionY: 0.25,
      },
    );

    expect(result).toEqual([
      { type: "brightness", value: 1.2 },
      { type: "zoom", intensity: 1.6, positionX: 0.75, positionY: 0.25 },
    ]);
  });

  it("updates an existing editable scene effect", () => {
    const result = upsertSceneEffect(
      [
        { type: "brightness", value: 0.8 },
        { type: "contrast", value: 1.1 },
      ],
      "brightness",
      1.3,
    );

    expect(result).toEqual([
      { type: "contrast", value: 1.1 },
      { type: "brightness", value: 1.3 },
    ]);
  });

  it("resets editable scene effects but keeps other effects", () => {
    const result = resetEditableSceneEffects([
      { type: "brightness", value: 1.2 },
      { type: "contrast", value: 1.2 },
      { type: "zoom", intensity: 1.2, positionX: 0.5, positionY: 0.5 },
      { type: "blur", value: 0.4 },
    ]);

    expect(result).toEqual([{ type: "blur", value: 0.4 }]);
  });

  it("returns effects for the scene active at the current time", () => {
    const scenes: Scene[] = [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "First scene",
        textOverlays: [],
        effects: [{ type: "brightness", value: 1.2 }],
      },
      {
        id: "scene-2",
        orderIndex: 1,
        startSeconds: 3,
        durationSeconds: 4,
        instruction: "Second scene",
        textOverlays: [],
        effects: [{ type: "contrast", value: 1.3 }],
      },
    ];

    expect(getSceneEffectsAtTime(scenes, 1)).toEqual([
      { type: "brightness", value: 1.2 },
    ]);
    expect(getSceneEffectsAtTime(scenes, 3)).toEqual([
      { type: "contrast", value: 1.3 },
    ]);
  });

  it("returns empty effects when playback time is outside all scenes", () => {
    const scenes: Scene[] = [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "First scene",
        textOverlays: [],
        effects: [{ type: "brightness", value: 1.2 }],
      },
    ];

    expect(getSceneEffectsAtTime(scenes, 10)).toEqual([]);
  });
});
