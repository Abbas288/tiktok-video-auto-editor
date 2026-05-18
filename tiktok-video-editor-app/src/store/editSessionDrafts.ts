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

    return isEditedTemplatesById(parsedValue) ? parsedValue : {};
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
