import {
  clampVolume,
  formatVolumePercent,
  stepVolume,
  toggleMute,
} from "./volume";

describe("volume helpers", () => {
  it("clamps volume to the normalized range", () => {
    expect(clampVolume(-1)).toBe(0);
    expect(clampVolume(2)).toBe(1);
    expect(clampVolume(0.5)).toBe(0.5);
  });

  it("falls back safely for invalid values", () => {
    expect(clampVolume(Number.NaN)).toBe(1);
    expect(clampVolume(Number.POSITIVE_INFINITY)).toBe(1);
  });

  it("steps volume while keeping it inside range", () => {
    expect(stepVolume(0.5, 0.1)).toBeCloseTo(0.6);
    expect(stepVolume(0.95, 0.1)).toBe(1);
    expect(stepVolume(0.05, -0.1)).toBe(0);
  });

  it("toggles mute and restores audible volume", () => {
    expect(toggleMute(0.5)).toBe(0);
    expect(toggleMute(0)).toBe(1);
    expect(toggleMute(0, 0.4)).toBe(0.4);
  });

  it("formats volume as a percentage", () => {
    expect(formatVolumePercent(0)).toBe("0%");
    expect(formatVolumePercent(0.55)).toBe("55%");
    expect(formatVolumePercent(1)).toBe("100%");
  });
});
