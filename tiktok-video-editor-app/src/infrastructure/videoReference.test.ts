import {
  ensureVideoReferenceAvailable,
  openVideoReference,
  UNAVAILABLE_VIDEO_MESSAGE,
  VideoReferenceDependencies,
} from "./videoReference";

function createDependencies(
  overrides: Partial<VideoReferenceDependencies> = {},
): VideoReferenceDependencies {
  return {
    fetcher: jest.fn(async () => ({
      ok: true,
      headers: {
        get: () => "video/mp4",
      },
    })),
    openUrl: jest.fn(async () => undefined),
    compileServerBaseUrl: "http://localhost:3030",
    ...overrides,
  };
}

describe("videoReference", () => {
  it("returns external URLs without HEAD validation", async () => {
    const dependencies = createDependencies();

    const result = await ensureVideoReferenceAvailable(
      "https://example.com/video.mp4",
      dependencies,
    );

    expect(result).toBe("https://example.com/video.mp4");
    expect(dependencies.fetcher).not.toHaveBeenCalled();
  });

  it("validates compile-server output URLs", async () => {
    const dependencies = createDependencies();

    const result = await ensureVideoReferenceAvailable(
      "http://localhost:3030/compiled/video.mp4",
      dependencies,
    );

    expect(result).toBe("http://localhost:3030/compiled/video.mp4");
    expect(dependencies.fetcher).toHaveBeenCalledWith(
      "http://localhost:3030/compiled/video.mp4",
      { method: "HEAD" },
    );
  });

  it("rejects missing compile-server output URLs", async () => {
    const dependencies = createDependencies({
      fetcher: jest.fn(async () => ({
        ok: false,
        headers: {
          get: () => "application/json",
        },
      })),
    });

    await expect(
      ensureVideoReferenceAvailable(
        "http://localhost:3030/compiled/missing.mp4",
        dependencies,
      ),
    ).rejects.toThrow(UNAVAILABLE_VIDEO_MESSAGE);
  });

  it("rejects JSON responses for compile-server output URLs", async () => {
    const dependencies = createDependencies({
      fetcher: jest.fn(async () => ({
        ok: true,
        headers: {
          get: () => "application/json",
        },
      })),
    });

    await expect(
      ensureVideoReferenceAvailable(
        "http://localhost:3030/compiled/not-video.mp4",
        dependencies,
      ),
    ).rejects.toThrow(UNAVAILABLE_VIDEO_MESSAGE);
  });

  it("opens available video references", async () => {
    const dependencies = createDependencies();

    await openVideoReference(
      "http://localhost:3030/compiled/video.mp4",
      dependencies,
    );

    expect(dependencies.openUrl).toHaveBeenCalledWith(
      "http://localhost:3030/compiled/video.mp4",
    );
  });
});
