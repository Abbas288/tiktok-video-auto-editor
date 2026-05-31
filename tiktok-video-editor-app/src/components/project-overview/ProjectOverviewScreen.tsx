import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useProjectOverviewController } from "../../application/useProjectOverviewController";
import { colors } from "../../styles/theme";
import { AppNavbar } from "../AppNavbar";
import { FeedbackBanner } from "./FeedbackBanner";
import { HomeActionButton } from "./HomeActionButton";
import { ProjectCard } from "./ProjectCard";

/**
 * Renders the project overview page.
 *
 * @returns Project overview screen element.
 */
export function ProjectOverviewScreen(): React.JSX.Element {
  const controller = useProjectOverviewController();

  return (
    <View style={styles.container}>
      <AppNavbar />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        testID="home-screen"
      >
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIconBadge}>
              <MaterialIcons
                name="movie-creation"
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.heroTextColumn}>
              <Text style={styles.title}>Projects</Text>
              <Text style={styles.subtitle}>
                Create a project from a JSON template or open an existing one.
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <HomeActionButton
              icon="add-circle-outline"
              label="Create project"
              variant="primary"
              disabled={controller.isImporting}
              onPress={controller.toggleCreatePanel}
              testID="create-project-button"
            />

            <HomeActionButton
              icon="content-copy"
              label="Copy AI prompt"
              variant="ghost"
              disabled={controller.isImporting}
              onPress={() => {
                void controller.handleCopyPrompt();
              }}
              testID="copy-template-prompt-button"
            />

            <HomeActionButton
              icon="info-outline"
              label="Guide"
              variant="ghost"
              disabled={controller.isImporting}
              onPress={controller.handleOpenTemplateGuide}
              testID="template-guide-button"
            />
          </View>
        </View>

        {controller.feedback ? (
          <FeedbackBanner feedback={controller.feedback} />
        ) : null}

        {controller.isCreatePanelOpen ? (
          <View style={styles.createPanel} testID="create-project-panel">
            <View style={styles.createHeader}>
              <View style={styles.createTextColumn}>
                <Text style={styles.panelTitle}>Create from template</Text>
                <Text style={styles.panelDescription}>
                  Upload a .txt or .json file containing the editor template.
                </Text>
              </View>

              <MaterialIcons
                name="data-object"
                size={22}
                color={colors.primary}
              />
            </View>

            <HomeActionButton
              icon="upload-file"
              label={controller.isImporting ? "Importing" : "Add JSON template"}
              variant="primary"
              disabled={controller.isImporting}
              onPress={() => {
                void controller.handleImportTemplate();
              }}
              testID="add-json-template-button"
            />
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <Text style={styles.sectionCount}>{controller.templates.length}</Text>
        </View>

        {controller.isLoading ? (
          <View style={styles.centerCard}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : controller.templates.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons
              name="folder-open"
              size={28}
              color={colors.textSecondary}
            />

            <Text style={styles.emptyTitle}>No projects yet.</Text>
            <Text style={styles.emptyText}>
              Create a project and import a JSON template to get started.
            </Text>
          </View>
        ) : (
          <View style={styles.templateList}>
            {controller.templates.map((template) => (
              <ProjectCard
                key={template.id}
                template={template}
                isActionsOpen={controller.expandedProjectId === template.id}
                isRenaming={controller.renamingProjectId === template.id}
                isDeleting={controller.deletingProjectId === template.id}
                renameDraft={controller.renameDraft}
                isBusy={controller.busyProjectId === template.id}
                onOpenProject={(id) => {
                  void controller.handleOpenProject(id);
                }}
                onToggleActions={controller.handleToggleActions}
                onStartRename={controller.handleStartRename}
                onRenameDraftChange={controller.setRenameDraft}
                onSaveRename={(id) => {
                  void controller.handleSaveRename(id);
                }}
                onCancelRename={controller.handleCancelRename}
                onStartDelete={controller.handleStartDelete}
                onConfirmDelete={(selectedTemplate) => {
                  void controller.handleConfirmDelete(selectedTemplate);
                }}
                onCancelDelete={controller.handleCancelDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    padding: 14,
    gap: 12,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 214, 249, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  createPanel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  createHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  createTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  panelDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  sectionHeader: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  sectionCount: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "900",
  },
  centerCard: {
    minHeight: 140,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    minHeight: 170,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  templateList: {
    gap: 10,
  },
});
