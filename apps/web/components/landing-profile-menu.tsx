'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';
import { SubmitButton } from './submit-button';

/** Menu profil di header landing — mirip popup profil dashboard: Dashboard + Keluar. */
export function LandingProfileMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (name || email || '?').charAt(0).toUpperCase();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg p-1.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {initial}
        </div>
        <span className="hidden max-w-32 truncate text-sm font-medium text-slate-900 dark:text-white sm:inline">
          {name || email}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900" role="menu">
          <Link
            href="/dashboard"
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <form action={logout} className="mt-1">
            <SubmitButton
              type="submit"
              role="menuitem"
              variant="ghost"
              className="w-full justify-start rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
