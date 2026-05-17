import { RefObject, useCallback, useEffect, useState } from "react";
import { Platform, View } from "react-native";

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

/**
 * Controls fullscreen for the whole editor video stage on web.
 *
 * This intentionally does not call VideoView native fullscreen. The full stage
 * must enter fullscreen so video, overlays and custom controls stay together.
 */
export function useStageFullscreen(stageRef: RefObject<View | null>): {
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
} {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const getFullscreenDocument = useCallback((): FullscreenDocument | null => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return null;
    }

    return document as FullscreenDocument;
  }, []);

  const getFullscreenElement = useCallback((): Element | null => {
    const fullscreenDocument = getFullscreenDocument();

    return (
      fullscreenDocument?.fullscreenElement ??
      fullscreenDocument?.webkitFullscreenElement ??
      null
    );
  }, [getFullscreenDocument]);

  const toggleFullscreen = useCallback(async (): Promise<void> => {
    const fullscreenDocument = getFullscreenDocument();

    if (!fullscreenDocument) {
      return;
    }

    if (getFullscreenElement()) {
      if (fullscreenDocument.exitFullscreen) {
        await fullscreenDocument.exitFullscreen();
        return;
      }

      await fullscreenDocument.webkitExitFullscreen?.();
      return;
    }

    const stageElement =
      stageRef.current as unknown as FullscreenElement | null;

    if (!stageElement) {
      return;
    }

    if (stageElement.requestFullscreen) {
      await stageElement.requestFullscreen({ navigationUI: "hide" });
      return;
    }

    await stageElement.webkitRequestFullscreen?.();
  }, [getFullscreenDocument, getFullscreenElement, stageRef]);

  useEffect(() => {
    const fullscreenDocument = getFullscreenDocument();

    if (!fullscreenDocument) {
      return undefined;
    }

    const handleFullscreenChange = (): void => {
      setIsFullscreen(Boolean(getFullscreenElement()));
    };

    fullscreenDocument.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );
    fullscreenDocument.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      fullscreenDocument.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
      fullscreenDocument.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [getFullscreenDocument, getFullscreenElement]);

  return {
    isFullscreen,
    toggleFullscreen,
  };
}
