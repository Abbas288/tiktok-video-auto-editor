import React from "react";
import { render } from "@testing-library/react-native";
import { TransitionPreviewLayer } from "./TransitionPreviewLayer";
import { MediaRect } from "../../domain/video/videoCanvas";

jest.mock("expo-video", () => ({
  VideoView: "VideoView",
}));

const mediaRect: MediaRect = {
  left: 0,
  top: 0,
  width: 800,
  height: 450,
};

describe("TransitionPreviewLayer", () => {
  it("renders null when no transition simulation is active", () => {
    const { queryByTestId } = render(
      <TransitionPreviewLayer
        simulation={null}
        mediaRect={mediaRect}
        previewPlayer={null}
      />,
    );

    expect(queryByTestId("transition-preview-layer")).toBeNull();
  });

  it("renders fade preview layer", () => {
    const { getByTestId } = render(
      <TransitionPreviewLayer
        mediaRect={mediaRect}
        previewPlayer={null}
        simulation={{
          type: "fade",
          direction: "left",
          progress: 0.5,
          easedProgress: 0.5,
          intensity: 1,
          previewTimeSeconds: 3.2,
          transitionKey: "scene-1:scene-2:fade",
        }}
      />,
    );

    expect(getByTestId("transition-preview-layer")).toBeTruthy();
    expect(getByTestId("transition-preview-fade")).toBeTruthy();
  });

  it("renders slide preview layer", () => {
    const { getByTestId } = render(
      <TransitionPreviewLayer
        mediaRect={mediaRect}
        previewPlayer={null}
        simulation={{
          type: "slide",
          direction: "left",
          progress: 0.5,
          easedProgress: 0.5,
          intensity: 1,
          previewTimeSeconds: 3.2,
          transitionKey: "scene-1:scene-2:slide",
        }}
      />,
    );

    expect(getByTestId("transition-preview-layer")).toBeTruthy();
    expect(getByTestId("transition-preview-slide")).toBeTruthy();
  });

  it("renders vertical slide preview for up direction", () => {
    const { getByTestId } = render(
      <TransitionPreviewLayer
        mediaRect={mediaRect}
        previewPlayer={null}
        simulation={{
          type: "slide",
          direction: "up",
          progress: 0.5,
          easedProgress: 0.5,
          intensity: 1,
          previewTimeSeconds: 3.2,
          transitionKey: "scene-1:scene-2:slide",
        }}
      />,
    );

    expect(getByTestId("transition-preview-slide")).toBeTruthy();
  });
});
