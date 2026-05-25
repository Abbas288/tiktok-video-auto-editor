import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { TransitionPickerPanel } from "./TransitionPickerPanel";
import { Scene } from "../types/template";

const scene: Scene = {
  id: "scene-1",
  orderIndex: 0,
  startSeconds: 0,
  durationSeconds: 3,
  instruction: "First scene",
  textOverlays: [],
  effects: [],
};

describe("TransitionPickerPanel", () => {
  it("renders transition options", () => {
    const { getByText } = render(
      <TransitionPickerPanel
        scene={scene}
        selectedTransition={{ type: "cut", durationSeconds: 0 }}
        onChangeTransition={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(getByText("Cut")).toBeTruthy();
    expect(getByText("Fade")).toBeTruthy();
    expect(getByText("Slide")).toBeTruthy();
  });

  it("selects fade transition", () => {
    const onChangeTransition = jest.fn();

    const { getByTestId } = render(
      <TransitionPickerPanel
        scene={scene}
        selectedTransition={{ type: "cut", durationSeconds: 0 }}
        onChangeTransition={onChangeTransition}
        onClose={jest.fn()}
      />,
    );

    fireEvent.press(getByTestId("transition-option-fade"));

    expect(onChangeTransition).toHaveBeenCalledWith("fade");
  });

  it("selects slide transition", () => {
    const onChangeTransition = jest.fn();

    const { getByTestId } = render(
      <TransitionPickerPanel
        scene={scene}
        selectedTransition={{ type: "fade", durationSeconds: 0.3 }}
        onChangeTransition={onChangeTransition}
        onClose={jest.fn()}
      />,
    );

    fireEvent.press(getByTestId("transition-option-slide"));

    expect(onChangeTransition).toHaveBeenCalledWith("slide");
  });

  it("returns null when no scene is selected", () => {
    const { queryByTestId } = render(
      <TransitionPickerPanel
        scene={null}
        selectedTransition={null}
        onChangeTransition={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(queryByTestId("transition-picker-panel")).toBeNull();
  });
});
