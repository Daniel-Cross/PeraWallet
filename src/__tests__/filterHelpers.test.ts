import {
  toggleItem,
  extractUniqueOrganizations,
  filterRepositories,
} from "../lib/filterHelpers";
import { Repository } from "../services/githubApi";

describe("filterHelpers", () => {
  describe("extractUniqueOrganizations", () => {
    it("should extract unique organizations sorted alphabetically", () => {
      const repos: Repository[] = [
        { owner: { login: "orgC", avatar_url: "" } } as Repository,
        { owner: { login: "orgA", avatar_url: "" } } as Repository,
        { owner: { login: "orgB", avatar_url: "" } } as Repository,
        { owner: { login: "orgA", avatar_url: "" } } as Repository,
      ];
      const result = extractUniqueOrganizations(repos);
      expect(result).toEqual(["orgA", "orgB", "orgC"]);
    });

    it("should return empty array for empty input", () => {
      const result = extractUniqueOrganizations([]);
      expect(result).toEqual([]);
    });
  });

  describe("toggleItem", () => {
    it("should add item if not present", () => {
      const selected = ["item1", "item2"];
      const result = toggleItem(selected, "item3");
      expect(result).toEqual(["item1", "item2", "item3"]);
    });

    it("should remove item if present", () => {
      const selected = ["item1", "item2", "item3"];
      const result = toggleItem(selected, "item2");
      expect(result).toEqual(["item1", "item3"]);
    });
  });

  describe("filterRepositories", () => {
    const mockRepos: Repository[] = [
      {
        id: 1,
        name: "react-app",
        description: "A React application",
        owner: { login: "facebook", avatar_url: "" },
        language: "JavaScript",
        stargazers_count: 100,
      } as Repository,
      {
        id: 2,
        name: "vue-app",
        description: "A Vue application",
        owner: { login: "vuejs", avatar_url: "" },
        language: "TypeScript",
        stargazers_count: 50,
      } as Repository,
      {
        id: 3,
        name: "angular-app",
        description: null,
        owner: { login: "angular", avatar_url: "" },
        language: "TypeScript",
        stargazers_count: 200,
      } as Repository,
      {
        id: 4,
        name: "python-tool",
        description: "A Python tool",
        owner: { login: "python", avatar_url: "" },
        language: "Python",
        stargazers_count: 25,
      } as Repository,
    ];

    it("should return all repos when no filters applied", () => {
      const result = filterRepositories(mockRepos, "", [], 0);
      expect(result).toHaveLength(4);
    });

    it("should filter by search query in name", () => {
      const result = filterRepositories(mockRepos, "react", [], 0);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("react-app");
    });

    it("should filter by organization", () => {
      const result = filterRepositories(
        mockRepos,
        "",
        ["facebook", "vuejs"],
        0
      );
      expect(result).toHaveLength(2);
    });

    it("should filter by minimum stars", () => {
      const result = filterRepositories(mockRepos, "", [], 100);
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.stargazers_count >= 100)).toBe(true);
    });

    it("should filter by multiple criteria", () => {
      const result = filterRepositories(
        mockRepos,
        "app",
        ["facebook", "angular"],
        50
      );
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.name)).toContain("react-app");
      expect(result.map((r) => r.name)).toContain("angular-app");
    });

    it("should be case insensitive for search", () => {
      const result = filterRepositories(mockRepos, "REACT", [], 0);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("react-app");
    });

    it("should return empty array when filters exclude all repos", () => {
      const result = filterRepositories(mockRepos, "test", ["facebook"], 1000);
      expect(result).toHaveLength(0);
    });
  });
});
