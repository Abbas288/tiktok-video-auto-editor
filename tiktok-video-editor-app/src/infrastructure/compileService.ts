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
const compileServerUrl = process.env.EXPO_PUBLIC_COMPILE_SERVER_URL;

export function getCompileServerBaseUrl(): string | undefined {
  return compileServerUrl?.trim() || undefined;
}

export function createCompileService(
  baseUrl: string | undefined = getCompileServerBaseUrl(),
): CompileClient {
  return baseUrl
    ? new HttpCompileClient(baseUrl)
    : new LocalPreviewCompileClient();
}

class HttpCompileClient implements CompileClient {
  private readonly endpointUrl: string;

  public constructor(baseUrl: string) {
    this.endpointUrl = `${baseUrl.replace(/\/$/, "")}${DEFAULT_COMPILE_PATH}`;
  }

  public async compile(payload: CompilePayload): Promise<CompileResult> {
    const response = await fetch(this.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await createCompileErrorMessage(response));
    }

    return parseCompileResponse(await response.json());
  }
}

class LocalPreviewCompileClient implements CompileClient {
  public async compile(payload: CompilePayload): Promise<CompileResult> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      compiledVideoUrl: payload.sourceVideoUrl,
      renderer: "placeholder",
    };
  }
}

export const compileService: CompileClient =
  createCompileService(compileServerUrl);

async function createCompileErrorMessage(response: Response): Promise<string> {
  const fallbackMessage = `Compile request failed with status ${response.status}.`;

  try {
    const responseBody = await response.text();

    if (responseBody.trim().length === 0) {
      return fallbackMessage;
    }

    const parsedBody = JSON.parse(responseBody);

    if (!isObject(parsedBody)) {
      return fallbackMessage;
    }

    const serverError =
      typeof parsedBody.error === "string" && parsedBody.error.trim().length > 0
        ? parsedBody.error.trim()
        : undefined;

    const serverDetails = Array.isArray(parsedBody.details)
      ? parsedBody.details
          .filter((detail): detail is string => typeof detail === "string")
          .map((detail) => detail.trim())
          .filter(Boolean)
          .slice(0, 2)
      : [];

    if (!serverError && serverDetails.length === 0) {
      return fallbackMessage;
    }

    return [fallbackMessage.replace(/\.$/, ""), serverError, ...serverDetails]
      .filter(Boolean)
      .join(": ");
  } catch {
    return fallbackMessage;
  }
}

function parseCompileResponse(data: unknown): CompileResult {
  if (!isObject(data)) {
    throw new Error("Compile response was not an object.");
  }

  if (
    typeof data.compiledVideoUrl !== "string" ||
    data.compiledVideoUrl.trim() === ""
  ) {
    throw new Error(
      "Compile response did not include a usable video reference.",
    );
  }

  return {
    compiledVideoUrl: data.compiledVideoUrl,
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
