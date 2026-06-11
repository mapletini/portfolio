const ACTIVE_THRESHOLD_DAYS = 45;

/**
 * Calculates the status of a repository based on its metadata.
 * @param {Object} repo - GitHub repository object
 * @returns {'Completed' | 'Active' | 'Hiatus'}
 */
export function getRepoStatus(repo) {
  if (repo.archived) return 'Completed';

  const pushedAt = new Date(repo.pushed_at);
  const now = new Date();
  const diffDays = (now - pushedAt) / (1000 * 60 * 60 * 24);

  return diffDays <= ACTIVE_THRESHOLD_DAYS ? 'Active' : 'Hiatus';
}

export const STATUS_STYLES = {
  Completed: {
    badge: 'bg-blue-100 text-blue-800',
    dot: 'bg-blue-500',
  },
  Active: {
    badge: 'bg-green-100 text-green-800',
    dot: 'bg-green-500',
  },
  Hiatus: {
    badge: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-500',
  },
};
