import React from "react";
import { StyleSheet, View } from "react-native";
import { NormalizedOverlayPosition } from "../../domain/video/overlayPosition";
import { MediaRect, VideoCanvas } from "../../domain/video/videoCanvas";
import { TextOverlay } from "../../types/template";
import { TextOverlayLayer } from "../TextOverlayLayer";

interface OverlayWorldProps {
  overlays: TextOverlay[];
  currentTime: number;
  canvas: VideoCanvas;
  mediaRect: MediaRect;
  selectedOverlayId: string | null;
  isEditingEnabled: boolean;
  onSelectOverlay: (overlayId: string | null) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onCommitOverlayPosition: (
    overlayId: string,
    position: NormalizedOverlayPosition,
  ) => void;
}

/**
 * Mounts overlay layers on top of the exact rendered media rectangle.
 */
export function OverlayWorld({
  overlays,
  currentTime,
  canvas,
  mediaRect,
  selectedOverlayId,
  isEditingEnabled,
  onSelectOverlay,
  onDragStart,
  onDragEnd,
  onCommitOverlayPosition,
}: OverlayWorldProps): React.JSX.Element {
  return (
    <View style={[styles.world, mediaRect]} pointerEvents="box-none">
      <TextOverlayLayer
        overlays={overlays}
        currentTime={currentTime}
        canvas={canvas}
        mediaSize={{
          width: mediaRect.width,
          height: mediaRect.height,
        }}
        selectedOverlayId={selectedOverlayId}
        isEditingEnabled={isEditingEnabled}
        onSelectOverlay={onSelectOverlay}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onCommitOverlayPosition={onCommitOverlayPosition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  world: {
    position: "absolute",
    overflow: "hidden",
    zIndex: 20,
    elevation: 20,
  },
});
