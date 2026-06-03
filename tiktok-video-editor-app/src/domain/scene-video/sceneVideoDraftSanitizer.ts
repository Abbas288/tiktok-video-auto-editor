import { Scene, Template } from "../../types/template";

/**
 * Removes runtime media references from persisted editor drafts.
 *
 * Scene video sources and compiled output URLs are produced during a specific
 * browser/server session. They must not be trusted when a draft is restored
 * later, because local file/blob references and server upload files may no
 * longer be playable.
 *
 * @param template Persisted editor draft.
 * @returns Draft without session-bound media references.
 */
export function removeSessionBoundSceneMedia(template: Template): Template {
  const scenes = template.scenes.map(removeSceneVideoSource);
  const didRemoveSceneVideo = scenes.some(
    (scene, index) => scene !== template.scenes[index],
  );
  const didRemoveCompiledVideo = typeof template.compiledVideoUrl === "string";

  if (!didRemoveSceneVideo && !didRemoveCompiledVideo) {
    return template;
  }

  const {
    compiledVideoUrl: _removedCompiledVideoUrl,
    ...templateWithoutCompiledVideo
  } = template;

  return {
    ...templateWithoutCompiledVideo,
    scenes,
  };
}

function removeSceneVideoSource(scene: Scene): Scene {
  if (!scene.videoSource) {
    return scene;
  }

  const { videoSource: _removedVideoSource, ...sceneWithoutVideoSource } =
    scene;

  return sceneWithoutVideoSource;
}
