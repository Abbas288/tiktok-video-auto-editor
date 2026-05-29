export interface SceneVideoCandidate {
  localUri: string;
  fileName: string;
  mimeType: string;
  durationSeconds: number;
  webFile?: File;
}

export type SceneVideoDecision =
  | {
      type: "ready";
      sourceStartSeconds: number;
      durationSeconds: number;
      candidate: SceneVideoCandidate;
    }
  | {
      type: "needs-trim";
      maxStartSeconds: number;
      durationSeconds: number;
      candidate: SceneVideoCandidate;
    }
  | {
      type: "too-short";
      requiredDurationSeconds: number;
      actualDurationSeconds: number;
    };

const DURATION_TOLERANCE_SECONDS = 0.05;

export function createSceneVideoDecision(
  candidate: SceneVideoCandidate,
  sceneDurationSeconds: number,
): SceneVideoDecision {
  const requiredDuration = Math.max(sceneDurationSeconds, 0);
  const actualDuration = Math.max(candidate.durationSeconds, 0);

  if (actualDuration + DURATION_TOLERANCE_SECONDS < requiredDuration) {
    return {
      type: "too-short",
      requiredDurationSeconds: requiredDuration,
      actualDurationSeconds: actualDuration,
    };
  }

  if (actualDuration > requiredDuration + DURATION_TOLERANCE_SECONDS) {
    return {
      type: "needs-trim",
      maxStartSeconds: Math.max(actualDuration - requiredDuration, 0),
      durationSeconds: requiredDuration,
      candidate,
    };
  }

  return {
    type: "ready",
    sourceStartSeconds: 0,
    durationSeconds: requiredDuration,
    candidate,
  };
}

export function clampSceneVideoStart(
  value: number,
  maxStartSeconds: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), Math.max(maxStartSeconds, 0));
}

export function formatSceneVideoSeconds(value: number): string {
  return `${Number(value.toFixed(1))}s`;
}
