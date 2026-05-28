import { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  Orientation,
  TextOverlay,
  TextOverlayLayout,
} from "../../types/template";
import { Size, VideoCanvas, getVideoCanvas } from "./videoCanvas";

export interface TextOverlayRenderModel {
  id: string;
  text: string;
  wrapperStyle: ViewStyle;
  textStyle: StyleProp<TextStyle>;
}

const DEFAULT_FONT_SIZE = 32;
const APPROX_CHARACTER_WIDTH_RATIO = 0.52;

export const TEXT_OVERLAY_MAX_LINES = 4;
export const TEXT_OVERLAY_MIN_FONT_RATIO = 0.028;
export const TEXT_OVERLAY_MAX_FONT_RATIO = 0.12;
export const TEXT_OVERLAY_BOX_WIDTH_RATIO = 0.86;
export const TEXT_OVERLAY_LINE_HEIGHT_RATIO = 1.15;
export const TEXT_OVERLAY_PADDING_X_RATIO = 0.012;
export const TEXT_OVERLAY_PADDING_Y_RATIO = 0.007;

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
 * The preview intentionally uses the same export-safe text layout rules that
 * are sent to the compile-server. This reduces mismatch between editor preview
 * and FFmpeg output.
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
  const layout = createTextOverlayLayoutSpec(canvas.orientation, overlay);
  const scale = mediaSize.width / canvas.width;
  const canvasFontSize = getClampedCanvasFontSize(overlay.fontSizePt, canvas);
  const fontSize = canvasFontSize * scale;
  const lineHeight = fontSize * layout.lineHeightRatio;
  const paddingX = mediaSize.width * layout.paddingXRatio;
  const paddingY = mediaSize.height * layout.paddingYRatio;
  const boxWidth = mediaSize.width * layout.boxWidthRatio;
  const maxTextHeight = lineHeight * layout.maxLines + paddingY * 2;

  return {
    id: getSafeId(overlay.id, index),
    text: layout.lines.join("\n"),
    wrapperStyle: {
      position: "absolute",
      width: boxWidth,
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
      textAlign: layout.textAlign,
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
 * Creates the export-safe text layout contract sent to the compile-server.
 *
 * @param orientation Template orientation.
 * @param overlay Optional overlay used to precompute line breaks.
 * @returns Text overlay layout metadata.
 */
export function createTextOverlayLayoutSpec(
  orientation: Orientation,
  overlay?: Pick<TextOverlay, "text" | "fontSizePt">,
): TextOverlayLayout {
  const canvas = getVideoCanvas(orientation);
  const fontSize = overlay
    ? getClampedCanvasFontSize(overlay.fontSizePt, canvas)
    : getClampedCanvasFontSize(DEFAULT_FONT_SIZE, canvas);
  const lines = overlay
    ? createExportSafeTextLines(overlay.text, fontSize, canvas)
    : [];

  return {
    anchor: "center",
    textAlign: "center",
    referenceWidth: canvas.width,
    referenceHeight: canvas.height,
    boxWidthRatio: TEXT_OVERLAY_BOX_WIDTH_RATIO,
    maxLines: TEXT_OVERLAY_MAX_LINES,
    lineHeightRatio: TEXT_OVERLAY_LINE_HEIGHT_RATIO,
    paddingXRatio: TEXT_OVERLAY_PADDING_X_RATIO,
    paddingYRatio: TEXT_OVERLAY_PADDING_Y_RATIO,
    minFontRatio: TEXT_OVERLAY_MIN_FONT_RATIO,
    maxFontRatio: TEXT_OVERLAY_MAX_FONT_RATIO,
    lines,
  };
}

/**
 * Returns the maximum number of lines used by text overlays.
 *
 * @returns Maximum number of rendered text lines.
 */
export function getMaxTextLines(): number {
  return TEXT_OVERLAY_MAX_LINES;
}

function createExportSafeTextLines(
  text: string,
  fontSize: number,
  canvas: VideoCanvas,
): string[] {
  const boxWidth = canvas.width * TEXT_OVERLAY_BOX_WIDTH_RATIO;
  const paddingX = canvas.width * TEXT_OVERLAY_PADDING_X_RATIO;
  const availableTextWidth = Math.max(boxWidth - paddingX * 2, fontSize);
  const maxCharactersPerLine = Math.max(
    Math.floor(availableTextWidth / approximateCharacterWidth(fontSize)),
    8,
  );

  return createLimitedWrappedLines(
    typeof text === "string" ? text : "",
    maxCharactersPerLine,
  );
}

function createLimitedWrappedLines(
  text: string,
  maxCharactersPerLine: number,
): string[] {
  const wrappedLines = wrapText(text, maxCharactersPerLine)
    .split("\n")
    .filter((line) => line.length > 0);

  if (wrappedLines.length === 0) {
    return [""];
  }

  if (wrappedLines.length <= TEXT_OVERLAY_MAX_LINES) {
    return wrappedLines;
  }

  const visibleLines = wrappedLines.slice(0, TEXT_OVERLAY_MAX_LINES);

  visibleLines[TEXT_OVERLAY_MAX_LINES - 1] = addEllipsis(
    visibleLines[TEXT_OVERLAY_MAX_LINES - 1],
    maxCharactersPerLine,
  );

  return visibleLines;
}

function wrapText(text: string, maxCharactersPerLine: number): string {
  return text
    .split(/\r?\n/)
    .flatMap((line) => wrapLine(line, maxCharactersPerLine))
    .join("\n");
}

function wrapLine(line: string, maxCharactersPerLine: number): string[] {
  const words = line.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const parts = splitLongWord(word, maxCharactersPerLine);

    for (const part of parts) {
      const nextLine = currentLine ? `${currentLine} ${part}` : part;

      if (nextLine.length <= maxCharactersPerLine) {
        currentLine = nextLine;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = part;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function splitLongWord(word: string, maxCharactersPerLine: number): string[] {
  if (word.length <= maxCharactersPerLine) {
    return [word];
  }

  const parts: string[] = [];

  for (let index = 0; index < word.length; index += maxCharactersPerLine) {
    parts.push(word.slice(index, index + maxCharactersPerLine));
  }

  return parts;
}

function addEllipsis(line: string, maxCharactersPerLine: number): string {
  if (line.length <= 3) {
    return "...";
  }

  if (line.length <= maxCharactersPerLine - 3) {
    return `${line}...`;
  }

  return `${line.slice(0, Math.max(maxCharactersPerLine - 3, 1)).trimEnd()}...`;
}

function getClampedCanvasFontSize(
  fontSizePt: number,
  canvas: VideoCanvas,
): number {
  return clamp(
    toFiniteNumber(fontSizePt, DEFAULT_FONT_SIZE),
    canvas.height * TEXT_OVERLAY_MIN_FONT_RATIO,
    canvas.height * TEXT_OVERLAY_MAX_FONT_RATIO,
  );
}

function approximateCharacterWidth(fontSize: number): number {
  return Math.max(fontSize * APPROX_CHARACTER_WIDTH_RATIO, 6);
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
