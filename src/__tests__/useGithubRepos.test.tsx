import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { fetchGithubRepos } from "../services/githubApi";
import React from "react";

jest.mock("../services/githubApi");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGithubRepos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch repositories successfully", async () => {
    const mockRepos = [
      {
        id: 1,
        name: "test-repo",
        full_name: "user/test-repo",
        description: "A test repository",
        stargazers_count: 100,
        language: "TypeScript",
        html_url: "https://github.com/user/test-repo",
        owner: {
          login: "user",
          avatar_url: "https://avatar.url",
        },
      },
    ];

    (fetchGithubRepos as jest.Mock).mockResolvedValueOnce(mockRepos);

    const { result } = renderHook(() => useGithubRepos(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockRepos);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch errors", async () => {
    const mockError = new Error("Failed to fetch");
    (fetchGithubRepos as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGithubRepos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });

  it("should use custom usernames when provided", async () => {
    const customUsernames = ["facebook", "google"];
    const mockRepos = [{ id: 1, name: "repo" }];

    (fetchGithubRepos as jest.Mock).mockResolvedValueOnce(mockRepos);

    const { result } = renderHook(() => useGithubRepos(customUsernames), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchGithubRepos).toHaveBeenCalledWith(customUsernames);
  });

  it("should use different query keys for different usernames", async () => {
    const mockRepos = [{ id: 1, name: "repo" }];
    (fetchGithubRepos as jest.Mock).mockResolvedValue(mockRepos);

    const { result: result1 } = renderHook(() => useGithubRepos(["user1"]), {
      wrapper: createWrapper(),
    });

    const { result: result2 } = renderHook(() => useGithubRepos(["user2"]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
      expect(result2.current.isSuccess).toBe(true);
    });

    expect(fetchGithubRepos).toHaveBeenCalledWith(["user1"]);
    expect(fetchGithubRepos).toHaveBeenCalledWith(["user2"]);
  });
});
