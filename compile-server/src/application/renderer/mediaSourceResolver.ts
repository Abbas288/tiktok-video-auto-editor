import { copyFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { CompileServerConfig } from "../../config";

export type MediaSourceOperation = "resolve-local-upload" | "download-remote";

export interface MaterializeMediaSourceOptions {
  url: string;
  outputPath: string;
  config: CompileServerConfig;
  label: string;
}

export class MediaSourceError extends Error {
  public readonly sourceUrl: string;
  public readonly operation: MediaSourceOperation;
  public readonly cause: unknown;

  public constructor(options: {
    message: string;
    sourceUrl: string;
    operation: MediaSourceOperation;
    cause?: unknown;
  }) {
    super(options.message);
    this.name = "MediaSourceError";
    this.sourceUrl = options.sourceUrl;
    this.operation = options.operation;
    this.cause = options.cause;
  }
}

/**
 * Makes a media source available as a local file for FFmpeg.
 *
 * Own uploaded assets are read directly from uploadDir instead of being fetched
 * through the public Caddy URL. External media sources are downloaded.
 */
export async function materializeMediaSource(
  options: MaterializeMediaSourceOptions,
): Promise<void> {
  const localUploadedAssetPath = resolveLocalUploadedAssetPath(
    options.url,
    options.config,
  );

  if (localUploadedAssetPath) {
    await copyLocalUploadedAsset({
      sourcePath: localUploadedAssetPath,
      outputPath: options.outputPath,
      sourceUrl: options.url,
      label: options.label,
    });
    return;
  }

  await downloadRemoteMediaSource(options);
}

export function resolveLocalUploadedAssetPath(
  sourceUrl: string,
  config: CompileServerConfig,
): string | null {
  const fileName = extractOwnUploadedAssetFileName(sourceUrl, config);

  if (!fileName) {
    return null;
  }

  return path.join(config.uploadDir, fileName);
}

function extractOwnUploadedAssetFileName(
  sourceUrl: string,
  config: CompileServerConfig,
): string | null {
  const parsedSourceUrl = safeParseUrl(sourceUrl);
  const parsedPublicBaseUrl = safeParseUrl(config.publicBaseUrl);

  if (!parsedSourceUrl || !parsedPublicBaseUrl) {
    return null;
  }

  if (!hasSameOrigin(parsedSourceUrl, parsedPublicBaseUrl)) {
    return null;
  }

  const publicBasePath = normalizePathPrefix(parsedPublicBaseUrl.pathname);
  const expectedAssetPrefix = normalizePathPrefix(
    `${publicBasePath}/assets/videos`,
  );

  if (!parsedSourceUrl.pathname.startsWith(`${expectedAssetPrefix}/`)) {
    return null;
  }

  const encodedFileName = parsedSourceUrl.pathname.slice(
    expectedAssetPrefix.length + 1,
  );

  if (encodedFileName.length === 0 || encodedFileName.includes("/")) {
    throw new MediaSourceError({
      message: `Invalid uploaded media URL for ${sourceUrl}.`,
      sourceUrl,
      operation: "resolve-local-upload",
    });
  }

  const fileName = decodeURIComponent(encodedFileName);

  if (!isSafeFileName(fileName)) {
    throw new MediaSourceError({
      message: `Unsafe uploaded media file name in ${sourceUrl}.`,
      sourceUrl,
      operation: "resolve-local-upload",
    });
  }

  return fileName;
}

async function copyLocalUploadedAsset(options: {
  sourcePath: string;
  outputPath: string;
  sourceUrl: string;
  label: string;
}): Promise<void> {
  try {
    const fileStat = await stat(options.sourcePath);

    if (!fileStat.isFile()) {
      throw new Error("Resolved upload path is not a file.");
    }

    await copyFile(options.sourcePath, options.outputPath);
  } catch (error) {
    throw new MediaSourceError({
      message: `Could not read uploaded media for ${options.label}.`,
      sourceUrl: options.sourceUrl,
      operation: "resolve-local-upload",
      cause: error,
    });
  }
}

async function downloadRemoteMediaSource(
  options: MaterializeMediaSourceOptions,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(options.url);
  } catch (error) {
    throw new MediaSourceError({
      message: `Could not download media for ${options.label}.`,
      sourceUrl: options.url,
      operation: "download-remote",
      cause: error,
    });
  }

  if (!response.ok) {
    throw new MediaSourceError({
      message: `Could not download media for ${options.label}. HTTP status ${response.status}.`,
      sourceUrl: options.url,
      operation: "download-remote",
    });
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.byteLength === 0) {
    throw new MediaSourceError({
      message: `Downloaded media for ${options.label} was empty.`,
      sourceUrl: options.url,
      operation: "download-remote",
    });
  }

  await writeFile(options.outputPath, buffer);
}

function safeParseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function hasSameOrigin(firstUrl: URL, secondUrl: URL): boolean {
  return (
    firstUrl.protocol === secondUrl.protocol &&
    firstUrl.hostname === secondUrl.hostname &&
    normalizePort(firstUrl) === normalizePort(secondUrl)
  );
}

function normalizePort(url: URL): string {
  if (url.port.length > 0) {
    return url.port;
  }

  if (url.protocol === "https:") {
    return "443";
  }

  if (url.protocol === "http:") {
    return "80";
  }

  return "";
}

function normalizePathPrefix(value: string): string {
  const normalizedValue = value.replace(/\/+$/g, "");

  return normalizedValue.length > 0 ? normalizedValue : "";
}

function isSafeFileName(fileName: string): boolean {
  return (
    fileName.length > 0 &&
    fileName === path.basename(fileName) &&
    !fileName.includes("\\") &&
    !fileName.includes("\0")
  );
}