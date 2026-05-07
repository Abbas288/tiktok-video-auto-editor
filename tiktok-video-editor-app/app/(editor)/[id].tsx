import React, { useCallback } from "react";
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
import { SceneList } from "../../src/components/SceneList";
import { VideoPlayerPlaceholder } from "../../src/components/VideoPlayerPlaceholder";
import { colors } from "../../src/styles/theme";

export default function EditorScreen(): React.JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectScene,
    clearSession,
  } = useInitializeEditor(id);

  const handleGoBack = useCallback((): void => {
    clearSession();
    router.back();
  }, [clearSession, router]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.text || "#000"} />
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
      <VideoPlayerPlaceholder />
      <Text style={styles.subtitle}>Scenes</Text>
      <SceneList
        scenes={currentTemplate.scenes}
        activeSceneId={activeSceneId}
        onSelectScene={selectScene}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface || "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background || "#f5f5f5",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 10,
    color: colors.text || "#000",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.text || "#000",
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
  },
});
