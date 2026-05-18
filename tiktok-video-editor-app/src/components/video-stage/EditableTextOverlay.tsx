import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";
import {
  clampTopLeft,
  NormalizedOverlayPosition,
  normalizedPositionToTopLeft,
  OverlaySize,
  Point,
  topLeftToNormalizedPosition,
} from "../../domain/video/overlayPosition";
import { TextOverlayRenderModel } from "../../domain/video/textOverlayLayout";
import { Size } from "../../domain/video/videoCanvas";

export interface EditableTextOverlayProps {
  model: TextOverlayRenderModel;
  position: NormalizedOverlayPosition;
  mediaSize: Size;
  isSelected: boolean;
  isEditingEnabled: boolean;
  maxLines: number;
  webTextWrapStyle?: StyleProp<TextStyle>;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onCommitPosition: (position: NormalizedOverlayPosition) => void;
}

/**
 * Renders one selectable and draggable text overlay.
 *
 * Dragging is local to the component. The global editor state is updated only
 * when the drag interaction ends. Editing can be disabled for fullscreen
 * preview mode while keeping the overlay visible.
 */
export function EditableTextOverlay({
  model,
  position,
  mediaSize,
  isSelected,
  isEditingEnabled,
  maxLines,
  webTextWrapStyle,
  onSelect,
  onDragStart,
  onDragEnd,
  onCommitPosition,
}: EditableTextOverlayProps): React.JSX.Element {
  const animatedPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const currentTopLeftRef = useRef<Point>({ x: 0, y: 0 });
  const dragStartTopLeftRef = useRef<Point>({ x: 0, y: 0 });
  const overlaySizeRef = useRef<OverlaySize>({ width: 1, height: 1 });
  const isDraggingRef = useRef<boolean>(false);

  const syncAnimatedPosition = useCallback((): void => {
    if (isDraggingRef.current) {
      return;
    }

    const nextTopLeft = normalizedPositionToTopLeft(
      position,
      overlaySizeRef.current,
      mediaSize,
    );

    currentTopLeftRef.current = nextTopLeft;
    animatedPosition.setValue(nextTopLeft);
  }, [animatedPosition, mediaSize, position]);

  useEffect(() => {
    syncAnimatedPosition();
  }, [syncAnimatedPosition]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent): void => {
      overlaySizeRef.current = {
        width: Math.max(event.nativeEvent.layout.width, 1),
        height: Math.max(event.nativeEvent.layout.height, 1),
      };

      syncAnimatedPosition();
    },
    [syncAnimatedPosition],
  );

  const commitPosition = useCallback((): void => {
    onCommitPosition(
      topLeftToNormalizedPosition(
        currentTopLeftRef.current,
        overlaySizeRef.current,
        mediaSize,
      ),
    );
  }, [mediaSize, onCommitPosition]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isEditingEnabled,

      onMoveShouldSetPanResponder: (_event, gestureState) =>
        isEditingEnabled &&
        (Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dy) > 1),

      onPanResponderGrant: () => {
        if (!isEditingEnabled) {
          return;
        }

        isDraggingRef.current = true;
        dragStartTopLeftRef.current = currentTopLeftRef.current;
        onSelect();
        onDragStart?.();
      },

      onPanResponderMove: (_event, gestureState) => {
        if (!isEditingEnabled) {
          return;
        }

        const nextTopLeft = clampTopLeft(
          {
            x: dragStartTopLeftRef.current.x + gestureState.dx,
            y: dragStartTopLeftRef.current.y + gestureState.dy,
          },
          overlaySizeRef.current,
          mediaSize,
        );

        currentTopLeftRef.current = nextTopLeft;
        animatedPosition.setValue(nextTopLeft);
      },

      onPanResponderRelease: () => {
        if (!isEditingEnabled) {
          return;
        }

        isDraggingRef.current = false;
        commitPosition();
        onDragEnd?.();
      },

      onPanResponderTerminate: () => {
        if (!isEditingEnabled) {
          return;
        }

        isDraggingRef.current = false;
        commitPosition();
        onDragEnd?.();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      onLayout={handleLayout}
      style={[
        model.wrapperStyle,
        {
          transform: animatedPosition.getTranslateTransform(),
        },
        styles.interactiveWrapper,
        isSelected && styles.selectedWrapper,
      ]}
      testID={`editable-overlay-${model.id}`}
    >
      <Text
        numberOfLines={maxLines}
        ellipsizeMode="tail"
        maxFontSizeMultiplier={1}
        style={[model.textStyle, webTextWrapStyle]}
      >
        {model.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  interactiveWrapper: {
    userSelect: "none",
  } as TextStyle,
  selectedWrapper: {
    borderWidth: 1,
    borderColor: "#00D6F9",
    borderRadius: 8,
    backgroundColor: "rgba(0, 214, 249, 0.08)",
  },
});
