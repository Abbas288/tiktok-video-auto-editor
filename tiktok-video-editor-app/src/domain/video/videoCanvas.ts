import { Orientation } from "../../types/template";

export interface Size {
  width: number;
  height: number;
}

export interface MediaRect extends Size {
  left: number;
  top: number;
}

export interface VideoCanvas extends Size {
  orientation: Orientation;
}

const DEFAULT_CANVAS_BY_ORIENTATION: Record<Orientation, VideoCanvas> = {
  landscape: {
    width: 720,
    height: 405,
    orientation: "landscape",
  },
  portrait: {
    width: 405,
    height: 720,
    orientation: "portrait",
  },
  square: {
    width: 720,
    height: 720,
    orientation: "square",
  },
};

/**
 * Returns the logical video canvas used by overlays and preview layout.
 *
 * The canvas is not a desktop layout value. It is the internal coordinate
 * system for the edited video, similar to how a video editor keeps overlays
 * attached to the video instead of the browser viewport.
 */
export function getVideoCanvas(orientation: Orientation): VideoCanvas {
  return DEFAULT_CANVAS_BY_ORIENTATION[orientation];
}

/**
 * Calculates the actual rendered video rectangle inside a stage.
 *
 * This mirrors contain-style video fitting: the video keeps its aspect ratio
 * and may create letterboxing. Overlays must be attached to this rect, not to
 * the whole black stage.
 */
export function getContainedMediaRect(
  stageSize: Size,
  canvas: VideoCanvas,
): MediaRect {
  if (stageSize.width <= 0 || stageSize.height <= 0) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
  }

  const canvasAspectRatio = canvas.width / canvas.height;
  const stageAspectRatio = stageSize.width / stageSize.height;

  if (stageAspectRatio > canvasAspectRatio) {
    const width = stageSize.height * canvasAspectRatio;

    return {
      left: (stageSize.width - width) / 2,
      top: 0,
      width,
      height: stageSize.height,
    };
  }

  const height = stageSize.width / canvasAspectRatio;

  return {
    left: 0,
    top: (stageSize.height - height) / 2,
    width: stageSize.width,
    height,
  };
}
