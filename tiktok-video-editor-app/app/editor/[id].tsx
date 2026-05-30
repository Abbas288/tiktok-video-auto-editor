import React, { useCallback, useEffect, useState } from "react";
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
import {
  EditorToolKey,
  EditorToolTabs,
} from "../../src/components/EditorToolTabs";
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
  const [activeTool, setActiveTool] = useState<EditorToolKey>("scene");

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

  useEffect(() => {
    if (controller.selectedOverlayId) {
      setActiveTool("text");
    }
  }, [controller.selectedOverlayId]);

  useEffect(() => {
    if (controller.selectedTransition) {
      setActiveTool("timeline");
    }
  }, [controller.selectedTransition]);

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

  const handleSelectTransition = (sceneId: string): void => {
    setActiveTool("timeline");
    controller.handleSelectTransition(sceneId);
  };

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

        <EditorToolTabs activeTool={activeTool} onChangeTool={setActiveTool} />

        <View style={styles.toolShell}>
          {activeTool === "scene" ? (
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
          ) : null}

          {activeTool === "text" ? (
            controller.selectedOverlayResult?.overlay ? (
              <OverlayEditPanel
                overlay={controller.selectedOverlayResult.overlay}
                onChange={controller.handleChangeSelectedOverlay}
                onClose={() => controller.selectOverlay(null)}
              />
            ) : (
              <ToolHint message="Select text in preview." />
            )
          ) : null}

          {activeTool === "filters" ? (
            <SceneEffectsPanel
              sceneTitle={controller.activeScene?.instruction ?? null}
              values={controller.activeSceneFilterValues}
              onChange={controller.handleChangeSceneEffect}
              onReset={controller.handleResetSceneEffects}
            />
          ) : null}

          {activeTool === "audio" ? (
            <AudioPanel
              originalVolume={controller.currentTemplate.originalVolume ?? 1}
              musicVolume={
                controller.currentTemplate.music
                  ? controller.currentTemplate.music.volume
                  : null
              }
              onChangeVolumes={controller.updateVolumes}
            />
          ) : null}

          {activeTool === "timeline" ? (
            <>
              <Timeline
                scenes={controller.currentTemplate.scenes}
                activeSceneId={controller.activeSceneId}
                onSelectScene={controller.handleSceneClick}
                onSelectTransition={handleSelectTransition}
              />

              <TransitionPickerPanel
                scene={controller.selectedTransition?.scene ?? null}
                selectedTransition={
                  controller.selectedTransition?.transition ?? null
                }
                onChangeTransition={controller.handleChangeTransition}
                onClose={controller.handleCloseTransitionPicker}
              />
            </>
          ) : null}
        </View>

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
      </ScrollView>
    </View>
  );
}

function ToolHint({ message }: { message: string }): React.JSX.Element {
  return (
    <View style={styles.toolHint}>
      <Text style={styles.toolHintText}>{message}</Text>
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
    padding: 14,
    gap: 12,
  },
  stageShell: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
  toolShell: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    gap: 12,
  },
  toolHint: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  toolHintText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
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
