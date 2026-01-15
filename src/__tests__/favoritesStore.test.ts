import { renderHook, act } from "@testing-library/react-native";
import { useFavouritesStore } from "../store/favouritesStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("favouritesStore", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useFavouritesStore());
    act(() => {
      result.current.favouriteIds.forEach((id) => {
        if (result.current.isFavourite(id)) {
          result.current.toggleFavourite(id);
        }
      });
    });
  });

  it("should have empty array as initial state", () => {
    const { result } = renderHook(() => useFavouritesStore());
    expect(result.current.favouriteIds).toEqual([]);
  });

  it("should check if repository is favourite", () => {
    const { result } = renderHook(() => useFavouritesStore());

    expect(result.current.isFavourite(1)).toBe(false);

    act(() => {
      result.current.toggleFavourite(1);
    });

    expect(result.current.isFavourite(1)).toBe(true);
  });

  it("should toggle favourite on", () => {
    const { result } = renderHook(() => useFavouritesStore());
    expect(result.current.isFavourite(1)).toBe(false);

    act(() => {
      result.current.toggleFavourite(1);
    });

    expect(result.current.isFavourite(1)).toBe(true);
    expect(result.current.favouriteIds).toContain(1);
  });

  it("should toggle favourite off", () => {
    const { result } = renderHook(() => useFavouritesStore());
    act(() => {
      result.current.toggleFavourite(1);
    });

    expect(result.current.isFavourite(1)).toBe(true);

    act(() => {
      result.current.toggleFavourite(1);
    });

    expect(result.current.isFavourite(1)).toBe(false);
    expect(result.current.favouriteIds).not.toContain(1);
  });

  it("should toggle multiple times", () => {
    const { result } = renderHook(() => useFavouritesStore());
    act(() => {
      result.current.toggleFavourite(1);
    });
    expect(result.current.isFavourite(1)).toBe(true);
    act(() => {
      result.current.toggleFavourite(1);
    });
    expect(result.current.isFavourite(1)).toBe(false);

    act(() => {
      result.current.toggleFavourite(1);
    });
    expect(result.current.isFavourite(1)).toBe(true);
  });

  it("should handle multiple favourites", () => {
    const { result } = renderHook(() => useFavouritesStore());
    act(() => {
      result.current.toggleFavourite(1);
      result.current.toggleFavourite(2);
      result.current.toggleFavourite(3);
    });

    expect(result.current.favouriteIds).toEqual([1, 2, 3]);
    expect(result.current.isFavourite(1)).toBe(true);
    expect(result.current.isFavourite(2)).toBe(true);
    expect(result.current.isFavourite(3)).toBe(true);
  });

  it("should remove specific favourite when toggled off", () => {
    const { result } = renderHook(() => useFavouritesStore());

    act(() => {
      result.current.toggleFavourite(1);
      result.current.toggleFavourite(2);
    });

    expect(result.current.favouriteIds).toContain(1);

    act(() => {
      result.current.toggleFavourite(1);
    });

    expect(result.current.favouriteIds).not.toContain(1);
    expect(result.current.favouriteIds).toContain(2);
    expect(result.current.isFavourite(1)).toBe(false);
  });

  it("should persist state across hook instances", () => {
    const { result: result1 } = renderHook(() => useFavouritesStore());
    act(() => {
      result1.current.toggleFavourite(1);
    });

    const { result: result2 } = renderHook(() => useFavouritesStore());

    expect(result2.current.favouriteIds).toContain(1);
    expect(result2.current.isFavourite(1)).toBe(true);
  });
});
