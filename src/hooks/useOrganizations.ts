import { useMemo, useEffect, useRef } from "react";
import { extractUniqueOrganizations } from "../lib/filterHelpers";
import { useFilterStore } from "../store/filterStore";
import { Repository } from "../services/githubApi";

export const useOrganizations = (repos: Repository[]) => {
  const { setSelectedOrganizations } = useFilterStore();
  const hasInitializedOrgs = useRef(false);

  const organizations = useMemo(() => {
    if (repos.length === 0) return [];
    return extractUniqueOrganizations(repos);
  }, [repos]);

  useEffect(() => {
    if (organizations.length > 0 && !hasInitializedOrgs.current) {
      setSelectedOrganizations(organizations);
      hasInitializedOrgs.current = true;
    }
  }, [organizations, setSelectedOrganizations]);

  return organizations;
};
