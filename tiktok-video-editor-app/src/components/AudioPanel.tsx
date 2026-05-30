import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  formatVolumePercent,
  stepVolume,
  toggleMute,
  VOLUME_STEP,
} from "../domain/audio/volume";
import { colors } from "../styles/theme";
import { EditorPanel } from "./editor-panel/EditorPanel";

export interface AudioPanelProps {
  originalVolume: number;
  musicVolume: number | null;
  onChangeVolumes: (originalVolume: number, musicVolume?: number) => void;
}

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

const HIT_SLOP = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

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
    <EditorPanel title="Audio" testID="audio-effects-panel">
      <View style={styles.compactGrid}>
        <VolumeControlRow
          icon="volume-up"
          label="Original"
          value={originalVolume}
          testIDPrefix="audio-original"
          onChange={updateOriginal}
        />

        {musicVolume !== null ? (
          <VolumeControlRow
            icon="music-note"
            label="Music"
            value={musicVolume}
            testIDPrefix="audio-music"
            onChange={updateMusic}
          />
        ) : (
          <Text style={styles.emptyText}>No music.</Text>
        )}
      </View>
    </EditorPanel>
  );
}

interface VolumeControlRowProps {
  icon: MaterialIconName;
  label: string;
  value: number;
  testIDPrefix: string;
  onChange: (value: number) => void;
}

function VolumeControlRow({
  icon,
  label,
  value,
  testIDPrefix,
  onChange,
}: VolumeControlRowProps): React.JSX.Element {
  const isMuted = value === 0;

  return (
    <View style={styles.volumeCard}>
      <View style={styles.volumeHeader}>
        <MaterialIcons name={icon} size={17} color={colors.primary} />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{formatVolumePercent(value)}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          testID={`${testIDPrefix}-decrease`}
          onPress={() => onChange(stepVolume(value, -VOLUME_STEP))}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label} volume`}
        >
          <MaterialIcons name="remove" size={18} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          testID={`${testIDPrefix}-increase`}
          onPress={() => onChange(stepVolume(value, VOLUME_STEP))}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label} volume`}
        >
          <MaterialIcons name="add" size={18} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, isMuted && styles.activeButton]}
          testID={`${testIDPrefix}-mute`}
          onPress={() => onChange(toggleMute(value))}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={isMuted ? `Unmute ${label}` : `Mute ${label}`}
        >
          <MaterialIcons
            name={isMuted ? "volume-off" : "volume-up"}
            size={18}
            color={isMuted ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  volumeCard: {
    flexGrow: 1,
    flexBasis: 180,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 10,
    gap: 8,
  },
  volumeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  value: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    flex: 1,
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
