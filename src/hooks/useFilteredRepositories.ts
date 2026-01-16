import { useMemo } from "react";
import { filterRepositories } from "../lib/filterHelpers";
import { useFilterStore } from "../store/filterStore";
import { Repository } from "../services/githubApi";

export const useFilteredRepositories = (repos: Repository[]) => {
  const { searchText, selectedOrganizations, minStars } = useFilterStore();

  const filteredRepos = useMemo(() => {
    if (repos.length === 0) return [];
    return filterRepositories(
      repos,
      searchText,
      selectedOrganizations,
      minStars
    );
  }, [repos, searchText, selectedOrganizations, minStars]);

  return filteredRepos;
};
