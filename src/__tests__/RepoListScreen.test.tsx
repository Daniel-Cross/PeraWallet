import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RepoListScreen from "../screens/RepoListScreen";
import { useRepositories } from "../hooks/useRepositories";
import { useOrganizations } from "../hooks/useOrganizations";
import { useFilteredRepositories } from "../hooks/useFilteredRepositories";
import { usePagination } from "../hooks/usePagination";
import { useFilterStore } from "../store/filterStore";
import { useFavouritesStore } from "../store/favouritesStore";
import { useRepositoryStore } from "../store/repositoryStore";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

jest.mock("../hooks/useRepositories");
jest.mock("../hooks/useOrganizations");
jest.mock("../hooks/useFilteredRepositories");
jest.mock("../hooks/usePagination");
jest.mock("../store/filterStore");
jest.mock("../store/repositoryStore");

jest.mock("../store/favouritesStore", () => ({
  useFavouritesStore: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("../components/molecules/SearchAndFilter", () => {
  const React = require("react");
  const MockSearchAndFilter = () => React.createElement("SearchAndFilter", {});
  MockSearchAndFilter.displayName = "SearchAndFilter";
  return { __esModule: true, default: MockSearchAndFilter };
});

jest.mock("../components/molecules/FilterModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockFilterModal = () =>
    React.createElement(View, { testID: "FilterModal" });
  MockFilterModal.displayName = "FilterModal";
  return { __esModule: true, default: MockFilterModal };
});

jest.mock("../components/atoms/Loading", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(Text, {}, "Loading"),
  };
});

jest.mock("../components/atoms/ListEmpty", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(Text, {}, "No repositories found"),
  };
});

describe("RepoListScreen", () => {
  const mockRepos = [
    {
      id: 1,
      name: "react",
      description: "A JavaScript library",
      owner: { login: "facebook" },
      stargazers_count: 1000,
    },
    {
      id: 2,
      name: "angular",
      description: "A TypeScript framework",
      owner: { login: "google" },
      stargazers_count: 500,
    },
    {
      id: 3,
      name: "typescript",
      description: "A typed superset of JavaScript",
      owner: { login: "microsoft" },
      stargazers_count: 800,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useOrganizations as jest.Mock).mockReturnValue([
      "facebook",
      "google",
      "microsoft",
    ]);

    (useFilteredRepositories as jest.Mock).mockImplementation((repos) => repos);

    (usePagination as jest.Mock).mockReturnValue({
      handleLoadMore: jest.fn(),
    });

    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: false,
    });

    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: [],
      status: "pending",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: true,
    });

    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      isFavourite: jest.fn(() => false),
      toggleFavourite: jest.fn(),
    });

    (useRepositoryStore as unknown as jest.Mock).mockReturnValue({
      setSelectedRepository: jest.fn(),
    });
  });

  it("should show loading state when data is loading", () => {
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: [],
      status: "pending",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: true,
    });

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("Loading")).toBeTruthy();
  });

  it("should show error state when there is an error", () => {
    const mockError = new Error("Failed to fetch");
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: [],
      status: "error",
      error: mockError,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("Error: Failed to fetch")).toBeTruthy();
  });

  it("should render repos when data is loaded", () => {
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("angular")).toBeTruthy();
    expect(getByText("typescript")).toBeTruthy();
  });

  it("should display repo details correctly", () => {
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("@facebook")).toBeTruthy();
    expect(getByText("A JavaScript library")).toBeTruthy();
  });

  it("should render FilterModal when isModalVisible is true", () => {
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: true,
      searchText: "",
      selectedOrganizations: [],
      setSelectedOrganizations: jest.fn(),
      minStars: 0,
      setMinStars: jest.fn(),
    });

    const { queryByTestId } = render(<RepoListScreen />);
    expect(queryByTestId("FilterModal")).toBeTruthy();
  });

  it("should not render FilterModal when isModalVisible is false", () => {
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: false,
      searchText: "",
      selectedOrganizations: [],
      setSelectedOrganizations: jest.fn(),
      minStars: 0,
      setMinStars: jest.fn(),
    });

    const { queryByTestId } = render(<RepoListScreen />);
    expect(queryByTestId("FilterModal")).toBeNull();
  });

  it("should show ListEmpty component when no repos match filters", () => {
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: [],
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue([]);

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("No repositories found")).toBeTruthy();
  });

  it("should initialize selectedOrganizations with all organizations", () => {
    const mockOrganizations = ["facebook", "google", "microsoft"];
    (useOrganizations as jest.Mock).mockReturnValue(mockOrganizations);
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);

    render(<RepoListScreen />);
    expect(useOrganizations).toHaveBeenCalledWith(mockRepos);
  });

  it("should render favourite icon for each repository", () => {
    const mockToggleFavourite = jest.fn();
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      isFavourite: jest.fn(() => false),
      toggleFavourite: mockToggleFavourite,
    });
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);

    const { getByTestId } = render(<RepoListScreen />);
    const favouriteIcon = getByTestId("favourite-icon-1");

    fireEvent.press(favouriteIcon);

    expect(mockToggleFavourite).toHaveBeenCalledWith(1);
  });

  it("should call handleLoadMore when scrolling to the end", () => {
    const mockHandleLoadMore = jest.fn();
    (usePagination as jest.Mock).mockReturnValue({
      handleLoadMore: mockHandleLoadMore,
    });
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);

    const { UNSAFE_getByType } = render(<RepoListScreen />);
    const flatList = UNSAFE_getByType(require("react-native").FlatList) as any;

    // Simulate onEndReached
    flatList.props.onEndReached();

    expect(mockHandleLoadMore).toHaveBeenCalled();
  });

  it("should show loading footer when fetching next page", () => {
    (useRepositories as jest.Mock).mockReturnValue({
      allRepos: mockRepos,
      status: "success",
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
      isFetching: false,
    });
    (useFilteredRepositories as jest.Mock).mockReturnValue(mockRepos);

    const { getByText } = render(<RepoListScreen />);

    expect(getByText("Loading")).toBeTruthy();
  });
});
