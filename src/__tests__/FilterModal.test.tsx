import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FilterModal from "../components/molecules/FilterModal";
import { useFilterStore } from "../store/filterStore";

jest.mock("../store/filterStore");

describe("FilterModal", () => {
  const mockSetModalVisible = jest.fn();
  const mockSetSelectedOrganizations = jest.fn();
  const mockSetMinStars = jest.fn();
  const mockOrganizations = ["facebook", "google", "microsoft"];

  beforeEach(() => {
    jest.clearAllMocks();
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: true,
      setModalVisible: mockSetModalVisible,
      selectedOrganizations: ["facebook", "google"],
      setSelectedOrganizations: mockSetSelectedOrganizations,
      minStars: 0,
      setMinStars: mockSetMinStars,
    });
  });

  it("should render modal with organizations tab by default", () => {
    const { getByText } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    expect(getByText("Filters")).toBeTruthy();
    expect(getByText("Organization")).toBeTruthy();
    expect(getByText("Stars")).toBeTruthy();
    expect(getByText("facebook")).toBeTruthy();
  });

  it("should close modal when close button is pressed", () => {
    const { getByText } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    const closeButton = getByText("✕");
    fireEvent.press(closeButton);

    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });

  it("should reset filters when reset button is pressed", () => {
    const { getByText } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    const resetButton = getByText("Reset");
    fireEvent.press(resetButton);

    expect(mockSetSelectedOrganizations).toHaveBeenCalledWith(
      mockOrganizations
    );
    expect(mockSetMinStars).toHaveBeenCalledWith(0);
  });

  it("should toggle organization when item is pressed", () => {
    const { getByTestId } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    const microsoftItem = getByTestId("org-filter-microsoft");
    fireEvent.press(microsoftItem);

    expect(mockSetSelectedOrganizations).toHaveBeenCalledWith([
      "facebook",
      "google",
      "microsoft",
    ]);
  });

  it("should switch to stars tab and handle input", () => {
    const { getByText, getByTestId } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    const starsTab = getByText("Stars");
    fireEvent.press(starsTab);

    const starsInput = getByTestId("stars-input");
    fireEvent.changeText(starsInput, "100");

    expect(mockSetMinStars).toHaveBeenCalledWith(100);
  });

  it("should show badge count for selected organizations", () => {
    const { getAllByText } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    const badge = getAllByText("2")[0];
    expect(badge).toBeTruthy();
  });

  it("should show checked state for selected organizations", () => {
    const { getAllByText } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    const checkmarks = getAllByText("✓");
    expect(checkmarks.length).toBeGreaterThanOrEqual(2);
  });

  it("should not render modal content when isModalVisible is false", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: false,
      setModalVisible: mockSetModalVisible,
      selectedOrganizations: [],
      setSelectedOrganizations: mockSetSelectedOrganizations,
      minStars: 0,
      setMinStars: mockSetMinStars,
    });

    const { queryByText } = render(
      <FilterModal organizations={mockOrganizations} />
    );

    expect(queryByText("Filters")).toBeFalsy();
  });

  it("should handle empty organizations list", () => {
    const { getByText } = render(<FilterModal organizations={[]} />);

    expect(getByText("No organizations found")).toBeTruthy();
  });
});
