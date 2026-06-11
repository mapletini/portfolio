/**
 * Displays a Tailwind-styled progress bar based on README task-list completion.
 * Returns null when progress data is not available (no checkboxes in README).
 *
 * @param {{ progress: { completed: number, total: number, percentage: number }|null }} props
 */
export default function ProgressBar({ progress }) {
  if (!progress) return null;

  const { completed, total, percentage } = progress;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">Progress</span>
        <span className="text-xs font-medium text-gray-500">{percentage}%</span>
      </div>
      <div
        className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${completed} of ${total} tasks completed`}
      >
        <div
          className="h-full rounded-full bg-green-500 transition-[width] duration-500"
          style={{ width: percentage + '%' }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {completed}/{total} tasks completed
      </p>
    </div>
  );
}
