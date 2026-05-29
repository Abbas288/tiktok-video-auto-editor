import { useEvent } from "expo";
import { type VideoPlayer as ExpoVideoPlayer } from "expo-video";
import React, {
  CSSProperties,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useBackgroundMusic } from "../../application/useBackgroundMusic";
import { SeekRequest, useVideoSync } from "../../application/useVideoSync";
import { clampVolume } from "../../domain/audio/volume";
import {
  getScenePreviewPlaybackSource,
  getTemplateDurationSeconds,
} from "../../domain/scene-video/scenePreviewTimeline";
import { getSceneVideoReadiness } from "../../domain/scene-video/sceneVideoReadiness";
import { NormalizedOverlayPosition } from "../../domain/video/overlayPosition";
import {
  getSceneEffectsAtTime,
  getSceneFilterValues,
  SceneFilterValues,
  ZoomFocusPosition,
} from "../../domain/video/sceneEffects";
import {
  getContainedMediaRect,
  getVideoCanvas,
  MediaRect,
} from "../../domain/video/videoCanvas";
import { Template } from "../../types/template";
import { VideoErrorState } from "../VideoErrorState";
import { OverlayWorld } from "./OverlayWorld";
import { StageControls } from "./StageControls";
import { useMeasuredSize } from "./useMeasuredSize";
import { useStageFullscreen } from "./useStageFullscreen";
import { VideoStageEmptyState } from "./VideoStageEmptyState";
import { VideoSurface } from "./VideoSurface";

export interface VideoStageProps {
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

type WebVideoElement = HTMLVideoElement;
type WebVideoEvent = SyntheticEvent<WebVideoElement>;

const WEB_SCENE_END_TOLERANCE_SECONDS = 0.05;
const NATIVE_RESTART_PLAY_DELAY_MS = 120;

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
  const isWeb = Platform.OS === "web";
  const stageRef = useRef<View | null>(null);
  const webVideoRef = useRef<WebVideoElement | null>(null);
  const shouldResumeWebPlaybackRef = useRef<boolean>(false);

  const [webIsPlaying, setWebIsPlaying] = useState<boolean>(false);
  const [webHasError, setWebHasError] = useState<boolean>(false);
  const [restartSeekRequest, setRestartSeekRequest] = useState<
    SeekRequest | undefined
  >();

  const { size: stageSize, hasMeasuredSize, onLayout } = useMeasuredSize();

  const canvas = useMemo(
    () => getVideoCanvas(template.orientation),
    [template.orientation],
  );

  const readiness = useMemo(
    () => getSceneVideoReadiness(template.scenes),
    [template.scenes],
  );

  const playbackSource = useMemo(
    () => getScenePreviewPlaybackSource(template, currentTime),
    [currentTime, template],
  );

  const playbackSceneId = playbackSource?.scene.id ?? null;
  const playbackVideoUrl = playbackSource?.videoUrl ?? null;
  const playbackTimelineStartSeconds =
    playbackSource?.timelineStartSeconds ?? 0;
  const playbackTimelineEndSeconds = playbackSource?.timelineEndSeconds ?? 0;
  const playbackSourceStartSeconds = playbackSource?.sourceStartSeconds ?? 0;
  const playbackSourceEndSeconds = playbackSource?.sourceEndSeconds ?? 0;

  const totalDuration = useMemo(
    () => getTemplateDurationSeconds(template.scenes),
    [template.scenes],
  );

  const effectiveSeekRequest = useMemo(
    () => getNewestSeekRequest(seekRequest, restartSeekRequest),
    [restartSeekRequest, seekRequest],
  );

  const isAtTimelineEnd =
    totalDuration > 0 &&
    currentTime >= totalDuration - WEB_SCENE_END_TOLERANCE_SECONDS;

  const nativePlayer = useVideoSync({
    videoUrl: isWeb ? undefined : playbackSource?.videoUrl,
    seekRequest: isWeb ? undefined : effectiveSeekRequest,
    onTimeUpdate: isWeb ? undefined : onTimeUpdate,
    timelineStartSeconds: playbackTimelineStartSeconds,
    sourceStartSeconds: playbackSourceStartSeconds,
    sourceEndSeconds: playbackSource?.sourceEndSeconds,
  });

  const { isPlaying: nativeIsPlaying } = useEvent(
    nativePlayer,
    "playingChange",
    {
      isPlaying: nativePlayer.playing,
    },
  );

  const { status: nativeStatus } = useEvent(nativePlayer, "statusChange", {
    status: nativePlayer.status,
  });

  const isPlaying = isWeb ? webIsPlaying : nativeIsPlaying;
  const originalVolume = template.originalVolume ?? 1;

  useEffect(() => {
    if (isWeb) {
      return;
    }

    const safeVolume = clampVolume(originalVolume);

    nativePlayer.volume = safeVolume;
    nativePlayer.muted = safeVolume === 0;
  }, [isWeb, nativePlayer, originalVolume]);

  useEffect(() => {
    if (!isWeb || !webVideoRef.current) {
      return;
    }

    const safeVolume = clampVolume(originalVolume);

    webVideoRef.current.volume = safeVolume;
    webVideoRef.current.muted = safeVolume === 0;
  }, [isWeb, originalVolume, playbackVideoUrl]);

  useBackgroundMusic({
    url: readiness.isReadyForCompile ? template.music?.url : undefined,
    volume: template.music?.volume ?? 1,
    isPlaying: readiness.isReadyForCompile && isPlaying,
    seekRequest: effectiveSeekRequest,
  });

  const { isFullscreen, toggleFullscreen } = useStageFullscreen(stageRef);
  const isOverlayEditingEnabled = !isFullscreen;

  useEffect(() => {
    if (isFullscreen && selectedOverlayId) {
      onSelectOverlay(null);
    }
  }, [isFullscreen, onSelectOverlay, selectedOverlayId]);

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

  useEffect(() => {
    if (
      !isWeb ||
      !webVideoRef.current ||
      !playbackSceneId ||
      !playbackVideoUrl
    ) {
      return;
    }

    const video = webVideoRef.current;

    setWebHasError(false);
    video.currentTime = playbackSourceStartSeconds;

    if (shouldResumeWebPlaybackRef.current) {
      void playWebVideo(video, setWebIsPlaying);
    }
  }, [isWeb, playbackSceneId, playbackSourceStartSeconds, playbackVideoUrl]);

  useEffect(() => {
    if (
      !isWeb ||
      !webVideoRef.current ||
      !effectiveSeekRequest ||
      !playbackSceneId
    ) {
      return;
    }

    const localTime = Math.max(
      effectiveSeekRequest.time - playbackTimelineStartSeconds,
      0,
    );

    webVideoRef.current.currentTime = playbackSourceStartSeconds + localTime;
  }, [
    effectiveSeekRequest,
    isWeb,
    playbackSceneId,
    playbackSourceStartSeconds,
    playbackTimelineStartSeconds,
  ]);

  const restartPreviewFromBeginning = useCallback((): void => {
    const nextSeekRequest = {
      time: 0,
      timestamp: Date.now(),
    };

    shouldResumeWebPlaybackRef.current = true;
    setWebIsPlaying(false);
    setRestartSeekRequest(nextSeekRequest);
    onTimeUpdate(0);

    if (!isWeb) {
      setTimeout(() => {
        playNativeVideo(nativePlayer);
      }, NATIVE_RESTART_PLAY_DELAY_MS);
    }
  }, [isWeb, nativePlayer, onTimeUpdate]);

  const handleTogglePlay = useCallback((): void => {
    if (!playbackSource) {
      return;
    }

    if (isAtTimelineEnd) {
      restartPreviewFromBeginning();
      return;
    }

    if (isWeb) {
      const video = webVideoRef.current;

      if (!video) {
        return;
      }

      if (!video.paused) {
        video.pause();
        shouldResumeWebPlaybackRef.current = false;
        setWebIsPlaying(false);
        return;
      }

      shouldResumeWebPlaybackRef.current = true;
      void playWebVideo(video, setWebIsPlaying);
      return;
    }

    if (nativePlayer.playing) {
      nativePlayer.pause();
      return;
    }

    playNativeVideo(nativePlayer);
  }, [
    isAtTimelineEnd,
    isWeb,
    nativePlayer,
    playbackSource,
    restartPreviewFromBeginning,
  ]);

  const handleToggleFullscreen = useCallback((): void => {
    void toggleFullscreen();
  }, [toggleFullscreen]);

  const handleCommitZoomFocus = useCallback(
    (position: ZoomFocusPosition): void => {
      if (!playbackSource) {
        return;
      }

      onCommitZoomFocus(playbackSource.scene.id, position);
    },
    [onCommitZoomFocus, playbackSource],
  );

  const handleWebTimeUpdate = useCallback(
    (event: WebVideoEvent): void => {
      if (!playbackSource) {
        return;
      }

      const sourceTime = event.currentTarget.currentTime;

      if (
        sourceTime >=
        playbackSourceEndSeconds - WEB_SCENE_END_TOLERANCE_SECONDS
      ) {
        const nextTimelineTime = playbackTimelineEndSeconds;

        if (nextTimelineTime >= totalDuration) {
          event.currentTarget.pause();
          shouldResumeWebPlaybackRef.current = false;
          setWebIsPlaying(false);
        }

        onTimeUpdate(nextTimelineTime);
        return;
      }

      onTimeUpdate(
        playbackTimelineStartSeconds +
          Math.max(sourceTime - playbackSourceStartSeconds, 0),
      );
    },
    [
      onTimeUpdate,
      playbackSource,
      playbackSourceEndSeconds,
      playbackSourceStartSeconds,
      playbackTimelineEndSeconds,
      playbackTimelineStartSeconds,
      totalDuration,
    ],
  );

  const webVideoStyle = useMemo(
    () =>
      createWebVideoStyle({
        mediaRect,
        filters: activeSceneFilters,
      }),
    [activeSceneFilters, mediaRect],
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
          {!readiness.isReadyForCompile || !playbackSource ? (
            <VideoStageEmptyState readiness={readiness} />
          ) : (
            <>
              {isWeb ? (
                React.createElement("video", {
                  key: `${playbackSceneId}:${playbackVideoUrl}`,
                  ref: (element: WebVideoElement | null) => {
                    webVideoRef.current = element;
                  },
                  src: playbackVideoUrl,
                  playsInline: true,
                  preload: "auto",
                  controls: false,
                  style: webVideoStyle,
                  onPlay: () => {
                    shouldResumeWebPlaybackRef.current = true;
                    setWebIsPlaying(true);
                  },
                  onPause: () => {
                    shouldResumeWebPlaybackRef.current = false;
                    setWebIsPlaying(false);
                  },
                  onTimeUpdate: handleWebTimeUpdate,
                  onError: () => {
                    setWebHasError(true);
                    shouldResumeWebPlaybackRef.current = false;
                    setWebIsPlaying(false);
                  },
                })
              ) : (
                <VideoSurface
                  player={nativePlayer}
                  mediaRect={mediaRect}
                  filters={activeSceneFilters}
                  isZoomPanEnabled={!selectedOverlayId}
                  onZoomPanStart={onDragStart}
                  onZoomPanEnd={onDragEnd}
                  onCommitZoomFocus={handleCommitZoomFocus}
                />
              )}

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

              {(isWeb && webHasError) ||
              (!isWeb && nativeStatus === "error") ? (
                <View style={[styles.errorLayer, mediaRect]}>
                  <VideoErrorState message="Unable to load scene video." />
                </View>
              ) : null}

              <StageControls
                isPlaying={isPlaying}
                isFullscreen={isFullscreen}
                currentTime={currentTime}
                duration={totalDuration}
                onTogglePlay={handleTogglePlay}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </>
          )}
        </>
      ) : null}
    </View>
  );
}

function getNewestSeekRequest(
  externalSeekRequest: SeekRequest | undefined,
  internalSeekRequest: SeekRequest | undefined,
): SeekRequest | undefined {
  if (!externalSeekRequest) {
    return internalSeekRequest;
  }

  if (!internalSeekRequest) {
    return externalSeekRequest;
  }

  return internalSeekRequest.timestamp > externalSeekRequest.timestamp
    ? internalSeekRequest
    : externalSeekRequest;
}

async function playWebVideo(
  video: WebVideoElement,
  setIsPlaying: (value: boolean) => void,
): Promise<void> {
  try {
    await video.play();
    setIsPlaying(true);
  } catch (error) {
    if (!isExpectedMediaAbortError(error)) {
      console.warn("Unable to play web video.", error);
    }

    setIsPlaying(false);
  }
}

function playNativeVideo(player: ExpoVideoPlayer): void {
  try {
    const result = player.play();

    void Promise.resolve(result).catch((error) => {
      if (!isExpectedMediaAbortError(error)) {
        console.warn("Unable to play video.", error);
      }
    });
  } catch (error) {
    if (!isExpectedMediaAbortError(error)) {
      console.warn("Unable to play video.", error);
    }
  }
}

function createWebVideoStyle(options: {
  mediaRect: MediaRect;
  filters: SceneFilterValues;
}): CSSProperties {
  const brightness = readNumber(options.filters.brightness, 1);
  const contrast = readNumber(options.filters.contrast, 1);
  const zoom = Math.max(readNumber(options.filters.zoom, 1), 1);
  const zoomPositionX = readNumber(options.filters.zoomPositionX, 0.5);
  const zoomPositionY = readNumber(options.filters.zoomPositionY, 0.5);

  return {
    position: "absolute",
    left: options.mediaRect.left,
    top: options.mediaRect.top,
    width: options.mediaRect.width,
    height: options.mediaRect.height,
    objectFit: "cover",
    backgroundColor: "#000000",
    filter: `brightness(${brightness}) contrast(${contrast})`,
    transform: `scale(${zoom})`,
    transformOrigin: `${zoomPositionX * 100}% ${zoomPositionY * 100}%`,
  };
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isExpectedMediaAbortError(error: unknown): boolean {
  if (!(error instanceof Error || typeof error === "object")) {
    return false;
  }

  const name =
    error && "name" in error && typeof error.name === "string"
      ? error.name
      : "";

  const message =
    error && "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return (
    name === "AbortError" ||
    message.includes("media resource was aborted") ||
    message.includes("play() request was interrupted") ||
    message.includes("The fetching process for the media resource was aborted")
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
