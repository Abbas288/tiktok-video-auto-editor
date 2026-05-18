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
    <View style={styles.panel} testID="overlay-edit-panel">
      <View style={styles.headerRow}>
        <Text style={styles.title}>Edit text overlay</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={overlay.text}
        onChangeText={(text) => onChange({ text })}
        placeholder="Overlay text"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        testID="overlay-text-input"
      />

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

      <Text style={styles.label}>Font size: {overlay.fontSizePt} pt</Text>
      <View style={styles.sizeRow}>
        <TouchableOpacity style={styles.sizeButton} onPress={decreaseFontSize}>
          <Text style={styles.sizeButtonText}>Smaller</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sizeButton} onPress={increaseFontSize}>
          <Text style={styles.sizeButtonText}>Larger</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  closeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: colors.background,
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
  sizeRow: {
    flexDirection: "row",
    gap: 10,
  },
  sizeButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
