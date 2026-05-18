import { Size } from "./videoCanvas";

/**
 * Represents normalized overlay coordinates.
 */
export interface NormalizedOverlayPosition {
  positionX: number;
  positionY: number;
}

/**
 * Represents a 2D point in rendered media pixels.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents the measured overlay size in rendered pixels.
 */
export interface OverlaySize {
  width: number;
  height: number;
}

/**
 * Calculates a new normalized overlay position from a drag gesture.
 *
 * @param startPosition Overlay position at the start of the gesture.
 * @param deltaX Horizontal drag delta in rendered media pixels.
 * @param deltaY Vertical drag delta in rendered media pixels.
 * @param mediaSize Current rendered video size.
 * @returns Clamped normalized position between 0 and 1.
 */
export function calculateDraggedOverlayPosition(
  startPosition: NormalizedOverlayPosition,
  deltaX: number,
  deltaY: number,
  mediaSize: Size,
): NormalizedOverlayPosition {
  if (mediaSize.width <= 0 || mediaSize.height <= 0) {
    return {
      positionX: clamp01(startPosition.positionX),
      positionY: clamp01(startPosition.positionY),
    };
  }

  return {
    positionX: clamp01(startPosition.positionX + deltaX / mediaSize.width),
    positionY: clamp01(startPosition.positionY + deltaY / mediaSize.height),
  };
}

/**
 * Converts normalized center coordinates into a clamped top-left position.
 *
 * @param position Normalized overlay center position.
 * @param overlaySize Rendered overlay size.
 * @param mediaSize Rendered media size.
 * @returns Clamped top-left position in pixels.
 */
export function normalizedPositionToTopLeft(
  position: NormalizedOverlayPosition,
  overlaySize: OverlaySize,
  mediaSize: Size,
): Point {
  const mediaWidth = Math.max(mediaSize.width, 1);
  const mediaHeight = Math.max(mediaSize.height, 1);

  return clampTopLeft(
    {
      x: clamp01(position.positionX) * mediaWidth - overlaySize.width / 2,
      y: clamp01(position.positionY) * mediaHeight - overlaySize.height / 2,
    },
    overlaySize,
    {
      width: mediaWidth,
      height: mediaHeight,
    },
  );
}

/**
 * Converts a top-left pixel position into normalized center coordinates.
 *
 * @param topLeft Top-left overlay position in pixels.
 * @param overlaySize Rendered overlay size.
 * @param mediaSize Rendered media size.
 * @returns Normalized center position.
 */
export function topLeftToNormalizedPosition(
  topLeft: Point,
  overlaySize: OverlaySize,
  mediaSize: Size,
): NormalizedOverlayPosition {
  const mediaWidth = Math.max(mediaSize.width, 1);
  const mediaHeight = Math.max(mediaSize.height, 1);

  return {
    positionX: clamp01((topLeft.x + overlaySize.width / 2) / mediaWidth),
    positionY: clamp01((topLeft.y + overlaySize.height / 2) / mediaHeight),
  };
}

/**
 * Clamps a top-left overlay position so the overlay remains inside the media.
 *
 * @param topLeft Requested top-left position.
 * @param overlaySize Rendered overlay size.
 * @param mediaSize Rendered media size.
 * @returns Clamped top-left position.
 */
export function clampTopLeft(
  topLeft: Point,
  overlaySize: OverlaySize,
  mediaSize: Size,
): Point {
  return {
    x: clamp(topLeft.x, 0, Math.max(mediaSize.width - overlaySize.width, 0)),
    y: clamp(topLeft.y, 0, Math.max(mediaSize.height - overlaySize.height, 0)),
  };
}

/**
 * Clamps a number to the normalized coordinate range.
 *
 * @param value Input number.
 * @returns Number between 0 and 1.
 */
export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value Input number.
 * @param min Minimum allowed value.
 * @param max Maximum allowed value.
 * @returns Clamped number.
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
