import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  getTransitionLabel,
  TRANSITION_TYPES,
} from "../domain/video/transitions";
import { colors } from "../styles/theme";
import { Scene, Transition } from "../types/template";

export interface TransitionPickerPanelProps {
  scene: Scene | null;
  selectedTransition: Transition | null;
  onChangeTransition: (transitionType: Transition["type"]) => void;
  onClose: () => void;
}

/**
 * Renders transition choices for the selected timeline transition slot.
 *
 * @param props Selected scene, current transition and handlers.
 * @returns Transition picker panel, or null when no transition slot is selected.
 */
export function TransitionPickerPanel({
  scene,
  selectedTransition,
  onChangeTransition,
  onClose,
}: TransitionPickerPanelProps): React.JSX.Element | null {
  if (!scene || !selectedTransition) {
    return null;
  }

  return (
    <View style={styles.panel} testID="transition-picker-panel">
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Scene transition</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            After: {scene.instruction || scene.id}
          </Text>
        </View>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        Choose how this scene should transition into the next one.
      </Text>

      <View style={styles.optionRow}>
        {TRANSITION_TYPES.map((transitionType) => {
          const isSelected = selectedTransition.type === transitionType;

          return (
            <TouchableOpacity
              key={transitionType}
              style={[styles.optionButton, isSelected && styles.activeOption]}
              onPress={() => onChangeTransition(transitionType)}
              testID={`transition-option-${transitionType}`}
            >
              <Text style={styles.optionText}>
                {getTransitionLabel(transitionType)}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleColumn: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  closeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    minHeight: 36,
    minWidth: 72,
    borderRadius: 999,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeOption: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
  },
  optionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
