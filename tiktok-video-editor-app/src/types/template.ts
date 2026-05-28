/** Allowed video orientations. */
export type Orientation = "portrait" | "landscape" | "square";

/** Configuration for background music. */
export interface Music {
  url: string;
  volume: number;
  beatSync: boolean;
}

/** Defines how a scene transitions into the next. */
export interface Transition {
  type: "cut" | "fade" | "slide";
  durationSeconds: number;
  direction?: "left" | "right" | "up" | "down";
}

/**
 * Describes the export-safe text box model used by both preview and compile-server.
 */
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

/**
 * Represents a text element rendered over the video.
 * positionX and positionY are normalized center coordinates between 0 and 1.
 */
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

/** Visual effects applied to a specific scene. */
export interface Effect {
  type: "zoom" | "brightness" | "contrast" | "blur";
  intensity?: number;
  value?: number;
  positionX?: number;
  positionY?: number;
}

/** Represents a discrete video segment with its own rules and overlays. */
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

/**
 * The root template object containing the full editing blueprint.
 * compiledVideoUrl is set after a successful compile response.
 */
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
