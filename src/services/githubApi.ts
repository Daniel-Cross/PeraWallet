export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const DEFAULT_USERS = ["algorandfoundation", "algorand", "perawallet"];

export const fetchGithubRepos = async (
  usernames: string[] = DEFAULT_USERS
): Promise<Repository[]> => {
  const fetchPromises = usernames.map(async (username) => {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    if (!response.ok) {
      console.error(`Failed to fetch repos for ${username}`);
      return [];
    }

    return response.json();
  });

  const results = await Promise.all(fetchPromises);
  return results.flat();
};
