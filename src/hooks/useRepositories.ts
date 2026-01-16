import { useMemo } from "react";
import { useGithubRepos } from "./useGithubRepos";
import { Repository } from "../services/githubApi";

export const useRepositories = (usernames?: string[]) => {
  const query = useGithubRepos(usernames);

  const allRepos = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flat() as Repository[];
  }, [query.data]);

  return {
    ...query,
    allRepos,
  };
};
