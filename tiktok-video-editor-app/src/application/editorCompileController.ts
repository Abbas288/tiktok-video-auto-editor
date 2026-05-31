import { CompileOutputKind } from "../components/CompilePanel";
import { CompileRendererName } from "../infrastructure/compileService";

export function toCompileOutputKind(
  renderer: CompileRendererName | undefined,
): CompileOutputKind {
  if (renderer === "placeholder") {
    return "placeholder";
  }

  if (renderer === "ffmpeg") {
    return "rendered";
  }

  return "unknown";
}

export function createSuccessfulCompileMessage(
  outputKind: CompileOutputKind,
): string {
  if (outputKind === "placeholder") {
    return "Preview ready.";
  }

  return "Ready.";
}

export function createMissingSceneVideosMessage(): string {
  return "Add videos for all scenes first.";
}
