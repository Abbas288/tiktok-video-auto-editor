import {
  clampPan,
  getZoomPanBounds,
  panToZoomFocus,
  zoomFocusToPan,
} from "./zoomPan";
import { SceneFilterValues } from "./sceneEffects";
import { MediaRect } from "./videoCanvas";

const mediaRect: MediaRect = {
  left: 0,
  top: 0,
  width: 800,
  height: 400,
};

/**
 * Creates a complete scene filter fixture for zoom pan tests.
 *
 * @param overrides Filter values to override.
 * @returns Scene filter values.
 */
function createFilters(
  overrides: Partial<SceneFilterValues> = {},
): SceneFilterValues {
  return {
    brightness: 1,
    contrast: 1,
    zoom: 1.5,
    zoomPositionX: 0.5,
    zoomPositionY: 0.5,
    ...overrides,
  };
}

describe("zoomPan", () => {
  it("calculates pan bounds from zoom and media size", () => {
    expect(getZoomPanBounds(mediaRect, 1.5)).toEqual({
      maxX: 200,
      maxY: 100,
    });
  });

  it("returns zero bounds when zoom is 1", () => {
    expect(getZoomPanBounds(mediaRect, 1)).toEqual({
      maxX: 0,
      maxY: 0,
    });
  });

  it("converts center zoom focus into zero pan", () => {
    const bounds = getZoomPanBounds(mediaRect, 1.5);

    expect(zoomFocusToPan(createFilters(), bounds)).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("converts right-bottom focus into negative pan", () => {
    const bounds = getZoomPanBounds(mediaRect, 1.5);

    expect(
      zoomFocusToPan(
        createFilters({
          zoomPositionX: 1,
          zoomPositionY: 1,
        }),
        bounds,
      ),
    ).toEqual({
      x: -200,
      y: -100,
    });
  });

  it("converts pan back into normalized zoom focus", () => {
    const bounds = getZoomPanBounds(mediaRect, 1.5);

    expect(
      panToZoomFocus(
        {
          x: -200,
          y: -100,
        },
        bounds,
      ),
    ).toEqual({
      positionX: 1,
      positionY: 1,
    });
  });

  it("clamps pan inside zoom bounds", () => {
    const bounds = getZoomPanBounds(mediaRect, 1.5);

    expect(
      clampPan(
        {
          x: 999,
          y: -999,
        },
        bounds,
      ),
    ).toEqual({
      x: 200,
      y: -100,
    });
  });
});
