import { getRepoStatus, STATUS_STYLES } from '../lib/status';
import { useReadmeProgress } from '../hooks/useReadmeProgress';
import ProgressBar from './ProgressBar';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Shell: '#89e051',
  Svelte: '#ff3e00',
  Vue: '#41b883',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
};

function LanguageDot({ language }) {
  if (!language) return null;
  const color = LANGUAGE_COLORS[language] ?? '#6e7681';
  return (
    <span className="flex items-center gap-1.5 text-sm text-gray-500">
      <span
        className="inline-block h-3 w-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {language}
    </span>
  );
}

export default function ProjectCard({ repo }) {
  const status = getRepoStatus(repo);
  const { badge, dot } = STATUS_STYLES[status];
  const { progress } = useReadmeProgress(repo.full_name);

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900 leading-snug break-all">
          {repo.name}
        </h2>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="flex-1 text-sm text-gray-600 leading-relaxed line-clamp-3">
        {repo.description || (
          <span className="italic text-gray-400">No description provided.</span>
        )}
      </p>

      {/* Progress bar (only rendered when README has task-list checkboxes) */}
      <ProgressBar progress={progress} />

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <LanguageDot language={repo.language} />
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition-colors"
        >
          View on GitHub
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
