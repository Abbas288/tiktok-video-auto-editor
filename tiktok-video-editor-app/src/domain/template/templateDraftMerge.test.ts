import { Template } from "../../types/template";
import { mergeTemplateWithDraft } from "./templateDraftMerge";

function createSourceTemplate(): Template {
  return {
    id: "bunny-intro-2026",
    title: "The Bunny and the Butterfly",
    sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    orientation: "landscape",
    originalVolume: 1,
    music: {
      url: "https://example.com/new-music.mp3",
      volume: 0.5,
      beatSync: false,
    },
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "Updated source instruction",
        textOverlays: [],
        effects: [],
      },
    ],
  };
}

describe("templateDraftMerge", () => {
  it("returns source template when no draft exists", () => {
    const sourceTemplate = createSourceTemplate();

    expect(mergeTemplateWithDraft(sourceTemplate, undefined)).toBe(
      sourceTemplate,
    );
  });

  it("preserves draft volume changes while keeping source music url", () => {
    const sourceTemplate = createSourceTemplate();
    const draft: Template = {
      ...sourceTemplate,
      originalVolume: 0.4,
      music: {
        url: "https://example.com/old-music.mp3",
        volume: 0.2,
        beatSync: false,
      },
    };

    const result = mergeTemplateWithDraft(sourceTemplate, draft);

    expect(result.originalVolume).toBe(0.4);
    expect(result.music?.url).toBe("https://example.com/new-music.mp3");
    expect(result.music?.volume).toBe(0.2);
  });

  it("keeps source music when old draft has no music", () => {
    const sourceTemplate = createSourceTemplate();
    const draft: Template = {
      ...sourceTemplate,
      music: undefined,
    };

    const result = mergeTemplateWithDraft(sourceTemplate, draft);

    expect(result.music).toEqual(sourceTemplate.music);
  });

  it("preserves draft scene edits while keeping source timing", () => {
    const sourceTemplate = createSourceTemplate();
    const draft: Template = {
      ...sourceTemplate,
      scenes: [
        {
          ...sourceTemplate.scenes[0],
          startSeconds: 99,
          durationSeconds: 99,
          textOverlays: [
            {
              id: "text-1",
              text: "Draft text",
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
        },
      ],
    };

    const result = mergeTemplateWithDraft(sourceTemplate, draft);

    expect(result.scenes[0].startSeconds).toBe(0);
    expect(result.scenes[0].durationSeconds).toBe(3);
    expect(result.scenes[0].textOverlays[0].text).toBe("Draft text");
  });
});
