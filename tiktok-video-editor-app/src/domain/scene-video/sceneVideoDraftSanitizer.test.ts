import { Template } from "../../types/template";
import { removeSessionBoundSceneMedia } from "./sceneVideoDraftSanitizer";

function createTemplateWithSceneMedia(): Template {
  return {
    id: "bunny-intro-2026",
    title: "The Bunny and the Butterfly",
    sourceVideoUrl: "https://example.com/source.mp4",
    orientation: "landscape",
    compiledVideoUrl: "https://example.com/compiled/old-output.mp4",
    originalVolume: 0.7,
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 4,
        instruction: "Scene with stale media",
        transition: {
          type: "cut",
          durationSeconds: 0,
        },
        textOverlays: [
          {
            id: "text-1",
            text: "Keep this edit",
            positionX: 0.5,
            positionY: 0.5,
            fontSizePt: 24,
            color: "#FFFFFF",
            style: "normal",
            animationIn: "none",
            startSeconds: 0,
            durationSeconds: 2,
          },
        ],
        effects: [
          {
            type: "brightness",
            value: 1.2,
          },
        ],
        videoSource: {
          type: "user",
          localUri: "blob:http://localhost/stale-video",
          uploadUrl: "https://example.com/api/assets/videos/stale.mp4",
          fileName: "stale.mp4",
          originalDurationSeconds: 8,
          sourceStartSeconds: 0,
          durationSeconds: 4,
        },
      },
    ],
  };
}

describe("sceneVideoDraftSanitizer", () => {
  it("removes session-bound media references from a persisted draft", () => {
    const result = removeSessionBoundSceneMedia(createTemplateWithSceneMedia());

    expect(result.compiledVideoUrl).toBeUndefined();
    expect(result.scenes[0].videoSource).toBeUndefined();
  });

  it("keeps stable project edits when session media is removed", () => {
    const result = removeSessionBoundSceneMedia(createTemplateWithSceneMedia());

    expect(result.originalVolume).toBe(0.7);
    expect(result.scenes[0].textOverlays[0].text).toBe("Keep this edit");
    expect(result.scenes[0].effects).toEqual([
      {
        type: "brightness",
        value: 1.2,
      },
    ]);
    expect(result.scenes[0].transition).toEqual({
      type: "cut",
      durationSeconds: 0,
    });
  });

  it("returns the same reference when no session-bound media exists", () => {
    const template: Template = {
      id: "clean-template",
      title: "Clean Template",
      sourceVideoUrl: "https://example.com/source.mp4",
      orientation: "landscape",
      scenes: [
        {
          id: "scene-1",
          orderIndex: 0,
          startSeconds: 0,
          durationSeconds: 4,
          instruction: "Clean scene",
          textOverlays: [],
          effects: [],
        },
      ],
    };

    expect(removeSessionBoundSceneMedia(template)).toBe(template);
  });
});
