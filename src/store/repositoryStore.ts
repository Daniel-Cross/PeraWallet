import { create } from "zustand";
import { Repository } from "../services/githubApi";

interface RepositoryStore {
  selectedRepository: Repository | null;
  setSelectedRepository: (repository: Repository | null) => void;
}

export const useRepositoryStore = create<RepositoryStore>((set) => ({
  selectedRepository: null,
  setSelectedRepository: (repository) =>
    set({ selectedRepository: repository }),
}));
