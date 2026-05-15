import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useInitializeEditor } from "../../src/application/useInitializeEditor";
import { EditorHeader } from "../../src/components/EditorHeader";
import { Timeline } from "../../src/components/Timeline";
import { colors } from "../../src/styles/theme";
import { normalizeRouteParam } from "../../src/utils/normalizeRouteParam";
import { VideoPlayer } from "../../src/components/VideoPlayer";
import { SeekRequest } from "../../src/application/useVideoSync";

export default function EditorScreen(): React.JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const templateId = normalizeRouteParam(id);

  const [seekRequest, setSeekRequest] = useState<SeekRequest>();

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
    (sceneId: string) => {
      const scene = currentTemplate?.scenes.find((s) => s.id === sceneId);
      if (scene) {
        selectScene(sceneId);
        setSeekRequest({
          time: scene.startSeconds,
          timestamp: Date.now(),
        });
      }
    },
    [currentTemplate, selectScene],
  );

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (!currentTemplate) return;

      const matchedScene = currentTemplate.scenes.find(
        (scene) =>
          currentTime >= scene.startSeconds &&
          currentTime < scene.startSeconds + scene.durationSeconds,
      );

      if (matchedScene && matchedScene.id !== activeSceneId) {
        selectScene(matchedScene.id);
      }
    },
    [currentTemplate, activeSceneId, selectScene],
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

      <VideoPlayer
        videoUrl={currentTemplate.sourceVideoUrl}
        seekRequest={seekRequest}
        onTimeUpdate={handleTimeUpdate}
      />

      <Timeline
        scenes={currentTemplate.scenes}
        activeSceneId={activeSceneId}
        onSelectScene={handleSceneClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 10,
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.text,
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    fontSize: 16,
  },
});
