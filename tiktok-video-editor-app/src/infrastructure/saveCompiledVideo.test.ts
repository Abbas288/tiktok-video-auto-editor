import {
  saveCompiledVideoToDevice,
  SaveCompiledVideoDependencies,
} from "./saveCompiledVideo";

function createDependencies(
  overrides: Partial<SaveCompiledVideoDependencies> = {},
): SaveCompiledVideoDependencies {
  return {
    platform: "ios",
    openUrl: jest.fn(async () => undefined),
    requestPermission: jest.fn(async () => ({ granted: true })),
    downloadVideo: jest.fn(async () => ({
      exists: true,
      uri: "file:///cache/letrend-export.mp4",
    })),
    saveToLibrary: jest.fn(async () => undefined),
    prepareVideoReference: jest.fn(async (url: string) => url),
    ...overrides,
  };
}

describe("saveCompiledVideoToDevice", () => {
  it("validates, downloads and saves a remote video on native platforms", async () => {
    const dependencies = createDependencies();

    const result = await saveCompiledVideoToDevice(
      "https://example.com/video.mp4",
      dependencies,
    );

    expect(dependencies.prepareVideoReference).toHaveBeenCalledWith(
      "https://example.com/video.mp4",
    );
    expect(dependencies.requestPermission).toHaveBeenCalledTimes(1);
    expect(dependencies.downloadVideo).toHaveBeenCalledWith(
      "https://example.com/video.mp4",
    );
    expect(dependencies.saveToLibrary).toHaveBeenCalledWith(
      "file:///cache/letrend-export.mp4",
    );
    expect(result.kind).toBe("saved");
  });

  it("saves an existing local file without downloading it again", async () => {
    const dependencies = createDependencies();

    await saveCompiledVideoToDevice(
      "file:///cache/already-rendered.mp4",
      dependencies,
    );

    expect(dependencies.downloadVideo).not.toHaveBeenCalled();
    expect(dependencies.saveToLibrary).toHaveBeenCalledWith(
      "file:///cache/already-rendered.mp4",
    );
  });

  it("opens the video URL on web instead of requesting media-library permission", async () => {
    const dependencies = createDependencies({
      platform: "web",
    });

    const result = await saveCompiledVideoToDevice(
      "https://example.com/video.mp4",
      dependencies,
    );

    expect(dependencies.openUrl).toHaveBeenCalledWith(
      "https://example.com/video.mp4",
    );
    expect(dependencies.requestPermission).not.toHaveBeenCalled();
    expect(dependencies.saveToLibrary).not.toHaveBeenCalled();
    expect(result.kind).toBe("opened");
  });

  it("throws a clear error when permission is denied", async () => {
    const dependencies = createDependencies({
      requestPermission: jest.fn(async () => ({ granted: false })),
    });

    await expect(
      saveCompiledVideoToDevice("https://example.com/video.mp4", dependencies),
    ).rejects.toThrow("Permission was denied.");

    expect(dependencies.saveToLibrary).not.toHaveBeenCalled();
  });

  it("throws a clear error when no video is available", async () => {
    const dependencies = createDependencies();

    await expect(saveCompiledVideoToDevice("", dependencies)).rejects.toThrow(
      "No finished video is available to save.",
    );
  });

  it("throws when the finished video reference is no longer available", async () => {
    const dependencies = createDependencies({
      prepareVideoReference: jest.fn(async () => {
        throw new Error(
          "The finished video is no longer available. Run compile again.",
        );
      }),
    });

    await expect(
      saveCompiledVideoToDevice(
        "http://localhost:3030/compiled/missing.mp4",
        dependencies,
      ),
    ).rejects.toThrow(
      "The finished video is no longer available. Run compile again.",
    );

    expect(dependencies.downloadVideo).not.toHaveBeenCalled();
  });

  it("throws a clear error when the downloaded video is not a local file", async () => {
    const dependencies = createDependencies({
      downloadVideo: jest.fn(async () => ({
        exists: true,
        uri: "https://example.com/not-local.mp4",
      })),
    });

    await expect(
      saveCompiledVideoToDevice("https://example.com/video.mp4", dependencies),
    ).rejects.toThrow("The video could not be prepared for saving.");
  });
});
