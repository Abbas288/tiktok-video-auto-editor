import { SceneVideoCandidate } from "../domain/scene-video/sceneVideoSelection";

export interface SceneVideoTrimDraft {
  sceneId: string;
  candidate: SceneVideoCandidate;
  maxStartSeconds: number;
  durationSeconds: number;
}
