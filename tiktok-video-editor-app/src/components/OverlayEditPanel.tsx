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
import { ControlRow } from "./editor-panel/ControlRow";
import { EditorPanel } from "./editor-panel/EditorPanel";
import { PanelButton } from "./editor-panel/PanelButton";

export interface OverlayEditPanelProps {
  overlay: TextOverlay | null;
  onChange: (patch: TextOverlayUpdate) => void;
  onClose: () => void;
}

const COLOR_OPTIONS = ["#00D6F9", "#FFFFFF", "#FF0000", "#00FF00", "#FFD400"];
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 96;
const FONT_SIZE_STEP = 2;

/**
 * Renders editing controls for the selected text overlay.
 *
 * @param props Selected overlay and edit handlers.
 * @returns Overlay editing panel, or null when no overlay is selected.
 */
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

      <View style={styles.fieldGroup}>
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
              testID={`overlay-color-${color}`}
            />
          ))}
        </View>
      </View>

      <ControlRow label="Font size" value={`${overlay.fontSizePt} pt`}>
        <PanelButton label="Smaller" minWidth={72} onPress={decreaseFontSize} />

        <PanelButton label="Larger" minWidth={72} onPress={increaseFontSize} />
      </ControlRow>
    </EditorPanel>
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
  fieldGroup: {
    gap: 10,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  colorRow: {
    flexDirection: "row",
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
});
