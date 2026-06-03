import {
  clearEditedTemplateDraftsStorage,
  DraftStorage,
  EditedTemplatesById,
  loadEditedTemplateDrafts,
  saveEditedTemplateDrafts,
} from "./editSessionDrafts";

interface MemoryStorage {
  getItem: jest.Mock<string | null, [string]>;
  setItem: jest.Mock<void, [string, string]>;
  removeItem: jest.Mock<void, [string]>;
}

const DRAFTS_STORAGE_KEY = "tiktok-video-editor-app:edited-template-drafts:v2";

function createMemoryStorage(): MemoryStorage {
  const values = new Map<string, string>();

  return {
    getItem: jest.fn((key: string) => values.get(key) ?? null),
    setItem: jest.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: jest.fn((key: string) => {
      values.delete(key);
    }),
  };
}

function createDraftFixture(): EditedTemplatesById {
  return {
    "bunny-intro-2026": {
      id: "bunny-intro-2026",
      title: "The Bunny and the Butterfly",
      sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      orientation: "landscape",
      scenes: [],
    },
  };
}

function createDraftWithSessionMedia(): EditedTemplatesById {
  return {
    "bunny-intro-2026": {
      id: "bunny-intro-2026",
      title: "The Bunny and the Butterfly",
      sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      orientation: "landscape",
      compiledVideoUrl: "https://example.com/compiled/old-output.mp4",
      scenes: [
        {
          id: "scene-1",
          orderIndex: 0,
          startSeconds: 0,
          durationSeconds: 4,
          instruction: "Scene with stale video",
          textOverlays: [],
          effects: [
            {
              type: "contrast",
              value: 1.1,
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
    },
  };
}

describe("editSessionDrafts", () => {
  it("saves and loads edited template drafts", () => {
    const storage = createMemoryStorage();
    const drafts = createDraftFixture();

    saveEditedTemplateDrafts(drafts, storage);

    expect(loadEditedTemplateDrafts(storage)).toEqual(drafts);
  });

  it("removes session-bound media references when drafts are restored", () => {
    const storage = createMemoryStorage();

    storage.setItem(
      DRAFTS_STORAGE_KEY,
      JSON.stringify(createDraftWithSessionMedia()),
    );

    const loadedDrafts = loadEditedTemplateDrafts(storage);
    const loadedTemplate = loadedDrafts["bunny-intro-2026"];

    expect(loadedTemplate.compiledVideoUrl).toBeUndefined();
    expect(loadedTemplate.scenes[0].videoSource).toBeUndefined();
    expect(loadedTemplate.scenes[0].effects).toEqual([
      {
        type: "contrast",
        value: 1.1,
      },
    ]);
  });

  it("rewrites stored drafts after session-bound media references are removed", () => {
    const storage = createMemoryStorage();

    storage.setItem(
      DRAFTS_STORAGE_KEY,
      JSON.stringify(createDraftWithSessionMedia()),
    );

    loadEditedTemplateDrafts(storage);

    const storedValue = storage.getItem(DRAFTS_STORAGE_KEY);

    expect(storedValue).not.toBeNull();

    const storedDrafts = JSON.parse(storedValue ?? "{}") as EditedTemplatesById;
    const storedTemplate = storedDrafts["bunny-intro-2026"];

    expect(storedTemplate.compiledVideoUrl).toBeUndefined();
    expect(storedTemplate.scenes[0].videoSource).toBeUndefined();
  });

  it("returns an empty object when storage is unavailable", () => {
    expect(loadEditedTemplateDrafts(null)).toEqual({});
  });

  it("returns an empty object when stored JSON is invalid", () => {
    const storage = createMemoryStorage();

    storage.setItem(DRAFTS_STORAGE_KEY, "{");

    expect(loadEditedTemplateDrafts(storage)).toEqual({});
  });

  it("returns an empty object when stored data does not match template shape", () => {
    const storage = createMemoryStorage();

    storage.setItem(
      DRAFTS_STORAGE_KEY,
      JSON.stringify({
        broken: {
          id: "missing-fields",
        },
      }),
    );

    expect(loadEditedTemplateDrafts(storage)).toEqual({});
  });

  it("returns an empty object when orientation is invalid", () => {
    const storage = createMemoryStorage();

    storage.setItem(
      DRAFTS_STORAGE_KEY,
      JSON.stringify({
        "bunny-intro-2026": {
          id: "bunny-intro-2026",
          title: "The Bunny and the Butterfly",
          sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          orientation: "diagonal",
          scenes: [],
        },
      }),
    );

    expect(loadEditedTemplateDrafts(storage)).toEqual({});
  });

  it("clears edited template drafts", () => {
    const storage = createMemoryStorage();
    const drafts = createDraftFixture();

    saveEditedTemplateDrafts(drafts, storage);
    clearEditedTemplateDraftsStorage(storage);

    expect(loadEditedTemplateDrafts(storage)).toEqual({});
  });

  it("does not throw when storage methods fail", () => {
    const storage: DraftStorage = {
      getItem: jest.fn(() => {
        throw new Error("getItem failed");
      }),
      setItem: jest.fn(() => {
        throw new Error("setItem failed");
      }),
      removeItem: jest.fn(() => {
        throw new Error("removeItem failed");
      }),
    };

    expect(() =>
      saveEditedTemplateDrafts(createDraftFixture(), storage),
    ).not.toThrow();
    expect(() => clearEditedTemplateDraftsStorage(storage)).not.toThrow();
    expect(loadEditedTemplateDrafts(storage)).toEqual({});
  });
});
