import { getSceneTransition } from "../video/transitions";
import {
  Effect,
  Music,
  Orientation,
  Scene,
  Template,
  TextOverlay,
  Transition,
} from "../../types/template";

export interface CompilePayload {
  templateId: string;
  sourceVideoUrl: string;
  orientation: Orientation;
  originalVolume: number;
  music?: Music;
  scenes: CompileScene[];
}

export interface CompileScene {
  id: string;
  orderIndex: number;
  startSeconds: number;
  durationSeconds: number;
  instruction: string;
  transition: Transition;
  textOverlays: TextOverlay[];
  effects: Effect[];
}

/**
 * Builds the payload sent from the editor client to the compile server.
 *
 * @param template Current edited template session.
 * @returns Compile payload containing the full editable session state.
 */
export function buildCompilePayload(template: Template): CompilePayload {
  return {
    templateId: template.id,
    sourceVideoUrl: template.sourceVideoUrl,
    orientation: template.orientation,
    originalVolume: template.originalVolume ?? 1,
    music: template.music ? { ...template.music } : undefined,
    scenes: template.scenes.map(createCompileScene),
  };
}

function createCompileScene(scene: Scene): CompileScene {
  return {
    id: scene.id,
    orderIndex: scene.orderIndex,
    startSeconds: scene.startSeconds,
    durationSeconds: scene.durationSeconds,
    instruction: scene.instruction,
    transition: getSceneTransition(scene),
    textOverlays: scene.textOverlays.map((overlay) => ({ ...overlay })),
    effects: scene.effects.map((effect) => ({ ...effect })),
  };
}
