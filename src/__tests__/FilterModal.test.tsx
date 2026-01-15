import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FilterModal from "../components/molecules/FilterModal";
import { useFilterStore } from "../store/filterStore";

jest.mock("../store/filterStore");

describe("FilterModal", () => {
  const mockSetModalVisible = jest.fn();
  const mockHandleOrganizationToggle = jest.fn();
  const mockOrganizations = ["facebook", "google", "microsoft"];
  const mockSelectedOrganizations = ["facebook", "google"];

  beforeEach(() => {
    jest.clearAllMocks();
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: true,
      setModalVisible: mockSetModalVisible,
    });
  });

  it("should render modal with organizations when visible", () => {
    const { getByText } = render(
      <FilterModal
        organizations={mockOrganizations}
        selectedOrganizations={mockSelectedOrganizations}
        handleOrganizationToggle={mockHandleOrganizationToggle}
      />
    );

    expect(getByText("Filter by Organisation")).toBeTruthy();
    expect(getByText("facebook")).toBeTruthy();
    expect(getByText("google")).toBeTruthy();
    expect(getByText("microsoft")).toBeTruthy();
  });

  it("should close modal when close button is pressed", () => {
    const { getByText } = render(
      <FilterModal
        organizations={mockOrganizations}
        selectedOrganizations={mockSelectedOrganizations}
        handleOrganizationToggle={mockHandleOrganizationToggle}
      />
    );

    const closeButton = getByText("✕");
    fireEvent.press(closeButton);

    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });

  it("should toggle organization when item is pressed", () => {
    const { getByText } = render(
      <FilterModal
        organizations={mockOrganizations}
        selectedOrganizations={mockSelectedOrganizations}
        handleOrganizationToggle={mockHandleOrganizationToggle}
      />
    );

    const microsoftItem = getByText("microsoft");
    fireEvent.press(microsoftItem);

    expect(mockHandleOrganizationToggle).toHaveBeenCalledWith("microsoft");
  });

  it("should show checked state for selected organizations", () => {
    const { getAllByText } = render(
      <FilterModal
        organizations={mockOrganizations}
        selectedOrganizations={mockSelectedOrganizations}
        handleOrganizationToggle={mockHandleOrganizationToggle}
      />
    );

    const checkmarks = getAllByText("✓");
    expect(checkmarks).toHaveLength(2);
  });

  it("should not render modal content when isModalVisible is false", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: false,
      setModalVisible: mockSetModalVisible,
    });

    const { queryByText } = render(
      <FilterModal
        organizations={mockOrganizations}
        selectedOrganizations={mockSelectedOrganizations}
        handleOrganizationToggle={mockHandleOrganizationToggle}
      />
    );

    expect(queryByText("Filter by Organisation")).toBeFalsy();
  });

  it("should render all organizations in the list", () => {
    const { getByText } = render(
      <FilterModal
        organizations={mockOrganizations}
        selectedOrganizations={[]}
        handleOrganizationToggle={mockHandleOrganizationToggle}
      />
    );

    mockOrganizations.forEach((org) => {
      expect(getByText(org)).toBeTruthy();
    });
  });

  it("should handle empty organizations list", () => {
    const { queryByText } = render(
      <FilterModal
        organizations={[]}
        selectedOrganizations={[]}
        handleOrganizationToggle={mockHandleOrganizationToggle}
      />
    );

    expect(queryByText("facebook")).toBeFalsy();
    expect(queryByText("google")).toBeFalsy();
  });
});
