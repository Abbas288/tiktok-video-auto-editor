import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../styles/theme";

interface EditorHeaderProps {
  title: string;
  onGoBack: () => void;
}

const HIT_SLOP = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

export function EditorHeader({
  title,
  onGoBack,
}: EditorHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <View style={styles.headerShell}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          testID="editor-back-button"
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  headerShell: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    minHeight: 82,
    paddingHorizontal: 14,
    paddingTop: 34,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "900",
  },
});
