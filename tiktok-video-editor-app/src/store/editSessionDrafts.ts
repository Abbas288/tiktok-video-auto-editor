import { removeSessionBoundSceneMedia } from "../domain/scene-video/sceneVideoDraftSanitizer";
import { Template } from "../types/template";

export type EditedTemplatesById = Record<string, Template>;

export interface DraftStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const DRAFTS_STORAGE_KEY = "tiktok-video-editor-app:edited-template-drafts:v2";

/**
 * Loads edited template drafts from browser storage.
 *
 * Runtime media references are removed when drafts are restored. This prevents
 * old local file/blob URLs and old upload URLs from being treated as valid
 * scene videos in a later browser or server session.
 *
 * @param storage Optional storage adapter used for tests.
 * @returns Previously saved template drafts, or an empty object when storage is unavailable.
 */
export function loadEditedTemplateDrafts(
  storage: DraftStorage | null = getBrowserStorage(),
): EditedTemplatesById {
  if (!storage) {
    return {};
  }

  try {
    const rawValue = storage.getItem(DRAFTS_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isEditedTemplatesById(parsedValue)) {
      return {};
    }

    const { drafts, didChange } = sanitizeEditedTemplateDrafts(parsedValue);

    if (didChange) {
      saveEditedTemplateDrafts(drafts, storage);
    }

    return drafts;
  } catch {
    return {};
  }
}

/**
 * Saves edited template drafts to browser storage.
 *
 * @param drafts Edited template drafts keyed by template id.
 * @param storage Optional storage adapter used for tests.
 */
export function saveEditedTemplateDrafts(
  drafts: EditedTemplatesById,
  storage: DraftStorage | null = getBrowserStorage(),
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    return;
  }
}

/**
 * Clears edited template drafts from browser storage.
 *
 * @param storage Optional storage adapter used for tests.
 */
export function clearEditedTemplateDraftsStorage(
  storage: DraftStorage | null = getBrowserStorage(),
): void {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(DRAFTS_STORAGE_KEY);
  } catch {
    return;
  }
}

function sanitizeEditedTemplateDrafts(drafts: EditedTemplatesById): {
  drafts: EditedTemplatesById;
  didChange: boolean;
} {
  let didChange = false;
  const sanitizedDrafts: EditedTemplatesById = {};

  for (const [templateId, template] of Object.entries(drafts)) {
    const sanitizedTemplate = removeSessionBoundSceneMedia(template);

    if (sanitizedTemplate !== template) {
      didChange = true;
    }

    sanitizedDrafts[templateId] = sanitizedTemplate;
  }

  return {
    drafts: sanitizedDrafts,
    didChange,
  };
}

function getBrowserStorage(): DraftStorage | null {
  if (typeof globalThis === "undefined") {
    return null;
  }

  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isEditedTemplatesById(value: unknown): value is EditedTemplatesById {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(isTemplateLike);
}

function isTemplateLike(value: unknown): value is Template {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.sourceVideoUrl === "string" &&
    isValidOrientation(value.orientation) &&
    Array.isArray(value.scenes)
  );
}

function isValidOrientation(value: unknown): value is Template["orientation"] {
  return value === "portrait" || value === "landscape" || value === "square";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
