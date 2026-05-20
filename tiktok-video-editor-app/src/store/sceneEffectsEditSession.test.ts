import { Template } from "../types/template";
import { clearEditedTemplateDraftsStorage } from "./editSessionDrafts";
import {
  resetTemplateSceneEffects,
  updateTemplateSceneEffect,
  updateTemplateSceneZoomFocus,
  useEditSession,
} from "./useEditSession";

function createTemplateFixture(): Template {
  return {
    id: "bunny-intro-2026",
    title: "The Bunny and the Butterfly",
    sourceVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    orientation: "landscape",
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "Butterfly flies above a giant bunny",
        textOverlays: [],
        effects: [],
      },
      {
        id: "scene-2",
        orderIndex: 1,
        startSeconds: 3,
        durationSeconds: 7,
        instruction: "The bunny follows the butterfly",
        textOverlays: [],
        effects: [{ type: "blur", value: 0.2 }],
      },
    ],
  };
}

function resetStore(): void {
  clearEditedTemplateDraftsStorage();

  useEditSession.setState({
    currentTemplate: null,
    editedTemplatesById: {},
    activeSceneId: null,
    selectedOverlayId: null,
  });
}

function getCurrentTemplate(): Template {
  const template = useEditSession.getState().currentTemplate;

  if (!template) {
    throw new Error("Expected currentTemplate to be loaded.");
  }

  return template;
}

describe("template scene effects", () => {
  it("updates a scene effect immutably", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateSceneEffect(
      template,
      "scene-1",
      "brightness",
      1.2,
    );

    expect(updatedTemplate).not.toBe(template);
    expect(updatedTemplate.scenes[0]).not.toBe(template.scenes[0]);
    expect(updatedTemplate.scenes[1]).toBe(template.scenes[1]);
    expect(updatedTemplate.scenes[0].effects).toEqual([
      { type: "brightness", value: 1.2 },
    ]);
  });

  it("updates zoom focus immutably", () => {
    const template = updateTemplateSceneEffect(
      createTemplateFixture(),
      "scene-1",
      "zoom",
      1.5,
    );

    const updatedTemplate = updateTemplateSceneZoomFocus(template, "scene-1", {
      positionX: 0.75,
      positionY: 0.25,
    });

    expect(updatedTemplate).not.toBe(template);
    expect(updatedTemplate.scenes[0]).not.toBe(template.scenes[0]);
    expect(updatedTemplate.scenes[0].effects).toEqual([
      { type: "zoom", intensity: 1.5, positionX: 0.75, positionY: 0.25 },
    ]);
  });

  it("returns original template when scene does not exist", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateSceneEffect(
      template,
      "missing-scene",
      "brightness",
      1.2,
    );

    expect(updatedTemplate).toBe(template);
  });

  it("resets editable effects but keeps unsupported effects", () => {
    const template = updateTemplateSceneEffect(
      updateTemplateSceneEffect(
        createTemplateFixture(),
        "scene-2",
        "brightness",
        1.2,
      ),
      "scene-2",
      "zoom",
      1.4,
    );

    const resetTemplate = resetTemplateSceneEffects(template, "scene-2");

    expect(resetTemplate.scenes[1].effects).toEqual([
      { type: "blur", value: 0.2 },
    ]);
  });
});

describe("useEditSession scene effects", () => {
  beforeEach(() => {
    resetStore();
  });

  it("updates brightness, contrast and zoom for a target scene", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneEffect("scene-1", "brightness", 1.2);
    useEditSession.getState().updateSceneEffect("scene-1", "contrast", 1.3);
    useEditSession.getState().updateSceneEffect("scene-1", "zoom", 1.4);

    expect(getCurrentTemplate().scenes[0].effects).toEqual([
      { type: "brightness", value: 1.2 },
      { type: "contrast", value: 1.3 },
      { type: "zoom", intensity: 1.4, positionX: 0.5, positionY: 0.5 },
    ]);
    expect(getCurrentTemplate().scenes[1].effects).toEqual([
      { type: "blur", value: 0.2 },
    ]);
  });

  it("updates zoom focus through the store", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneEffect("scene-1", "zoom", 1.5);
    useEditSession.getState().updateSceneZoomFocus("scene-1", {
      positionX: 0.8,
      positionY: 0.2,
    });

    expect(getCurrentTemplate().scenes[0].effects).toEqual([
      { type: "zoom", intensity: 1.5, positionX: 0.8, positionY: 0.2 },
    ]);
  });

  it("stores scene effect changes as a draft", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneEffect("scene-1", "brightness", 1.2);

    const draft =
      useEditSession.getState().editedTemplatesById["bunny-intro-2026"];

    expect(draft).toBeDefined();
    expect(draft.scenes[0].effects).toEqual([
      { type: "brightness", value: 1.2 },
    ]);
  });

  it("loads saved scene effect draft instead of original template", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneEffect("scene-1", "zoom", 1.5);

    useEditSession.getState().clearSession();
    useEditSession.getState().loadTemplate(template);

    expect(getCurrentTemplate().scenes[0].effects).toEqual([
      { type: "zoom", intensity: 1.5, positionX: 0.5, positionY: 0.5 },
    ]);
  });

  it("loads saved zoom focus draft instead of original template", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneEffect("scene-1", "zoom", 1.5);
    useEditSession.getState().updateSceneZoomFocus("scene-1", {
      positionX: 0.7,
      positionY: 0.3,
    });

    useEditSession.getState().clearSession();
    useEditSession.getState().loadTemplate(template);

    expect(getCurrentTemplate().scenes[0].effects).toEqual([
      { type: "zoom", intensity: 1.5, positionX: 0.7, positionY: 0.3 },
    ]);
  });

  it("resets scene effects through the store", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneEffect("scene-1", "brightness", 1.2);
    useEditSession.getState().resetSceneEffects("scene-1");

    expect(getCurrentTemplate().scenes[0].effects).toEqual([]);
  });
});
