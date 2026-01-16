import { useCallback } from "react";

interface UsePaginationProps {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isFetching: boolean;
}

export const usePagination = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isFetching,
}: UsePaginationProps) => {
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]);

  return { handleLoadMore };
};
