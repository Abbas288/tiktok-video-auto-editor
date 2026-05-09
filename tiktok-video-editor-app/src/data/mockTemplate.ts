import { Template } from "../types/template";

/**
 * A mock template for testing the video editor.
 */
export const mockBunnyTemplate: Template = {
  id: "bunny-intro-2026",
  title: "The Bunny and the Butterfly",
  sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  orientation: "landscape",
  scenes: [
    {
      id: "scene-1",
      orderIndex: 0,
      startSeconds: 0.0,
      durationSeconds: 3.0,
      instruction: "Butterfly flies above a giant bunny",
      textOverlays: [],
      effects: [],
    },
    {
      id: "scene-2",
      orderIndex: 1,
      startSeconds: 3.0,
      durationSeconds: 7.0,
      instruction:
        "The bunny follows the butterfly with its eyes until it lands on a flower; at the last moment, the butterfly is crushed by a falling apple",
      textOverlays: [],
      effects: [],
    },
  ],
};
