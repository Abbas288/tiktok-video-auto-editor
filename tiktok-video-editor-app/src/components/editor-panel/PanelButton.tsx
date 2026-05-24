import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../styles/theme";

export interface PanelButtonProps {
  label: string;
  onPress: () => void;
  testID?: string;
  isActive?: boolean;
  minWidth?: number;
}

/**
 * Renders a reusable rounded button used by editor panels.
 *
 * @param props Button label, press handler and optional visual state.
 * @returns Editor panel button element.
 */
export function PanelButton({
  label,
  onPress,
  testID,
  isActive = false,
  minWidth = 44,
}: PanelButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, { minWidth }, isActive && styles.activeButton]}
      onPress={onPress}
      testID={testID}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  activeButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
