import React, { useMemo } from "react";
import { Platform, StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { NormalizedOverlayPosition } from "../domain/video/overlayPosition";
import {
  createTextOverlayRenderModel,
  getMaxTextLines,
  getVisibleTextOverlays,
} from "../domain/video/textOverlayLayout";
import { Size, VideoCanvas, getVideoCanvas } from "../domain/video/videoCanvas";
import { TextOverlay } from "../types/template";
import { EditableTextOverlay } from "./video-stage/EditableTextOverlay";

interface TextOverlayLayerProps {
  overlays: TextOverlay[];
  currentTime: number;
  canvas?: VideoCanvas;
  mediaSize?: Size;
  selectedOverlayId?: string | null;
  isEditingEnabled?: boolean;
  onSelectOverlay?: (overlayId: string | null) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onCommitOverlayPosition?: (
    overlayId: string,
    position: NormalizedOverlayPosition,
  ) => void;
}

const webTextWrapStyle = Platform.select<StyleProp<TextStyle>>({
  web: {
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
  } as StyleProp<TextStyle>,
  default: undefined,
});

/**
 * Renders synchronized text overlays inside video space.
 *
 * When editing is disabled, overlays remain visible but cannot be selected or
 * dragged. This is used for fullscreen preview mode.
 */
export function TextOverlayLayer({
  overlays,
  currentTime,
  canvas = getVideoCanvas("landscape"),
  mediaSize = canvas,
  selectedOverlayId = null,
  isEditingEnabled = true,
  onSelectOverlay,
  onDragStart,
  onDragEnd,
  onCommitOverlayPosition,
}: TextOverlayLayerProps): React.JSX.Element {
  const renderModels = useMemo(
    () =>
      getVisibleTextOverlays(overlays, currentTime).map((overlay, index) => ({
        overlay,
        model: createTextOverlayRenderModel(overlay, index, canvas, mediaSize),
      })),
    [canvas, currentTime, mediaSize, overlays],
  );

  return (
    <View
      style={styles.layer}
      pointerEvents={isEditingEnabled ? "box-none" : "none"}
      testID="text-overlay-layer"
    >
      {renderModels.map(({ overlay, model }) => (
        <EditableTextOverlay
          key={model.id}
          model={model}
          position={{
            positionX: overlay.positionX,
            positionY: overlay.positionY,
          }}
          mediaSize={mediaSize}
          isSelected={isEditingEnabled && selectedOverlayId === overlay.id}
          isEditingEnabled={isEditingEnabled}
          maxLines={getMaxTextLines()}
          webTextWrapStyle={webTextWrapStyle}
          onSelect={() => onSelectOverlay?.(overlay.id)}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onCommitPosition={(position) =>
            onCommitOverlayPosition?.(overlay.id, position)
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 30,
    elevation: 30,
  },
});
