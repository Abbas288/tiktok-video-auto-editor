import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { AppNavbar } from "./AppNavbar";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe("AppNavbar", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders My Projects navigation link", () => {
    const { getByTestId, getByText } = render(<AppNavbar />);

    expect(getByTestId("my-projects-nav-link")).toBeTruthy();
    expect(getByText("My Projects")).toBeTruthy();
  });

  it("navigates to root when My Projects is pressed", () => {
    const { getByTestId } = render(<AppNavbar />);

    fireEvent.press(getByTestId("my-projects-nav-link"));

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("calls back action when back button is pressed", () => {
    const onBack = jest.fn();

    const { getByTestId } = render(
      <AppNavbar showBackButton projectTitle="Demo project" onBack={onBack} />,
    );

    fireEvent.press(getByTestId("navbar-back-button"));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders current project title when provided", () => {
    const { getByTestId } = render(
      <AppNavbar showBackButton projectTitle="Imported Template" />,
    );

    expect(getByTestId("navbar-project-title").props.children).toBe(
      "Imported Template",
    );
  });
});
