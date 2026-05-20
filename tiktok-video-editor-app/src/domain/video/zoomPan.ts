import { SceneFilterValues, ZoomFocusPosition } from "./sceneEffects";
import { MediaRect } from "./videoCanvas";

/**
 * Represents a 2D point in rendered media pixels.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents the maximum allowed pan distance for a zoomed media frame.
 */
export interface ZoomPanBounds {
  maxX: number;
  maxY: number;
}

/**
 * Calculates the maximum pan distance created by zooming a video frame.
 *
 * @param mediaRect Rendered media rectangle.
 * @param zoom Current zoom factor.
 * @returns Maximum horizontal and vertical pan distance.
 */
export function getZoomPanBounds(
  mediaRect: MediaRect,
  zoom: number,
): ZoomPanBounds {
  const safeZoom = Math.max(zoom, 1);

  return {
    maxX: Math.max((mediaRect.width * safeZoom - mediaRect.width) / 2, 0),
    maxY: Math.max((mediaRect.height * safeZoom - mediaRect.height) / 2, 0),
  };
}

/**
 * Converts normalized zoom focus into rendered pan pixels.
 *
 * @param filters Active scene filter values.
 * @param bounds Current pan bounds.
 * @returns Pan point in rendered pixels.
 */
export function zoomFocusToPan(
  filters: SceneFilterValues,
  bounds: ZoomPanBounds,
): Point {
  return {
    x: (0.5 - filters.zoomPositionX) * bounds.maxX * 2,
    y: (0.5 - filters.zoomPositionY) * bounds.maxY * 2,
  };
}

/**
 * Converts rendered pan pixels into normalized zoom focus.
 *
 * @param pan Current pan point.
 * @param bounds Current pan bounds.
 * @returns Normalized zoom focus position.
 */
export function panToZoomFocus(
  pan: Point,
  bounds: ZoomPanBounds,
): ZoomFocusPosition {
  return {
    positionX: bounds.maxX > 0 ? clamp01(0.5 - pan.x / (bounds.maxX * 2)) : 0.5,
    positionY: bounds.maxY > 0 ? clamp01(0.5 - pan.y / (bounds.maxY * 2)) : 0.5,
  };
}

/**
 * Keeps pan movement inside the zoomed media bounds.
 *
 * @param pan Requested pan point.
 * @param bounds Current pan bounds.
 * @returns Clamped pan point.
 */
export function clampPan(pan: Point, bounds: ZoomPanBounds): Point {
  return {
    x: clamp(pan.x, -bounds.maxX, bounds.maxX),
    y: clamp(pan.y, -bounds.maxY, bounds.maxY),
  };
}

/**
 * Clamps a value to the normalized coordinate range.
 *
 * @param value Input value.
 * @returns Number between 0 and 1.
 */
function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Clamps a value between a minimum and maximum value.
 *
 * @param value Input value.
 * @param min Minimum allowed value.
 * @param max Maximum allowed value.
 * @returns Clamped value.
 */
function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
