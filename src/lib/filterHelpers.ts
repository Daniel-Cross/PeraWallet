import { Repository } from "../services/githubApi";

/**
 * Toggle an item in a selected array
 */
export const toggleItem = (selectedItems: string[], item: string): string[] => {
  if (selectedItems.includes(item)) {
    return selectedItems.filter((i) => i !== item);
  }
  return [...selectedItems, item];
};

/**
 * Extract unique organizations from repositories
 */
export const extractUniqueOrganizations = (
  repositories: Repository[]
): string[] => {
  const orgs = repositories.map((repo) => repo.owner.login);
  return Array.from(new Set(orgs)).sort();
};

/**
 * Filter repositories by multiple criteria
 * Note: Empty selectedOrganizations array means "show all" for that filter
 */
export const filterRepositories = (
  repositories: Repository[],
  searchQuery: string,
  selectedOrganizations: string[],
  minStars: number
): Repository[] => {
  return repositories.filter((repo) => {
    const matchesSearch =
      searchQuery === "" ||
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrganization =
      !selectedOrganizations ||
      selectedOrganizations.length === 0 ||
      selectedOrganizations.includes(repo.owner.login);

    const matchesStars = repo.stargazers_count >= minStars;

    return matchesSearch && matchesOrganization && matchesStars;
  });
};
