import { Linking } from "react-native";

export const UNAVAILABLE_VIDEO_MESSAGE =
  "The finished video is no longer available. Run compile again.";

export interface VideoReferenceResponse {
  ok: boolean;
  headers: {
    get: (name: string) => string | null;
  };
}

export type VideoReferenceFetcher = (
  url: string,
  init?: { method: "HEAD" },
) => Promise<VideoReferenceResponse>;

export interface VideoReferenceDependencies {
  fetcher: VideoReferenceFetcher;
  openUrl: (url: string) => Promise<unknown>;
  compileServerBaseUrl?: string;
}

/**
 * Ensures that a finished video reference is usable before the UI opens or saves it.
 *
 * Only compile-server output URLs are validated with a HEAD request. External
 * placeholder or preview URLs are left alone to avoid browser CORS false errors.
 *
 * @param videoUrl Finished video URL or local file URI.
 * @param dependencies Optional dependencies for tests.
 * @returns Normalized video URL.
 */
export async function ensureVideoReferenceAvailable(
  videoUrl: string,
  dependencies: Partial<VideoReferenceDependencies> = {},
): Promise<string> {
  const normalizedUrl = normalizeVideoUrl(videoUrl);

  if (!normalizedUrl) {
    throw new Error("No finished video is available.");
  }

  const resolvedDependencies = createDependencies(dependencies);

  if (
    !shouldValidateVideoUrl(
      normalizedUrl,
      resolvedDependencies.compileServerBaseUrl,
    )
  ) {
    return normalizedUrl;
  }

  try {
    const response = await resolvedDependencies.fetcher(normalizedUrl, {
      method: "HEAD",
    });

    if (!response.ok) {
      throw new Error(UNAVAILABLE_VIDEO_MESSAGE);
    }

    const contentType =
      response.headers.get("content-type")?.toLowerCase() ?? "";

    if (contentType.includes("application/json")) {
      throw new Error(UNAVAILABLE_VIDEO_MESSAGE);
    }

    return normalizedUrl;
  } catch (error) {
    if (error instanceof Error && error.message === UNAVAILABLE_VIDEO_MESSAGE) {
      throw error;
    }

    throw new Error(UNAVAILABLE_VIDEO_MESSAGE);
  }
}

/**
 * Opens a finished video only after validating the reference when possible.
 *
 * @param videoUrl Finished video URL or local file URI.
 * @param dependencies Optional dependencies for tests.
 */
export async function openVideoReference(
  videoUrl: string,
  dependencies: Partial<VideoReferenceDependencies> = {},
): Promise<void> {
  const resolvedDependencies = createDependencies(dependencies);
  const availableUrl = await ensureVideoReferenceAvailable(
    videoUrl,
    resolvedDependencies,
  );

  await resolvedDependencies.openUrl(availableUrl);
}

function createDependencies(
  dependencies: Partial<VideoReferenceDependencies>,
): VideoReferenceDependencies {
  return {
    fetcher: async (url, init) => fetch(url, init),
    openUrl: (url) => Linking.openURL(url),
    compileServerBaseUrl: process.env.EXPO_PUBLIC_COMPILE_SERVER_URL?.trim(),
    ...dependencies,
  };
}

function shouldValidateVideoUrl(
  videoUrl: string,
  compileServerBaseUrl: string | undefined,
): boolean {
  if (videoUrl.startsWith("file://")) {
    return false;
  }

  const baseUrl = compileServerBaseUrl?.trim();

  if (!baseUrl) {
    return false;
  }

  try {
    const candidate = new URL(videoUrl);
    const base = new URL(baseUrl);

    return (
      candidate.origin === base.origin &&
      candidate.pathname.startsWith("/compiled/")
    );
  } catch {
    return false;
  }
}

function normalizeVideoUrl(videoUrl: string): string | null {
  if (typeof videoUrl !== "string") {
    return null;
  }

  const trimmedUrl = videoUrl.trim();

  return trimmedUrl.length > 0 ? trimmedUrl : null;
}
