'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Stethoscope, Users, LogOut, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { clearToken } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
];

export function Logo({ light }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="9" fill="#0E8F86" />
        <path d="M4 17h6l3-7 5 13 3-6h7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={clsx('font-display text-lg font-semibold tracking-tight', light ? 'text-white' : 'text-ink-900')}>Doctor Tracker</span>
    </span>
  );
}

export default function Sidebar({ user, open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const qc = useQueryClient();

  const logout = () => {
    clearToken();
    qc.clear();
    router.replace('/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden" onClick={onClose} />}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink-900 px-4 py-5 text-ink-200 transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Logo light />
          <button className="text-ink-300 lg:hidden" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="mt-10 flex flex-col gap-1" aria-label="Main">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-brand-600 text-white' : 'text-ink-300 hover:bg-ink-800 hover:text-white'
                )}
              >
                <Icon size={18} /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl bg-ink-800 p-3">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'A'} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name || 'Admin'}</p>
              <p className="truncate text-xs text-ink-400">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-ink-700 py-2 text-sm font-medium text-ink-200 hover:bg-ink-700">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
