/**
 * Formats playback time for editor controls.
 *
 * @param value Playback time in seconds.
 * @returns A display string formatted as m:ss.
 */
export function formatPlaybackTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = `${totalSeconds % 60}`.padStart(2, "0");

  return `${minutes}:${seconds}`;
}
