import { renderHook, act } from "@testing-library/react-native";
import { useFilterStore } from "../store/filterStore";

describe("filterStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useFilterStore());
    act(() => {
      result.current.setModalVisible(false);
      result.current.setSearchText("");
    });
  });

  describe("modal state", () => {
    it("should initialize with modal closed", () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.isModalVisible).toBe(false);
    });

    it("should set modal to visible", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setModalVisible(true);
      });

      expect(result.current.isModalVisible).toBe(true);
    });

    it("should set modal to hidden", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setModalVisible(true);
      });

      expect(result.current.isModalVisible).toBe(true);

      act(() => {
        result.current.setModalVisible(false);
      });

      expect(result.current.isModalVisible).toBe(false);
    });
  });

  describe("search text state", () => {
    it("should initialize with empty search text", () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.searchText).toBe("");
    });

    it("should update search text", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSearchText("react");
      });

      expect(result.current.searchText).toBe("react");
    });

    it("should clear search text", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSearchText("react");
      });

      expect(result.current.searchText).toBe("react");

      act(() => {
        result.current.setSearchText("");
      });

      expect(result.current.searchText).toBe("");
    });
  });
});
