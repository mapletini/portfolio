import { useState, useEffect } from 'react';
import { fetchReadmeProgress } from '../lib/readmeProgress';

/**
 * Fetches and returns the README task-list progress for a repository.
 * Initialises loading to false immediately when no fullName is provided,
 * avoiding synchronous setState inside the effect body.
 *
 * @param {string|undefined} fullName - Repository full name, e.g. "username/repo"
 * @returns {{ progress: { completed: number, total: number, percentage: number }|null, loading: boolean }}
 */
export function useReadmeProgress(fullName) {
  const [progress, setProgress] = useState(null);
  // Start in loading state only when there is actually something to fetch
  const [loading, setLoading] = useState(Boolean(fullName));

  useEffect(() => {
    if (!fullName) return;

    let cancelled = false;

    fetchReadmeProgress(fullName).then((result) => {
      if (!cancelled) {
        setProgress(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [fullName]);

  return { progress, loading };
}
