import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export type CompileRendererMode = "placeholder" | "ffmpeg";

/**
 * Runtime configuration used by the compile server.
 */
export interface CompileServerConfig {
  port: number;
  publicBaseUrl: string;
  renderer: CompileRendererMode;
  placeholderVideoUrl?: string;
  outputDir: string;
  tempDir: string;
  ffmpegPath: string;
  ffprobePath: string;
  renderTimeoutMs: number;
  fontFile?: string;
  cleanupTempFiles: boolean;
}

/**
 * Reads server configuration from environment variables.
 *
 * @param env Environment variables.
 * @returns Normalized compile server configuration.
 */
export function getServerConfig(
  env: NodeJS.ProcessEnv = process.env,
): CompileServerConfig {
  const port = parsePort(env.PORT);

  return {
    port,
    publicBaseUrl: parsePublicBaseUrl(env.COMPILE_PUBLIC_BASE_URL, port),
    renderer: parseRenderer(env.COMPILE_RENDERER),
    placeholderVideoUrl: parseOptionalUrl(env.COMPILE_PLACEHOLDER_VIDEO_URL),
    outputDir: ensureDirectory(parseDirectory(env.COMPILE_OUTPUT_DIR, ".compiled")),
    tempDir: ensureDirectory(
      parseDirectory(env.COMPILE_TEMP_DIR, path.join(tmpdir(), "letrend-compile-server")),
    ),
    ffmpegPath: parseCommand(env.COMPILE_FFMPEG_PATH, "ffmpeg"),
    ffprobePath: parseCommand(env.COMPILE_FFPROBE_PATH, "ffprobe"),
    renderTimeoutMs: parsePositiveInteger(env.COMPILE_RENDER_TIMEOUT_MS, 120000),
    fontFile: parseFontFile(env.COMPILE_FONT_FILE),
    cleanupTempFiles: parseBoolean(env.COMPILE_CLEANUP_TEMP_FILES, true),
  };
}

function parsePort(value: string | undefined): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return 3030;
  }

  return parsedValue;
}

function parseRenderer(value: string | undefined): CompileRendererMode {
  if (value === "ffmpeg" || value === "placeholder") {
    return value;
  }

  return "placeholder";
}

function parsePublicBaseUrl(value: string | undefined, port: number): string {
  const fallback = `http://localhost:${port}`;

  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback;
  }

  try {
    return removeTrailingSlash(new URL(value.trim()).toString());
  } catch {
    throw new Error("COMPILE_PUBLIC_BASE_URL must be a valid URL.");
  }
}

function parseOptionalUrl(value: string | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  try {
    return new URL(trimmedValue).toString();
  } catch {
    throw new Error("COMPILE_PLACEHOLDER_VIDEO_URL must be a valid URL.");
  }
}

function parseDirectory(value: string | undefined, fallback: string): string {
  const selectedValue =
    typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

  return path.resolve(selectedValue);
}

function parseCommand(value: string | undefined, fallback: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback;
  }

  return value.trim();
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function parseFontFile(value: string | undefined): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return path.resolve(value.trim());
  }

  return findFirstExistingPath([
    "C:\\Windows\\Fonts\\arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
  ]);
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return fallback;
}

function ensureDirectory(directoryPath: string): string {
  mkdirSync(directoryPath, { recursive: true });

  return directoryPath;
}

function removeTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function findFirstExistingPath(paths: string[]): string | undefined {
  return paths.find((filePath) => existsSync(filePath));
}
