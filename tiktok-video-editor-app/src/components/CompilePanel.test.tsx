import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { CompilePanel } from "./CompilePanel";

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

  it("renders compiling message in warning color", () => {
    const { getByTestId } = render(
      <CompilePanel
        status="compiling"
        message="Compiling video..."
        onCompile={jest.fn()}
      />,
    );

    const messageStyle = StyleSheet.flatten(
      getByTestId("compile-message").props.style,
    );

    expect(messageStyle.color).toBe("#FACC15");
  });

  it("does not render export actions when no finished video exists", () => {
    const { queryByTestId } = render(
      <CompilePanel status="idle" message={null} onCompile={jest.fn()} />,
    );

    expect(queryByTestId("compiled-output-card")).toBeNull();
    expect(queryByTestId("save-compiled-video-button")).toBeNull();
  });

  it("does not render stale export actions before a successful compile", () => {
    const { queryByTestId } = render(
      <CompilePanel
        status="idle"
        message={null}
        compiledVideoUrl="http://localhost:3030/compiled/stale.mp4"
        onCompile={jest.fn()}
      />,
    );

    expect(queryByTestId("compiled-output-card")).toBeNull();
    expect(queryByTestId("save-compiled-video-button")).toBeNull();
  });

  it("does not render export actions while compiling", () => {
    const { queryByTestId } = render(
      <CompilePanel
        status="compiling"
        message="Compiling video..."
        compiledVideoUrl="http://localhost:3030/compiled/stale.mp4"
        onCompile={jest.fn()}
      />,
    );

    expect(queryByTestId("compiled-output-card")).toBeNull();
  });

  it("renders compact export actions when a finished video exists after success", () => {
    const { getByTestId, getByText, queryByText } = render(
      <CompilePanel
        status="success"
        message="Rendered video is ready."
        compiledVideoUrl="https://example.com/compiled.mp4"
        outputKind="rendered"
        onCompile={jest.fn()}
        onSaveCompiledVideo={jest.fn()}
        onOpenCompiledVideo={jest.fn()}
      />,
    );

    expect(getByTestId("compiled-output-card")).toBeTruthy();
    expect(getByText("Ready")).toBeTruthy();
    expect(getByText("MP4")).toBeTruthy();
    expect(queryByText("Rendered video is ready.")).toBeNull();
    expect(queryByText("Final render available.")).toBeNull();
    expect(queryByText("Rendered")).toBeNull();
    expect(getByTestId("save-compiled-video-button")).toBeTruthy();
    expect(getByTestId("open-compiled-video-button")).toBeTruthy();
  });

  it("renders preview title for placeholder output", () => {
    const { getByText } = render(
      <CompilePanel
        status="success"
        message="Preview ready."
        compiledVideoUrl="https://example.com/placeholder.mp4"
        outputKind="placeholder"
        onCompile={jest.fn()}
        onSaveCompiledVideo={jest.fn()}
        onOpenCompiledVideo={jest.fn()}
      />,
    );

    expect(getByText("Preview ready")).toBeTruthy();
  });

  it("calls onSaveCompiledVideo when save button is pressed", () => {
    const onSaveCompiledVideo = jest.fn();

    const { getByTestId } = render(
      <CompilePanel
        status="success"
        message="Rendered video is ready."
        compiledVideoUrl="https://example.com/compiled.mp4"
        onCompile={jest.fn()}
        onSaveCompiledVideo={onSaveCompiledVideo}
        onOpenCompiledVideo={jest.fn()}
      />,
    );

    fireEvent.press(getByTestId("save-compiled-video-button"));

    expect(onSaveCompiledVideo).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenCompiledVideo when open button is pressed", () => {
    const onOpenCompiledVideo = jest.fn();

    const { getByTestId } = render(
      <CompilePanel
        status="success"
        message="Rendered video is ready."
        compiledVideoUrl="https://example.com/compiled.mp4"
        onCompile={jest.fn()}
        onSaveCompiledVideo={jest.fn()}
        onOpenCompiledVideo={onOpenCompiledVideo}
      />,
    );

    fireEvent.press(getByTestId("open-compiled-video-button"));

    expect(onOpenCompiledVideo).toHaveBeenCalledTimes(1);
  });

  it("blocks save attempts while saving", () => {
    const onSaveCompiledVideo = jest.fn();

    const { getByTestId } = render(
      <CompilePanel
        status="success"
        message="Rendered video is ready."
        compiledVideoUrl="https://example.com/compiled.mp4"
        saveStatus="saving"
        onCompile={jest.fn()}
        onSaveCompiledVideo={onSaveCompiledVideo}
        onOpenCompiledVideo={jest.fn()}
      />,
    );

    fireEvent.press(getByTestId("save-compiled-video-button"));

    expect(onSaveCompiledVideo).not.toHaveBeenCalled();
  });

  it("renders save feedback", () => {
    const { getByText } = render(
      <CompilePanel
        status="success"
        message="Rendered video is ready."
        compiledVideoUrl="https://example.com/compiled.mp4"
        saveStatus="success"
        saveMessage="Saved to gallery."
        onCompile={jest.fn()}
        onSaveCompiledVideo={jest.fn()}
        onOpenCompiledVideo={jest.fn()}
      />,
    );

    expect(getByText("Saved to gallery.")).toBeTruthy();
  });

  it("renders web download feedback", () => {
    const { getByText } = render(
      <CompilePanel
        status="success"
        message="Rendered video is ready."
        compiledVideoUrl="https://example.com/compiled.mp4"
        saveStatus="success"
        saveMessage="Download started."
        onCompile={jest.fn()}
        onSaveCompiledVideo={jest.fn()}
        onOpenCompiledVideo={jest.fn()}
      />,
    );

    expect(getByText("Download started.")).toBeTruthy();
  });

  it("renders save error feedback even when output actions are hidden", () => {
    const { getByText } = render(
      <CompilePanel
        status="error"
        message="Compile failed."
        saveStatus="error"
        saveMessage="The finished video is no longer available. Run compile again."
        onCompile={jest.fn()}
      />,
    );

    expect(
      getByText(
        "The finished video is no longer available. Run compile again.",
      ),
    ).toBeTruthy();
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
