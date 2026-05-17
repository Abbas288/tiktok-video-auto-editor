import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "../styles/theme";

interface VideoErrorStateProps {
  message?: string;
}

export function VideoErrorState({
  message = "Unable to load video (broken link)",
}: VideoErrorStateProps): React.JSX.Element {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface || "#1a1a1a",
    borderWidth: 1,
    borderColor: colors.error || "#FF5D73",
  },
  errorText: {
    color: colors.error || "#FF5D73",
    fontSize: 16,
    fontWeight: "bold",
  },
});
