import {
  createMissingSceneVideosMessage,
  createSuccessfulCompileMessage,
  toCompileOutputKind,
} from "./editorCompileController";

describe("editorCompileController", () => {
  it("maps placeholder renderer to placeholder output", () => {
    expect(toCompileOutputKind("placeholder")).toBe("placeholder");
  });

  it("maps ffmpeg renderer to rendered output", () => {
    expect(toCompileOutputKind("ffmpeg")).toBe("rendered");
  });

  it("falls back to unknown output when renderer is missing", () => {
    expect(toCompileOutputKind(undefined)).toBe("unknown");
  });

  it("returns compact success message for rendered output", () => {
    expect(createSuccessfulCompileMessage("rendered")).toBe("Ready.");
  });

  it("returns compact success message for placeholder output", () => {
    expect(createSuccessfulCompileMessage("placeholder")).toBe(
      "Preview ready.",
    );
  });

  it("returns compact validation message when scene videos are missing", () => {
    expect(createMissingSceneVideosMessage()).toBe(
      "Add videos for all scenes first.",
    );
  });
});
