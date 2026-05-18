import {
  calculateDraggedOverlayPosition,
  clamp01,
  clampTopLeft,
  normalizedPositionToTopLeft,
  topLeftToNormalizedPosition,
} from "./overlayPosition";

describe("overlayPosition", () => {
  it("converts pixel drag delta into normalized overlay coordinates", () => {
    const result = calculateDraggedOverlayPosition(
      {
        positionX: 0.5,
        positionY: 0.5,
      },
      72,
      -40.5,
      {
        width: 720,
        height: 405,
      },
    );

    expect(result.positionX).toBeCloseTo(0.6);
    expect(result.positionY).toBeCloseTo(0.4);
  });

  it("clamps dragged position to normalized coordinate bounds", () => {
    const result = calculateDraggedOverlayPosition(
      {
        positionX: 0.95,
        positionY: 0.05,
      },
      500,
      -500,
      {
        width: 720,
        height: 405,
      },
    );

    expect(result.positionX).toBe(1);
    expect(result.positionY).toBe(0);
  });

  it("returns safe values when media size is invalid", () => {
    const result = calculateDraggedOverlayPosition(
      {
        positionX: 2,
        positionY: -1,
      },
      100,
      100,
      {
        width: 0,
        height: 0,
      },
    );

    expect(result.positionX).toBe(1);
    expect(result.positionY).toBe(0);
  });

  it("converts normalized center position into top-left pixels", () => {
    const result = normalizedPositionToTopLeft(
      {
        positionX: 0.5,
        positionY: 0.5,
      },
      {
        width: 100,
        height: 50,
      },
      {
        width: 800,
        height: 400,
      },
    );

    expect(result).toEqual({
      x: 350,
      y: 175,
    });
  });

  it("converts top-left pixels into normalized center position", () => {
    const result = topLeftToNormalizedPosition(
      {
        x: 350,
        y: 175,
      },
      {
        width: 100,
        height: 50,
      },
      {
        width: 800,
        height: 400,
      },
    );

    expect(result.positionX).toBeCloseTo(0.5);
    expect(result.positionY).toBeCloseTo(0.5);
  });

  it("clamps top-left position so overlay stays inside media", () => {
    const result = clampTopLeft(
      {
        x: 900,
        y: -20,
      },
      {
        width: 100,
        height: 50,
      },
      {
        width: 800,
        height: 400,
      },
    );

    expect(result).toEqual({
      x: 700,
      y: 0,
    });
  });

  it("clamps invalid normalized values to zero", () => {
    expect(clamp01(Number.NaN)).toBe(0);
    expect(clamp01(Number.POSITIVE_INFINITY)).toBe(0);
  });
});
