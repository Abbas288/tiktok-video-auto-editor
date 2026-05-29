import {
  clampSceneVideoStart,
  createSceneVideoDecision,
} from "./sceneVideoSelection";

const candidate = {
  localUri: "file:///video.mp4",
  fileName: "video.mp4",
  mimeType: "video/mp4",
  durationSeconds: 5,
};

describe("sceneVideoSelection", () => {
  it("requires trim when selected video is longer than the scene", () => {
    const result = createSceneVideoDecision(candidate, 3);

    expect(result.type).toBe("needs-trim");
  });

  it("accepts video with matching duration", () => {
    const result = createSceneVideoDecision(
      { ...candidate, durationSeconds: 3 },
      3,
    );

    expect(result.type).toBe("ready");
  });

  it("rejects video shorter than the scene", () => {
    const result = createSceneVideoDecision(
      { ...candidate, durationSeconds: 2 },
      3,
    );

    expect(result.type).toBe("too-short");
  });

  it("clamps trim start", () => {
    expect(clampSceneVideoStart(-2, 3)).toBe(0);
    expect(clampSceneVideoStart(8, 3)).toBe(3);
    expect(clampSceneVideoStart(1.5, 3)).toBe(1.5);
  });
});
