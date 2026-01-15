import { Repository } from "../services/githubApi";

/**
 * Toggle an organization in the selected organizations array
 */
export const toggleOrganization = (
  selectedOrganizations: string[],
  org: string
): string[] => {
  if (selectedOrganizations.includes(org)) {
    return selectedOrganizations.filter((o) => o !== org);
  }
  return [...selectedOrganizations, org];
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
 * Filter repositories by search query and selected organizations
 */
export const filterRepositories = (
  repositories: Repository[],
  searchQuery: string,
  selectedOrganizations: string[]
): Repository[] => {
  return repositories.filter((repo) => {
    const matchesSearch =
      searchQuery === "" ||
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrganization =
      selectedOrganizations.length > 0 &&
      selectedOrganizations.includes(repo.owner.login);

    return matchesSearch && matchesOrganization;
  });
};
