import {
  Effect,
  Music,
  Orientation,
  Scene,
  SceneVideoSource,
  Template,
  TextOverlay,
  TextOverlayLayout,
  Transition,
} from "../../types/template";
import { createTextOverlayLayoutSpec } from "../video/textOverlayLayout";
import { getSceneTransition } from "../video/transitions";

export interface CompilePayload {
  templateId: string;
  sourceVideoUrl: string;
  orientation: Orientation;
  originalVolume: number;
  music?: Music;
  scenes: CompileScene[];
}

export interface CompileSceneVideoSource {
  url: string;
  sourceStartSeconds: number;
  durationSeconds: number;
}

export interface CompileTextOverlay extends TextOverlay {
  layout: TextOverlayLayout;
}

export interface CompileScene {
  id: string;
  orderIndex: number;
  startSeconds: number;
  durationSeconds: number;
  instruction: string;
  transition: Transition;
  textOverlays: CompileTextOverlay[];
  effects: Effect[];
  videoSource?: CompileSceneVideoSource;
}

export function buildCompilePayload(template: Template): CompilePayload {
  return {
    templateId: template.id,
    sourceVideoUrl: template.sourceVideoUrl,
    orientation: template.orientation,
    originalVolume: template.originalVolume ?? 1,
    music: template.music ? { ...template.music } : undefined,
    scenes: template.scenes.map((scene) =>
      createCompileScene(scene, template.orientation),
    ),
  };
}

function createCompileScene(
  scene: Scene,
  orientation: Orientation,
): CompileScene {
  return {
    id: scene.id,
    orderIndex: scene.orderIndex,
    startSeconds: scene.startSeconds,
    durationSeconds: scene.durationSeconds,
    instruction: scene.instruction,
    transition: getSceneTransition(scene),
    textOverlays: scene.textOverlays.map((overlay) =>
      createCompileTextOverlay(overlay, orientation),
    ),
    effects: scene.effects.map((effect) => ({ ...effect })),
    videoSource: createCompileSceneVideoSource(scene.videoSource),
  };
}

function createCompileTextOverlay(
  overlay: TextOverlay,
  orientation: Orientation,
): CompileTextOverlay {
  return {
    ...overlay,
    layout: createTextOverlayLayoutSpec(orientation, overlay),
  };
}

function createCompileSceneVideoSource(
  source: SceneVideoSource | undefined,
): CompileSceneVideoSource | undefined {
  if (!source) {
    return undefined;
  }

  return {
    url: source.uploadUrl,
    sourceStartSeconds: source.sourceStartSeconds,
    durationSeconds: source.durationSeconds,
  };
}
