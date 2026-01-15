import { fetchGithubRepos } from "../services/githubApi";

global.fetch = jest.fn();

describe("githubApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchGithubRepos", () => {
    it("should fetch repositories for default users", async () => {
      const mockRepos = [
        { id: 1, name: "repo1", owner: { login: "algorandfoundation" } },
        { id: 2, name: "repo2", owner: { login: "algorand" } },
        { id: 3, name: "repo3", owner: { login: "perawallet" } },
      ];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [mockRepos[0]],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [mockRepos[1]],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      const result = await fetchGithubRepos();

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/algorandfoundation/repos"
      );
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/algorand/repos"
      );
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/perawallet/repos"
      );
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("repo1");
      expect(result[1].name).toBe("repo2");
    });

    it("should fetch repositories for custom users", async () => {
      const mockRepos = [
        { id: 1, name: "custom-repo", owner: { login: "facebook" } },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await fetchGithubRepos(["facebook"]);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/facebook/repos"
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("custom-repo");
    });

    it("should return empty array for failed requests", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const result = await fetchGithubRepos(["nonexistent"]);

      expect(result).toEqual([]);
    });

    it("should flatten results from multiple users", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            { id: 1, name: "repo1" },
            { id: 2, name: "repo2" },
          ],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 3, name: "repo3" }],
        });

      const result = await fetchGithubRepos(["user1", "user2"]);

      expect(result).toHaveLength(3);
      expect(result.map((r) => r.name)).toEqual(["repo1", "repo2", "repo3"]);
    });

    it("should handle mix of successful and failed requests", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 1, name: "repo1" }],
        })
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 2, name: "repo2" }],
        });

      const result = await fetchGithubRepos(["user1", "user2", "user3"]);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.name)).toEqual(["repo1", "repo2"]);
    });

    it("should handle fetch errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(fetchGithubRepos(["user1"])).rejects.toThrow(
        "Network error"
      );
    });
  });
});
