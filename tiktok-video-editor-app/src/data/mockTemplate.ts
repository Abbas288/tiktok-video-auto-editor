import { Template } from "../types/template";

/**
 * A mock template for testing the video editor functionality.
 */
export const mockBunnyTemplate: Template = {
  id: "bunny-intro-2026",
  title: "The Bunny and the Butterfly",
  sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  orientation: "landscape",
  originalVolume: 1,
  music: {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    volume: 0.5,
    beatSync: false,
  },
  scenes: [
    {
      id: "scene-1",
      orderIndex: 0,
      startSeconds: 0.0,
      durationSeconds: 3.0,
      instruction: "Butterfly flies above a giant bunny",
      textOverlays: [
        {
          id: "text-1",
          text: "Meet the world's largest bunny!",
          positionX: 0.1,
          positionY: 0.2,
          fontSizePt: 24,
          color: "#00D6F9",
          style: "bold",
          animationIn: "none",
          startSeconds: 0.5,
          durationSeconds: 2.0,
        },
      ],
      effects: [],
    },
    {
      id: "scene-2",
      orderIndex: 1,
      startSeconds: 3.0,
      durationSeconds: 7.0,
      instruction:
        "The bunny follows the butterfly with its eyes until it lands on a flower; at the last moment, the butterfly is crushed by a falling apple",
      textOverlays: [
        {
          id: "text-2",
          text: "What is he looking at?",
          positionX: 0.3,
          positionY: 0.8,
          fontSizePt: 20,
          color: "#FFFFFF",
          style: "italic",
          animationIn: "none",
          startSeconds: 4.0,
          durationSeconds: 3.0,
        },
      ],
      effects: [],
    },
  ],
};
