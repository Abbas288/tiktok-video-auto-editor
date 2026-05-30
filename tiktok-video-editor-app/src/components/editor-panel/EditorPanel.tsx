import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../styles/theme";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export interface EditorPanelProps {
  title: string;
  subtitle?: string | null;
  actionLabel?: string;
  actionIcon?: MaterialIconName;
  actionAccessibilityLabel?: string;
  actionTestID?: string;
  onAction?: () => void;
  testID?: string;
  children: ReactNode;
}

export function EditorPanel({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  actionAccessibilityLabel,
  actionTestID,
  onAction,
  testID,
  children,
}: EditorPanelProps): React.JSX.Element {
  const shouldRenderAction = Boolean(onAction && (actionLabel || actionIcon));

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

        {shouldRenderAction ? (
          <TouchableOpacity
            style={
              actionIcon ? styles.iconActionButton : styles.textActionButton
            }
            onPress={onAction}
            hitSlop={HIT_SLOP}
            testID={actionTestID}
            accessibilityRole="button"
            accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
          >
            {actionIcon ? (
              <MaterialIcons
                name={actionIcon}
                size={19}
                color={colors.primary}
              />
            ) : null}

            {actionLabel ? (
              <Text style={styles.actionText}>{actionLabel}</Text>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>

      {children}
    </View>
  );
}

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  textActionButton: {
    minHeight: 32,
    justifyContent: "center",
  },
  iconActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#2F3B45",
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});
