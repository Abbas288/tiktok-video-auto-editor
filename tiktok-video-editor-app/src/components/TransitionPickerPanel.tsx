import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

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

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={HIT_SLOP}
          testID="transition-picker-close"
          accessibilityRole="button"
          accessibilityLabel="Close transition picker"
        >
          <MaterialIcons name="close" size={19} color={colors.primary} />
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
              accessibilityRole="button"
              accessibilityLabel={`Select ${getTransitionLabel(
                transitionType,
              )} transition`}
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
    gap: 12,
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
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
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#2F3B45",
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
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
