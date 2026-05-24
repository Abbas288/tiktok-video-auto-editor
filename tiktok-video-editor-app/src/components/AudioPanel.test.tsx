import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { AudioPanel } from "./AudioPanel";

describe("AudioPanel", () => {
  it("mutes original audio without changing music volume", () => {
    const onChangeVolumes = jest.fn();

    const { getByTestId } = render(
      <AudioPanel
        originalVolume={0.7}
        musicVolume={0.4}
        onChangeVolumes={onChangeVolumes}
      />,
    );

    fireEvent.press(getByTestId("audio-original-mute"));

    expect(onChangeVolumes).toHaveBeenCalledWith(0, 0.4);
  });

  it("mutes background music without changing original audio volume", () => {
    const onChangeVolumes = jest.fn();

    const { getByTestId } = render(
      <AudioPanel
        originalVolume={0.7}
        musicVolume={0.4}
        onChangeVolumes={onChangeVolumes}
      />,
    );

    fireEvent.press(getByTestId("audio-music-mute"));

    expect(onChangeVolumes).toHaveBeenCalledWith(0.7, 0);
  });

  it("unmutes a muted audio source", () => {
    const onChangeVolumes = jest.fn();

    const { getByTestId } = render(
      <AudioPanel
        originalVolume={0}
        musicVolume={0.4}
        onChangeVolumes={onChangeVolumes}
      />,
    );

    fireEvent.press(getByTestId("audio-original-mute"));

    expect(onChangeVolumes).toHaveBeenCalledWith(1, 0.4);
  });
});
