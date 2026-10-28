import { ChevronLeft, ChevronRight } from 'lucide-react';

function windowPages(page, total) {
  const pages = new Set([1, total, page, page - 1, page + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push('…' + p);
    out.push(p);
  });
  return out;
}

export default function Pagination({ meta, onPage, label = 'results' }) {
  if (!meta || meta.total === 0) return null;
  const { page, limit, total, totalPages } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 px-4 py-3 sm:flex-row">
      <p className="text-sm text-ink-500">
        Showing <span className="font-medium text-ink-800">{start}–{end}</span> of <span className="font-medium text-ink-800">{total}</span> {label}
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button className="btn-ghost" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <ChevronLeft size={16} />
        </button>
        {windowPages(page, totalPages).map((p) =>
          typeof p === 'string' ? (
            <span key={p} className="px-1 text-ink-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium ${p === page ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'}`}
            >
              {p}
            </button>
          )
        )}
        <button className="btn-ghost" disabled={page >= totalPages} onClick={() => onPage(page + 1)} aria-label="Next page">
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
