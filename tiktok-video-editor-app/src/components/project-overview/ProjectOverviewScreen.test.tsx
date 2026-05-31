import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import {
  ProjectOverviewController,
  useProjectOverviewController,
} from "../../application/useProjectOverviewController";
import { ProjectOverviewScreen } from "./ProjectOverviewScreen";

const mockController: ProjectOverviewController = {
  templates: [],
  isLoading: false,
  isImporting: false,
  isCreatePanelOpen: false,
  feedback: null,
  expandedProjectId: null,
  renamingProjectId: null,
  deletingProjectId: null,
  renameDraft: "",
  busyProjectId: null,
  setRenameDraft: jest.fn(),
  toggleCreatePanel: jest.fn(),
  handleOpenTemplateGuide: jest.fn(),
  handleOpenProject: jest.fn(),
  handleImportTemplate: jest.fn(),
  handleCopyPrompt: jest.fn(),
  handleToggleActions: jest.fn(),
  handleStartRename: jest.fn(),
  handleCancelRename: jest.fn(),
  handleSaveRename: jest.fn(),
  handleStartDelete: jest.fn(),
  handleCancelDelete: jest.fn(),
  handleConfirmDelete: jest.fn(),
};

jest.mock("../../application/useProjectOverviewController", () => ({
  useProjectOverviewController: jest.fn(),
}));

jest.mock("../AppNavbar", () => ({
  AppNavbar: () => null,
}));

const mockedUseProjectOverviewController =
  useProjectOverviewController as jest.MockedFunction<
    typeof useProjectOverviewController
  >;

describe("ProjectOverviewScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseProjectOverviewController.mockReturnValue(mockController);
  });

  it("renders guide action", () => {
    const { getByTestId, getByText } = render(<ProjectOverviewScreen />);

    expect(getByTestId("template-guide-button")).toBeTruthy();
    expect(getByText("Guide")).toBeTruthy();
  });

  it("opens template guide when guide action is pressed", () => {
    const { getByTestId } = render(<ProjectOverviewScreen />);

    fireEvent.press(getByTestId("template-guide-button"));

    expect(mockController.handleOpenTemplateGuide).toHaveBeenCalledTimes(1);
  });
});
