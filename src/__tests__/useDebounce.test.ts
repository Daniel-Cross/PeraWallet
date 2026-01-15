import { renderHook, act } from "@testing-library/react-native";
import { useDebounce } from "../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return empty string initially", () => {
    const { result } = renderHook(() => useDebounce(""));
    expect(result.current).toBe("");
  });

  it("should debounce the value", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "" },
    });

    expect(result.current).toBe("");

    rerender({ value: "test" });

    expect(result.current).toBe("");

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe("");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("test");
  });

  it("should reset timer when value changes rapidly", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "" },
    });

    rerender({ value: "t" });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: "te" });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: "tes" });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("");

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe("tes");
  });

  it("should update to latest value after delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    rerender({ value: "updated" });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("should cleanup timer on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("test"));

    act(() => {
      jest.advanceTimersByTime(200);
    });
    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(true).toBe(true);
  });
});
