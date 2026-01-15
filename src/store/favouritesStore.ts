import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavouritesStore {
  favouriteIds: number[];
  isFavourite: (repositoryId: number) => boolean;
  toggleFavourite: (repositoryId: number) => void;
}

export const useFavouritesStore = create<FavouritesStore>()(
  persist(
    (set, get) => ({
      favouriteIds: [],
      isFavourite: (repositoryId) => get().favouriteIds.includes(repositoryId),
      toggleFavourite: (repositoryId) => {
        const { favouriteIds } = get();
        if (favouriteIds.includes(repositoryId)) {
          set({
            favouriteIds: favouriteIds.filter((id) => id !== repositoryId),
          });
        } else {
          set({ favouriteIds: [...favouriteIds, repositoryId] });
        }
      },
    }),
    {
      name: "favourites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
