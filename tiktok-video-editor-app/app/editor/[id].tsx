import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useInitializeEditor } from "../../src/application/useInitializeEditor";
import { SeekRequest } from "../../src/application/useVideoSync";
import { EditorHeader } from "../../src/components/EditorHeader";
import { OverlayEditPanel } from "../../src/components/OverlayEditPanel";
import { Timeline } from "../../src/components/Timeline";
import { VideoStage } from "../../src/components/video-stage/VideoStage";
import { findTextOverlayById } from "../../src/domain/video/findTextOverlay";
import { getActiveSceneIdAtTime } from "../../src/domain/video/getActiveSceneIdAtTime";
import { NormalizedOverlayPosition } from "../../src/domain/video/overlayPosition";
import { TextOverlayUpdate } from "../../src/store/useEditSession";
import { colors } from "../../src/styles/theme";
import { normalizeRouteParam } from "../../src/utils/normalizeRouteParam";

/**
 * Renders the editor screen for a selected template.
 */
export default function EditorScreen(): React.JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const templateId = normalizeRouteParam(id);

  const [seekRequest, setSeekRequest] = useState<SeekRequest>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState<boolean>(false);

  const {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectedOverlayId,
    selectScene,
    selectOverlay,
    updateTextOverlay,
    clearSession,
  } = useInitializeEditor(templateId);

  const selectedOverlayResult = useMemo(
    () =>
      currentTemplate
        ? findTextOverlayById(currentTemplate.scenes, selectedOverlayId)
        : null,
    [currentTemplate, selectedOverlayId],
  );

  const handleGoBack = useCallback((): void => {
    clearSession();

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }, [clearSession, router]);

  const handleSceneClick = useCallback(
    (sceneId: string): void => {
      const scene = currentTemplate?.scenes.find((item) => item.id === sceneId);

      if (!scene) {
        return;
      }

      selectScene(sceneId);
      setSeekRequest({
        time: scene.startSeconds,
        timestamp: Date.now(),
      });
    },
    [currentTemplate, selectScene],
  );

  const handleTimeUpdate = useCallback(
    (time: number): void => {
      setCurrentTime(time);

      if (!currentTemplate) {
        return;
      }

      const matchedSceneId = getActiveSceneIdAtTime(
        currentTemplate.scenes,
        time,
      );

      if (matchedSceneId && matchedSceneId !== activeSceneId) {
        selectScene(matchedSceneId);
      }
    },
    [activeSceneId, currentTemplate, selectScene],
  );

  const handleCommitOverlayPosition = useCallback(
    (overlayId: string, position: NormalizedOverlayPosition): void => {
      if (!currentTemplate) {
        return;
      }

      const result = findTextOverlayById(currentTemplate.scenes, overlayId);

      if (!result) {
        return;
      }

      updateTextOverlay(result.sceneId, overlayId, position);
    },
    [currentTemplate, updateTextOverlay],
  );

  const handleChangeSelectedOverlay = useCallback(
    (patch: TextOverlayUpdate): void => {
      if (!selectedOverlayResult) {
        return;
      }

      updateTextOverlay(
        selectedOverlayResult.sceneId,
        selectedOverlayResult.overlay.id,
        patch,
      );
    },
    [selectedOverlayResult, updateTextOverlay],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error || !currentTemplate) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "No project loaded."}</Text>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.link}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EditorHeader title={currentTemplate.title} onGoBack={handleGoBack} />

      <ScrollView
        style={styles.scroll}
        scrollEnabled={!isDraggingOverlay}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.stageShell}>
          <VideoStage
            template={currentTemplate}
            currentTime={currentTime}
            selectedOverlayId={selectedOverlayId}
            seekRequest={seekRequest}
            onTimeUpdate={handleTimeUpdate}
            onSelectOverlay={selectOverlay}
            onDragStart={() => setIsDraggingOverlay(true)}
            onDragEnd={() => setIsDraggingOverlay(false)}
            onCommitOverlayPosition={handleCommitOverlayPosition}
          />
        </View>

        <OverlayEditPanel
          overlay={selectedOverlayResult?.overlay ?? null}
          onChange={handleChangeSelectedOverlay}
          onClose={() => selectOverlay(null)}
        />

        <Timeline
          scenes={currentTemplate.scenes}
          activeSceneId={activeSceneId}
          onSelectScene={handleSceneClick}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  stageShell: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.text,
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
  },
});
