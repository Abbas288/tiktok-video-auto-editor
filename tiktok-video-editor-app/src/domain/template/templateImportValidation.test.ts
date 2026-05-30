import {
  getTemplateImportValidationDetails,
  parseImportedTemplate,
  TemplateImportValidationError,
} from "./templateImportValidation";

interface ValidTemplateInput {
  id: string;
  title: string;
  sourceVideoUrl: string;
  orientation: "portrait";
  originalVolume: number;
  scenes: ValidSceneInput[];
}

interface ValidSceneInput {
  id: string;
  orderIndex: number;
  startSeconds: number;
  durationSeconds: number;
  instruction: string;
  transition: {
    type: "fade";
    durationSeconds: number;
    direction?: string;
  };
  textOverlays: ValidTextOverlayInput[];
  effects: ValidEffectInput[];
}

interface ValidTextOverlayInput {
  id: string;
  text: string;
  positionX: number;
  positionY: number;
  fontSizePt: number;
  color: string;
  style: string;
  animationIn: string;
  startSeconds: number;
  durationSeconds: number;
}

interface ValidEffectInput {
  type: string;
  value?: number;
  intensity?: number;
  positionX?: number;
  positionY?: number;
}

function createValidTemplateInput(): ValidTemplateInput {
  return {
    id: "custom-template",
    title: "Custom Template",
    sourceVideoUrl: "https://example.com/video.mp4",
    orientation: "portrait",
    originalVolume: 1,
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "Show the product close to camera.",
        transition: {
          type: "fade",
          durationSeconds: 0.18,
        },
        textOverlays: [
          {
            id: "text-1",
            text: "New drop",
            positionX: 0.5,
            positionY: 0.8,
            fontSizePt: 24,
            color: "#FFFFFF",
            style: "bold",
            animationIn: "none",
            startSeconds: 0.2,
            durationSeconds: 2,
          },
        ],
        effects: [{ type: "brightness", value: 1.1 }],
      },
    ],
  };
}

describe("templateImportValidation", () => {
  it("parses a valid imported template", () => {
    const template = parseImportedTemplate(createValidTemplateInput());

    expect(template.id).toBe("custom-template");
    expect(template.scenes[0].instruction).toBe(
      "Show the product close to camera.",
    );
  });

  it("reports missing required top-level fields", () => {
    const details = getTemplateImportValidationDetails({
      title: "",
      orientation: "portrait",
      scenes: [],
    });

    expect(details).toContain("id is required.");
    expect(details).toContain("title is required.");
    expect(details).toContain("sourceVideoUrl is required.");
  });

  it("rejects templates without scenes", () => {
    expect(() =>
      parseImportedTemplate({
        ...createValidTemplateInput(),
        scenes: [],
      }),
    ).toThrow(TemplateImportValidationError);
  });

  it("requires scene metadata used by the editor", () => {
    const input = createValidTemplateInput();
    const {
      instruction: _instruction,
      textOverlays: _textOverlays,
      ...sceneWithoutRequiredMetadata
    } = input.scenes[0];

    const details = getTemplateImportValidationDetails({
      ...input,
      scenes: [sceneWithoutRequiredMetadata],
    });

    expect(details).toContain("scenes[0].instruction is required.");
    expect(details).toContain("scenes[0].textOverlays must be an array.");
  });

  it("validates text overlay shape", () => {
    const input = createValidTemplateInput();

    input.scenes[0].textOverlays[0].positionX = 2;
    input.scenes[0].textOverlays[0].style = "giant";

    const details = getTemplateImportValidationDetails(input);

    expect(details).toContain(
      "scenes[0].textOverlays[0].positionX must be a number between 0 and 1.",
    );
    expect(details).toContain(
      "scenes[0].textOverlays[0].style must be normal, bold or italic.",
    );
  });

  it("validates transition direction", () => {
    const input = createValidTemplateInput();

    input.scenes[0].transition.direction = "diagonal";

    const details = getTemplateImportValidationDetails(input);

    expect(details).toContain(
      "scenes[0].transition.direction must be left, right, up or down.",
    );
  });
});
