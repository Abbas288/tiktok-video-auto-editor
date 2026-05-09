import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

interface EditorHeaderProps {
  title: string;
  onGoBack: () => void;
}

/**
 * Renders the top navigation header for the editor screen.
 */
export function EditorHeader({
  title,
  onGoBack,
}: EditorHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onGoBack}>
        <Text style={styles.link}>← Go Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    color: colors.text || "#000",
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
  },
});
