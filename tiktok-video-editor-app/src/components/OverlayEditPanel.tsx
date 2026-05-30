import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TextOverlayUpdate } from "../store/useEditSession";
import { colors } from "../styles/theme";
import { TextOverlay } from "../types/template";
import { EditorPanel } from "./editor-panel/EditorPanel";

export interface OverlayEditPanelProps {
  overlay: TextOverlay | null;
  onChange: (patch: TextOverlayUpdate) => void;
  onClose: () => void;
}

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

const COLOR_OPTIONS = ["#00D6F9", "#FFFFFF", "#FF0000", "#00FF00", "#FFD400"];
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 96;
const FONT_SIZE_STEP = 2;

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

export function OverlayEditPanel({
  overlay,
  onChange,
  onClose,
}: OverlayEditPanelProps): React.JSX.Element | null {
  const decreaseFontSize = useCallback((): void => {
    if (!overlay) {
      return;
    }

    onChange({
      fontSizePt: Math.max(MIN_FONT_SIZE, overlay.fontSizePt - FONT_SIZE_STEP),
    });
  }, [onChange, overlay]);

  const increaseFontSize = useCallback((): void => {
    if (!overlay) {
      return;
    }

    onChange({
      fontSizePt: Math.min(MAX_FONT_SIZE, overlay.fontSizePt + FONT_SIZE_STEP),
    });
  }, [onChange, overlay]);

  if (!overlay) {
    return null;
  }

  return (
    <EditorPanel
      title="Edit text overlay"
      actionLabel="Close"
      onAction={onClose}
      testID="overlay-edit-panel"
    >
      <TextInput
        value={overlay.text}
        onChangeText={(text) => onChange({ text })}
        placeholder="Overlay text"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        testID="overlay-text-input"
      />

      <View style={styles.controlsRow}>
        <View style={styles.colorGroup}>
          <Text style={styles.label}>Color</Text>

          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  overlay.color === color && styles.selectedColorButton,
                ]}
                onPress={() => onChange({ color })}
                hitSlop={HIT_SLOP}
                testID={`overlay-color-${color}`}
                accessibilityRole="button"
                accessibilityLabel={`Set text color ${color}`}
              />
            ))}
          </View>
        </View>

        <View style={styles.fontGroup}>
          <Text style={styles.label}>Font size</Text>

          <View style={styles.fontControl}>
            <IconButton
              icon="remove"
              onPress={decreaseFontSize}
              testID="overlay-font-decrease"
              accessibilityLabel="Decrease font size"
            />

            <Text style={styles.fontValue}>{overlay.fontSizePt} pt</Text>

            <IconButton
              icon="add"
              onPress={increaseFontSize}
              testID="overlay-font-increase"
              accessibilityLabel="Increase font size"
            />
          </View>
        </View>
      </View>
    </EditorPanel>
  );
}

interface IconButtonProps {
  icon: MaterialIconName;
  onPress: () => void;
  testID: string;
  accessibilityLabel: string;
}

function IconButton({
  icon,
  onPress,
  testID,
  accessibilityLabel,
}: IconButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <MaterialIcons name={icon} size={18} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: colors.background,
  },
  controlsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-end",
  },
  colorGroup: {
    flexGrow: 1,
    gap: 9,
    minWidth: 220,
  },
  fontGroup: {
    gap: 9,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColorButton: {
    borderColor: colors.primary,
  },
  fontControl: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  fontValue: {
    minWidth: 46,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
});
