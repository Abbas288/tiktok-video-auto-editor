import { formatPlaybackTime } from "./formatPlaybackTime";

describe("formatPlaybackTime", () => {
  it("formats seconds below one minute", () => {
    expect(formatPlaybackTime(7)).toBe("0:07");
  });

  it("formats minutes and seconds", () => {
    expect(formatPlaybackTime(67)).toBe("1:07");
  });

  it("floors decimal seconds", () => {
    expect(formatPlaybackTime(3.9)).toBe("0:03");
  });

  it("falls back safely for invalid values", () => {
    expect(formatPlaybackTime(Number.NaN)).toBe("0:00");
    expect(formatPlaybackTime(Number.POSITIVE_INFINITY)).toBe("0:00");
    expect(formatPlaybackTime(-1)).toBe("0:00");
  });
});
