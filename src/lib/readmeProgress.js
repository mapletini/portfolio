const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CACHE_PREFIX = 'portfolio_readme_';

/** @returns {{ expires: number, result: object|null }|undefined} */
function getCached(fullName) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + fullName);
    if (!raw) return undefined;
    const entry = JSON.parse(raw);
    if (Date.now() < entry.expires) return entry;
  } catch {
    // ignore parse / storage errors
  }
  return undefined;
}

function setCache(fullName, result) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + fullName,
      JSON.stringify({ expires: Date.now() + CACHE_TTL_MS, result })
    );
  } catch {
    // ignore storage quota errors
  }
}

/**
 * Fetches the README for a repository, parses Markdown task-list checkboxes,
 * and returns a progress object (or null if the README has no checkboxes).
 * Results are cached in localStorage for 1 hour.
 *
 * @param {string} fullName - Repository full name, e.g. "username/repo"
 * @returns {Promise<{ completed: number, total: number, percentage: number }|null>}
 */
export async function fetchReadmeProgress(fullName) {
  const cached = getCached(fullName);
  if (cached !== undefined) return cached.result;

  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (TOKEN) {
    headers['Authorization'] = 'Bearer ' + TOKEN;
  }

  try {
    const res = await fetch(
      'https://api.github.com/repos/' + fullName + '/readme',
      { headers }
    );

    if (!res.ok) {
      // No README or access error — cache null so we don't retry on every render
      setCache(fullName, null);
      return null;
    }

    const data = await res.json();

    // GitHub returns content as base64 with embedded newlines — strip them first
    const text = atob(data.content.replace(/\n/g, ''));

    // Match all task-list checkboxes: - [ ] and - [x] / - [X]
    const allMatches = text.match(/^\s*[-*+]\s+\[[ xX]\]/gm) ?? [];
    const completedMatches = text.match(/^\s*[-*+]\s+\[[xX]\]/gm) ?? [];

    const total = allMatches.length;
    if (total === 0) {
      setCache(fullName, null);
      return null;
    }

    const completed = completedMatches.length;
    const percentage = Math.round((completed / total) * 100);
    const result = { completed, total, percentage };
    setCache(fullName, result);
    return result;
  } catch {
    return null;
  }
}
