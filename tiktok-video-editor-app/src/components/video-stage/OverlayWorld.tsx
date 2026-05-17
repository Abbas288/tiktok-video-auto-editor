import React from "react";
import { StyleSheet, View } from "react-native";
import { MediaRect, VideoCanvas } from "../../domain/video/videoCanvas";
import { TextOverlay } from "../../types/template";
import { TextOverlayLayer } from "../TextOverlayLayer";

interface OverlayWorldProps {
  overlays: TextOverlay[];
  currentTime: number;
  canvas: VideoCanvas;
  mediaRect: MediaRect;
}

/**
 * Mounts overlay layers on top of the exact rendered media rectangle.
 *
 * This prevents overlays from leaking into letterbox areas or the surrounding
 * editor layout.
 */
export function OverlayWorld({
  overlays,
  currentTime,
  canvas,
  mediaRect,
}: OverlayWorldProps): React.JSX.Element {
  return (
    <View style={[styles.world, mediaRect]} pointerEvents="none">
      <TextOverlayLayer
        overlays={overlays}
        currentTime={currentTime}
        canvas={canvas}
        mediaSize={{
          width: mediaRect.width,
          height: mediaRect.height,
        }}
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
