import { getActiveSceneIdAtTime } from "./getActiveSceneIdAtTime";

const scenes = [
  {
    id: "scene-1",
    startSeconds: 0,
    durationSeconds: 3,
  },
  {
    id: "scene-2",
    startSeconds: 3,
    durationSeconds: 7,
  },
];

describe("getActiveSceneIdAtTime", () => {
  it("returns the first scene at the start of the video", () => {
    expect(getActiveSceneIdAtTime(scenes, 0)).toBe("scene-1");
  });

  it("returns the next scene at its exact start time", () => {
    expect(getActiveSceneIdAtTime(scenes, 3)).toBe("scene-2");
  });

  it("returns null when time is outside all scenes", () => {
    expect(getActiveSceneIdAtTime(scenes, 10)).toBeNull();
  });

  it("returns null for invalid playback time", () => {
    expect(getActiveSceneIdAtTime(scenes, Number.NaN)).toBeNull();
  });
});
