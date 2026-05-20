import React, { useCallback, useMemo, useRef } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { VideoView, type VideoPlayer as ExpoVideoPlayer } from "expo-video";
import {
  SceneFilterValues,
  ZoomFocusPosition,
} from "../../domain/video/sceneEffects";
import { MediaRect } from "../../domain/video/videoCanvas";
import {
  clampPan,
  getZoomPanBounds,
  Point,
  panToZoomFocus,
  zoomFocusToPan,
} from "../../domain/video/zoomPan";

interface VideoSurfaceProps {
  player: ExpoVideoPlayer;
  mediaRect: MediaRect;
  filters: SceneFilterValues;
  isZoomPanEnabled: boolean;
  onZoomPanStart?: () => void;
  onZoomPanEnd?: () => void;
  onCommitZoomFocus: (position: ZoomFocusPosition) => void;
}

/**
 * Renders the video surface inside the exact media rectangle.
 *
 * Zoom is represented by a larger inner media frame clipped by the surface.
 * Dragging moves that larger frame under the fixed video viewport and commits
 * the resulting focus point as normalized scene data.
 */
export function VideoSurface({
  player,
  mediaRect,
  filters,
  isZoomPanEnabled,
  onZoomPanStart,
  onZoomPanEnd,
  onCommitZoomFocus,
}: VideoSurfaceProps): React.JSX.Element {
  const animatedPan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const dragStartRef = useRef<Point>({ x: 0, y: 0 });
  const currentPanRef = useRef<Point>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);

  const panBounds = useMemo(
    () => getZoomPanBounds(mediaRect, filters.zoom),
    [filters.zoom, mediaRect],
  );

  const canPanZoom = isZoomPanEnabled && filters.zoom > 1 && panBounds.maxX > 0;

  const syncPanFromFilters = useCallback((): void => {
    if (isDraggingRef.current) {
      return;
    }

    const nextPan = zoomFocusToPan(filters, panBounds);

    currentPanRef.current = nextPan;
    animatedPan.setValue(nextPan);
  }, [animatedPan, filters, panBounds]);

  React.useEffect(() => {
    syncPanFromFilters();
  }, [syncPanFromFilters]);

  const commitZoomFocus = useCallback((): void => {
    onCommitZoomFocus(panToZoomFocus(currentPanRef.current, panBounds));
  }, [onCommitZoomFocus, panBounds]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => canPanZoom,

        onMoveShouldSetPanResponder: (_event, gestureState) =>
          canPanZoom &&
          (Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dy) > 1),

        onPanResponderGrant: () => {
          if (!canPanZoom) {
            return;
          }

          isDraggingRef.current = true;
          dragStartRef.current = currentPanRef.current;
          onZoomPanStart?.();
        },

        onPanResponderMove: (_event, gestureState) => {
          if (!canPanZoom) {
            return;
          }

          const nextPan = clampPan(
            {
              x: dragStartRef.current.x + gestureState.dx,
              y: dragStartRef.current.y + gestureState.dy,
            },
            panBounds,
          );

          currentPanRef.current = nextPan;
          animatedPan.setValue(nextPan);
        },

        onPanResponderRelease: () => {
          if (!canPanZoom) {
            return;
          }

          isDraggingRef.current = false;
          commitZoomFocus();
          onZoomPanEnd?.();
        },

        onPanResponderTerminate: () => {
          if (!canPanZoom) {
            return;
          }

          isDraggingRef.current = false;
          commitZoomFocus();
          onZoomPanEnd?.();
        },
      }),
    [
      animatedPan,
      canPanZoom,
      commitZoomFocus,
      onZoomPanEnd,
      onZoomPanStart,
      panBounds,
    ],
  );

  const effectFrameStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.effectFrame,
      {
        width: mediaRect.width * filters.zoom,
        height: mediaRect.height * filters.zoom,
        left: -panBounds.maxX,
        top: -panBounds.maxY,
        transform: animatedPan.getTranslateTransform(),
      },
    ],
    [animatedPan, filters.zoom, mediaRect.height, mediaRect.width, panBounds],
  );

  const videoStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.video, getWebFilterStyle(filters)],
    [filters],
  );

  return (
    <View
      {...panResponder.panHandlers}
      style={[styles.surface, mediaRect]}
      testID="video-surface"
    >
      <Animated.View style={effectFrameStyle}>
        <VideoView
          style={videoStyle}
          player={player}
          nativeControls={false}
          contentFit="fill"
          allowsPictureInPicture={false}
        />
      </Animated.View>
    </View>
  );
}

/**
 * Returns browser-only filter styling for Expo Web.
 *
 * @param filters Active scene filter values.
 * @returns Web filter style, or null on native platforms.
 */
function getWebFilterStyle(filters: SceneFilterValues): ViewStyle | null {
  if (Platform.OS !== "web") {
    return null;
  }

  return {
    filter: `brightness(${filters.brightness}) contrast(${filters.contrast})`,
  } as ViewStyle;
}

const styles = StyleSheet.create({
  surface: {
    position: "absolute",
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  effectFrame: {
    position: "absolute",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
