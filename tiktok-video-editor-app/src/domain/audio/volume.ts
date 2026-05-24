/**
 * Shared volume step used by editor audio controls.
 */
export const VOLUME_STEP = 0.1;

/**
 * Clamps a volume value to the supported normalized range.
 *
 * @param value Input volume.
 * @returns Volume between 0 and 1.
 */
export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(Math.max(value, 0), 1);
}

/**
 * Applies a relative step to a volume value.
 *
 * @param value Current volume.
 * @param delta Relative volume delta.
 * @returns Clamped volume.
 */
export function stepVolume(value: number, delta: number): number {
  return clampVolume(value + delta);
}

/**
 * Toggles a volume value between muted and audible.
 *
 * @param value Current volume.
 * @param fallbackVolume Volume to use when unmuting.
 * @returns Muted or restored volume.
 */
export function toggleMute(value: number, fallbackVolume = 1): number {
  return clampVolume(value) === 0 ? clampVolume(fallbackVolume) : 0;
}

/**
 * Formats a normalized volume value as a percentage.
 *
 * @param value Normalized volume.
 * @returns Rounded percentage label.
 */
export function formatVolumePercent(value: number): string {
  return `${Math.round(clampVolume(value) * 100)}%`;
}
