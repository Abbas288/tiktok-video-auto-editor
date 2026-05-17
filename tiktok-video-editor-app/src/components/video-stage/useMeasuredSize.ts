import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { Size } from "../../domain/video/videoCanvas";

interface MeasuredSizeResult {
  size: Size;
  hasMeasuredSize: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
}

/**
 * Measures a React Native view and exposes its current size.
 *
 * This keeps layout measurement separate from visual stage rendering.
 */
export function useMeasuredSize(): MeasuredSizeResult {
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;

    setSize({ width, height });
  }, []);

  return {
    size,
    hasMeasuredSize: size.width > 0 && size.height > 0,
    onLayout,
  };
}
