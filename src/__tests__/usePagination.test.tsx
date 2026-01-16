import { renderHook } from "@testing-library/react-native";
import { usePagination } from "../hooks/usePagination";

describe("usePagination", () => {
  it("should call fetchNextPage when conditions are met", () => {
    const mockFetchNextPage = jest.fn();

    const { result } = renderHook(() =>
      usePagination({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        isFetching: false,
      })
    );

    result.current.handleLoadMore();

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("should not call fetchNextPage when hasNextPage is false", () => {
    const mockFetchNextPage = jest.fn();

    const { result } = renderHook(() =>
      usePagination({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetchingNextPage: false,
        isFetching: false,
      })
    );

    result.current.handleLoadMore();

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("should not call fetchNextPage when isFetchingNextPage is true", () => {
    const mockFetchNextPage = jest.fn();

    const { result } = renderHook(() =>
      usePagination({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: true,
        isFetching: false,
      })
    );

    result.current.handleLoadMore();

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("should not call fetchNextPage when isFetching is true", () => {
    const mockFetchNextPage = jest.fn();

    const { result } = renderHook(() =>
      usePagination({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        isFetching: true,
      })
    );

    result.current.handleLoadMore();

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("should not call fetchNextPage when hasNextPage is undefined", () => {
    const mockFetchNextPage = jest.fn();

    const { result } = renderHook(() =>
      usePagination({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: undefined,
        isFetchingNextPage: false,
        isFetching: false,
      })
    );

    result.current.handleLoadMore();

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("should call fetchNextPage multiple times when called multiple times", () => {
    const mockFetchNextPage = jest.fn();

    const { result } = renderHook(() =>
      usePagination({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        isFetching: false,
      })
    );

    result.current.handleLoadMore();
    result.current.handleLoadMore();
    result.current.handleLoadMore();

    expect(mockFetchNextPage).toHaveBeenCalledTimes(3);
  });

  it("should maintain stable reference for handleLoadMore", () => {
    const mockFetchNextPage = jest.fn();

    const { result, rerender } = renderHook(
      (props: any) => usePagination(props),
      {
        initialProps: {
          fetchNextPage: mockFetchNextPage,
          hasNextPage: true,
          isFetchingNextPage: false,
          isFetching: false,
        },
      }
    );

    const firstReference = result.current.handleLoadMore;

    rerender({
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isFetching: false,
    });

    const secondReference = result.current.handleLoadMore;

    expect(firstReference).toBe(secondReference);
  });
});
