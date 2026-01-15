import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FavouritesScreen from "../screens/FavouritesScreen";
import { useFavouritesStore } from "../store/favouritesStore";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { useRepositoryStore } from "../store/repositoryStore";
import { useNavigation } from "@react-navigation/native";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");
jest.mock("../hooks/useGithubRepos");
jest.mock("../store/repositoryStore");

jest.mock("../store/favouritesStore", () => ({
  useFavouritesStore: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("../components/atoms/Loading", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(Text, {}, "Loading"),
  };
});

describe("FavouritesScreen", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockRepos = [
    {
      id: 1,
      name: "react",
      description: "A JavaScript library",
      owner: { login: "facebook" },
      stargazers_count: 1000,
      full_name: "facebook/react",
      language: "JavaScript",
      html_url: "https://github.com/facebook/react",
    },
    {
      id: 2,
      name: "vue",
      description: "A progressive framework",
      owner: { login: "vuejs" },
      stargazers_count: 500,
      full_name: "vuejs/vue",
      language: "TypeScript",
      html_url: "https://github.com/vuejs/vue",
    },
    {
      id: 3,
      name: "angular",
      description: "A framework",
      owner: { login: "angular" },
      stargazers_count: 800,
      full_name: "angular/angular",
      language: "TypeScript",
      html_url: "https://github.com/angular/angular",
    },
  ];

  const mockSetSelectedRepository = jest.fn();
  const mockToggleFavourite = jest.fn();
  const mockIsFavourite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      setSelectedRepository: mockSetSelectedRepository,
      selectedRepository: null,
    });
  });

  it("should show loading state when data is loading", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [],
      isFavourite: mockIsFavourite,
      toggleFavourite: mockToggleFavourite,
    });

    const { getByText } = render(<FavouritesScreen />);
    expect(getByText("Loading")).toBeTruthy();
  });

  it("should show empty state when no favourites", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [],
      isFavourite: mockIsFavourite,
      toggleFavourite: mockToggleFavourite,
    });

    const { getByText } = render(<FavouritesScreen />);

    expect(getByText("No Favourites Yet")).toBeTruthy();
    expect(
      getByText(
        "Tap the heart icon on any repository to add it to your favourites"
      )
    ).toBeTruthy();
  });

  it("should display favourited repositories", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [1, 2],
      isFavourite: (id: number) => [1, 2].includes(id),
      toggleFavourite: mockToggleFavourite,
    });

    const { getByText, queryByText } = render(<FavouritesScreen />);

    expect(getByText("react")).toBeTruthy();
    expect(getByText("vue")).toBeTruthy();
    expect(queryByText("angular")).toBeNull();
  });

  it("should navigate to repository detail when item is pressed", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [1],
      isFavourite: (id: number) => id === 1,
      toggleFavourite: mockToggleFavourite,
    });

    const { getByText } = render(<FavouritesScreen />);
    const repoItem = getByText("react");

    fireEvent.press(repoItem);

    expect(mockSetSelectedRepository).toHaveBeenCalledWith(mockRepos[0]);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("IndividualRepo");
  });

  it("should toggle favourite when heart icon is pressed", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [1],
      isFavourite: (id: number) => id === 1,
      toggleFavourite: mockToggleFavourite,
    });

    const { getByTestId } = render(<FavouritesScreen />);
    const favouriteIcon = getByTestId("favourite-icon-1");

    fireEvent.press(favouriteIcon);

    expect(mockToggleFavourite).toHaveBeenCalledWith(1);
  });

  it("should display all favourite repository details", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [1],
      isFavourite: (id: number) => id === 1,
      toggleFavourite: mockToggleFavourite,
    });

    const { getByText } = render(<FavouritesScreen />);

    expect(getByText("@facebook")).toBeTruthy();
    expect(getByText("react")).toBeTruthy();
    expect(getByText("A JavaScript library")).toBeTruthy();
    expect(getByText("1000")).toBeTruthy();
  });

  it("should update displayed repos when favourites change", () => {
    const { rerender, getByText, queryByText } = render(<FavouritesScreen />);

    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });

    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [1],
      isFavourite: (id: number) => id === 1,
      toggleFavourite: mockToggleFavourite,
    });

    rerender(<FavouritesScreen />);
    expect(getByText("react")).toBeTruthy();
    expect(queryByText("vue")).toBeNull();

    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favouriteIds: [1, 2],
      isFavourite: (id: number) => [1, 2].includes(id),
      toggleFavourite: mockToggleFavourite,
    });

    rerender(<FavouritesScreen />);
    expect(getByText("react")).toBeTruthy();
    expect(getByText("vue")).toBeTruthy();
  });
});
