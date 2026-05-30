import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppNavbar } from "../../src/components/AppNavbar";
import { createGoogleAiStudioTemplatePrompt } from "../../src/domain/template/templateAiPrompt";
import {
  getTemplateImportErrorMessage,
  parseTemplateJsonText,
  pickTemplateFile,
} from "../../src/infrastructure/templateImportService";
import { templateRepository } from "../../src/infrastructure/templateRepository";
import { colors } from "../../src/styles/theme";
import { Template } from "../../src/types/template";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];
type FeedbackType = "success" | "error" | "info";

interface FeedbackMessage {
  type: FeedbackType;
  message: string;
}

interface ProjectCardProps {
  template: Template;
  isActionsOpen: boolean;
  isRenaming: boolean;
  isDeleting: boolean;
  renameDraft: string;
  isBusy: boolean;
  onOpenProject: (id: string) => void;
  onToggleActions: (id: string) => void;
  onStartRename: (template: Template) => void;
  onRenameDraftChange: (value: string) => void;
  onSaveRename: (id: string) => void;
  onCancelRename: () => void;
  onStartDelete: (template: Template) => void;
  onConfirmDelete: (template: Template) => void;
  onCancelDelete: () => void;
}

interface HomeActionButtonProps {
  icon: MaterialIconName;
  label: string;
  variant: "primary" | "ghost";
  onPress: () => void;
  testID: string;
  disabled?: boolean;
}

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null,
  );
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(
    null,
  );
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const [renameDraft, setRenameDraft] = useState<string>("");
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);

  const loadTemplates = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await templateRepository.getAvailableTemplates();

      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setFeedback({
        type: "error",
        message: "Could not load projects.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  const clearProjectActionState = useCallback((): void => {
    setExpandedProjectId(null);
    setRenamingProjectId(null);
    setDeletingProjectId(null);
    setRenameDraft("");
  }, []);

  const handleOpenProject = useCallback(
    async (id: string): Promise<void> => {
      try {
        setFeedback(null);

        const template = await templateRepository.getTemplateById(id);

        if (!template) {
          setFeedback({
            type: "error",
            message: "Project not found.",
          });
          await loadTemplates();
          return;
        }

        router.push(`/editor/${template.id}`);
      } catch {
        setFeedback({
          type: "error",
          message: "Could not open project.",
        });
      }
    },
    [loadTemplates, router],
  );

  const handleImportTemplate = useCallback(async (): Promise<void> => {
    try {
      setFeedback(null);
      setIsImporting(true);

      const pickedFile = await pickTemplateFile();

      if (!pickedFile) {
        setFeedback({
          type: "info",
          message: "No template file selected.",
        });
        return;
      }

      const templateInput = parseTemplateJsonText(pickedFile.text);
      const importedTemplate =
        await templateRepository.importTemplate(templateInput);

      setFeedback({
        type: "success",
        message: `Imported ${importedTemplate.title}.`,
      });

      setIsCreatePanelOpen(false);
      clearProjectActionState();
      await loadTemplates();

      router.push(`/editor/${importedTemplate.id}`);
    } catch (error) {
      setFeedback({
        type: "error",
        message: getTemplateImportErrorMessage(error),
      });
    } finally {
      setIsImporting(false);
    }
  }, [clearProjectActionState, loadTemplates, router]);

  const handleCopyPrompt = useCallback(async (): Promise<void> => {
    try {
      const didCopy = await Clipboard.setStringAsync(
        createGoogleAiStudioTemplatePrompt(),
      );

      if (!didCopy) {
        throw new Error("Clipboard rejected the prompt.");
      }

      setFeedback({
        type: "success",
        message: "AI template prompt copied.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Could not copy prompt.",
      });
    }
  }, []);

  const handleToggleActions = useCallback((id: string): void => {
    setExpandedProjectId((currentValue) => (currentValue === id ? null : id));
    setRenamingProjectId(null);
    setDeletingProjectId(null);
    setRenameDraft("");
  }, []);

  const handleStartRename = useCallback((template: Template): void => {
    setExpandedProjectId(template.id);
    setRenamingProjectId(template.id);
    setDeletingProjectId(null);
    setRenameDraft(template.title);
    setFeedback(null);
  }, []);

  const handleCancelRename = useCallback((): void => {
    setRenamingProjectId(null);
    setRenameDraft("");
  }, []);

  const handleSaveRename = useCallback(
    async (id: string): Promise<void> => {
      const nextTitle = renameDraft.trim();

      if (!nextTitle) {
        setFeedback({
          type: "error",
          message: "Project name is required.",
        });
        return;
      }

      try {
        setBusyProjectId(id);
        setFeedback(null);

        const updatedTemplate = await templateRepository.renameTemplate(
          id,
          nextTitle,
        );

        setFeedback({
          type: "success",
          message: `Renamed to ${updatedTemplate.title}.`,
        });

        clearProjectActionState();
        await loadTemplates();
      } catch (error) {
        setFeedback({
          type: "error",
          message: getProjectActionErrorMessage(
            error,
            "Could not rename project.",
          ),
        });
      } finally {
        setBusyProjectId(null);
      }
    },
    [clearProjectActionState, loadTemplates, renameDraft],
  );

  const handleStartDelete = useCallback((template: Template): void => {
    setExpandedProjectId(template.id);
    setDeletingProjectId(template.id);
    setRenamingProjectId(null);
    setRenameDraft("");
    setFeedback(null);
  }, []);

  const handleCancelDelete = useCallback((): void => {
    setDeletingProjectId(null);
  }, []);

  const handleConfirmDelete = useCallback(
    async (template: Template): Promise<void> => {
      try {
        setBusyProjectId(template.id);
        setFeedback(null);

        await templateRepository.deleteTemplate(template.id);

        setFeedback({
          type: "success",
          message: `Deleted ${template.title}.`,
        });

        clearProjectActionState();
        await loadTemplates();
      } catch (error) {
        setFeedback({
          type: "error",
          message: getProjectActionErrorMessage(
            error,
            "Could not delete project.",
          ),
        });
      } finally {
        setBusyProjectId(null);
      }
    },
    [clearProjectActionState, loadTemplates],
  );

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
              disabled={isImporting}
              onPress={() =>
                setIsCreatePanelOpen((currentValue) => !currentValue)
              }
              testID="create-project-button"
            />

            <HomeActionButton
              icon="content-copy"
              label="Copy AI prompt"
              variant="ghost"
              disabled={isImporting}
              onPress={handleCopyPrompt}
              testID="copy-template-prompt-button"
            />
          </View>
        </View>

        {feedback ? <FeedbackBanner feedback={feedback} /> : null}

        {isCreatePanelOpen ? (
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
              label={isImporting ? "Importing" : "Add JSON template"}
              variant="primary"
              disabled={isImporting}
              onPress={handleImportTemplate}
              testID="add-json-template-button"
            />
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <Text style={styles.sectionCount}>{templates.length}</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerCard}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : templates.length === 0 ? (
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
            {templates.map((template) => (
              <ProjectCard
                key={template.id}
                template={template}
                isActionsOpen={expandedProjectId === template.id}
                isRenaming={renamingProjectId === template.id}
                isDeleting={deletingProjectId === template.id}
                renameDraft={renameDraft}
                isBusy={busyProjectId === template.id}
                onOpenProject={(id) => {
                  void handleOpenProject(id);
                }}
                onToggleActions={handleToggleActions}
                onStartRename={handleStartRename}
                onRenameDraftChange={setRenameDraft}
                onSaveRename={(id) => {
                  void handleSaveRename(id);
                }}
                onCancelRename={handleCancelRename}
                onStartDelete={handleStartDelete}
                onConfirmDelete={(selectedTemplate) => {
                  void handleConfirmDelete(selectedTemplate);
                }}
                onCancelDelete={handleCancelDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ProjectCard({
  template,
  isActionsOpen,
  isRenaming,
  isDeleting,
  renameDraft,
  isBusy,
  onOpenProject,
  onToggleActions,
  onStartRename,
  onRenameDraftChange,
  onSaveRename,
  onCancelRename,
  onStartDelete,
  onConfirmDelete,
  onCancelDelete,
}: ProjectCardProps): React.JSX.Element {
  return (
    <View style={styles.templateCard} testID={`project-card-${template.id}`}>
      <View style={styles.templateMainRow}>
        <TouchableOpacity
          style={styles.templateOpenArea}
          onPress={() => onOpenProject(template.id)}
          testID={`template-card-${template.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Open ${template.title}`}
          disabled={isBusy}
        >
          <View style={styles.templateIconBadge}>
            <MaterialIcons
              name="movie-filter"
              size={20}
              color={colors.primary}
            />
          </View>

          <View style={styles.templateTextColumn}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {template.title}
            </Text>

            <Text style={styles.cardMeta}>
              {template.scenes.length} scenes · {template.orientation}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.projectMenuButton}
          onPress={() => onToggleActions(template.id)}
          hitSlop={HIT_SLOP}
          testID={`project-actions-${template.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Project actions for ${template.title}`}
          disabled={isBusy}
        >
          <MaterialIcons
            name={isActionsOpen ? "close" : "more-vert"}
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {isActionsOpen ? (
        <View
          style={styles.projectActions}
          testID={`project-actions-panel-${template.id}`}
        >
          {!isRenaming && !isDeleting ? (
            <View style={styles.projectActionRow}>
              <ProjectActionButton
                icon="open-in-new"
                label="Open"
                onPress={() => onOpenProject(template.id)}
                disabled={isBusy}
                testID={`project-open-${template.id}`}
              />

              <ProjectActionButton
                icon="edit"
                label="Rename"
                onPress={() => onStartRename(template)}
                disabled={isBusy}
                testID={`project-rename-${template.id}`}
              />

              <ProjectActionButton
                icon="delete-outline"
                label="Delete"
                variant="danger"
                onPress={() => onStartDelete(template)}
                disabled={isBusy}
                testID={`project-delete-${template.id}`}
              />
            </View>
          ) : null}

          {isRenaming ? (
            <View
              style={styles.inlinePanel}
              testID={`project-rename-panel-${template.id}`}
            >
              <Text style={styles.inlinePanelTitle}>Rename project</Text>

              <TextInput
                value={renameDraft}
                onChangeText={onRenameDraftChange}
                style={styles.projectInput}
                autoCapitalize="sentences"
                autoCorrect={false}
                selectTextOnFocus
                returnKeyType="done"
                onSubmitEditing={() => onSaveRename(template.id)}
                editable={!isBusy}
                testID={`project-rename-input-${template.id}`}
                accessibilityLabel="Project name"
              />

              <View style={styles.projectActionRow}>
                <ProjectActionButton
                  icon="check"
                  label={isBusy ? "Saving" : "Save"}
                  onPress={() => onSaveRename(template.id)}
                  disabled={isBusy}
                  testID={`project-rename-save-${template.id}`}
                />

                <ProjectActionButton
                  icon="close"
                  label="Cancel"
                  onPress={onCancelRename}
                  disabled={isBusy}
                  testID={`project-rename-cancel-${template.id}`}
                />
              </View>
            </View>
          ) : null}

          {isDeleting ? (
            <View
              style={styles.deletePanel}
              testID={`project-delete-panel-${template.id}`}
            >
              <Text style={styles.inlinePanelTitle}>Delete project?</Text>
              <Text style={styles.deleteDescription}>
                This removes it from My Projects.
              </Text>

              <View style={styles.projectActionRow}>
                <ProjectActionButton
                  icon="delete"
                  label={isBusy ? "Deleting" : "Delete"}
                  variant="danger"
                  onPress={() => onConfirmDelete(template)}
                  disabled={isBusy}
                  testID={`project-delete-confirm-${template.id}`}
                />

                <ProjectActionButton
                  icon="close"
                  label="Cancel"
                  onPress={onCancelDelete}
                  disabled={isBusy}
                  testID={`project-delete-cancel-${template.id}`}
                />
              </View>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function ProjectActionButton({
  icon,
  label,
  onPress,
  testID,
  variant = "default",
  disabled = false,
}: {
  icon: MaterialIconName;
  label: string;
  onPress: () => void;
  testID: string;
  variant?: "default" | "danger";
  disabled?: boolean;
}): React.JSX.Element {
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      style={[
        styles.projectActionButton,
        isDanger && styles.projectDangerButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <MaterialIcons
        name={icon}
        size={17}
        color={isDanger ? colors.error : colors.primary}
      />

      <Text
        style={[
          styles.projectActionButtonText,
          isDanger && styles.projectDangerButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function HomeActionButton({
  icon,
  label,
  variant,
  onPress,
  testID,
  disabled = false,
}: HomeActionButtonProps): React.JSX.Element {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        isPrimary ? styles.primaryActionButton : styles.ghostActionButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <MaterialIcons
        name={icon}
        size={18}
        color={isPrimary ? "#000000" : colors.primary}
      />

      <Text
        style={isPrimary ? styles.primaryActionText : styles.ghostActionText}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FeedbackBanner({
  feedback,
}: {
  feedback: FeedbackMessage;
}): React.JSX.Element {
  const isError = feedback.type === "error";
  const isSuccess = feedback.type === "success";
  const iconName: MaterialIconName = isError
    ? "error-outline"
    : isSuccess
      ? "check-circle"
      : "info-outline";

  return (
    <View
      style={[
        styles.feedbackBanner,
        isError && styles.feedbackError,
        isSuccess && styles.feedbackSuccess,
      ]}
      testID="home-feedback-banner"
    >
      <MaterialIcons
        name={iconName}
        size={18}
        color={
          isError ? colors.error : isSuccess ? colors.accent : colors.primary
        }
      />

      <Text style={styles.feedbackText}>{feedback.message}</Text>
    </View>
  );
}

function getProjectActionErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
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
  actionButton: {
    minHeight: 42,
    borderRadius: 999,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  primaryActionButton: {
    backgroundColor: colors.primary,
  },
  ghostActionButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#2F3B45",
  },
  primaryActionText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "900",
  },
  ghostActionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.6,
  },
  feedbackBanner: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#2F3B45",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedbackError: {
    borderColor: "rgba(255, 93, 115, 0.45)",
  },
  feedbackSuccess: {
    borderColor: "rgba(0, 255, 208, 0.45)",
  },
  feedbackText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
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
  templateCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  templateMainRow: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  templateOpenArea: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  templateIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#2F3B45",
    alignItems: "center",
    justifyContent: "center",
  },
  templateTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  cardMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
    fontWeight: "700",
  },
  projectMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#2F3B45",
    alignItems: "center",
    justifyContent: "center",
  },
  projectActions: {
    borderTopWidth: 1,
    borderTopColor: "#252B33",
    paddingTop: 12,
    gap: 10,
  },
  projectActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  projectActionButton: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#2F3B45",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  projectDangerButton: {
    borderColor: "rgba(255, 93, 115, 0.42)",
    backgroundColor: "rgba(255, 93, 115, 0.08)",
  },
  projectActionButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  projectDangerButtonText: {
    color: colors.error,
  },
  inlinePanel: {
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#2F3B45",
    padding: 12,
    gap: 10,
  },
  deletePanel: {
    borderRadius: 14,
    backgroundColor: "rgba(255, 93, 115, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 93, 115, 0.36)",
    padding: 12,
    gap: 10,
  },
  inlinePanelTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  deleteDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  projectInput: {
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2F3B45",
    backgroundColor: "#050505",
    color: colors.text,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "800",
  },
});
