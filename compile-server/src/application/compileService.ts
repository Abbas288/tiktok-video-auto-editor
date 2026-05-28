import { randomUUID } from "node:crypto";
import { CompileServerConfig } from "../config";
import { CompilePayload } from "../domain/compilePayloadSchema";
import {
  FfmpegRenderResult,
  renderWithFfmpeg,
} from "./renderer/ffmpegRenderer";

export type CompileJobStatus = "completed";
export type CompileRendererName = "placeholder" | "ffmpeg";

export interface CompilePayloadSummary {
  templateId: string;
  sceneCount: number;
  hasMusic: boolean;
  renderer: CompileRendererName;
}

export interface CompileResult {
  jobId: string;
  status: CompileJobStatus;
  compiledVideoUrl: string;
  summary: CompilePayloadSummary;
}

export interface CompileRenderer {
  render: (
    payload: CompilePayload,
    config: CompileServerConfig,
    jobId: string,
  ) => Promise<FfmpegRenderResult>;
}

/**
 * Creates a compiled video result for the provided editing session.
 *
 * @param payload Validated compile payload.
 * @param config Server configuration.
 * @param renderer Optional renderer used for FFmpeg mode.
 * @returns Compile result consumed by the mobile app.
 */
export async function compileSession(
  payload: CompilePayload,
  config: CompileServerConfig,
  renderer: CompileRenderer = { render: renderWithFfmpeg },
): Promise<CompileResult> {
  const jobId = randomUUID();

  if (config.renderer === "ffmpeg") {
    const result = await renderer.render(payload, config, jobId);

    return {
      jobId,
      status: "completed",
      compiledVideoUrl: result.compiledVideoUrl,
      summary: createSummary(payload, "ffmpeg"),
    };
  }

  return {
    jobId,
    status: "completed",
    compiledVideoUrl: resolvePlaceholderVideoUrl(payload, config),
    summary: createSummary(payload, "placeholder"),
  };
}

function createSummary(
  payload: CompilePayload,
  renderer: CompileRendererName,
): CompilePayloadSummary {
  return {
    templateId: payload.templateId,
    sceneCount: payload.scenes.length,
    hasMusic: Boolean(payload.music),
    renderer,
  };
}

function resolvePlaceholderVideoUrl(
  payload: CompilePayload,
  config: CompileServerConfig,
): string {
  return config.placeholderVideoUrl ?? payload.sourceVideoUrl;
}
