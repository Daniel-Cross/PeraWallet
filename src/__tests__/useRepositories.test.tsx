import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRepositories } from "../hooks/useRepositories";
import { fetchGithubRepos } from "../services/githubApi";
import React from "react";

jest.mock("../services/githubApi");

describe("useRepositories", () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const mockReposPage1 = [
    {
      id: 1,
      name: "repo1",
      full_name: "user/repo1",
      description: "Repository 1",
      stargazers_count: 100,
      language: "TypeScript",
      html_url: "https://github.com/user/repo1",
      owner: { login: "user", avatar_url: "https://avatar.url" },
    },
    {
      id: 2,
      name: "repo2",
      full_name: "user/repo2",
      description: "Repository 2",
      stargazers_count: 200,
      language: "JavaScript",
      html_url: "https://github.com/user/repo2",
      owner: { login: "user", avatar_url: "https://avatar.url" },
    },
  ];

  const mockReposPage2 = [
    {
      id: 3,
      name: "repo3",
      full_name: "user/repo3",
      description: "Repository 3",
      stargazers_count: 300,
      language: "Python",
      html_url: "https://github.com/user/repo3",
      owner: { login: "user", avatar_url: "https://avatar.url" },
    },
  ];

  it("should return empty array when no data is loaded", () => {
    (fetchGithubRepos as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useRepositories(), {
      wrapper: createWrapper(),
    });

    expect(result.current.allRepos).toEqual([]);
  });

  it("should flatten pages into allRepos array", async () => {
    (fetchGithubRepos as jest.Mock)
      .mockResolvedValueOnce(mockReposPage1)
      .mockResolvedValueOnce(mockReposPage2);

    const { result } = renderHook(() => useRepositories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.allRepos).toHaveLength(2);
    expect(result.current.allRepos).toEqual(mockReposPage1);

    // Fetch next page
    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.allRepos).toHaveLength(3);
    });

    expect(result.current.allRepos).toEqual([
      ...mockReposPage1,
      ...mockReposPage2,
    ]);
  });

  it("should expose all infinite query methods", async () => {
    (fetchGithubRepos as jest.Mock).mockResolvedValueOnce(mockReposPage1);

    const { result } = renderHook(() => useRepositories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.fetchNextPage).toBeDefined();
    expect(result.current.hasNextPage).toBeDefined();
    expect(result.current.isFetchingNextPage).toBeDefined();
    expect(result.current.isFetching).toBeDefined();
    expect(result.current.error).toBeDefined();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Failed to fetch");
    (fetchGithubRepos as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRepositories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.allRepos).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  it("should use custom usernames when provided", async () => {
    const customUsernames = ["facebook", "google"];
    (fetchGithubRepos as jest.Mock).mockResolvedValueOnce(mockReposPage1);

    const { result } = renderHook(() => useRepositories(customUsernames), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(fetchGithubRepos).toHaveBeenCalledWith({
      usernames: customUsernames,
      page: 1,
    });
  });
});
