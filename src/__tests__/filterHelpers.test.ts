import {
  toggleOrganization,
  extractUniqueOrganizations,
  filterRepositories,
} from "../lib/filterHelpers";
import { Repository } from "../services/githubApi";

describe("filterHelpers", () => {
  describe("toggleOrganization", () => {
    it("should add organization if not present", () => {
      const selected = ["org1", "org2"];
      const result = toggleOrganization(selected, "org3");
      expect(result).toEqual(["org1", "org2", "org3"]);
    });

    it("should remove organization if present", () => {
      const selected = ["org1", "org2", "org3"];
      const result = toggleOrganization(selected, "org2");
      expect(result).toEqual(["org1", "org3"]);
    });
  });

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

  describe("filterRepositories", () => {
    const mockRepos: Repository[] = [
      {
        id: 1,
        name: "react-app",
        description: "A React application",
        owner: { login: "facebook", avatar_url: "" },
      } as Repository,
      {
        id: 2,
        name: "vue-app",
        description: "A Vue application",
        owner: { login: "vuejs", avatar_url: "" },
      } as Repository,
      {
        id: 3,
        name: "angular-app",
        description: null,
        owner: { login: "angular", avatar_url: "" },
      } as Repository,
    ];

    it("should return empty array when no organizations are selected", () => {
      const result = filterRepositories(mockRepos, "", []);
      expect(result).toHaveLength(0);
    });

    it("should filter by search query in name when organizations are selected", () => {
      const result = filterRepositories(mockRepos, "react", ["facebook"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("react-app");
    });

    it("should filter by search query in description when organizations are selected", () => {
      const result = filterRepositories(mockRepos, "vue application", ["vuejs"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("vue-app");
    });

    it("should filter by selected organizations", () => {
      const result = filterRepositories(mockRepos, "", ["facebook", "vuejs"]);
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.name)).toEqual(["react-app", "vue-app"]);
    });

    it("should filter by both search and organization", () => {
      const result = filterRepositories(mockRepos, "app", ["facebook"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("react-app");
    });

    it("should be case insensitive for search", () => {
      const result = filterRepositories(mockRepos, "REACT", ["facebook"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("react-app");
    });

    it("should return all repos when all organizations are selected", () => {
      const result = filterRepositories(mockRepos, "", ["facebook", "vuejs", "angular"]);
      expect(result).toHaveLength(3);
    });
  });
});
