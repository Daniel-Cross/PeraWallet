import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import RepoListScreen from "../screens/RepoList/RepoListScreen";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { useFilterStore } from "../store/filterStore";

// Mock FontAwesome at the top
jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

// Mock dependencies
jest.mock("../hooks/useGithubRepos");
jest.mock("../store/filterStore");
jest.mock("../components/molecules/SearchAndFilter", () => "SearchAndFilter");
jest.mock("../components/molecules/FilterModal", () => "FilterModal");
jest.mock("../components/atoms/Loading", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, {}, "Loading");
});
jest.mock("../components/atoms/ListEmpty", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => React.createElement(Text, {}, "No repositories found");
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
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: false,
      searchText: "",
    });
  });

  it("should show loading state when data is loading", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("Loading")).toBeTruthy();
  });

  it("should show error state when there is an error", () => {
    const mockError = new Error("Failed to fetch");
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("Error: Failed to fetch")).toBeTruthy();
  });

  it("should render repos when data is loaded", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<RepoListScreen />);

    expect(getByText("react")).toBeTruthy();
    expect(getByText("angular")).toBeTruthy();
    expect(getByText("typescript")).toBeTruthy();
  });

  it("should display repo details correctly", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<RepoListScreen />);

    expect(getByText("@facebook")).toBeTruthy();
    expect(getByText("A JavaScript library")).toBeTruthy();
    expect(getByText("1000")).toBeTruthy();
  });

  it("should render SearchAndFilter component", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });

    const { UNSAFE_getByType } = render(<RepoListScreen />);
    expect(UNSAFE_getByType("SearchAndFilter")).toBeTruthy();
  });

  it("should render FilterModal when isModalVisible is true", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: true,
      searchText: "",
    });

    const { UNSAFE_getByType } = render(<RepoListScreen />);
    expect(UNSAFE_getByType("FilterModal")).toBeTruthy();
  });

  it("should not render FilterModal when isModalVisible is false", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      isModalVisible: false,
      searchText: "",
    });

    const { UNSAFE_queryByType } = render(<RepoListScreen />);
    expect(UNSAFE_queryByType("FilterModal")).toBeFalsy();
  });

  it("should show ListEmpty component when no repos match filters", () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<RepoListScreen />);
    expect(getByText("No repositories found")).toBeTruthy();
  });

  it("should initialize selectedOrganizations with all organizations", async () => {
    (useGithubRepos as jest.Mock).mockReturnValue({
      data: mockRepos,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<RepoListScreen />);

    // Wait for useEffect to set selectedOrganizations
    await waitFor(() => {
      // All repos should be visible initially
      expect(getByText("react")).toBeTruthy();
      expect(getByText("angular")).toBeTruthy();
      expect(getByText("typescript")).toBeTruthy();
    });
  });
});
