import { useState } from 'react';
import { useGitHubRepos } from './hooks/useGitHubRepos';
import ProjectCard from './components/ProjectCard';
import { STATUS_STYLES } from './lib/status';

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME;

const ALL_STATUSES = ['Active', 'Hiatus', 'Completed'];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex justify-between gap-2">
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="h-3 w-4/6 rounded bg-gray-100" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 w-20 rounded bg-gray-100" />
        <div className="h-7 w-28 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export default function App() {
  const { repos, loading, error } = useGitHubRepos();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? repos
      : repos.filter((r) => {
          if (r.archived && activeFilter === 'Completed') return true;
          const days =
            (new Date() - new Date(r.pushed_at)) / (1000 * 60 * 60 * 24);
          if (!r.archived && days <= 45 && activeFilter === 'Active') return true;
          if (!r.archived && days > 45 && activeFilter === 'Hiatus') return true;
          return false;
        });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {USERNAME ? `${USERNAME}'s Projects` : 'Portfolio'}
              </h1>
              <p className="mt-1 text-gray-500 text-sm">
                Auto-populated from GitHub · {repos.length} project
                {repos.length !== 1 ? 's' : ''}
              </p>
            </div>
            {USERNAME && (
              <a
                href={`https://github.com/${USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.8c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.303 24 12 24 5.373 18.627 0 12 0z"
                  />
                </svg>
                GitHub Profile
              </a>
            )}
          </div>

          {/* Filter tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['All', ...ALL_STATUSES].map((label) => {
              const isActive = activeFilter === label;
              const style = label !== 'All' ? STATUS_STYLES[label] : null;
              return (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? label === 'All'
                        ? 'bg-gray-900 text-white'
                        : `${style.badge} ring-2 ring-current ring-offset-1`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label !== 'All' && style && (
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                  )}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-800">⚠️ {error}</p>
            <p className="mt-1 text-xs text-red-600">
              Check that <code className="font-mono">VITE_GITHUB_USERNAME</code> and{' '}
              <code className="font-mono">VITE_GITHUB_TOKEN</code> are set in your{' '}
              <code className="font-mono">.env</code> file.
            </p>
          </div>
        )}

        {!error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length > 0
              ? filtered.map((repo) => <ProjectCard key={repo.id} repo={repo} />)
              : (
                <p className="col-span-full text-center text-gray-400 py-16">
                  No projects found for the <strong>{activeFilter}</strong> filter.
                </p>
              )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-8 py-6 text-center text-xs text-gray-400">
        Built with React · Vite · Tailwind CSS · GitHub API
      </footer>
    </div>
  );
}
