import { renderHook, act } from "@testing-library/react-native";
import { useFavoritesStore } from "../store/favoritesStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("favoritesStore", () => {
  beforeEach(async () => {
    // Clear AsyncStorage mock
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    // Reset store state
    const { result } = renderHook(() => useFavoritesStore());
    act(() => {
      // Clear all favorites by toggling them off
      result.current.favoriteIds.forEach((id) => {
        if (result.current.isFavorite(id)) {
          result.current.toggleFavorite(id);
        }
      });
    });
  });

  it("should have empty array as initial state", () => {
    const { result } = renderHook(() => useFavoritesStore());
    expect(result.current.favoriteIds).toEqual([]);
  });

  it("should check if repository is favorite", () => {
    const { result } = renderHook(() => useFavoritesStore());

    expect(result.current.isFavorite(1)).toBe(false);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.isFavorite(1)).toBe(true);
  });

  it("should toggle favorite on", () => {
    const { result } = renderHook(() => useFavoritesStore());

    expect(result.current.isFavorite(1)).toBe(false);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.favoriteIds).toContain(1);
  });

  it("should toggle favorite off", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.isFavorite(1)).toBe(true);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.isFavorite(1)).toBe(false);
    expect(result.current.favoriteIds).not.toContain(1);
  });

  it("should toggle multiple times", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.toggleFavorite(1);
    });
    expect(result.current.isFavorite(1)).toBe(true);

    act(() => {
      result.current.toggleFavorite(1);
    });
    expect(result.current.isFavorite(1)).toBe(false);

    act(() => {
      result.current.toggleFavorite(1);
    });
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it("should handle multiple favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(2);
      result.current.toggleFavorite(3);
    });

    expect(result.current.favoriteIds).toEqual([1, 2, 3]);
    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(2)).toBe(true);
    expect(result.current.isFavorite(3)).toBe(true);
  });

  it("should remove specific favorite when toggled off", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(2);
    });

    expect(result.current.favoriteIds).toContain(1);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favoriteIds).not.toContain(1);
    expect(result.current.favoriteIds).toContain(2);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("should persist state across hook instances", () => {
    const { result: result1 } = renderHook(() => useFavoritesStore());

    act(() => {
      result1.current.toggleFavorite(1);
    });

    const { result: result2 } = renderHook(() => useFavoritesStore());

    expect(result2.current.favoriteIds).toContain(1);
    expect(result2.current.isFavorite(1)).toBe(true);
  });
});
