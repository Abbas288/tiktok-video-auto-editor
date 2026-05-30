import { Template } from "../../types/template";

/**
 * Merges an existing draft with the latest template shape.
 *
 * @param sourceTemplate Current template from the repository.
 * @param draft Saved draft, if one exists.
 * @returns Template with preserved user edits and current template fields.
 */
export function mergeTemplateWithDraft(
  sourceTemplate: Template,
  draft: Template | undefined,
): Template {
  if (!draft) {
    return sourceTemplate;
  }

  return {
    ...sourceTemplate,
    ...draft,
    id: sourceTemplate.id,
    title: sourceTemplate.title,
    sourceVideoUrl: draft.sourceVideoUrl || sourceTemplate.sourceVideoUrl,
    orientation: draft.orientation ?? sourceTemplate.orientation,
    originalVolume: draft.originalVolume ?? sourceTemplate.originalVolume,
    compiledVideoUrl: draft.compiledVideoUrl ?? sourceTemplate.compiledVideoUrl,
    music: mergeMusic(sourceTemplate, draft),
    scenes: mergeScenes(sourceTemplate, draft),
  };
}

function mergeMusic(
  sourceTemplate: Template,
  draft: Template,
): Template["music"] {
  if (!sourceTemplate.music) {
    return draft.music;
  }

  if (!draft.music) {
    return sourceTemplate.music;
  }

  return {
    ...sourceTemplate.music,
    volume: draft.music.volume ?? sourceTemplate.music.volume,
    beatSync: draft.music.beatSync ?? sourceTemplate.music.beatSync,
  };
}

function mergeScenes(
  sourceTemplate: Template,
  draft: Template,
): Template["scenes"] {
  const draftScenesById = new Map(
    draft.scenes.map((scene) => [scene.id, scene]),
  );

  return sourceTemplate.scenes.map((sourceScene) => {
    const draftScene = draftScenesById.get(sourceScene.id);

    if (!draftScene) {
      return sourceScene;
    }

    return {
      ...sourceScene,
      ...draftScene,
      id: sourceScene.id,
      orderIndex: sourceScene.orderIndex,
      startSeconds: sourceScene.startSeconds,
      durationSeconds: sourceScene.durationSeconds,
      instruction: draftScene.instruction ?? sourceScene.instruction,
      transition: draftScene.transition ?? sourceScene.transition,
      textOverlays: draftScene.textOverlays ?? sourceScene.textOverlays,
      effects: draftScene.effects ?? sourceScene.effects,
    };
  });
}
