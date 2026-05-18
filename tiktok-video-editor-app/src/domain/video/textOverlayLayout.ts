import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { TextOverlay } from "../../types/template";
import { Size, VideoCanvas } from "./videoCanvas";

export interface TextOverlayRenderModel {
  id: string;
  text: string;
  wrapperStyle: ViewStyle;
  textStyle: StyleProp<TextStyle>;
}

const MAX_TEXT_LINES = 4;
const DEFAULT_FONT_SIZE = 32;
const MIN_FONT_RATIO = 0.028;
const MAX_FONT_RATIO = 0.12;
const MAX_TEXT_BOX_WIDTH_RATIO = 0.86;
const LINE_HEIGHT_RATIO = 1.15;
const PADDING_X_RATIO = 0.012;
const PADDING_Y_RATIO = 0.007;

/**
 * Filters text overlays that should be visible at the current playback time.
 *
 * @param overlays Text overlays from the active template scenes.
 * @param currentTime Current playback time in seconds.
 * @returns Text overlays visible at the current playback time.
 */
export function getVisibleTextOverlays(
  overlays: TextOverlay[],
  currentTime: number,
): TextOverlay[] {
  const safeCurrentTime = toFiniteNumber(currentTime, 0);

  return overlays.filter((overlay) => {
    const start = toFiniteNumber(overlay.startSeconds, 0);
    const duration = toFiniteNumber(overlay.durationSeconds, 0);

    return (
      duration > 0 &&
      safeCurrentTime >= start &&
      safeCurrentTime < start + duration
    );
  });
}

/**
 * Converts template overlay data into a render model for appearance.
 *
 * Position is intentionally kept outside this model during editing. The
 * draggable overlay component owns live transform state and commits the final
 * normalized coordinates only when the gesture finishes.
 *
 * @param overlay Source text overlay.
 * @param index Overlay index used for stable fallback ids and stacking.
 * @param canvas Logical video canvas.
 * @param mediaSize Rendered media size.
 * @returns Render model used by the overlay component.
 */
export function createTextOverlayRenderModel(
  overlay: TextOverlay,
  index: number,
  canvas: VideoCanvas,
  mediaSize: Size,
): TextOverlayRenderModel {
  const scale = mediaSize.width / canvas.width;
  const canvasFontSize = clamp(
    toFiniteNumber(overlay.fontSizePt, DEFAULT_FONT_SIZE),
    canvas.height * MIN_FONT_RATIO,
    canvas.height * MAX_FONT_RATIO,
  );

  const fontSize = canvasFontSize * scale;
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const paddingX = mediaSize.width * PADDING_X_RATIO;
  const paddingY = mediaSize.height * PADDING_Y_RATIO;
  const maxTextHeight = lineHeight * MAX_TEXT_LINES + paddingY * 2;

  return {
    id: getSafeId(overlay.id, index),
    text: typeof overlay.text === "string" ? overlay.text : "",
    wrapperStyle: {
      position: "absolute",
      maxWidth: mediaSize.width * MAX_TEXT_BOX_WIDTH_RATIO,
      maxHeight: maxTextHeight,
      paddingHorizontal: paddingX,
      paddingVertical: paddingY,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 30 + index,
      elevation: 30 + index,
    },
    textStyle: {
      color: getSafeColor(overlay.color),
      fontSize,
      lineHeight,
      textAlign: "center",
      fontWeight: overlay.style === "bold" ? "bold" : "normal",
      fontStyle: overlay.style === "italic" ? "italic" : "normal",
      includeFontPadding: false,
      textShadowColor: "rgba(0, 0, 0, 0.9)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: Math.max(2, fontSize * 0.08),
    },
  };
}

/**
 * Returns the maximum number of lines used by text overlays.
 *
 * @returns Maximum number of rendered text lines.
 */
export function getMaxTextLines(): number {
  return MAX_TEXT_LINES;
}

function toFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function getSafeId(id: string, index: number): string {
  return typeof id === "string" && id.trim().length > 0
    ? id
    : `text-overlay-${index}`;
}

function getSafeColor(color: string): string {
  if (typeof color !== "string") {
    return "#FFFFFF";
  }

  const trimmed = color.trim();
  const isHex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(
    trimmed,
  );
  const isRgb =
    /^rgba?\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(
      trimmed,
    );

  return isHex || isRgb ? trimmed : "#FFFFFF";
}
