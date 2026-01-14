// src/hooks/useGithubRepos.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGithubRepos } from "../services/githubApi";

export const useGithubRepos = (usernames?: string[]) => {
  return useQuery({
    queryKey: ["repos", usernames],
    queryFn: () => fetchGithubRepos(usernames),
  });
};
