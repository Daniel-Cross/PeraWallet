import { renderHook, act } from "@testing-library/react-native";
import { useFilterStore } from "../store/filterStore";

describe("filterStore", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useFilterStore());
    act(() => {
      result.current.setModalVisible(false);
      result.current.setSearchText("");
      result.current.setSelectedOrganizations([]);
      result.current.setMinStars(0);
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

  describe("organization filter state", () => {
    it("should initialize with empty selected organizations", () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.selectedOrganizations).toEqual([]);
    });

    it("should update selected organizations", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedOrganizations(["facebook", "google"]);
      });

      expect(result.current.selectedOrganizations).toEqual([
        "facebook",
        "google",
      ]);
    });

    it("should clear selected organizations", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedOrganizations(["facebook", "google"]);
      });

      act(() => {
        result.current.setSelectedOrganizations([]);
      });

      expect(result.current.selectedOrganizations).toEqual([]);
    });
  });

  describe("stars filter state", () => {
    it("should initialize with 0 minimum stars", () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.minStars).toBe(0);
    });

    it("should update minimum stars", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setMinStars(100);
      });

      expect(result.current.minStars).toBe(100);
    });

    it("should handle different star values", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setMinStars(50);
      });

      expect(result.current.minStars).toBe(50);

      act(() => {
        result.current.setMinStars(500);
      });

      expect(result.current.minStars).toBe(500);
    });
  });

  describe("resetFilters", () => {
    it("should reset all filter states", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedOrganizations(["facebook", "google"]);
        result.current.setMinStars(100);
      });

      expect(result.current.selectedOrganizations).toEqual([
        "facebook",
        "google",
      ]);
      expect(result.current.minStars).toBe(100);

      act(() => {
        result.current.setSelectedOrganizations([]);
        result.current.setMinStars(0);
      });

      expect(result.current.selectedOrganizations).toEqual([]);
      expect(result.current.minStars).toBe(0);
    });

    it("should not affect modal visibility or search text", () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setModalVisible(true);
        result.current.setSearchText("test");
        result.current.setSelectedOrganizations(["facebook"]);
      });

      act(() => {
        result.current.setSelectedOrganizations([]);
        result.current.setMinStars(0);
      });

      expect(result.current.isModalVisible).toBe(true);
      expect(result.current.searchText).toBe("test");
    });
  });
});
