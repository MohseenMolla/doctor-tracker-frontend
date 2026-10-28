import { Search, X } from 'lucide-react';

export function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative min-w-0 flex-1 sm:min-w-[240px]">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
      <input className="input pl-9" type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </div>
  );
}

export function DateRange({ from, to, onFrom, onTo }) {
  return (
    <div className="flex items-center gap-2">
      <input type="date" className="input w-auto" value={from} max={to || undefined} onChange={(e) => onFrom(e.target.value)} aria-label="Added from" />
      <span className="text-xs text-ink-400">to</span>
      <input type="date" className="input w-auto" value={to} min={from || undefined} onChange={(e) => onTo(e.target.value)} aria-label="Added until" />
    </div>
  );
}

export function ClearFilters({ show, onClick }) {
  if (!show) return null;
  return (
    <button className="btn-ghost text-brand-700" onClick={onClick}>
      <X size={14} /> Clear filters
    </button>
  );
}
