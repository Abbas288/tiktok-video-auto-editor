import * as ImagePicker from "expo-image-picker";
import { SceneVideoCandidate } from "../domain/scene-video/sceneVideoSelection";
import { getCompileServerBaseUrl } from "./compileService";

export interface UploadedSceneVideo {
  uploadUrl: string;
  fileName: string;
}

interface UploadResponse {
  assetUrl?: unknown;
  fileName?: unknown;
}

const VIDEO_FIELD_NAME = "video";

export async function pickSceneVideoCandidate(): Promise<SceneVideoCandidate | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Permission was denied. Allow media access to choose a video.",
    );
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["videos"],
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];

  return {
    localUri: asset.uri,
    fileName: normalizeFileName(asset.fileName, asset.uri),
    mimeType: asset.mimeType ?? "video/mp4",
    durationSeconds: normalizeDuration(asset.duration),
    webFile: asset.file,
  };
}

export async function uploadSceneVideoCandidate(
  candidate: SceneVideoCandidate,
): Promise<UploadedSceneVideo> {
  const baseUrl = getCompileServerBaseUrl();

  if (!baseUrl) {
    throw new Error(
      "Compile server URL is missing. Cannot upload scene video.",
    );
  }

  const formData = new FormData();

  if (candidate.webFile) {
    formData.append(VIDEO_FIELD_NAME, candidate.webFile, candidate.fileName);
  } else {
    formData.append(VIDEO_FIELD_NAME, {
      uri: candidate.localUri,
      name: candidate.fileName,
      type: candidate.mimeType,
    } as unknown as Blob);
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/assets/videos`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Video upload failed with status ${response.status}.`);
  }

  const data = (await response.json()) as UploadResponse;

  if (typeof data.assetUrl !== "string" || data.assetUrl.trim().length === 0) {
    throw new Error(
      "Upload response did not include a usable video reference.",
    );
  }

  return {
    uploadUrl: data.assetUrl,
    fileName:
      typeof data.fileName === "string" && data.fileName.trim().length > 0
        ? data.fileName
        : candidate.fileName,
  };
}

function normalizeDuration(duration: number | null | undefined): number {
  if (!Number.isFinite(duration)) {
    return 0;
  }

  const value = Number(duration);

  return value > 1000 ? value / 1000 : value;
}

function normalizeFileName(
  fileName: string | null | undefined,
  uri: string,
): string {
  if (typeof fileName === "string" && fileName.trim().length > 0) {
    return ensureExtension(fileName.trim());
  }

  const fallbackName = uri.split("/").pop()?.split("?")[0] || "scene-video.mp4";

  return ensureExtension(fallbackName);
}

function ensureExtension(fileName: string): string {
  return /\.[a-z0-9]+$/i.test(fileName) ? fileName : `${fileName}.mp4`;
}
