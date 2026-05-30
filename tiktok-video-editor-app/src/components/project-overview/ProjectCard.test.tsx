import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Template } from "../../types/template";
import { ProjectCard } from "./ProjectCard";

function createTemplate(): Template {
  return {
    id: "project-1",
    title: "Project One",
    sourceVideoUrl: "https://example.com/source.mp4",
    orientation: "landscape",
    originalVolume: 1,
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "Show the product.",
        textOverlays: [],
        effects: [],
      },
    ],
  };
}

function renderProjectCard(
  overrides: Partial<React.ComponentProps<typeof ProjectCard>> = {},
) {
  const props: React.ComponentProps<typeof ProjectCard> = {
    template: createTemplate(),
    isActionsOpen: true,
    isRenaming: false,
    isDeleting: false,
    renameDraft: "Project One",
    isBusy: false,
    onOpenProject: jest.fn(),
    onToggleActions: jest.fn(),
    onStartRename: jest.fn(),
    onRenameDraftChange: jest.fn(),
    onSaveRename: jest.fn(),
    onCancelRename: jest.fn(),
    onStartDelete: jest.fn(),
    onConfirmDelete: jest.fn(),
    onCancelDelete: jest.fn(),
    ...overrides,
  };

  return {
    ...render(<ProjectCard {...props} />),
    props,
  };
}

describe("ProjectCard", () => {
  it("opens project from the card", () => {
    const { getByTestId, props } = renderProjectCard();

    fireEvent.press(getByTestId("template-card-project-1"));

    expect(props.onOpenProject).toHaveBeenCalledWith("project-1");
  });

  it("starts rename from project actions", () => {
    const { getByTestId, props } = renderProjectCard();

    fireEvent.press(getByTestId("project-rename-project-1"));

    expect(props.onStartRename).toHaveBeenCalledWith(props.template);
  });

  it("shows rename panel and saves new name", () => {
    const { getByTestId, props } = renderProjectCard({
      isRenaming: true,
      renameDraft: "New title",
    });

    fireEvent.changeText(getByTestId("project-rename-input-project-1"), "Next");
    fireEvent.press(getByTestId("project-rename-save-project-1"));

    expect(props.onRenameDraftChange).toHaveBeenCalledWith("Next");
    expect(props.onSaveRename).toHaveBeenCalledWith("project-1");
  });

  it("shows delete confirmation and confirms delete", () => {
    const { getByTestId, props } = renderProjectCard({
      isDeleting: true,
    });

    fireEvent.press(getByTestId("project-delete-confirm-project-1"));

    expect(props.onConfirmDelete).toHaveBeenCalledWith(props.template);
  });

  it("allows delete cancellation", () => {
    const { getByTestId, props } = renderProjectCard({
      isDeleting: true,
    });

    fireEvent.press(getByTestId("project-delete-cancel-project-1"));

    expect(props.onCancelDelete).toHaveBeenCalledTimes(1);
  });
});
