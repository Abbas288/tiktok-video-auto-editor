import { CompilePayload } from "../domain/compile/compilePayload";

export interface CompileResult {
  compiledVideoUrl: string;
  jobId?: string;
}

export interface CompileClient {
  compile: (payload: CompilePayload) => Promise<CompileResult>;
}

const DEFAULT_COMPILE_PATH = "/compile";

/**
 * HTTP client for sending compile payloads to the compile server.
 */
class HttpCompileClient implements CompileClient {
  private readonly endpointUrl: string;

  /**
   * Creates a compile client.
   *
   * @param baseUrl Compile server base URL.
   */
  public constructor(baseUrl: string) {
    this.endpointUrl = `${baseUrl.replace(/\/$/, "")}${DEFAULT_COMPILE_PATH}`;
  }

  /**
   * Sends a compile payload and returns the compiled video location.
   *
   * @param payload Current editor session payload.
   * @returns Compile result from the server.
   */
  public async compile(payload: CompilePayload): Promise<CompileResult> {
    const response = await fetch(this.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Compile request failed with status ${response.status}.`);
    }

    const data: unknown = await response.json();

    return parseCompileResponse(data);
  }
}

/**
 * Local fallback client used when no compile server URL is configured.
 */
class LocalPreviewCompileClient implements CompileClient {
  /**
   * Returns the source video as a local development compile result.
   *
   * @param payload Current editor session payload.
   * @returns Compile result using the source video URL.
   */
  public async compile(payload: CompilePayload): Promise<CompileResult> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      compiledVideoUrl: payload.sourceVideoUrl,
      jobId: "local-preview",
    };
  }
}

/**
 * Compile service used by the editor.
 */
export const compileService: CompileClient = createCompileClient();

function createCompileClient(): CompileClient {
  const baseUrl = process.env.EXPO_PUBLIC_COMPILE_SERVER_URL?.trim();

  if (!baseUrl) {
    return new LocalPreviewCompileClient();
  }

  return new HttpCompileClient(baseUrl);
}

function parseCompileResponse(data: unknown): CompileResult {
  if (!isRecord(data)) {
    throw new Error("Compile server returned an invalid response.");
  }

  const compiledVideoUrl = readStringValue(data, [
    "compiledVideoUrl",
    "videoUrl",
    "url",
  ]);

  if (!compiledVideoUrl) {
    throw new Error("Compile server response does not contain a video URL.");
  }

  const jobId = readStringValue(data, ["jobId", "id"]);

  return {
    compiledVideoUrl,
    jobId,
  };
}

function readStringValue(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
