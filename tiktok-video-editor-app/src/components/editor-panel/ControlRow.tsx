import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../styles/theme";

export interface ControlRowProps {
  label: string;
  value?: string;
  children: ReactNode;
}

/**
 * Renders a reusable editor control row with label, value and controls.
 *
 * @param props Row label, optional value and control elements.
 * @returns Editor control row element.
 */
export function ControlRow({
  label,
  value,
  children,
}: ControlRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.labelColumn}>
        <Text style={styles.label}>{label}</Text>
        {value ? <Text style={styles.value}>{value}</Text> : null}
      </View>

      <View style={styles.controls}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  labelColumn: {
    flex: 1,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  value: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
});
