import { z } from "zod";

export type CompileOrientation = "portrait" | "landscape" | "square";
export type CompileTransitionType = "cut" | "fade" | "slide";
export type CompileTransitionDirection = "left" | "right" | "up" | "down";
export type CompileEffectType = "zoom" | "brightness" | "contrast" | "blur";
export type CompileTextStyle = "normal" | "bold" | "italic";
export type CompileTextAnimation = "none" | "fadeUp" | "fadeIn";

export interface CompileTransition {
  type: CompileTransitionType;
  durationSeconds: number;
  direction?: CompileTransitionDirection;
}

export interface CompileTextOverlayLayout {
  anchor: "center";
  textAlign: "center";
  referenceWidth: number;
  referenceHeight: number;
  boxWidthRatio: number;
  maxLines: number;
  lineHeightRatio: number;
  paddingXRatio: number;
  paddingYRatio: number;
  minFontRatio: number;
  maxFontRatio: number;
  lines: string[];
}

export interface CompileTextOverlay {
  id: string;
  text: string;
  positionX: number;
  positionY: number;
  fontSizePt: number;
  color: string;
  style: CompileTextStyle;
  animationIn: CompileTextAnimation;
  startSeconds: number;
  durationSeconds: number;
  layout?: CompileTextOverlayLayout;
}

export interface CompileEffect {
  type: CompileEffectType;
  intensity?: number;
  value?: number;
  positionX?: number;
  positionY?: number;
}

export interface CompilePayloadScene {
  id: string;
  orderIndex?: number;
  startSeconds: number;
  durationSeconds: number;
  instruction?: string;
  transition?: CompileTransition;
  textOverlays: CompileTextOverlay[];
  effects: CompileEffect[];
}

export interface CompilePayloadMusic {
  url: string;
  volume: number;
  beatSync?: boolean;
}

export interface CompilePayload {
  templateId: string;
  sourceVideoUrl: string;
  orientation: CompileOrientation;
  originalVolume: number;
  music?: CompilePayloadMusic;
  scenes: CompilePayloadScene[];
}

interface ParsedCompilePayloadInput {
  templateId?: string;
  id?: string;
  sourceVideoUrl?: string;
  videoUrl?: string;
  orientation?: CompileOrientation;
  originalVolume?: number;
  music?: CompilePayloadMusic;
  scenes: CompilePayloadScene[];
}

const volumeSchema = z.number().finite().min(0).max(1);

const orientationSchema = z
  .enum(["portrait", "landscape", "square"])
  .default("landscape");

const transitionSchema = z
  .object({
    type: z.enum(["cut", "fade", "slide"]),
    durationSeconds: z.number().finite().min(0),
    direction: z.enum(["left", "right", "up", "down"]).optional(),
  })
  .passthrough();

const textOverlayLayoutSchema = z
  .object({
    anchor: z.enum(["center"]).default("center"),
    textAlign: z.enum(["center"]).default("center"),
    referenceWidth: z.number().finite().positive(),
    referenceHeight: z.number().finite().positive(),
    boxWidthRatio: z.number().finite().positive().max(1),
    maxLines: z.number().int().positive().max(12),
    lineHeightRatio: z.number().finite().positive(),
    paddingXRatio: z.number().finite().min(0).max(0.2),
    paddingYRatio: z.number().finite().min(0).max(0.2),
    minFontRatio: z.number().finite().positive(),
    maxFontRatio: z.number().finite().positive(),
    lines: z.array(z.string()).max(12).default([]),
  })
  .passthrough();

const textOverlaySchema = z
  .object({
    id: z.string().min(1),
    text: z.string(),
    positionX: z.number().finite(),
    positionY: z.number().finite(),
    fontSizePt: z.number().finite().positive(),
    color: z.string().min(1),
    style: z.enum(["normal", "bold", "italic"]),
    animationIn: z.enum(["none", "fadeUp", "fadeIn"]),
    startSeconds: z.number().finite().min(0),
    durationSeconds: z.number().finite().positive(),
    layout: textOverlayLayoutSchema.optional(),
  })
  .passthrough();

const effectSchema = z
  .object({
    type: z.enum(["zoom", "brightness", "contrast", "blur"]),
    intensity: z.number().finite().optional(),
    value: z.number().finite().optional(),
    positionX: z.number().finite().optional(),
    positionY: z.number().finite().optional(),
  })
  .passthrough();

const sceneSchema = z
  .object({
    id: z.string().min(1),
    orderIndex: z.number().finite().optional(),
    startSeconds: z.number().finite().min(0),
    durationSeconds: z.number().finite().positive(),
    instruction: z.string().optional(),
    transition: transitionSchema.optional(),
    textOverlays: z.array(textOverlaySchema).default([]),
    effects: z.array(effectSchema).default([]),
  })
  .passthrough();

const musicSchema = z
  .object({
    url: z.string().url(),
    volume: volumeSchema.default(1),
    beatSync: z.boolean().optional(),
  })
  .passthrough();

const compilePayloadInputSchema = z
  .object({
    templateId: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
    sourceVideoUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    orientation: orientationSchema,
    originalVolume: volumeSchema.optional(),
    music: musicSchema.optional(),
    scenes: z.array(sceneSchema).min(1),
  })
  .passthrough()
  .superRefine((value, context) => {
    if (!value.templateId && !value.id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["templateId"],
        message: "templateId is required.",
      });
    }

    if (!value.sourceVideoUrl && !value.videoUrl) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sourceVideoUrl"],
        message: "sourceVideoUrl is required.",
      });
    }
  });

/**
 * Error thrown when a compile payload cannot be accepted.
 */
export class CompilePayloadValidationError extends Error {
  public readonly details: string[];

  public constructor(details: string[]) {
    super("Invalid compile payload.");
    this.name = "CompilePayloadValidationError";
    this.details = details;
  }
}

/**
 * Validates and normalizes a compile payload from the app.
 *
 * @param input Unknown request body.
 * @returns Compile payload normalized for server-side processing.
 * @throws CompilePayloadValidationError when the payload is invalid.
 */
export function parseCompilePayload(input: unknown): CompilePayload {
  const result = compilePayloadInputSchema.safeParse(input);

  if (!result.success) {
    throw new CompilePayloadValidationError(
      result.error.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "payload";

        return `${path}: ${issue.message}`;
      }),
    );
  }

  const data = result.data as ParsedCompilePayloadInput;
  const templateId = data.templateId ?? data.id;
  const sourceVideoUrl = data.sourceVideoUrl ?? data.videoUrl;

  if (!templateId || !sourceVideoUrl) {
    throw new CompilePayloadValidationError([
      "templateId and sourceVideoUrl are required.",
    ]);
  }

  return {
    templateId,
    sourceVideoUrl,
    orientation: data.orientation ?? "landscape",
    originalVolume: data.originalVolume ?? 1,
    music: data.music,
    scenes: data.scenes,
  };
}