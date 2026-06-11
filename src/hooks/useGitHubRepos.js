import { useState, useEffect } from 'react';

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

/**
 * Fetches all public repositories for the configured GitHub user,
 * filtering out forks and the profile README repository.
 */
export function useGitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!USERNAME) {
      setError('VITE_GITHUB_USERNAME is not set in your .env file.');
      setLoading(false);
      return;
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (TOKEN) {
      headers['Authorization'] = 'Bearer ' + TOKEN;
    }

    async function fetchAllRepos() {
      try {
        const allRepos = [];
        let page = 1;
        const perPage = 100;

        while (true) {
          const res = await fetch(
            `https://api.github.com/users/${USERNAME}/repos?per_page=${perPage}&page=${page}&sort=pushed`,
            { headers }
          );

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(
              data.message || `GitHub API error: ${res.status} ${res.statusText}`
            );
          }

          const data = await res.json();
          allRepos.push(...data);

          if (data.length < perPage) break;
          page++;
        }

        const filtered = allRepos.filter(
          (repo) => !repo.fork && repo.name.toLowerCase() !== USERNAME.toLowerCase()
        );

        setRepos(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllRepos();
  }, []);

  return { repos, loading, error };
}
