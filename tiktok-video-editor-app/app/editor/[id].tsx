import React, { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEditorController } from "../../src/application/useEditorController";
import { AudioPanel } from "../../src/components/AudioPanel";
import { CompilePanel } from "../../src/components/CompilePanel";
import { EditorHeader } from "../../src/components/EditorHeader";
import { OverlayEditPanel } from "../../src/components/OverlayEditPanel";
import { SceneEffectsPanel } from "../../src/components/SceneEffectsPanel";
import { Timeline } from "../../src/components/Timeline";
import { TransitionPickerPanel } from "../../src/components/TransitionPickerPanel";
import { VideoStage } from "../../src/components/video-stage/VideoStage";
import { colors } from "../../src/styles/theme";
import { normalizeRouteParam } from "../../src/utils/normalizeRouteParam";

/**
 * Renders the editor screen for a selected template.
 *
 * @returns Editor screen element.
 */
export default function EditorScreen(): React.JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const templateId = normalizeRouteParam(id);

  const handleExitEditor = useCallback((): void => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }, [router]);

  const {
    isLoading,
    error,
    currentTemplate,
    activeSceneId,
    selectedOverlayId,
    selectedTransition,
    selectedOverlayResult,
    activeScene,
    activeSceneFilterValues,
    seekRequest,
    currentTime,
    isDraggingOverlay,
    compileStatus,
    compileMessage,
    selectOverlay,
    updateVolumes,
    handleGoBack,
    handleSceneClick,
    handleTimeUpdate,
    handleDragStart,
    handleDragEnd,
    handleCommitOverlayPosition,
    handleChangeSelectedOverlay,
    handleChangeSceneEffect,
    handleResetSceneEffects,
    handleCommitZoomFocus,
    handleSelectTransition,
    handleChangeTransition,
    handleCloseTransitionPicker,
    handleCompileProject,
  } = useEditorController({
    templateId,
    onExitEditor: handleExitEditor,
  });

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
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onCommitOverlayPosition={handleCommitOverlayPosition}
            onCommitZoomFocus={handleCommitZoomFocus}
          />
        </View>

        <CompilePanel
          status={compileStatus}
          message={compileMessage}
          compiledVideoUrl={currentTemplate.compiledVideoUrl ?? null}
          onCompile={handleCompileProject}
        />

        <OverlayEditPanel
          overlay={selectedOverlayResult?.overlay ?? null}
          onChange={handleChangeSelectedOverlay}
          onClose={() => selectOverlay(null)}
        />

        {!selectedOverlayId && (
          <>
            <SceneEffectsPanel
              sceneTitle={activeScene?.instruction ?? null}
              values={activeSceneFilterValues}
              onChange={handleChangeSceneEffect}
              onReset={handleResetSceneEffects}
            />

            <AudioPanel
              originalVolume={currentTemplate.originalVolume ?? 1}
              musicVolume={
                currentTemplate.music ? currentTemplate.music.volume : null
              }
              onChangeVolumes={updateVolumes}
            />
          </>
        )}

        <Timeline
          scenes={currentTemplate.scenes}
          activeSceneId={activeSceneId}
          onSelectScene={handleSceneClick}
          onSelectTransition={handleSelectTransition}
        />

        <TransitionPickerPanel
          scene={selectedTransition?.scene ?? null}
          selectedTransition={selectedTransition?.transition ?? null}
          onChangeTransition={handleChangeTransition}
          onClose={handleCloseTransitionPicker}
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
