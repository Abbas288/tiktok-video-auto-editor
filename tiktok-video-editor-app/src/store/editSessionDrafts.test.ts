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

describe("editSessionDrafts", () => {
  it("saves and loads edited template drafts", () => {
    const storage = createMemoryStorage();
    const drafts = createDraftFixture();

    saveEditedTemplateDrafts(drafts, storage);

    expect(loadEditedTemplateDrafts(storage)).toEqual(drafts);
  });

  it("returns an empty object when storage is unavailable", () => {
    expect(loadEditedTemplateDrafts(null)).toEqual({});
  });

  it("returns an empty object when stored JSON is invalid", () => {
    const storage = createMemoryStorage();

    storage.setItem("tiktok-video-editor-app:edited-template-drafts:v2", "{");

    expect(loadEditedTemplateDrafts(storage)).toEqual({});
  });

  it("returns an empty object when stored data does not match template shape", () => {
    const storage = createMemoryStorage();

    storage.setItem(
      "tiktok-video-editor-app:edited-template-drafts:v2",
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
      "tiktok-video-editor-app:edited-template-drafts:v2",
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
