import { AlertCircle, SearchX } from 'lucide-react';

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="divide-y divide-ink-100" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-4">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-ink-100" />
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3.5 flex-1 animate-pulse rounded bg-ink-100" style={{ maxWidth: c === 0 ? 200 : 140 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action, filtered }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
        <SearchX size={22} />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">{text}</p>
      {action && <div className="mt-5">{action}</div>}
      {filtered && <p className="sr-only">No matches for current filters</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-600">
        <AlertCircle size={22} />
      </span>
      <h3 className="mt-4 text-base font-semibold">We couldn’t load this</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">{message}</p>
      {onRetry && <button className="btn-secondary mt-5" onClick={onRetry}>Try again</button>}
    </div>
  );
}
