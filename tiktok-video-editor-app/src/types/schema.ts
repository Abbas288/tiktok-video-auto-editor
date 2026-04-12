export type Orientation = "portrait" | "landscape" | "square";

export interface Music {
  url: string;
  volume: number;
  beatSync: boolean;
}

export interface Transition {
  type: "cut" | "fade" | "slide";
  durationSeconds: number;
  direction?: "left" | "right" | "up" | "down";
}

export interface TextOverlay {
  id: string;
  text: string;
  positionX: number;
  positionY: number;
  fontSizePt: number;
  color: string;
  style: "normal" | "bold" | "italic";
  animationIn: "none" | "fadeUp" | "fadeIn";
  startSeconds: number;
  durationSeconds: number;
}

export interface Effect {
  type: "zoom" | "brightness" | "contrast" | "blur";
  intensity?: number;
  value?: number;
}

export interface Scene {
  id: string;
  orderIndex: number;
  startSeconds: number;
  durationSeconds: number;
  instruction: string;
  transition?: Transition;
  textOverlays: TextOverlay[];
  effects: Effect[];
}

export interface Template {
  id: string;
  title: string;
  sourceVideoUrl: string;
  orientation: Orientation;
  music?: Music;
  scenes: Scene[];
}
