import { useEvent } from "expo";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SeekRequest, useVideoSync } from "../../application/useVideoSync";
import {
  getContainedMediaRect,
  getVideoCanvas,
} from "../../domain/video/videoCanvas";
import { Template } from "../../types/template";
import { VideoErrorState } from "../VideoErrorState";
import { OverlayWorld } from "./OverlayWorld";
import { StageControls } from "./StageControls";
import { useMeasuredSize } from "./useMeasuredSize";
import { useStageFullscreen } from "./useStageFullscreen";
import { VideoSurface } from "./VideoSurface";

interface VideoStageProps {
  template: Template;
  currentTime: number;
  seekRequest?: SeekRequest;
  onTimeUpdate: (time: number) => void;
}

/**
 * Owns the complete video preview stage: video, overlays and custom controls.
 *
 * Fullscreen is applied to this stage, not to VideoView. This keeps text
 * overlays attached to the video preview during fullscreen.
 */
export function VideoStage({
  template,
  currentTime,
  seekRequest,
  onTimeUpdate,
}: VideoStageProps): React.JSX.Element {
  const stageRef = useRef<View | null>(null);
  const { size: stageSize, hasMeasuredSize, onLayout } = useMeasuredSize();

  const canvas = useMemo(
    () => getVideoCanvas(template.orientation),
    [template.orientation],
  );

  const player = useVideoSync({
    videoUrl: template.sourceVideoUrl,
    seekRequest,
    onTimeUpdate,
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  const { isFullscreen, toggleFullscreen } = useStageFullscreen(stageRef);

  const overlays = useMemo(
    () => template.scenes.flatMap((scene) => scene.textOverlays ?? []),
    [template.scenes],
  );

  const mediaRect = useMemo(
    () => getContainedMediaRect(stageSize, canvas),
    [canvas, stageSize],
  );

  const handleTogglePlay = useCallback((): void => {
    if (player.playing) {
      player.pause();
      return;
    }

    player.play();
  }, [player]);

  const handleToggleFullscreen = useCallback((): void => {
    void toggleFullscreen();
  }, [toggleFullscreen]);

  return (
    <View
      ref={stageRef}
      style={[
        styles.stage,
        isFullscreen
          ? styles.stageFullscreen
          : {
              aspectRatio: canvas.width / canvas.height,
            },
      ]}
      onLayout={onLayout}
      testID="video-stage"
    >
      {hasMeasuredSize ? (
        <>
          <VideoSurface player={player} mediaRect={mediaRect} />

          <OverlayWorld
            overlays={overlays}
            currentTime={currentTime}
            canvas={canvas}
            mediaRect={mediaRect}
          />

          {status === "error" ? (
            <View style={[styles.errorLayer, mediaRect]}>
              <VideoErrorState message="Unable to load video." />
            </View>
          ) : null}

          <StageControls
            isPlaying={isPlaying}
            isFullscreen={isFullscreen}
            currentTime={currentTime}
            duration={player.duration}
            onTogglePlay={handleTogglePlay}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000000",
    borderRadius: 14,
  },
  stageFullscreen: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  errorLayer: {
    position: "absolute",
    overflow: "hidden",
    zIndex: 40,
    elevation: 40,
  },
});
