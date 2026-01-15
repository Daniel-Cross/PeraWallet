import { renderHook, act } from "@testing-library/react-native";
import { useRepositoryStore } from "../store/repositoryStore";
import { Repository } from "../services/githubApi";

describe("repositoryStore", () => {
  const mockRepository: Repository = {
    id: 1,
    name: "test-repo",
    full_name: "user/test-repo",
    description: "A test repository",
    stargazers_count: 100,
    language: "TypeScript",
    html_url: "https://github.com/user/test-repo",
    owner: {
      login: "user",
      avatar_url: "https://avatar.url",
    },
  };

  beforeEach(() => {
    const { result } = renderHook(() => useRepositoryStore());
    act(() => {
      result.current.setSelectedRepository(null);
    });
  });

  it("should have null as initial state", () => {
    const { result } = renderHook(() => useRepositoryStore());
    expect(result.current.selectedRepository).toBeNull();
  });

  it("should set selected repository", () => {
    const { result } = renderHook(() => useRepositoryStore());

    act(() => {
      result.current.setSelectedRepository(mockRepository);
    });

    expect(result.current.selectedRepository).toEqual(mockRepository);
  });

  it("should update selected repository", () => {
    const { result } = renderHook(() => useRepositoryStore());

    act(() => {
      result.current.setSelectedRepository(mockRepository);
    });

    const updatedRepository = { ...mockRepository, name: "updated-repo" };

    act(() => {
      result.current.setSelectedRepository(updatedRepository);
    });

    expect(result.current.selectedRepository?.name).toBe("updated-repo");
  });

  it("should clear selected repository", () => {
    const { result } = renderHook(() => useRepositoryStore());

    act(() => {
      result.current.setSelectedRepository(mockRepository);
    });

    expect(result.current.selectedRepository).toEqual(mockRepository);

    act(() => {
      result.current.setSelectedRepository(null);
    });

    expect(result.current.selectedRepository).toBeNull();
  });

  it("should persist state across multiple hook calls", () => {
    const { result: result1 } = renderHook(() => useRepositoryStore());

    act(() => {
      result1.current.setSelectedRepository(mockRepository);
    });

    const { result: result2 } = renderHook(() => useRepositoryStore());

    expect(result2.current.selectedRepository).toEqual(mockRepository);
  });
});
