import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../styles/theme";
import { Template } from "../../types/template";
import { MaterialIconName } from "./HomeActionButton";

export interface ProjectCardProps {
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

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

/**
 * Renders one project card with open, rename and delete actions.
 *
 * @param props Project data and action handlers.
 * @returns Project card element.
 */
export function ProjectCard({
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

const styles = StyleSheet.create({
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
  disabledButton: {
    opacity: 0.6,
  },
});
