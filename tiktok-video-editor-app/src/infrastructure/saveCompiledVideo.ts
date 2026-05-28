import { Directory, File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Linking, Platform } from "react-native";
import { ensureVideoReferenceAvailable } from "./videoReference";

export type SaveCompiledVideoResultKind = "saved" | "opened";

export interface SaveCompiledVideoResult {
  kind: SaveCompiledVideoResultKind;
  message: string;
  localUri?: string;
}

interface PermissionResult {
  granted: boolean;
}

interface DownloadedFile {
  exists: boolean;
  uri: string;
}

export interface SaveCompiledVideoDependencies {
  platform: typeof Platform.OS;
  openUrl: (url: string) => Promise<unknown>;
  requestPermission: () => Promise<PermissionResult>;
  downloadVideo: (url: string) => Promise<DownloadedFile>;
  saveToLibrary: (localUri: string) => Promise<void>;
  prepareVideoReference: (url: string) => Promise<string>;
}

const EXPORT_DIRECTORY_NAME = "letrend-exports";

/**
 * Saves a finished video locally when the platform supports it.
 *
 * Native platforms download remote videos to cache and save the local file to
 * the user's media library. Web cannot write directly to the device gallery, so
 * it opens the video URL and lets the browser handle playback or download.
 *
 * @param videoUrl Finished video URL or local file URI.
 * @param dependencies Optional dependencies for tests.
 * @returns Save result.
 */
export async function saveCompiledVideoToDevice(
  videoUrl: string,
  dependencies: SaveCompiledVideoDependencies = createDefaultDependencies(),
): Promise<SaveCompiledVideoResult> {
  const normalizedUrl = normalizeVideoUrl(videoUrl);

  if (!normalizedUrl) {
    throw new Error("No finished video is available to save.");
  }

  const availableUrl = await dependencies.prepareVideoReference(normalizedUrl);

  if (dependencies.platform === "web") {
    await dependencies.openUrl(availableUrl);

    return {
      kind: "opened",
      message:
        "Video opened in the browser. Use the browser controls to download it.",
    };
  }

  const permission = await dependencies.requestPermission();

  if (!permission.granted) {
    throw new Error(
      "Permission was denied. Allow media access to save the video.",
    );
  }

  const localVideo = availableUrl.startsWith("file://")
    ? { exists: true, uri: availableUrl }
    : await dependencies.downloadVideo(availableUrl);

  if (!localVideo.exists || !localVideo.uri.startsWith("file://")) {
    throw new Error("The video could not be prepared for saving.");
  }

  await dependencies.saveToLibrary(localVideo.uri);

  return {
    kind: "saved",
    message: "Video saved to your gallery.",
    localUri: localVideo.uri,
  };
}

function createDefaultDependencies(): SaveCompiledVideoDependencies {
  return {
    platform: Platform.OS,
    openUrl: (url) => Linking.openURL(url),
    requestPermission: () => MediaLibrary.requestPermissionsAsync(true),
    downloadVideo: downloadVideoToCache,
    saveToLibrary: saveVideoToLibrary,
    prepareVideoReference: ensureVideoReferenceAvailable,
  };
}

async function downloadVideoToCache(url: string): Promise<DownloadedFile> {
  const exportDirectory = new Directory(Paths.cache, EXPORT_DIRECTORY_NAME);

  exportDirectory.create({
    idempotent: true,
    intermediates: true,
  });

  const destination = new File(exportDirectory, createExportFileName());
  const downloadedFile = await File.downloadFileAsync(url, destination);

  return {
    exists: downloadedFile.exists,
    uri: downloadedFile.uri,
  };
}

async function saveVideoToLibrary(localUri: string): Promise<void> {
  await MediaLibrary.saveToLibraryAsync(localUri);
}

function createExportFileName(): string {
  return `letrend-export-${Date.now()}.mp4`;
}

function normalizeVideoUrl(videoUrl: string): string | null {
  if (typeof videoUrl !== "string") {
    return null;
  }

  const trimmedUrl = videoUrl.trim();

  return trimmedUrl.length > 0 ? trimmedUrl : null;
}
