import { randomUUID } from "node:crypto";
import { CompileServerConfig } from "../config";
import { CompilePayload } from "../domain/compilePayloadSchema";

export type CompileJobStatus = "completed";

export interface CompilePayloadSummary {
  templateId: string;
  sceneCount: number;
  hasMusic: boolean;
  renderer: "placeholder";
}

export interface CompileResult {
  jobId: string;
  status: CompileJobStatus;
  compiledVideoUrl: string;
  summary: CompilePayloadSummary;
}

/**
 * Creates a compiled video result for the provided editing session.
 *
 * The current MVP returns a playable placeholder URL while preserving the same
 * service boundary that later FFmpeg rendering can use.
 *
 * @param payload Validated compile payload.
 * @param config Server configuration.
 * @returns Compile result consumed by the mobile app.
 */
export async function compileSession(
  payload: CompilePayload,
  config: CompileServerConfig,
): Promise<CompileResult> {
  return {
    jobId: randomUUID(),
    status: "completed",
    compiledVideoUrl: resolveCompiledVideoUrl(payload, config),
    summary: {
      templateId: payload.templateId,
      sceneCount: payload.scenes.length,
      hasMusic: Boolean(payload.music),
      renderer: "placeholder",
    },
  };
}

function resolveCompiledVideoUrl(
  payload: CompilePayload,
  config: CompileServerConfig,
): string {
  return config.placeholderVideoUrl ?? payload.sourceVideoUrl;
}