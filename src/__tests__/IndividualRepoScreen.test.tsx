import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import IndividualRepoScreen from "../screens/IndividualRepo/IndividualRepoScreen";
import { useRepositoryStore } from "../store/repositoryStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "react-native";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");
jest.mock("../store/repositoryStore");

// Mock the favoritesStore before it's imported
jest.mock("../store/favoritesStore", () => ({
  useFavoritesStore: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("IndividualRepoScreen", () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockRepository = {
    id: 1,
    name: "test-repo",
    full_name: "user/test-repo",
    description: "A test repository",
    stargazers_count: 1500,
    language: "TypeScript",
    html_url: "https://github.com/user/test-repo",
    owner: {
      login: "testuser",
      avatar_url: "https://avatar.url",
    },
  };

  const mockSetSelectedRepository = jest.fn();
  const mockIsFavorite = jest.fn();
  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      isFavorite: mockIsFavorite,
      toggleFavorite: mockToggleFavorite,
    });
  });

  it("should render 'No repository selected' when no repository is selected", () => {
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: null,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByText } = render(<IndividualRepoScreen />);
    expect(getByText("No repository selected")).toBeTruthy();
  });

  it("should render repository details when repository is selected", () => {
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: mockRepository,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByText } = render(<IndividualRepoScreen />);

    expect(getByText("@testuser")).toBeTruthy();
    expect(getByText("test-repo")).toBeTruthy();
    expect(getByText("A test repository")).toBeTruthy();
    expect(getByText("1,500 stars")).toBeTruthy();
    expect(getByText("TypeScript")).toBeTruthy();
    expect(getByText("user/test-repo")).toBeTruthy();
  });

  it("should render without description when description is null", () => {
    const repoWithoutDescription = { ...mockRepository, description: null };
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: repoWithoutDescription,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { queryByText, getByText } = render(<IndividualRepoScreen />);

    expect(getByText("test-repo")).toBeTruthy();
    expect(queryByText("A test repository")).toBeNull();
  });

  it("should render without language when language is null", () => {
    const repoWithoutLanguage = { ...mockRepository, language: null };
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: repoWithoutLanguage,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { queryByText, getByText } = render(<IndividualRepoScreen />);

    expect(getByText("test-repo")).toBeTruthy();
    expect(queryByText("TypeScript")).toBeNull();
  });

  it("should call goBack and clear repository when back button is pressed", () => {
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: mockRepository,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByTestId } = render(<IndividualRepoScreen />);
    const backButton = getByTestId("back-button");

    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
    expect(mockSetSelectedRepository).toHaveBeenCalledWith(null);
  });

  it("should open GitHub URL when 'View on GitHub' button is pressed", () => {
    const openURLSpy = jest.spyOn(Linking.Linking, "openURL");

    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: mockRepository,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByText } = render(<IndividualRepoScreen />);
    const githubButton = getByText("View on GitHub");

    fireEvent.press(githubButton);

    expect(openURLSpy).toHaveBeenCalledWith(
      "https://github.com/user/test-repo"
    );
  });

  it("should display header with title", () => {
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: mockRepository,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByText } = render(<IndividualRepoScreen />);
    expect(getByText("Repository Details")).toBeTruthy();
  });

  it("should format star count with locale string", () => {
    const repoWithManyStars = { ...mockRepository, stargazers_count: 123456 };
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: repoWithManyStars,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByText } = render(<IndividualRepoScreen />);
    expect(getByText("123,456 stars")).toBeTruthy();
  });

  it("should display filled heart icon when repository is favorited", () => {
    mockIsFavorite.mockReturnValue(true);
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: mockRepository,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByTestId } = render(<IndividualRepoScreen />);
    const favoriteButton = getByTestId("favorite-button");

    expect(favoriteButton).toBeTruthy();
    expect(mockIsFavorite).toHaveBeenCalledWith(mockRepository.id);
  });

  it("should display empty heart icon when repository is not favorited", () => {
    mockIsFavorite.mockReturnValue(false);
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: mockRepository,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByTestId } = render(<IndividualRepoScreen />);
    const favoriteButton = getByTestId("favorite-button");

    expect(favoriteButton).toBeTruthy();
    expect(mockIsFavorite).toHaveBeenCalledWith(mockRepository.id);
  });

  it("should toggle favorite when favorite button is pressed", () => {
    mockIsFavorite.mockReturnValue(false);
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      selectedRepository: mockRepository,
      setSelectedRepository: mockSetSelectedRepository,
    });

    const { getByTestId } = render(<IndividualRepoScreen />);
    const favoriteButton = getByTestId("favorite-button");

    fireEvent.press(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockRepository.id);
  });
});
