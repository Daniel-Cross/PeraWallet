import { renderHook } from "@testing-library/react-native";
import { useOrganizations } from "../hooks/useOrganizations";
import { useFilterStore } from "../store/filterStore";
import { Repository } from "../services/githubApi";

jest.mock("../store/filterStore");

describe("useOrganizations", () => {
  const mockSetSelectedOrganizations = jest.fn();

  const mockRepos: Repository[] = [
    {
      id: 1,
      name: "repo1",
      full_name: "facebook/repo1",
      description: "Repository 1",
      stargazers_count: 100,
      language: "TypeScript",
      html_url: "https://github.com/facebook/repo1",
      owner: { login: "facebook", avatar_url: "https://avatar.url" },
    },
    {
      id: 2,
      name: "repo2",
      full_name: "google/repo2",
      description: "Repository 2",
      stargazers_count: 200,
      language: "JavaScript",
      html_url: "https://github.com/google/repo2",
      owner: { login: "google", avatar_url: "https://avatar.url" },
    },
    {
      id: 3,
      name: "repo3",
      full_name: "facebook/repo3",
      description: "Repository 3",
      stargazers_count: 300,
      language: "Python",
      html_url: "https://github.com/facebook/repo3",
      owner: { login: "facebook", avatar_url: "https://avatar.url" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      setSelectedOrganizations: mockSetSelectedOrganizations,
    });
  });

  it("should return empty array when repos array is empty", () => {
    const { result } = renderHook(() => useOrganizations([]));
    expect(result.current).toEqual([]);
  });

  it("should extract unique organizations from repos", () => {
    const { result } = renderHook(() => useOrganizations(mockRepos));
    expect(result.current).toEqual(["facebook", "google"]);
  });

  it("should initialize selected organizations on first render", () => {
    renderHook(() => useOrganizations(mockRepos));
    expect(mockSetSelectedOrganizations).toHaveBeenCalledWith([
      "facebook",
      "google",
    ]);
  });

  it("should only initialize selected organizations once", () => {
    const { rerender } = renderHook(
      ({ repos }: { repos: Repository[] }) => useOrganizations(repos),
      {
        initialProps: { repos: mockRepos },
      }
    );

    expect(mockSetSelectedOrganizations).toHaveBeenCalledTimes(1);

    rerender({ repos: mockRepos });
    expect(mockSetSelectedOrganizations).toHaveBeenCalledTimes(1);
  });

  it("should not initialize when repos are empty", () => {
    renderHook(() => useOrganizations([]));
    expect(mockSetSelectedOrganizations).not.toHaveBeenCalled();
  });

  it("should update when new repos are added", () => {
    const { result, rerender } = renderHook(
      ({ repos }: { repos: Repository[] }) => useOrganizations(repos),
      {
        initialProps: { repos: [] },
      }
    );

    expect(result.current).toEqual([]);
    expect(mockSetSelectedOrganizations).not.toHaveBeenCalled();

    rerender({ repos: mockRepos });

    expect(result.current).toEqual(["facebook", "google"]);
    expect(mockSetSelectedOrganizations).toHaveBeenCalledWith([
      "facebook",
      "google",
    ]);
  });
});
