import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { createGoogleAiStudioTemplatePrompt } from "../domain/template/templateAiPrompt";
import {
  getTemplateImportErrorMessage,
  parseTemplateJsonText,
  pickTemplateFile,
} from "../infrastructure/templateImportService";
import { templateRepository } from "../infrastructure/templateRepository";
import { Template } from "../types/template";

export type ProjectFeedbackType = "success" | "error" | "info";

export interface ProjectFeedbackMessage {
  type: ProjectFeedbackType;
  message: string;
}

export interface ProjectOverviewController {
  templates: Template[];
  isLoading: boolean;
  isImporting: boolean;
  isCreatePanelOpen: boolean;
  feedback: ProjectFeedbackMessage | null;
  expandedProjectId: string | null;
  renamingProjectId: string | null;
  deletingProjectId: string | null;
  renameDraft: string;
  busyProjectId: string | null;
  setRenameDraft: (value: string) => void;
  toggleCreatePanel: () => void;
  handleOpenProject: (id: string) => Promise<void>;
  handleImportTemplate: () => Promise<void>;
  handleCopyPrompt: () => Promise<void>;
  handleToggleActions: (id: string) => void;
  handleStartRename: (template: Template) => void;
  handleCancelRename: () => void;
  handleSaveRename: (id: string) => Promise<void>;
  handleStartDelete: (template: Template) => void;
  handleCancelDelete: () => void;
  handleConfirmDelete: (template: Template) => Promise<void>;
}

/**
 * Coordinates project overview state and project actions.
 *
 * @returns Controller used by the project overview screen.
 */
export function useProjectOverviewController(): ProjectOverviewController {
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<ProjectFeedbackMessage | null>(null);
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

  const toggleCreatePanel = useCallback((): void => {
    setIsCreatePanelOpen((currentValue) => !currentValue);
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

  return {
    templates,
    isLoading,
    isImporting,
    isCreatePanelOpen,
    feedback,
    expandedProjectId,
    renamingProjectId,
    deletingProjectId,
    renameDraft,
    busyProjectId,
    setRenameDraft,
    toggleCreatePanel,
    handleOpenProject,
    handleImportTemplate,
    handleCopyPrompt,
    handleToggleActions,
    handleStartRename,
    handleCancelRename,
    handleSaveRename,
    handleStartDelete,
    handleCancelDelete,
    handleConfirmDelete,
  };
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
