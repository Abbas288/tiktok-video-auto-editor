import { parseTemplate } from "./parseTemplate";

describe("parseTemplate", () => {
  it("TC2.1: parses a valid template successfully", () => {
    const validData = {
      id: "test-1",
      title: "Valid Template",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "portrait",
      scenes: [
        {
          id: "scene-1",
          startSeconds: 0,
          durationSeconds: 5,
          instruction: "Do something fun",
        },
      ],
    };

    const result = parseTemplate(validData);
    expect(result.id).toBe("test-1");
    expect(result.orientation).toBe("portrait");
    expect(result.scenes.length).toBe(1);
    expect(result.scenes[0].instruction).toBe("Do something fun");
  });

  it("TC2.2 & TC2.6: throws error if input is not a valid object", () => {
    expect(() => parseTemplate(null)).toThrow(
      "Invalid template data: input is not an object",
    );
    expect(() => parseTemplate("not an object")).toThrow(
      "Invalid template data: input is not an object",
    );
    expect(() => parseTemplate(123)).toThrow(
      "Invalid template data: input is not an object",
    );
  });

  it("TC2.3: throws error if required fields are missing", () => {
    const missingTitle = {
      id: "test-1",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "landscape",
      scenes: [],
    };
    expect(() => parseTemplate(missingTitle)).toThrow(
      "Missing or invalid field: title",
    );

    const invalidOrientation = {
      id: "test-1",
      title: "Test",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "diagonal",
      scenes: [],
    };
    expect(() => parseTemplate(invalidOrientation)).toThrow(
      "Missing or invalid field: orientation",
    );
  });

  it("TC2.4: throws error if scene timing is invalid", () => {
    const negativeStart = {
      id: "test-1",
      title: "Test",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "square",
      scenes: [{ id: "s1", startSeconds: -1, durationSeconds: 5 }],
    };
    expect(() => parseTemplate(negativeStart)).toThrow(
      "Scene 0 has invalid timing",
    );

    const zeroDuration = {
      id: "test-2",
      title: "Test",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "square",
      scenes: [{ id: "s1", startSeconds: 0, durationSeconds: 0 }],
    };
    expect(() => parseTemplate(zeroDuration)).toThrow(
      "Scene 0 has invalid timing",
    );
  });

  it("TC2.5: handles empty scenes array safely", () => {
    const emptyScenes = {
      id: "test-empty",
      title: "Empty Scenes",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "landscape",
      scenes: [],
    };

    const result = parseTemplate(emptyScenes);
    expect(result.scenes).toEqual([]);
  });

  it("Safely parses originalVolume and music objects", () => {
    const dataWithAudio = {
      id: "test-audio",
      title: "Audio Template",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "landscape",
      originalVolume: 0.8,
      music: {
        url: "https://example.com/music.mp3",
        volume: 0.5,
        beatSync: true,
      },
      scenes: [],
    };

    const result = parseTemplate(dataWithAudio);
    expect(result.originalVolume).toBe(0.8);
    expect(result.music?.url).toBe("https://example.com/music.mp3");
    expect(result.music?.volume).toBe(0.5);
    expect(result.music?.beatSync).toBe(true);
  });

  it("safely parses scene transitions", () => {
    const dataWithTransition = {
      id: "test-transition",
      title: "Transition Template",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "landscape",
      scenes: [
        {
          id: "scene-1",
          startSeconds: 0,
          durationSeconds: 5,
          transition: {
            type: "fade",
            durationSeconds: 0.3,
          },
        },
      ],
    };

    const result = parseTemplate(dataWithTransition);

    expect(result.scenes[0].transition).toEqual({
      type: "fade",
      durationSeconds: 0.3,
    });
  });

  it("ignores invalid scene transitions safely", () => {
    const dataWithInvalidTransition = {
      id: "test-transition",
      title: "Transition Template",
      sourceVideoUrl: "https://example.com/video.mp4",
      orientation: "landscape",
      scenes: [
        {
          id: "scene-1",
          startSeconds: 0,
          durationSeconds: 5,
          transition: {
            type: "spin",
            durationSeconds: 0.3,
          },
        },
      ],
    };

    const result = parseTemplate(dataWithInvalidTransition);

    expect(result.scenes[0].transition).toBeUndefined();
  });
});
