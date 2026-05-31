import * as Clipboard from "expo-clipboard";
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { TemplateGuideScreen } from "./TemplateGuideScreen";

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
    canGoBack: mockCanGoBack,
  }),
}));

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(),
}));

const mockedSetStringAsync = Clipboard.setStringAsync as jest.MockedFunction<
  typeof Clipboard.setStringAsync
>;

describe("TemplateGuideScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
    mockedSetStringAsync.mockResolvedValue(true);
  });

  it("renders template guide content", () => {
    const { getByTestId, getByText } = render(<TemplateGuideScreen />);

    expect(getByTestId("template-guide-screen")).toBeTruthy();
    expect(getByText("Template guide")).toBeTruthy();
    expect(getByText("What is included")).toBeTruthy();
    expect(getByText("What you add")).toBeTruthy();
    expect(getByText("How it works")).toBeTruthy();
  });

  it("renders AI prompt inside a snippet box", () => {
    const { getByTestId, getByText } = render(<TemplateGuideScreen />);

    expect(getByTestId("template-guide-prompt-box")).toBeTruthy();
    expect(
      getByTestId("template-guide-prompt-snippet").props.children,
    ).toContain("JSON template");
    expect(getByText("BEGIN AI PROMPT")).toBeTruthy();
    expect(getByText("END AI PROMPT")).toBeTruthy();
  });

  it("copies the AI prompt", async () => {
    const { getByTestId, getByText } = render(<TemplateGuideScreen />);

    fireEvent.press(getByTestId("copy-template-guide-prompt-button"));

    await waitFor(() => {
      expect(mockedSetStringAsync).toHaveBeenCalledTimes(1);
      expect(getByText("Prompt copied.")).toBeTruthy();
    });
  });

  it("shows copy error feedback", async () => {
    mockedSetStringAsync.mockRejectedValueOnce(new Error("Clipboard failed"));

    const { getByTestId, getByText } = render(<TemplateGuideScreen />);

    fireEvent.press(getByTestId("copy-template-guide-prompt-button"));

    await waitFor(() => {
      expect(getByText("Could not copy.")).toBeTruthy();
    });
  });

  it("goes back when navigation history exists", () => {
    const { getByTestId } = render(<TemplateGuideScreen />);

    fireEvent.press(getByTestId("navbar-back-button"));

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("replaces with root when no back history exists", () => {
    mockCanGoBack.mockReturnValue(false);

    const { getByTestId } = render(<TemplateGuideScreen />);

    fireEvent.press(getByTestId("navbar-back-button"));

    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
