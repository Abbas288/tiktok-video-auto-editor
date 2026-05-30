import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const handleOpenProject = useCallback(
    (id: string): void => {
      router.push(`/editor/${id}`);
    },
    [router],
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
  }, [loadTemplates, router]);

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

  return (
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
        <Text style={styles.sectionTitle}>Available templates</Text>
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
          <Text style={styles.emptyTitle}>No templates yet.</Text>
          <Text style={styles.emptyText}>
            Create a project and import a JSON template to get started.
          </Text>
        </View>
      ) : (
        <View style={styles.templateList}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleOpenProject(template.id)}
              testID={`template-card-${template.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Open ${template.title}`}
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

              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

interface HomeActionButtonProps {
  icon: MaterialIconName;
  label: string;
  variant: "primary" | "ghost";
  onPress: () => void;
  testID: string;
  disabled?: boolean;
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

const styles = StyleSheet.create({
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
    minHeight: 78,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
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
});
