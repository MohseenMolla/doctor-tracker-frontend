'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Menu } from 'lucide-react';
import { getJson } from '@/lib/api';
import Sidebar, { Logo } from '@/components/layout/Sidebar';

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  // Verifies the token with the API; an invalid token triggers the 401 interceptor -> /login.
  const { data } = useQuery({ queryKey: ['me'], queryFn: () => getJson('/auth/me'), staleTime: 5 * 60_000 });

  return (
    <div className="min-h-screen">
      <Sidebar user={data?.user} open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-ink-200 bg-paper/90 px-4 backdrop-blur lg:hidden">
          <button className="btn-ghost -ml-2" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <Logo />
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
