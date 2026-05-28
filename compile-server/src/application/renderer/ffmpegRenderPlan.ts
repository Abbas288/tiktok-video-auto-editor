import {
  CompileOrientation,
  CompilePayloadScene,
  CompileTextOverlay,
  CompileTextOverlayLayout,
  CompileTransition,
} from "../../domain/compilePayloadSchema";

export interface RenderDimensions {
  width: number;
  height: number;
}

export interface SceneVideoFilterOptions {
  scene: CompilePayloadScene;
  orientation: CompileOrientation;
  subtitleFilePath?: string;
}

interface TextBoxLayout {
  centerX: number;
  centerY: number;
  fontSize: number;
  outlineSize: number;
  shadowSize: number;
  lines: string[];
}

const DEFAULT_MAX_TEXT_LINES = 4;
const DEFAULT_MIN_FONT_RATIO = 0.028;
const DEFAULT_MAX_FONT_RATIO = 0.12;
const DEFAULT_TEXT_BOX_WIDTH_RATIO = 0.86;
const DEFAULT_LINE_HEIGHT_RATIO = 1.15;
const DEFAULT_PADDING_X_RATIO = 0.012;
const DEFAULT_PADDING_Y_RATIO = 0.007;
const DEFAULT_APPROX_CHARACTER_WIDTH_RATIO = 0.52;
const FONT_SIZE_EXPORT_TUNING = 1.04;

/**
 * Returns the target video dimensions for a compile orientation.
 *
 * @param orientation Compile output orientation.
 * @returns Output dimensions.
 */
export function getRenderDimensions(
  orientation: CompileOrientation,
): RenderDimensions {
  if (orientation === "portrait") {
    return { width: 720, height: 1280 };
  }

  if (orientation === "square") {
    return { width: 1080, height: 1080 };
  }

  return { width: 1280, height: 720 };
}

/**
 * Returns fallback editor reference dimensions if the payload does not include layout metadata.
 *
 * @param orientation Compile output orientation.
 * @returns Editor reference dimensions.
 */
export function getEditorReferenceDimensions(
  orientation: CompileOrientation,
): RenderDimensions {
  if (orientation === "portrait") {
    return { width: 405, height: 720 };
  }

  if (orientation === "square") {
    return { width: 720, height: 720 };
  }

  return { width: 720, height: 405 };
}

/**
 * Builds the FFmpeg video filter chain for one scene segment.
 *
 * @param options Scene filter options.
 * @returns FFmpeg video filter chain.
 */
export function buildSceneVideoFilter(options: SceneVideoFilterOptions): string {
  const dimensions = getRenderDimensions(options.orientation);
  const filters = [
    "setpts=PTS-STARTPTS",
    `scale=${dimensions.width}:${dimensions.height}:force_original_aspect_ratio=increase`,
    `crop=${dimensions.width}:${dimensions.height}`,
    "setsar=1",
    "fps=30",
  ];

  const zoomEffect = options.scene.effects.find(
    (effect) => effect.type === "zoom",
  );

  if (zoomEffect) {
    const zoom = clampNumber(zoomEffect.intensity ?? 1, 1, 3);
    const positionX = clampNumber(zoomEffect.positionX ?? 0.5, 0, 1);
    const positionY = clampNumber(zoomEffect.positionY ?? 0.5, 0, 1);

    if (zoom > 1.001) {
      const scaledWidth = evenNumber(dimensions.width * zoom);
      const scaledHeight = evenNumber(dimensions.height * zoom);

      filters.push(
        `scale=${scaledWidth}:${scaledHeight}`,
        `crop=${dimensions.width}:${dimensions.height}:x=(in_w-out_w)*${formatNumber(
          positionX,
        )}:y=(in_h-out_h)*${formatNumber(positionY)}`,
      );
    }
  }

  const brightnessEffect = options.scene.effects.find(
    (effect) => effect.type === "brightness",
  );
  const contrastEffect = options.scene.effects.find(
    (effect) => effect.type === "contrast",
  );

  if (brightnessEffect || contrastEffect) {
    const brightnessValue = brightnessEffect?.value ?? 1;
    const contrastValue = contrastEffect?.value ?? 1;
    const brightness = clampNumber((brightnessValue - 1) * 0.25, -0.35, 0.35);
    const contrast = clampNumber(1 + (contrastValue - 1) * 0.6, 0.4, 2.2);

    filters.push(
      `eq=brightness=${formatNumber(brightness)}:contrast=${formatNumber(
        contrast,
      )}`,
    );
  }

  const blurEffect = options.scene.effects.find(
    (effect) => effect.type === "blur",
  );

  if (blurEffect) {
    const radius = clampNumber(
      blurEffect.value ?? blurEffect.intensity ?? 0,
      0,
      20,
    );

    if (radius > 0) {
      filters.push(`boxblur=${formatNumber(radius)}`);
    }
  }

  if (options.subtitleFilePath && options.scene.textOverlays.length > 0) {
    filters.push(`ass='${escapeFilterValue(options.subtitleFilePath)}'`);
  }

  filters.push("format=yuv420p");

  return filters.join(",");
}

/**
 * Creates an ASS subtitle file for all text overlays in one scene.
 *
 * @param scene Compile scene.
 * @param orientation Compile output orientation.
 * @returns ASS subtitle file content.
 */
export function createAssSubtitleFileContent(
  scene: CompilePayloadScene,
  orientation: CompileOrientation,
): string {
  const dimensions = getRenderDimensions(orientation);
  const events = scene.textOverlays
    .map((overlay) => createAssDialogueLine(overlay, scene, orientation))
    .filter((line): line is string => Boolean(line));

  return [
    "[Script Info]",
    "ScriptType: v4.00+",
    "ScaledBorderAndShadow: yes",
    "WrapStyle: 2",
    `PlayResX: ${dimensions.width}`,
    `PlayResY: ${dimensions.height}`,
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    "Style: Default, Arial, 24, &H00FFFFFF, &H00FFFFFF, &H80000000, &H00000000, 0, 0, 0, 0, 100, 100, 0, 0, 1, 2, 1, 5, 0, 0, 0, 1",
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ...events,
    "",
  ].join("\n");
}

/**
 * Builds the filter graph used to join rendered scene videos with transitions.
 *
 * @param scenes Ordered compile scenes.
 * @returns Filter graph and resulting output duration.
 */
export function buildVideoTransitionFilterGraph(scenes: CompilePayloadScene[]): {
  filterGraph: string;
  outputLabel: string;
  outputDurationSeconds: number;
} {
  if (scenes.length === 1) {
    return {
      filterGraph: "",
      outputLabel: "0:v",
      outputDurationSeconds: scenes[0].durationSeconds,
    };
  }

  const filters: string[] = [];
  let previousLabel = "0:v";
  let currentDuration = scenes[0].durationSeconds;

  for (let index = 1; index < scenes.length; index += 1) {
    const transition = normalizeTransition(
      scenes[index - 1].transition,
      scenes[index - 1].durationSeconds,
      scenes[index].durationSeconds,
    );
    const outputLabel = `v${index}`;

    if (transition.type === "cut") {
      filters.push(
        `[${previousLabel}][${index}:v]concat=n=2:v=1:a=0[${outputLabel}]`,
      );

      currentDuration += scenes[index].durationSeconds;
      previousLabel = outputLabel;
      continue;
    }

    const offset = Math.max(currentDuration - transition.durationSeconds, 0);

    filters.push(
      `[${previousLabel}][${index}:v]xfade=transition=${
        transition.name
      }:duration=${formatNumber(transition.durationSeconds)}:offset=${formatNumber(
        offset,
      )}[${outputLabel}]`,
    );

    currentDuration += scenes[index].durationSeconds - transition.durationSeconds;
    previousLabel = outputLabel;
  }

  const finalOutputLabel = "vout";
  filters.push(`[${previousLabel}]format=yuv420p[${finalOutputLabel}]`);

  return {
    filterGraph: filters.join(";"),
    outputLabel: finalOutputLabel,
    outputDurationSeconds: currentDuration,
  };
}

/**
 * Builds the filter graph used to join rendered scene audio segments.
 *
 * @param scenes Ordered compile scenes.
 * @returns Filter graph and output label.
 */
export function buildAudioTransitionFilterGraph(scenes: CompilePayloadScene[]): {
  filterGraph: string;
  outputLabel: string;
} {
  if (scenes.length === 1) {
    return {
      filterGraph: "",
      outputLabel: "0:a",
    };
  }

  const filters: string[] = [];
  let previousLabel = "0:a";

  for (let index = 1; index < scenes.length; index += 1) {
    const transition = normalizeTransition(
      scenes[index - 1].transition,
      scenes[index - 1].durationSeconds,
      scenes[index].durationSeconds,
    );
    const outputLabel = `a${index}`;

    if (transition.type === "cut") {
      filters.push(
        `[${previousLabel}][${index}:a]concat=n=2:v=0:a=1[${outputLabel}]`,
      );

      previousLabel = outputLabel;
      continue;
    }

    filters.push(
      `[${previousLabel}][${index}:a]acrossfade=d=${formatNumber(
        transition.durationSeconds,
      )}:c1=tri:c2=tri[${outputLabel}]`,
    );

    previousLabel = outputLabel;
  }

  return {
    filterGraph: filters.join(";"),
    outputLabel: previousLabel,
  };
}

function createAssDialogueLine(
  overlay: CompileTextOverlay,
  scene: CompilePayloadScene,
  orientation: CompileOrientation,
): string | null {
  const relativeStart = Math.max(overlay.startSeconds - scene.startSeconds, 0);
  const relativeEnd = Math.min(
    relativeStart + overlay.durationSeconds,
    scene.durationSeconds,
  );

  if (relativeEnd <= relativeStart) {
    return null;
  }

  const layout = createTextBoxLayout(overlay, orientation);
  const wrappedText = layout.lines.map(escapeAssText).join("\\N");
  const styleTags = [
    "\\an5",
    `\\pos(${layout.centerX},${layout.centerY})`,
    `\\fs${layout.fontSize}`,
    `\\c&H${toAssBgrColor(overlay.color)}&`,
    `\\bord${layout.outlineSize}`,
    `\\shad${layout.shadowSize}`,
    "\\q2",
    overlay.style === "bold" ? "\\b1" : "\\b0",
    overlay.style === "italic" ? "\\i1" : "\\i0",
  ].join("");

  return [
    "Dialogue: 0",
    formatAssTime(relativeStart),
    formatAssTime(relativeEnd),
    "Default",
    "",
    "0",
    "0",
    "0",
    "",
    `{${styleTags}}${wrappedText}`,
  ].join(",");
}

function createTextBoxLayout(
  overlay: CompileTextOverlay,
  orientation: CompileOrientation,
): TextBoxLayout {
  const dimensions = getRenderDimensions(orientation);
  const layout = getOverlayLayout(overlay, orientation);
  const fontSize = scaleFontSize(overlay.fontSizePt, layout, dimensions);
  const lineHeight = fontSize * layout.lineHeightRatio;
  const paddingX = dimensions.width * layout.paddingXRatio;
  const paddingY = dimensions.height * layout.paddingYRatio;
  const boxWidth = dimensions.width * layout.boxWidthRatio;
  const availableTextWidth = Math.max(boxWidth - paddingX * 2, fontSize);
  const maxCharactersPerLine = Math.max(
    Math.floor(availableTextWidth / approximateCharacterWidth(fontSize)),
    8,
  );
  const lines = normalizeLayoutLines(
    overlay,
    layout,
    maxCharactersPerLine,
  ).slice(0, layout.maxLines);
  const boxHeight = Math.min(
    lines.length * lineHeight + paddingY * 2,
    layout.maxLines * lineHeight + paddingY * 2,
  );
  const requestedCenterX =
    clampNumber(overlay.positionX, 0, 1) * dimensions.width;
  const requestedCenterY =
    clampNumber(overlay.positionY, 0, 1) * dimensions.height;
  const topLeftX = clampNumber(
    requestedCenterX - boxWidth / 2,
    0,
    Math.max(dimensions.width - boxWidth, 0),
  );
  const topLeftY = clampNumber(
    requestedCenterY - boxHeight / 2,
    0,
    Math.max(dimensions.height - boxHeight, 0),
  );
  const centerX = Math.round(topLeftX + boxWidth / 2);
  const centerY = Math.round(topLeftY + boxHeight / 2);
  const outlineSize = Math.max(Math.round(fontSize * 0.06), 1);
  const shadowSize = Math.max(Math.round(fontSize * 0.025), 0);

  return {
    centerX,
    centerY,
    fontSize,
    outlineSize,
    shadowSize,
    lines,
  };
}

function getOverlayLayout(
  overlay: CompileTextOverlay,
  orientation: CompileOrientation,
): CompileTextOverlayLayout {
  const fallbackDimensions = getEditorReferenceDimensions(orientation);

  return {
    anchor: overlay.layout?.anchor ?? "center",
    textAlign: overlay.layout?.textAlign ?? "center",
    referenceWidth: overlay.layout?.referenceWidth ?? fallbackDimensions.width,
    referenceHeight: overlay.layout?.referenceHeight ?? fallbackDimensions.height,
    boxWidthRatio: overlay.layout?.boxWidthRatio ?? DEFAULT_TEXT_BOX_WIDTH_RATIO,
    maxLines: overlay.layout?.maxLines ?? DEFAULT_MAX_TEXT_LINES,
    lineHeightRatio: overlay.layout?.lineHeightRatio ?? DEFAULT_LINE_HEIGHT_RATIO,
    paddingXRatio: overlay.layout?.paddingXRatio ?? DEFAULT_PADDING_X_RATIO,
    paddingYRatio: overlay.layout?.paddingYRatio ?? DEFAULT_PADDING_Y_RATIO,
    minFontRatio: overlay.layout?.minFontRatio ?? DEFAULT_MIN_FONT_RATIO,
    maxFontRatio: overlay.layout?.maxFontRatio ?? DEFAULT_MAX_FONT_RATIO,
    lines: overlay.layout?.lines ?? [],
  };
}

function normalizeLayoutLines(
  overlay: CompileTextOverlay,
  layout: CompileTextOverlayLayout,
  maxCharactersPerLine: number,
): string[] {
  const providedLines = layout.lines
    .map((line) => (typeof line === "string" ? line : ""))
    .filter((line) => line.length > 0);

  if (providedLines.length > 0) {
    return providedLines;
  }

  return createLimitedWrappedLines(
    typeof overlay.text === "string" ? overlay.text : "",
    maxCharactersPerLine,
    layout.maxLines,
  );
}

function scaleFontSize(
  fontSizePt: number,
  layout: CompileTextOverlayLayout,
  dimensions: RenderDimensions,
): number {
  const referenceFontSize = clampNumber(
    fontSizePt,
    layout.referenceHeight * layout.minFontRatio,
    layout.referenceHeight * layout.maxFontRatio,
  );
  const scale = dimensions.width / layout.referenceWidth;

  return Math.round(referenceFontSize * scale * FONT_SIZE_EXPORT_TUNING);
}

function createLimitedWrappedLines(
  text: string,
  maxCharactersPerLine: number,
  maxLines: number,
): string[] {
  const wrappedLines = wrapText(text, maxCharactersPerLine)
    .split("\n")
    .filter((line) => line.length > 0);

  if (wrappedLines.length === 0) {
    return [""];
  }

  if (wrappedLines.length <= maxLines) {
    return wrappedLines;
  }

  const visibleLines = wrappedLines.slice(0, maxLines);

  visibleLines[maxLines - 1] = addEllipsis(
    visibleLines[maxLines - 1],
    maxCharactersPerLine,
  );

  return visibleLines;
}

function addEllipsis(line: string, maxCharactersPerLine: number): string {
  if (line.length <= 3) {
    return "...";
  }

  if (line.length <= maxCharactersPerLine - 3) {
    return `${line}...`;
  }

  return `${line.slice(0, Math.max(maxCharactersPerLine - 3, 1)).trimEnd()}...`;
}

function normalizeTransition(
  transition: CompileTransition | undefined,
  previousDuration: number,
  nextDuration: number,
):
  | { type: "cut"; name: "cut"; durationSeconds: 0 }
  | { type: "animated"; name: string; durationSeconds: number } {
  if (!transition || transition.type === "cut") {
    return { type: "cut", name: "cut", durationSeconds: 0 };
  }

  const maxDuration = Math.max(Math.min(previousDuration, nextDuration) / 2, 0.001);
  const durationSeconds = clampNumber(
    transition.durationSeconds,
    0.001,
    maxDuration,
  );

  if (transition.type === "fade") {
    return { type: "animated", name: "fade", durationSeconds };
  }

  return {
    type: "animated",
    name: mapSlideTransition(transition.direction),
    durationSeconds,
  };
}

function mapSlideTransition(direction: CompileTransition["direction"]): string {
  if (direction === "right") {
    return "slideright";
  }

  if (direction === "up") {
    return "slideup";
  }

  if (direction === "down") {
    return "slidedown";
  }

  return "slideleft";
}

function wrapText(text: string, maxCharactersPerLine: number): string {
  return text
    .split(/\r?\n/)
    .flatMap((line) => wrapLine(line, maxCharactersPerLine))
    .join("\n");
}

function wrapLine(line: string, maxCharactersPerLine: number): string[] {
  const words = line.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const parts = splitLongWord(word, maxCharactersPerLine);

    for (const part of parts) {
      const nextLine = currentLine ? `${currentLine} ${part}` : part;

      if (nextLine.length <= maxCharactersPerLine) {
        currentLine = nextLine;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = part;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function splitLongWord(word: string, maxCharactersPerLine: number): string[] {
  if (word.length <= maxCharactersPerLine) {
    return [word];
  }

  const parts: string[] = [];

  for (let index = 0; index < word.length; index += maxCharactersPerLine) {
    parts.push(word.slice(index, index + maxCharactersPerLine));
  }

  return parts;
}

function approximateCharacterWidth(fontSize: number): number {
  return Math.max(fontSize * DEFAULT_APPROX_CHARACTER_WIDTH_RATIO, 6);
}

function toAssBgrColor(color: string): string {
  const trimmedColor = color.trim();
  const normalizedColor = /^#[0-9a-fA-F]{6}$/.test(trimmedColor)
    ? trimmedColor.slice(1)
    : "FFFFFF";
  const red = normalizedColor.slice(0, 2);
  const green = normalizedColor.slice(2, 4);
  const blue = normalizedColor.slice(4, 6);

  return `${blue}${green}${red}`.toUpperCase();
}

function formatAssTime(value: number): string {
  const totalCentiseconds = Math.max(Math.round(value * 100), 0);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${hours}:${padTwo(minutes)}:${padTwo(seconds)}.${padTwo(
    centiseconds,
  )}`;
}

function escapeAssText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/[{}]/g, "");
}

function evenNumber(value: number): number {
  const roundedValue = Math.max(Math.round(value), 2);

  return roundedValue % 2 === 0 ? roundedValue : roundedValue + 1;
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number): string {
  return Number(value.toFixed(4)).toString();
}

function padTwo(value: number): string {
  return value.toString().padStart(2, "0");
}

function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
}