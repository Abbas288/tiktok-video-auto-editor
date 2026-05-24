import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../styles/theme";

export interface EditorPanelProps {
  title: string;
  subtitle?: string | null;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
  children: ReactNode;
}

/**
 * Renders a reusable editor panel shell with optional subtitle and action.
 *
 * @param props Panel heading, optional action and panel content.
 * @returns Editor panel element.
 */
export function EditorPanel({
  title,
  subtitle,
  actionLabel,
  onAction,
  testID,
  children,
}: EditorPanelProps): React.JSX.Element {
  return (
    <View style={styles.panel} testID={testID}>
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {actionLabel && onAction ? (
          <TouchableOpacity onPress={onAction}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleColumn: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  actionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
