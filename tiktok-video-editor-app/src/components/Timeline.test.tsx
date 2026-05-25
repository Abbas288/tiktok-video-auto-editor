import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Timeline } from "./Timeline";
import { Scene } from "../types/template";

const scenes: Scene[] = [
  {
    id: "scene-1",
    orderIndex: 0,
    startSeconds: 0,
    durationSeconds: 3,
    instruction: "First scene",
    textOverlays: [],
    effects: [],
  },
  {
    id: "scene-2",
    orderIndex: 1,
    startSeconds: 3,
    durationSeconds: 4,
    instruction: "Second scene",
    textOverlays: [],
    effects: [],
  },
];

describe("Timeline transitions", () => {
  it("renders a transition slot between scenes", () => {
    const { getByTestId } = render(
      <Timeline
        scenes={scenes}
        activeSceneId="scene-1"
        onSelectScene={jest.fn()}
        onSelectTransition={jest.fn()}
      />,
    );

    expect(getByTestId("transition-slot-scene-1")).toBeTruthy();
  });

  it("calls transition selection when transition slot is pressed", () => {
    const onSelectTransition = jest.fn();

    const { getByTestId } = render(
      <Timeline
        scenes={scenes}
        activeSceneId="scene-1"
        onSelectScene={jest.fn()}
        onSelectTransition={onSelectTransition}
      />,
    );

    fireEvent.press(getByTestId("transition-slot-scene-1"));

    expect(onSelectTransition).toHaveBeenCalledWith("scene-1");
  });

  it("shows cut when no transition is explicitly selected", () => {
    const { getByText } = render(
      <Timeline
        scenes={scenes}
        activeSceneId="scene-1"
        onSelectScene={jest.fn()}
        onSelectTransition={jest.fn()}
      />,
    );

    expect(getByText("Cut")).toBeTruthy();
  });

  it("shows saved transition label", () => {
    const { getByText } = render(
      <Timeline
        scenes={[
          {
            ...scenes[0],
            transition: {
              type: "fade",
              durationSeconds: 0.3,
            },
          },
          scenes[1],
        ]}
        activeSceneId="scene-1"
        onSelectScene={jest.fn()}
        onSelectTransition={jest.fn()}
      />,
    );

    expect(getByText("Fade")).toBeTruthy();
  });
});
