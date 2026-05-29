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
import { SceneVideoChecklist } from "../../src/components/SceneVideoChecklist";
import { SceneVideoPanel } from "../../src/components/SceneVideoPanel";
import { Timeline } from "../../src/components/Timeline";
import { TransitionPickerPanel } from "../../src/components/TransitionPickerPanel";
import { VideoStage } from "../../src/components/video-stage/VideoStage";
import { colors } from "../../src/styles/theme";
import { normalizeRouteParam } from "../../src/utils/normalizeRouteParam";

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

  const controller = useEditorController({
    templateId,
    onExitEditor: handleExitEditor,
  });

  if (controller.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (controller.error || !controller.currentTemplate) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {controller.error || "No project loaded."}
        </Text>
        <TouchableOpacity onPress={controller.handleGoBack}>
          <Text style={styles.link}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EditorHeader
        title={controller.currentTemplate.title}
        onGoBack={controller.handleGoBack}
      />

      <ScrollView
        style={styles.scroll}
        scrollEnabled={!controller.isDraggingOverlay}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.stageShell}>
          <VideoStage
            template={controller.currentTemplate}
            activeSceneId={controller.activeSceneId}
            currentTime={controller.currentTime}
            selectedOverlayId={controller.selectedOverlayId}
            seekRequest={controller.seekRequest}
            onTimeUpdate={controller.handleTimeUpdate}
            onSelectOverlay={controller.selectOverlay}
            onDragStart={controller.handleDragStart}
            onDragEnd={controller.handleDragEnd}
            onCommitOverlayPosition={controller.handleCommitOverlayPosition}
            onCommitZoomFocus={controller.handleCommitZoomFocus}
          />
        </View>

        <SceneVideoChecklist
          scenes={controller.currentTemplate.scenes}
          activeSceneId={controller.activeSceneId}
          onSelectScene={controller.handleSceneClick}
        />

        <SceneVideoPanel
          scene={controller.activeScene}
          message={controller.sceneVideoMessage}
          trimDraft={controller.sceneVideoTrimDraft}
          isBusy={controller.isSceneVideoBusy}
          onPickVideo={controller.handlePickSceneVideo}
          onConfirmTrim={controller.handleConfirmSceneVideoTrim}
          onCancelTrim={controller.handleCancelSceneVideoTrim}
          onRemoveVideo={controller.handleRemoveSceneVideo}
        />

        <CompilePanel
          status={controller.compileStatus}
          message={controller.compileMessage}
          compiledVideoUrl={controller.compiledOutputUrl}
          outputKind={controller.compiledOutputKind}
          saveStatus={controller.saveStatus}
          saveMessage={controller.saveMessage}
          onCompile={controller.handleCompileProject}
          onSaveCompiledVideo={controller.handleSaveCompiledVideo}
          onOpenCompiledVideo={controller.handleOpenCompiledVideo}
        />

        <OverlayEditPanel
          overlay={controller.selectedOverlayResult?.overlay ?? null}
          onChange={controller.handleChangeSelectedOverlay}
          onClose={() => controller.selectOverlay(null)}
        />

        {!controller.selectedOverlayId && (
          <>
            <SceneEffectsPanel
              sceneTitle={controller.activeScene?.instruction ?? null}
              values={controller.activeSceneFilterValues}
              onChange={controller.handleChangeSceneEffect}
              onReset={controller.handleResetSceneEffects}
            />

            <AudioPanel
              originalVolume={controller.currentTemplate.originalVolume ?? 1}
              musicVolume={
                controller.currentTemplate.music
                  ? controller.currentTemplate.music.volume
                  : null
              }
              onChangeVolumes={controller.updateVolumes}
            />
          </>
        )}

        <Timeline
          scenes={controller.currentTemplate.scenes}
          activeSceneId={controller.activeSceneId}
          onSelectScene={controller.handleSceneClick}
          onSelectTransition={controller.handleSelectTransition}
        />

        <TransitionPickerPanel
          scene={controller.selectedTransition?.scene ?? null}
          selectedTransition={controller.selectedTransition?.transition ?? null}
          onChangeTransition={controller.handleChangeTransition}
          onClose={controller.handleCloseTransitionPicker}
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
