import { SceneVideoCandidate } from "../domain/scene-video/sceneVideoSelection";
import { UploadedSceneVideo } from "../infrastructure/sceneVideoAssetService";
import { SceneVideoSource } from "../types/template";

export interface CreateSceneVideoSourceInput {
  candidate: SceneVideoCandidate;
  upload: UploadedSceneVideo;
  sourceStartSeconds: number;
  durationSeconds: number;
}

export function createSceneVideoSource({
  candidate,
  upload,
  sourceStartSeconds,
  durationSeconds,
}: CreateSceneVideoSourceInput): SceneVideoSource {
  return {
    type: "user",
    localUri: candidate.localUri,
    uploadUrl: upload.uploadUrl,
    fileName: upload.fileName,
    originalDurationSeconds: candidate.durationSeconds,
    sourceStartSeconds,
    durationSeconds,
  };
}
