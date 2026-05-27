import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { CompilePanel } from "./CompilePanel";

jest.mock("expo-video", () => ({
  VideoView: "VideoView",
  useVideoPlayer: jest.fn(() => ({
    loop: false,
  })),
}));

describe("CompilePanel", () => {
  it("renders compile button", () => {
    const { getByTestId } = render(
      <CompilePanel status="idle" message={null} onCompile={jest.fn()} />,
    );

    expect(getByTestId("compile-button")).toBeTruthy();
  });

  it("calls onCompile when compile button is pressed", () => {
    const onCompile = jest.fn();

    const { getByTestId } = render(
      <CompilePanel status="idle" message={null} onCompile={onCompile} />,
    );

    fireEvent.press(getByTestId("compile-button"));

    expect(onCompile).toHaveBeenCalledTimes(1);
  });

  it("blocks repeated compile attempts while compiling", () => {
    const onCompile = jest.fn();

    const { getByTestId } = render(
      <CompilePanel
        status="compiling"
        message="Compiling video..."
        onCompile={onCompile}
      />,
    );

    fireEvent.press(getByTestId("compile-button"));

    expect(onCompile).not.toHaveBeenCalled();
  });

  it("renders compiled video preview when compile result exists", () => {
    const { getByTestId } = render(
      <CompilePanel
        status="success"
        message="Compile finished."
        compiledVideoUrl="https://example.com/compiled.mp4"
        onCompile={jest.fn()}
      />,
    );

    expect(getByTestId("compiled-video-preview")).toBeTruthy();
  });

  it("renders error message when compile fails", () => {
    const { getByText } = render(
      <CompilePanel
        status="error"
        message="Compile failed."
        onCompile={jest.fn()}
      />,
    );

    expect(getByText("Compile failed.")).toBeTruthy();
  });
});
