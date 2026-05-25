import { Template } from "../types/template";
import { clearEditedTemplateDraftsStorage } from "./editSessionDrafts";
import { updateTemplateTextOverlay, useEditSession } from "./useEditSession";

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
        textOverlays: [
          {
            id: "text-1",
            text: "Meet the world's largest bunny!",
            positionX: 0.1,
            positionY: 0.2,
            fontSizePt: 24,
            color: "#00D6F9",
            style: "bold",
            animationIn: "none",
            startSeconds: 0.5,
            durationSeconds: 2,
          },
          {
            id: "text-1-secondary",
            text: "Secondary overlay",
            positionX: 0.4,
            positionY: 0.4,
            fontSizePt: 18,
            color: "#FFFFFF",
            style: "normal",
            animationIn: "none",
            startSeconds: 0.5,
            durationSeconds: 2,
          },
        ],
        effects: [],
      },
      {
        id: "scene-2",
        orderIndex: 1,
        startSeconds: 3,
        durationSeconds: 7,
        instruction: "The bunny follows the butterfly",
        textOverlays: [
          {
            id: "text-2",
            text: "What is he looking at?",
            positionX: 0.3,
            positionY: 0.8,
            fontSizePt: 20,
            color: "#FFFFFF",
            style: "italic",
            animationIn: "none",
            startSeconds: 4,
            durationSeconds: 3,
          },
        ],
        effects: [],
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

describe("updateTemplateTextOverlay", () => {
  it("updates target overlay immutably", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateTextOverlay(
      template,
      "scene-1",
      "text-1",
      {
        text: "Hello LNU!",
        color: "#FF0000",
        fontSizePt: 32,
        positionX: 0.75,
        positionY: 0.25,
      },
    );

    expect(updatedTemplate).not.toBe(template);
    expect(updatedTemplate.scenes[0]).not.toBe(template.scenes[0]);
    expect(updatedTemplate.scenes[1]).toBe(template.scenes[1]);
    expect(updatedTemplate.scenes[0].textOverlays[0]).not.toBe(
      template.scenes[0].textOverlays[0],
    );
    expect(updatedTemplate.scenes[0].textOverlays[1]).toBe(
      template.scenes[0].textOverlays[1],
    );
    expect(updatedTemplate.scenes[0].textOverlays[0].text).toBe("Hello LNU!");
    expect(updatedTemplate.scenes[0].textOverlays[0].color).toBe("#FF0000");
    expect(updatedTemplate.scenes[0].textOverlays[0].fontSizePt).toBe(32);
    expect(updatedTemplate.scenes[0].textOverlays[0].positionX).toBe(0.75);
    expect(updatedTemplate.scenes[0].textOverlays[0].positionY).toBe(0.25);
  });

  it("returns original template when scene id does not match", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateTextOverlay(
      template,
      "missing-scene",
      "text-1",
      {
        text: "Should not update",
      },
    );

    expect(updatedTemplate).toBe(template);
  });

  it("returns original template when overlay id does not match", () => {
    const template = createTemplateFixture();

    const updatedTemplate = updateTemplateTextOverlay(
      template,
      "scene-1",
      "missing-overlay",
      {
        text: "Should not update",
      },
    );

    expect(updatedTemplate).toBe(template);
  });
});

describe("useEditSession overlay editing", () => {
  beforeEach(() => {
    resetStore();
  });

  it("selects and clears a text overlay", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().selectOverlay("text-1");

    expect(useEditSession.getState().selectedOverlayId).toBe("text-1");

    useEditSession.getState().clearSession();

    expect(useEditSession.getState().selectedOverlayId).toBeNull();
  });

  it("clears selected overlay when a different scene is selected", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().selectOverlay("text-1");
    useEditSession.getState().selectScene("scene-2");

    expect(useEditSession.getState().activeSceneId).toBe("scene-2");
    expect(useEditSession.getState().selectedOverlayId).toBeNull();
  });

  it("updates text, color, font size and position for the target overlay", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateTextOverlay("scene-1", "text-1", {
      text: "Hello LNU!",
      color: "#FF0000",
      fontSizePt: 32,
      positionX: 0.75,
      positionY: 0.25,
    });

    const updatedTemplate = getCurrentTemplate();
    const updatedOverlay = updatedTemplate.scenes[0].textOverlays[0];

    expect(updatedOverlay.text).toBe("Hello LNU!");
    expect(updatedOverlay.color).toBe("#FF0000");
    expect(updatedOverlay.fontSizePt).toBe(32);
    expect(updatedOverlay.positionX).toBe(0.75);
    expect(updatedOverlay.positionY).toBe(0.25);
  });

  it("stores edited template as a draft", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateTextOverlay("scene-1", "text-1", {
      text: "Saved draft text",
    });

    const draft =
      useEditSession.getState().editedTemplatesById["bunny-intro-2026"];

    expect(draft).toBeDefined();
    expect(draft.scenes[0].textOverlays[0].text).toBe("Saved draft text");
  });

  it("loads existing draft instead of original template", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateTextOverlay("scene-1", "text-1", {
      text: "Draft survives reload",
    });

    useEditSession.getState().clearSession();
    useEditSession.getState().loadTemplate(template);

    expect(getCurrentTemplate().scenes[0].textOverlays[0].text).toBe(
      "Draft survives reload",
    );
  });

  it("clears active session without deleting drafts", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateTextOverlay("scene-1", "text-1", {
      text: "Still cached",
    });

    useEditSession.getState().clearSession();

    expect(useEditSession.getState().currentTemplate).toBeNull();
    expect(
      useEditSession.getState().editedTemplatesById["bunny-intro-2026"],
    ).toBeDefined();
  });

  it("can clear all drafts explicitly", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateTextOverlay("scene-1", "text-1", {
      text: "Temporary draft",
    });

    useEditSession.getState().clearDrafts();

    expect(useEditSession.getState().editedTemplatesById).toEqual({});
  });
});

describe("useEditSession volume editing", () => {
  beforeEach(() => {
    resetStore();
  });

  it("updates original and music volumes immutably", () => {
    const template = createTemplateFixture();
    template.music = { url: "test.mp3", volume: 1, beatSync: false };

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateVolumes(0.5, 0.25);

    const updatedTemplate = getCurrentTemplate();

    expect(updatedTemplate.originalVolume).toBe(0.5);
    expect(updatedTemplate.music?.volume).toBe(0.25);
    expect(updatedTemplate).not.toBe(template);
  });
});

describe("useEditSession transition editing", () => {
  beforeEach(() => {
    resetStore();
  });

  it("updates and stores scene transition as a draft", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneTransition("scene-1", "slide");

    const updatedTemplate = getCurrentTemplate();

    expect(updatedTemplate.scenes[0].transition).toEqual({
      type: "slide",
      durationSeconds: 0.3,
      direction: "left",
    });

    const draft =
      useEditSession.getState().editedTemplatesById["bunny-intro-2026"];

    expect(draft.scenes[0].transition).toEqual({
      type: "slide",
      durationSeconds: 0.3,
      direction: "left",
    });
  });

  it("loads saved scene transition draft instead of original template", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneTransition("scene-1", "fade");

    useEditSession.getState().clearSession();
    useEditSession.getState().loadTemplate(template);

    expect(getCurrentTemplate().scenes[0].transition).toEqual({
      type: "fade",
      durationSeconds: 0.3,
    });
  });

  it("does not update transition when scene is missing", () => {
    const template = createTemplateFixture();

    useEditSession.getState().loadTemplate(template);
    useEditSession.getState().updateSceneTransition("missing-scene", "fade");

    expect(getCurrentTemplate().scenes[0].transition).toBeUndefined();
  });
});
