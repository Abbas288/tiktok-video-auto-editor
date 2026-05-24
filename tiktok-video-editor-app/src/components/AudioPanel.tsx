import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  formatVolumePercent,
  stepVolume,
  toggleMute,
  VOLUME_STEP,
} from "../domain/audio/volume";
import { colors } from "../styles/theme";

/**
 * Properties required for the AudioPanel component.
 */
export interface AudioPanelProps {
  originalVolume: number;
  musicVolume: number | null;
  onChangeVolumes: (originalVolume: number, musicVolume?: number) => void;
}

/**
 * Renders editing controls for original audio and background music.
 *
 * @param props Component properties.
 * @returns Audio panel element.
 */
export function AudioPanel({
  originalVolume,
  musicVolume,
  onChangeVolumes,
}: AudioPanelProps): React.JSX.Element {
  const updateOriginal = useCallback(
    (newValue: number): void => {
      onChangeVolumes(newValue, musicVolume ?? undefined);
    },
    [musicVolume, onChangeVolumes],
  );

  const updateMusic = useCallback(
    (newValue: number): void => {
      onChangeVolumes(originalVolume, newValue);
    },
    [originalVolume, onChangeVolumes],
  );

  return (
    <View style={styles.panel} testID="audio-effects-panel">
      <Text style={styles.title}>Audio Levels</Text>

      <VolumeControlRow
        label="Original Audio"
        value={originalVolume}
        testIDPrefix="audio-original"
        onChange={updateOriginal}
      />

      {musicVolume !== null ? (
        <VolumeControlRow
          label="Background Music"
          value={musicVolume}
          testIDPrefix="audio-music"
          onChange={updateMusic}
        />
      ) : (
        <Text style={styles.emptyText}>
          No background music in this template.
        </Text>
      )}
    </View>
  );
}

interface VolumeControlRowProps {
  label: string;
  value: number;
  testIDPrefix: string;
  onChange: (value: number) => void;
}

function VolumeControlRow({
  label,
  value,
  testIDPrefix,
  onChange,
}: VolumeControlRowProps): React.JSX.Element {
  const isMuted = value === 0;

  return (
    <View style={styles.effectRow}>
      <View style={styles.effectLabelColumn}>
        <Text style={styles.effectLabel}>{label}</Text>
        <Text style={styles.effectValue}>{formatVolumePercent(value)}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.effectButton}
          testID={`${testIDPrefix}-decrease`}
          onPress={() => onChange(stepVolume(value, -VOLUME_STEP))}
        >
          <Text style={styles.effectButtonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.effectButton}
          testID={`${testIDPrefix}-increase`}
          onPress={() => onChange(stepVolume(value, VOLUME_STEP))}
        >
          <Text style={styles.effectButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.effectButton, isMuted && styles.activeButton]}
          testID={`${testIDPrefix}-mute`}
          onPress={() => onChange(toggleMute(value))}
        >
          <Text style={styles.effectButtonText}>
            {isMuted ? "Unmute" : "Mute"}
          </Text>
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
    gap: 14,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  effectRow: {
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
  effectLabelColumn: {
    flex: 1,
  },
  effectLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  effectValue: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  effectButton: {
    minHeight: 34,
    minWidth: 44,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  activeButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  effectButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
