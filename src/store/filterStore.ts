import { create } from "zustand";

interface FilterState {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  selectedOrganizations: string[];
  setSelectedOrganizations: (orgs: string[]) => void;
  minStars: number;
  setMinStars: (stars: number) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isModalVisible: false,
  setModalVisible: (visible) => set({ isModalVisible: visible }),
  searchText: "",
  setSearchText: (text) => set({ searchText: text }),
  selectedOrganizations: [],
  setSelectedOrganizations: (orgs) => set({ selectedOrganizations: orgs }),
  minStars: 0,
  setMinStars: (stars) => set({ minStars: stars }),
}));
