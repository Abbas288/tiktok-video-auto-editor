import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../styles/theme";

export type EditorToolKey = "scene" | "text" | "filters" | "audio" | "timeline";

interface EditorToolTabsProps {
  activeTool: EditorToolKey;
  onChangeTool: (tool: EditorToolKey) => void;
}

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface EditorToolItem {
  key: EditorToolKey;
  label: string;
  icon: MaterialIconName;
}

const TOOLS: EditorToolItem[] = [
  { key: "scene", label: "Scene", icon: "video-library" },
  { key: "text", label: "Text", icon: "title" },
  { key: "filters", label: "Filters", icon: "tune" },
  { key: "audio", label: "Audio", icon: "music-note" },
  { key: "timeline", label: "Timeline", icon: "timeline" },
];

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

export function EditorToolTabs({
  activeTool,
  onChangeTool,
}: EditorToolTabsProps): React.JSX.Element {
  return (
    <View style={styles.shell}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        testID="editor-tool-tabs"
      >
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.key;

          return (
            <TouchableOpacity
              key={tool.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onChangeTool(tool.key)}
              hitSlop={HIT_SLOP}
              testID={`editor-tool-tab-${tool.key}`}
              accessibilityRole="button"
              accessibilityLabel={tool.label}
            >
              <MaterialIcons
                name={tool.icon}
                size={18}
                color={isActive ? colors.primary : colors.textSecondary}
              />

              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tool.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
  scroll: {
    width: "100%",
  },
  content: {
    minWidth: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  tab: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#262626",
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeTab: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  activeLabel: {
    color: colors.primary,
  },
});
