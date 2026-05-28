import React from "react";
import { render } from "@testing-library/react-native";
import { TextOverlayLayer } from "./TextOverlayLayer";
import { TextOverlay } from "../types/template";

const mockOverlays: TextOverlay[] = [
  {
    id: "test-1",
    text: "Jest Overlay Test",
    positionX: 0.5,
    positionY: 0.5,
    fontSizePt: 20,
    color: "#fff",
    style: "normal",
    animationIn: "none",
    startSeconds: 2.0,
    durationSeconds: 3.0,
  },
];

describe("TextOverlayLayer - Normal Flow", () => {
  it("renders text when currentTime is exactly at startSeconds", () => {
    const { getByText } = render(
      <TextOverlayLayer overlays={mockOverlays} currentTime={2.0} />,
    );

    expect(getByText("Jest Overlay Test")).toBeTruthy();
  });

  it("renders text when currentTime is within the overlay timeframe", () => {
    const { getByText } = render(
      <TextOverlayLayer overlays={mockOverlays} currentTime={3.5} />,
    );

    expect(getByText("Jest Overlay Test")).toBeTruthy();
  });

  it("does not render text when currentTime is before startSeconds", () => {
    const { queryByText } = render(
      <TextOverlayLayer overlays={mockOverlays} currentTime={1.9} />,
    );

    expect(queryByText("Jest Overlay Test")).toBeNull();
  });

  it("does not render text when currentTime is past duration bounds", () => {
    const { queryByText } = render(
      <TextOverlayLayer overlays={mockOverlays} currentTime={5.0} />,
    );

    expect(queryByText("Jest Overlay Test")).toBeNull();
  });
});

describe("TextOverlayLayer - Defect Testing & Edge Cases", () => {
  it("handles extremely long text strings safely", () => {
    const longText = "A".repeat(1000);
    const overlays: TextOverlay[] = [{ ...mockOverlays[0], text: longText }];

    const { getByTestId, getByText, queryByText } = render(
      <TextOverlayLayer overlays={overlays} currentTime={2.5} />,
    );

    expect(getByTestId("editable-overlay-test-1")).toBeTruthy();
    expect(getByText(/A{20}/)).toBeTruthy();
    expect(queryByText(longText)).toBeNull();
  });

  it("handles completely empty text strings", () => {
    const overlays: TextOverlay[] = [{ ...mockOverlays[0], text: "" }];

    const { getByTestId } = render(
      <TextOverlayLayer overlays={overlays} currentTime={2.5} />,
    );

    expect(getByTestId("editable-overlay-test-1")).toBeTruthy();
  });

  it("renders multiple overlapping overlays correctly", () => {
    const overlays: TextOverlay[] = [
      { ...mockOverlays[0], id: "1", text: "First" },
      { ...mockOverlays[0], id: "2", text: "Second" },
      { ...mockOverlays[0], id: "3", text: "Third" },
    ];

    const { getByText } = render(
      <TextOverlayLayer overlays={overlays} currentTime={2.5} />,
    );

    expect(getByText("First")).toBeTruthy();
    expect(getByText("Second")).toBeTruthy();
    expect(getByText("Third")).toBeTruthy();
  });

  it("handles emojis and unicode characters", () => {
    const overlays: TextOverlay[] = [
      { ...mockOverlays[0], text: "🐰 🦋 漢字" },
    ];

    const { getByText } = render(
      <TextOverlayLayer overlays={overlays} currentTime={2.5} />,
    );

    expect(getByText("🐰 🦋 漢字")).toBeTruthy();
  });
});
