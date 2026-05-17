import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SeekRequest } from "../../src/application/useVideoSync";
import { useInitializeEditor } from "../../src/application/useInitializeEditor";
import { EditorHeader } from "../../src/components/EditorHeader";
import { Timeline } from "../../src/components/Timeline";
import { VideoStage } from "../../src/components/video-stage/VideoStage";
import { colors } from "../../src/styles/theme";
import { normalizeRouteParam } from "../../src/utils/normalizeRouteParam";
import { getActiveSceneIdAtTime } from "../../src/domain/video/getActiveSceneIdAtTime";

export default function EditorScreen(): React.JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const templateId = normalizeRouteParam(id);

  const [seekRequest, setSeekRequest] = useState<SeekRequest>();
  const [currentTime, setCurrentTime] = useState<number>(0);

  const {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectScene,
    clearSession,
  } = useInitializeEditor(templateId);

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
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.stageShell}>
          <VideoStage
            template={currentTemplate}
            currentTime={currentTime}
            seekRequest={seekRequest}
            onTimeUpdate={handleTimeUpdate}
          />
        </View>

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
