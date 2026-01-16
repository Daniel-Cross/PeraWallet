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
const PER_PAGE = 30;

export interface FetchReposParams {
  usernames?: string[];
  page?: number;
  perPage?: number;
}

export const fetchGithubRepos = async ({
  usernames = DEFAULT_USERS,
  page = 1,
  perPage = PER_PAGE,
}: FetchReposParams = {}): Promise<Repository[]> => {
  const allRepos: Repository[] = [];

  for (const username of usernames) {
    try {
      const url = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Failed to fetch repos for ${username}: ${response.status}`
        );
        continue;
      }

      const repos = await response.json();
      allRepos.push(...repos);
    } catch (error) {
      console.error(`Error fetching repos for ${username}:`, error);
    }
  }

  return allRepos;
};
