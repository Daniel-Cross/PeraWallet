import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SearchAndFilter from "../components/molecules/SearchAndFilter";
import { useFilterStore } from "../store/filterStore";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

jest.mock("../store/filterStore");
jest.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

describe("SearchAndFilter", () => {
  const mockSetSearchText = jest.fn();
  const mockSetModalVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "",
      setSearchText: mockSetSearchText,
      setModalVisible: mockSetModalVisible,
    });
  });

  it("should render search input and filter button", () => {
    const { getByPlaceholderText } = render(<SearchAndFilter />);

    const input = getByPlaceholderText("Search repositories...");
    expect(input).toBeTruthy();
    expect(input.props.value).toBe("");
  });

  it("should call setSearchText when typing", async () => {
    const { getByPlaceholderText } = render(<SearchAndFilter />);
    const input = getByPlaceholderText("Search repositories...");

    fireEvent.changeText(input, "react");

    await waitFor(() => {
      expect(mockSetSearchText).toHaveBeenCalledWith("react");
    });
  });

  it("should open modal when filter button is pressed", () => {
    const { getByTestId } = render(<SearchAndFilter />);

    const filterButton = getByTestId("filter-button");
    fireEvent.press(filterButton);

    expect(mockSetModalVisible).toHaveBeenCalledWith(true);
  });

  it("should handle empty search text", () => {
    const { getByPlaceholderText } = render(<SearchAndFilter />);
    const input = getByPlaceholderText("Search repositories...");

    fireEvent.changeText(input, "test");
    fireEvent.changeText(input, "");

    expect(input.props.value).toBe("");
  });
});
