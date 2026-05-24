import { Template } from "../../types/template";
import {
  updateTemplateTextOverlay,
  updateTemplateVolumes,
} from "./templateEditing";

function createTemplateFixture(): Template {
  return {
    id: "bunny-intro-2026",
    title: "The Bunny and the Butterfly",
    sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    orientation: "landscape",
    originalVolume: 1,
    music: {
      url: "https://example.com/music.mp3",
      volume: 0.5,
      beatSync: false,
    },
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "First scene",
        textOverlays: [
          {
            id: "text-1",
            text: "Hello",
            positionX: 0.5,
            positionY: 0.5,
            fontSizePt: 20,
            color: "#FFFFFF",
            style: "normal",
            animationIn: "none",
            startSeconds: 0,
            durationSeconds: 2,
          },
        ],
        effects: [],
      },
    ],
  };
}

describe("templateEditing", () => {
  it("updates text overlays immutably", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateTextOverlay(
      template,
      "scene-1",
      "text-1",
      {
        text: "Updated",
      },
    );

    expect(updatedTemplate).not.toBe(template);
    expect(updatedTemplate.scenes[0]).not.toBe(template.scenes[0]);
    expect(updatedTemplate.scenes[0].textOverlays[0].text).toBe("Updated");
    expect(template.scenes[0].textOverlays[0].text).toBe("Hello");
  });

  it("updates original and music volumes immutably", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateVolumes(template, 0.4, 0.2);

    expect(updatedTemplate).not.toBe(template);
    expect(updatedTemplate.originalVolume).toBe(0.4);
    expect(updatedTemplate.music?.volume).toBe(0.2);
    expect(template.originalVolume).toBe(1);
    expect(template.music?.volume).toBe(0.5);
  });

  it("clamps volume updates safely", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateVolumes(template, 2, -1);

    expect(updatedTemplate.originalVolume).toBe(1);
    expect(updatedTemplate.music?.volume).toBe(0);
  });

  it("returns original template when volume values are unchanged", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateVolumes(template, 1, 0.5);

    expect(updatedTemplate).toBe(template);
  });
});
