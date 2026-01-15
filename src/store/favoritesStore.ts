import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesStore {
  favoriteIds: number[];
  isFavorite: (repositoryId: number) => boolean;
  toggleFavorite: (repositoryId: number) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      isFavorite: (repositoryId) => get().favoriteIds.includes(repositoryId),
      toggleFavorite: (repositoryId) => {
        const { favoriteIds } = get();
        if (favoriteIds.includes(repositoryId)) {
          set({ favoriteIds: favoriteIds.filter((id) => id !== repositoryId) });
        } else {
          set({ favoriteIds: [...favoriteIds, repositoryId] });
        }
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
