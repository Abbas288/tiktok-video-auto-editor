import { Template } from "../types/schema";

export const mockPizzaTemplate: Template = {
  id: "bunny-intro-2026",
  title: "Kaninen och Fjärilen",
  sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  orientation: "landscape",
  scenes: [
    {
      id: "scene-1",
      orderIndex: 0,
      startSeconds: 0.0,
      durationSeconds: 3.0,
      instruction: "Fjäril flyger ovanför en gigantisk kanin",
      textOverlays: [],
      effects: [],
    },
    {
      id: "scene-2",
      orderIndex: 1,
      startSeconds: 3.0,
      durationSeconds: 7.0,
      instruction:
        "Kaninen följer fjärilen med ögonen tills den landar på blomma, i sista ögonblick mosas fjärilen av ett fallande äpple",
      textOverlays: [],
      effects: [],
    },
  ],
};
