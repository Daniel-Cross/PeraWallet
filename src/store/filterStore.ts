import { create } from "zustand";

interface FilterState {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isModalVisible: false,
  setModalVisible: (visible) => set({ isModalVisible: visible }),
  searchText: "",
  setSearchText: (text) => set({ searchText: text }),
}));
