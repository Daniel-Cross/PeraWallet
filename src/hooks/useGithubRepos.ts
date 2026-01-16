import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGithubRepos } from "../services/githubApi";

export const useGithubRepos = (usernames?: string[]) => {
  return useInfiniteQuery({
    queryKey: ["infiniteRepos", usernames],
    queryFn: ({ pageParam }) =>
      fetchGithubRepos({ usernames, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
};
