import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../styles/theme";

export type MaterialIconName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

export interface HomeActionButtonProps {
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

/**
 * Renders a primary or secondary action button on the project overview.
 *
 * @param props Button icon, label and interaction state.
 * @returns Project overview action button.
 */
export function HomeActionButton({
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

const styles = StyleSheet.create({
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
});
