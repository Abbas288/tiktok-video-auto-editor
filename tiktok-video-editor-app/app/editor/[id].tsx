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
import { colors } from "../../src/styles/theme";
import { normalizeRouteParam } from "../../src/utils/normalizeRouteParam";
import { VideoPlayer } from "../../src/components/VideoPlayer";
import { Timeline } from "../../src/components/Timeline";

export default function EditorScreen(): React.JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const templateId = normalizeRouteParam(id);

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

      <VideoPlayer videoUrl={currentTemplate.sourceVideoUrl} />

      <Timeline
        // TC-T2: Tidslinjen hanterar tom scenlista säkert
        // scenes={[]}

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
