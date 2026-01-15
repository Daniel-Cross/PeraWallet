import { useState, useEffect } from "react";

const DELAY = 500;

export const useDebounce = (value: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [value, DELAY]);

  return debouncedSearch;
};
