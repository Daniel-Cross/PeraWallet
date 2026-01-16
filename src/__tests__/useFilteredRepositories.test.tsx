import { renderHook } from "@testing-library/react-native";
import { useFilteredRepositories } from "../hooks/useFilteredRepositories";
import { useFilterStore } from "../store/filterStore";
import { Repository } from "../services/githubApi";

jest.mock("../store/filterStore");
jest.mock("../lib/filterHelpers", () => ({
  filterRepositories: jest.fn((repos, search, orgs, stars) => {
    let filtered = [...repos];

    if (search) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(search.toLowerCase()) ||
          repo.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (orgs.length > 0) {
      filtered = filtered.filter((repo) => orgs.includes(repo.owner.login));
    }

    if (stars > 0) {
      filtered = filtered.filter((repo) => repo.stargazers_count >= stars);
    }

    return filtered;
  }),
}));

describe("useFilteredRepositories", () => {
  const mockRepos: Repository[] = [
    {
      id: 1,
      name: "react",
      full_name: "facebook/react",
      description: "A JavaScript library",
      stargazers_count: 1000,
      language: "TypeScript",
      html_url: "https://github.com/facebook/react",
      owner: { login: "facebook", avatar_url: "https://avatar.url" },
    },
    {
      id: 2,
      name: "angular",
      full_name: "google/angular",
      description: "A TypeScript framework",
      stargazers_count: 500,
      language: "TypeScript",
      html_url: "https://github.com/google/angular",
      owner: { login: "google", avatar_url: "https://avatar.url" },
    },
    {
      id: 3,
      name: "vue",
      full_name: "vuejs/vue",
      description: "Progressive JavaScript framework",
      stargazers_count: 800,
      language: "JavaScript",
      html_url: "https://github.com/vuejs/vue",
      owner: { login: "vuejs", avatar_url: "https://avatar.url" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty array when repos array is empty", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "",
      selectedOrganizations: [],
      minStars: 0,
    });

    const { result } = renderHook(() => useFilteredRepositories([]));
    expect(result.current).toEqual([]);
  });

  it("should return all repos when no filters applied", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "",
      selectedOrganizations: ["facebook", "google", "vuejs"],
      minStars: 0,
    });

    const { result } = renderHook(() => useFilteredRepositories(mockRepos));
    expect(result.current).toHaveLength(3);
  });

  it("should filter by search text", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "react",
      selectedOrganizations: ["facebook", "google", "vuejs"],
      minStars: 0,
    });

    const { result } = renderHook(() => useFilteredRepositories(mockRepos));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe("react");
  });

  it("should filter by organization", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "",
      selectedOrganizations: ["facebook"],
      minStars: 0,
    });

    const { result } = renderHook(() => useFilteredRepositories(mockRepos));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].owner.login).toBe("facebook");
  });

  it("should filter by minimum stars", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "",
      selectedOrganizations: ["facebook", "google", "vuejs"],
      minStars: 600,
    });

    const { result } = renderHook(() => useFilteredRepositories(mockRepos));
    expect(result.current).toHaveLength(2);
    expect(result.current.every((repo) => repo.stargazers_count >= 600)).toBe(
      true
    );
  });

  it("should apply multiple filters together", () => {
    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "JavaScript",
      selectedOrganizations: ["facebook", "vuejs"],
      minStars: 700,
    });

    const { result } = renderHook(() => useFilteredRepositories(mockRepos));
    expect(result.current).toHaveLength(2);
  });

  it("should update when filters change", () => {
    const { result, rerender } = renderHook(() => {
      return useFilteredRepositories(mockRepos);
    });

    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "",
      selectedOrganizations: ["facebook", "google", "vuejs"],
      minStars: 0,
    });
    rerender(useFilterStore);
    expect(result.current).toHaveLength(3);

    (useFilterStore as unknown as jest.Mock).mockReturnValue({
      searchText: "react",
      selectedOrganizations: ["facebook", "google", "vuejs"],
      minStars: 0,
    });
    rerender(useFilterStore);
    expect(result.current).toHaveLength(1);
  });
});
