import { parseTemplate } from "./parseTemplate";

describe("parseTemplate", () => {
  // TC2.1: Valid template-like data can be accepted
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

  // TC2.2 & TC2.6: Invalid template-like data is handled safely (no 'any')
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

  // TC2.3: Missing required fields are rejected
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

  // TC2.4: Invalid scene timing is rejected
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
      scenes: [
        { id: "s1", startSeconds: 0, durationSeconds: 0 }, // Invalid duration
      ],
    };
    expect(() => parseTemplate(zeroDuration)).toThrow(
      "Scene 0 has invalid timing",
    );
  });

  // TC2.5: Empty scenes array is handled safely
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
});
