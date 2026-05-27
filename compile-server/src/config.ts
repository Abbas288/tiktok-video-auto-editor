/**
 * Runtime configuration used by the compile server.
 */
export interface CompileServerConfig {
  port: number;
  placeholderVideoUrl?: string;
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
  return {
    port: parsePort(env.PORT),
    placeholderVideoUrl: parseOptionalUrl(env.COMPILE_PLACEHOLDER_VIDEO_URL),
  };
}

function parsePort(value: string | undefined): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return 3030;
  }

  return parsedValue;
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