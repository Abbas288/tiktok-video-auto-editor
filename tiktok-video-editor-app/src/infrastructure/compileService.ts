import { CompilePayload } from "../domain/compile/compilePayload";

export type CompileRendererName = "placeholder" | "ffmpeg";

export interface CompileResult {
  compiledVideoUrl: string;
  jobId?: string;
  renderer?: CompileRendererName;
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
      renderer: "placeholder",
    };
  }
}

const compileServerUrl = process.env.EXPO_PUBLIC_COMPILE_SERVER_URL;

export const compileService: CompileClient = compileServerUrl
  ? new HttpCompileClient(compileServerUrl)
  : new LocalPreviewCompileClient();

function parseCompileResponse(data: unknown): CompileResult {
  if (!isObject(data)) {
    throw new Error("Compile response was not an object.");
  }

  const compiledVideoUrl = data.compiledVideoUrl;

  if (typeof compiledVideoUrl !== "string" || compiledVideoUrl.trim() === "") {
    throw new Error(
      "Compile response did not include a usable video reference.",
    );
  }

  return {
    compiledVideoUrl,
    jobId: typeof data.jobId === "string" ? data.jobId : undefined,
    renderer: parseRenderer(data),
  };
}

function parseRenderer(
  data: Record<string, unknown>,
): CompileRendererName | undefined {
  const summary = data.summary;

  if (!isObject(summary)) {
    return undefined;
  }

  if (summary.renderer === "placeholder" || summary.renderer === "ffmpeg") {
    return summary.renderer;
  }

  return undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
