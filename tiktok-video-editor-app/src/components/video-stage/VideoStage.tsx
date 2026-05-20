import { useEvent } from "expo";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SeekRequest, useVideoSync } from "../../application/useVideoSync";
import { NormalizedOverlayPosition } from "../../domain/video/overlayPosition";
import {
  getSceneEffectsAtTime,
  getSceneFilterValues,
  ZoomFocusPosition,
} from "../../domain/video/sceneEffects";
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
  selectedOverlayId: string | null;
  seekRequest?: SeekRequest;
  onTimeUpdate: (time: number) => void;
  onSelectOverlay: (overlayId: string | null) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onCommitOverlayPosition: (
    overlayId: string,
    position: NormalizedOverlayPosition,
  ) => void;
  onCommitZoomFocus: (sceneId: string, position: ZoomFocusPosition) => void;
}

/**
 * Owns the complete video preview stage: video, overlays and custom controls.
 *
 * Scene filters are resolved from playback time so each scene controls only
 * its own visual appearance.
 */
export function VideoStage({
  template,
  currentTime,
  selectedOverlayId,
  seekRequest,
  onTimeUpdate,
  onSelectOverlay,
  onDragStart,
  onDragEnd,
  onCommitOverlayPosition,
  onCommitZoomFocus,
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
  const isOverlayEditingEnabled = !isFullscreen;

  useEffect(() => {
    if (isFullscreen && selectedOverlayId) {
      onSelectOverlay(null);
    }
  }, [isFullscreen, onSelectOverlay, selectedOverlayId]);

  const activeScene = useMemo(
    () =>
      template.scenes.find(
        (scene) =>
          currentTime >= scene.startSeconds &&
          currentTime < scene.startSeconds + scene.durationSeconds,
      ) ?? null,
    [currentTime, template.scenes],
  );

  const overlays = useMemo(
    () => template.scenes.flatMap((scene) => scene.textOverlays ?? []),
    [template.scenes],
  );

  const activeSceneFilters = useMemo(
    () =>
      getSceneFilterValues(getSceneEffectsAtTime(template.scenes, currentTime)),
    [currentTime, template.scenes],
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

  const handleCommitZoomFocus = useCallback(
    (position: ZoomFocusPosition): void => {
      if (!activeScene) {
        return;
      }

      onCommitZoomFocus(activeScene.id, position);
    },
    [activeScene, onCommitZoomFocus],
  );

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
          <VideoSurface
            player={player}
            mediaRect={mediaRect}
            filters={activeSceneFilters}
            isZoomPanEnabled={!selectedOverlayId}
            onZoomPanStart={onDragStart}
            onZoomPanEnd={onDragEnd}
            onCommitZoomFocus={handleCommitZoomFocus}
          />

          <OverlayWorld
            overlays={overlays}
            currentTime={currentTime}
            canvas={canvas}
            mediaRect={mediaRect}
            selectedOverlayId={selectedOverlayId}
            isEditingEnabled={isOverlayEditingEnabled}
            onSelectOverlay={onSelectOverlay}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onCommitOverlayPosition={onCommitOverlayPosition}
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
