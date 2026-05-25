import { VideoView, type VideoPlayer as ExpoVideoPlayer } from "expo-video";
import React, { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TransitionSimulation } from "../../domain/video/transitionSimulation";
import { MediaRect } from "../../domain/video/videoCanvas";

export interface TransitionPreviewLayerProps {
  simulation: TransitionSimulation | null;
  mediaRect: MediaRect;
  previewPlayer: ExpoVideoPlayer | null;
}

const FADE_MAX_OPACITY = 0.82;
const SLIDE_SHADOW_WIDTH = 42;
const SLIDE_EDGE_OPACITY = 0.12;

/**
 * Renders transition previews inside the rendered media rectangle.
 *
 * Fade is rendered as a pure overlay to avoid secondary-player sync glitches.
 * Slide still uses a muted secondary player because it needs incoming motion.
 *
 * @param props Active transition simulation, media rectangle and preview player.
 * @returns Transition preview layer, or null when no transition is active.
 */
export function TransitionPreviewLayer({
  simulation,
  mediaRect,
  previewPlayer,
}: TransitionPreviewLayerProps): React.JSX.Element | null {
  const previewModel = useMemo(() => {
    if (!simulation) {
      return null;
    }

    if (simulation.type === "fade") {
      return createFadePreviewModel(simulation);
    }

    return createSlidePreviewModel(simulation, mediaRect);
  }, [mediaRect, simulation]);

  if (!simulation || !previewModel) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.layer, mediaRect]}
      testID="transition-preview-layer"
    >
      {previewModel.type === "fade" ? (
        <FadePreview shadeStyle={previewModel.shadeStyle} />
      ) : (
        <SlidePreview
          previewPlayer={previewPlayer}
          videoStyle={previewModel.videoStyle}
          shadowStyle={previewModel.shadowStyle}
          edgeStyle={previewModel.edgeStyle}
        />
      )}
    </View>
  );
}

interface FadePreviewProps {
  shadeStyle: StyleProp<ViewStyle>;
}

/**
 * Renders a smooth fade overlay without mounting another video element.
 *
 * @param props Fade preview styles.
 * @returns Fade preview element.
 */
function FadePreview({ shadeStyle }: FadePreviewProps): React.JSX.Element {
  return (
    <View style={styles.fill} testID="transition-preview-fade">
      <View style={[styles.fadeShade, shadeStyle]} />
    </View>
  );
}

interface SlidePreviewProps {
  previewPlayer: ExpoVideoPlayer | null;
  videoStyle: StyleProp<ViewStyle>;
  shadowStyle: StyleProp<ViewStyle>;
  edgeStyle: StyleProp<ViewStyle>;
}

/**
 * Renders an incoming slide preview.
 *
 * @param props Slide preview player and visual styles.
 * @returns Slide preview element.
 */
function SlidePreview({
  previewPlayer,
  videoStyle,
  shadowStyle,
  edgeStyle,
}: SlidePreviewProps): React.JSX.Element {
  return (
    <View
      style={[styles.slideClip, videoStyle]}
      testID="transition-preview-slide"
    >
      {previewPlayer ? (
        <VideoView
          style={styles.previewVideo}
          player={previewPlayer}
          nativeControls={false}
          contentFit="fill"
          allowsPictureInPicture={false}
        />
      ) : (
        <View style={styles.slideFallback} />
      )}

      <View style={[styles.slideShadow, shadowStyle]} />
      <View style={[styles.slideEdge, edgeStyle]} />
    </View>
  );
}

interface FadePreviewModel {
  type: "fade";
  shadeStyle: StyleProp<ViewStyle>;
}

interface SlidePreviewModel {
  type: "slide";
  videoStyle: StyleProp<ViewStyle>;
  shadowStyle: StyleProp<ViewStyle>;
  edgeStyle: StyleProp<ViewStyle>;
}

function createFadePreviewModel(
  simulation: TransitionSimulation,
): FadePreviewModel {
  return {
    type: "fade",
    shadeStyle: {
      opacity: simulation.intensity * FADE_MAX_OPACITY,
    },
  };
}

function createSlidePreviewModel(
  simulation: TransitionSimulation,
  mediaRect: MediaRect,
): SlidePreviewModel {
  const translate = getSlideTranslate(simulation, mediaRect);

  return {
    type: "slide",
    videoStyle: {
      width: mediaRect.width,
      height: mediaRect.height,
      transform: [
        {
          translateX: translate.x,
        },
        {
          translateY: translate.y,
        },
      ],
    },
    shadowStyle: getSlideShadowStyle(simulation.direction),
    edgeStyle: getSlideEdgeStyle(simulation.direction),
  };
}

function getSlideTranslate(
  simulation: TransitionSimulation,
  mediaRect: MediaRect,
): { x: number; y: number } {
  const remaining = 1 - simulation.easedProgress;

  if (simulation.direction === "right") {
    return {
      x: -remaining * mediaRect.width,
      y: 0,
    };
  }

  if (simulation.direction === "up") {
    return {
      x: 0,
      y: remaining * mediaRect.height,
    };
  }

  if (simulation.direction === "down") {
    return {
      x: 0,
      y: -remaining * mediaRect.height,
    };
  }

  return {
    x: remaining * mediaRect.width,
    y: 0,
  };
}

function getSlideShadowStyle(
  direction: NonNullable<TransitionSimulation["direction"]>,
): StyleProp<ViewStyle> {
  if (direction === "right") {
    return [styles.slideShadowVertical, styles.slideShadowRight];
  }

  if (direction === "up") {
    return [styles.slideShadowHorizontal, styles.slideShadowTop];
  }

  if (direction === "down") {
    return [styles.slideShadowHorizontal, styles.slideShadowBottom];
  }

  return [styles.slideShadowVertical, styles.slideShadowLeft];
}

function getSlideEdgeStyle(
  direction: NonNullable<TransitionSimulation["direction"]>,
): StyleProp<ViewStyle> {
  if (direction === "right") {
    return [styles.slideEdgeVertical, styles.slideEdgeRight];
  }

  if (direction === "up") {
    return [styles.slideEdgeHorizontal, styles.slideEdgeTop];
  }

  if (direction === "down") {
    return [styles.slideEdgeHorizontal, styles.slideEdgeBottom];
  }

  return [styles.slideEdgeVertical, styles.slideEdgeLeft];
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    overflow: "hidden",
    zIndex: 25,
    elevation: 25,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  previewVideo: {
    width: "100%",
    height: "100%",
  },
  fadeShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  slideClip: {
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  slideFallback: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  slideShadow: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.24)",
  },
  slideShadowVertical: {
    top: 0,
    bottom: 0,
    width: SLIDE_SHADOW_WIDTH,
  },
  slideShadowHorizontal: {
    left: 0,
    right: 0,
    height: SLIDE_SHADOW_WIDTH,
  },
  slideShadowLeft: {
    left: 0,
  },
  slideShadowRight: {
    right: 0,
  },
  slideShadowTop: {
    top: 0,
  },
  slideShadowBottom: {
    bottom: 0,
  },
  slideEdge: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    opacity: SLIDE_EDGE_OPACITY,
  },
  slideEdgeVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  slideEdgeHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  slideEdgeLeft: {
    left: 0,
  },
  slideEdgeRight: {
    right: 0,
  },
  slideEdgeTop: {
    top: 0,
  },
  slideEdgeBottom: {
    bottom: 0,
  },
});
