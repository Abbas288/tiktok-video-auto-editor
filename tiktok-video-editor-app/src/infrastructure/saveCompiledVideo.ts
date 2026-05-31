import { Directory, File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import { ensureVideoReferenceAvailable } from "./videoReference";

export type SaveCompiledVideoResultKind = "saved" | "downloaded";

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
  requestPermission: () => Promise<PermissionResult>;
  downloadVideo: (url: string) => Promise<DownloadedFile>;
  saveToLibrary: (localUri: string) => Promise<void>;
  prepareVideoReference: (url: string) => Promise<string>;
  triggerWebDownload: (url: string, fileName: string) => Promise<void>;
}

interface BrowserDownloadAnchor {
  href: string;
  download: string;
  rel: string;
  target: string;
  style: {
    display: string;
  };
  click: () => void;
  remove: () => void;
}

interface BrowserDocument {
  createElement: (tagName: "a") => BrowserDownloadAnchor;
  body?: {
    appendChild: (element: BrowserDownloadAnchor) => void;
  };
}

interface BrowserUrlApi {
  createObjectURL: (blob: object) => string;
  revokeObjectURL: (url: string) => void;
}

interface BrowserFetchResponse {
  ok: boolean;
  blob: () => Promise<object>;
}

interface BrowserDownloadGlobals {
  document?: BrowserDocument;
  URL?: BrowserUrlApi;
  fetch?: (url: string) => Promise<BrowserFetchResponse>;
}

const EXPORT_DIRECTORY_NAME = "letrend-exports";
const DEFAULT_EXPORT_FILE_NAME = "letrend-export.mp4";

/**
 * Saves or downloads a finished video.
 *
 * Native platforms download remote videos to cache and save the local file to
 * the media library. Web triggers a browser download instead of opening the
 * video URL.
 *
 * @param videoUrl Finished video URL or local file URI.
 * @param dependencies Optional dependencies for tests.
 * @returns Save or download result.
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
    await dependencies.triggerWebDownload(
      availableUrl,
      createExportFileName(availableUrl),
    );

    return {
      kind: "downloaded",
      message: "Download started.",
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
    message: "Saved to gallery.",
    localUri: localVideo.uri,
  };
}

function createDefaultDependencies(): SaveCompiledVideoDependencies {
  return {
    platform: Platform.OS,
    requestPermission: () => MediaLibrary.requestPermissionsAsync(true),
    downloadVideo: downloadVideoToCache,
    saveToLibrary: saveVideoToLibrary,
    prepareVideoReference: ensureVideoReferenceAvailable,
    triggerWebDownload: triggerBrowserDownload,
  };
}

async function downloadVideoToCache(url: string): Promise<DownloadedFile> {
  const exportDirectory = new Directory(Paths.cache, EXPORT_DIRECTORY_NAME);

  exportDirectory.create({
    idempotent: true,
    intermediates: true,
  });

  const destination = new File(exportDirectory, createExportFileName(url));
  const downloadedFile = await File.downloadFileAsync(url, destination);

  return {
    exists: downloadedFile.exists,
    uri: downloadedFile.uri,
  };
}

async function saveVideoToLibrary(localUri: string): Promise<void> {
  await MediaLibrary.saveToLibraryAsync(localUri);
}

async function triggerBrowserDownload(
  url: string,
  fileName: string,
): Promise<void> {
  const globals = globalThis as typeof globalThis & BrowserDownloadGlobals;
  const browserDocument = globals.document;

  if (!browserDocument?.body) {
    throw new Error("Browser download is not available.");
  }

  const objectUrl = await createBrowserObjectUrl(url, globals).catch(
    () => null,
  );
  const downloadUrl = objectUrl ?? url;
  const link = browserDocument.createElement("a");

  link.href = downloadUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.target = "_self";
  link.style.display = "none";

  browserDocument.body.appendChild(link);
  link.click();
  link.remove();

  if (objectUrl && globals.URL?.revokeObjectURL) {
    setTimeout(() => {
      globals.URL?.revokeObjectURL(objectUrl);
    }, 1000);
  }
}

async function createBrowserObjectUrl(
  url: string,
  globals: BrowserDownloadGlobals,
): Promise<string | null> {
  if (!globals.fetch || !globals.URL?.createObjectURL) {
    return null;
  }

  const response = await globals.fetch(url);

  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();

  return globals.URL.createObjectURL(blob);
}

function createExportFileName(videoUrl?: string): string {
  if (!videoUrl) {
    return DEFAULT_EXPORT_FILE_NAME;
  }

  try {
    const fileName = new URL(videoUrl).pathname.split("/").pop()?.trim();

    if (fileName && /\.mp4$/i.test(fileName)) {
      return fileName;
    }
  } catch {
    return DEFAULT_EXPORT_FILE_NAME;
  }

  return DEFAULT_EXPORT_FILE_NAME;
}

function normalizeVideoUrl(videoUrl: string): string | null {
  if (typeof videoUrl !== "string") {
    return null;
  }

  const trimmedUrl = videoUrl.trim();

  return trimmedUrl.length > 0 ? trimmedUrl : null;
}
