import React, { useMemo } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";
import { TextOverlay } from "../types/template";
import { Size, VideoCanvas, getVideoCanvas } from "../domain/video/videoCanvas";
import {
  createTextOverlayRenderModel,
  getMaxTextLines,
  getVisibleTextOverlays,
} from "../domain/video/textOverlayLayout";

interface TextOverlayLayerProps {
  overlays: TextOverlay[];
  currentTime: number;
  canvas?: VideoCanvas;
  mediaSize?: Size;
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
 * Renders synchronized text overlays inside a video-owned coordinate system.
 *
 * The layer does not measure browser size and does not position text against
 * the page. It receives the logical video canvas and actual media size from
 * VideoStage, then renders text inside that video space only.
 */
export function TextOverlayLayer({
  overlays,
  currentTime,
  canvas = getVideoCanvas("landscape"),
  mediaSize = canvas,
}: TextOverlayLayerProps): React.JSX.Element {
  const renderModels = useMemo(
    () =>
      getVisibleTextOverlays(overlays, currentTime).map((overlay, index) =>
        createTextOverlayRenderModel(overlay, index, canvas, mediaSize),
      ),
    [canvas, currentTime, mediaSize, overlays],
  );

  return (
    <View style={styles.layer} pointerEvents="none" testID="text-overlay-layer">
      {renderModels.map((model) => (
        <View key={model.id} style={model.wrapperStyle} pointerEvents="none">
          <Text
            numberOfLines={getMaxTextLines()}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={1}
            style={[model.textStyle, webTextWrapStyle]}
          >
            {model.text}
          </Text>
        </View>
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
