import { createSceneVideoSource } from "./sceneVideoSourceFactory";

describe("sceneVideoSourceFactory", () => {
  it("creates scene video source from selected candidate and upload result", () => {
    const source = createSceneVideoSource({
      candidate: {
        localUri: "file:///local-video.mp4",
        fileName: "local-video.mp4",
        mimeType: "video/mp4",
        durationSeconds: 8,
      },
      upload: {
        uploadUrl: "http://localhost:3030/assets/videos/uploaded.mp4",
        fileName: "uploaded.mp4",
      },
      sourceStartSeconds: 1.5,
      durationSeconds: 4,
    });

    expect(source).toEqual({
      type: "user",
      localUri: "file:///local-video.mp4",
      uploadUrl: "http://localhost:3030/assets/videos/uploaded.mp4",
      fileName: "uploaded.mp4",
      originalDurationSeconds: 8,
      sourceStartSeconds: 1.5,
      durationSeconds: 4,
    });
  });
});
