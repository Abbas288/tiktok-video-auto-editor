import React, { useCallback } from "react";
import { StyleSheet, Text } from "react-native";
import {
  formatVolumePercent,
  stepVolume,
  toggleMute,
  VOLUME_STEP,
} from "../domain/audio/volume";
import { colors } from "../styles/theme";
import { ControlRow } from "./editor-panel/ControlRow";
import { EditorPanel } from "./editor-panel/EditorPanel";
import { PanelButton } from "./editor-panel/PanelButton";

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
    <EditorPanel title="Audio Levels" testID="audio-effects-panel">
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
    </EditorPanel>
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
    <ControlRow label={label} value={formatVolumePercent(value)}>
      <PanelButton
        label="-"
        testID={`${testIDPrefix}-decrease`}
        onPress={() => onChange(stepVolume(value, -VOLUME_STEP))}
      />

      <PanelButton
        label="+"
        testID={`${testIDPrefix}-increase`}
        onPress={() => onChange(stepVolume(value, VOLUME_STEP))}
      />

      <PanelButton
        label={isMuted ? "Unmute" : "Mute"}
        testID={`${testIDPrefix}-mute`}
        isActive={isMuted}
        onPress={() => onChange(toggleMute(value))}
      />
    </ControlRow>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
