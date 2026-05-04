/**
 * Represents a video editing project template.
 */
export interface Template {
  id: string;
  title: string;
  sourceVideoUrl: string;
  orientation: "portrait" | "landscape";
  music?: {
    url: string;
    volume: number;
  };
  scenes: Scene[];
}

/**
 * Represents a specific scene within a template.
 */
export interface Scene {
  id: string;
  orderIndex: number;
  startSeconds: number;
  durationSeconds: number;
  instruction: string;
  textOverlays: TextOverlay[];
}

/**
 * Represents a text overlay element on a scene.
 */
export interface TextOverlay {
  id: string;
  text: string;
  positionX: number; // 0-1
  positionY: number; // 0-1
  fontSize: number;
  color: string;
  startSeconds: number;
  durationSeconds: number;
}
