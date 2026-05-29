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

export interface TextOverlayLayout {
  anchor: "center";
  textAlign: "center";
  referenceWidth: number;
  referenceHeight: number;
  boxWidthRatio: number;
  maxLines: number;
  lineHeightRatio: number;
  paddingXRatio: number;
  paddingYRatio: number;
  minFontRatio: number;
  maxFontRatio: number;
  lines: string[];
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
  layout?: TextOverlayLayout;
}

export interface Effect {
  type: "zoom" | "brightness" | "contrast" | "blur";
  intensity?: number;
  value?: number;
  positionX?: number;
  positionY?: number;
}

export interface SceneVideoSource {
  type: "user";
  localUri: string;
  uploadUrl: string;
  fileName: string;
  originalDurationSeconds: number;
  sourceStartSeconds: number;
  durationSeconds: number;
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
  videoSource?: SceneVideoSource;
}

export interface Template {
  id: string;
  title: string;
  sourceVideoUrl: string;
  orientation: Orientation;
  originalVolume?: number;
  compiledVideoUrl?: string;
  music?: Music;
  scenes: Scene[];
}
