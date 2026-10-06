'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  NotebookPen,
  Bookmark,
  Flame,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Check,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { cn } from '@repo/ui';
import { GlobalSearch } from './global-search';
import { ToastHost } from './toast';
import { logout } from '@/app/(auth)/actions';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Notes', href: '/notes', icon: NotebookPen },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'Habits', href: '/habits', icon: Flame },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const effective = theme === 'system' ? resolvedTheme : theme;
  const Icon = effective === 'dark' ? Moon : theme === 'system' ? Monitor : Sun;
  const opts = [
    { key: 'light', label: 'Terang', icon: Sun },
    { key: 'dark', label: 'Gelap', icon: Moon },
    { key: 'system', label: 'Sistem', icon: Monitor },
  ] as const;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Pilih tema"
        title={theme === 'system' ? `Sistem (${resolvedTheme})` : theme}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
        type="button"
      >
        <Icon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {opts.map(({ key, label, icon: I }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setTheme(key); setOpen(false); }}
              className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition', theme === key ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-600/15 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
            >
              <I className="h-4 w-4" />{label}
              {theme === key && <Check className="ml-auto h-3.5 w-3.5" />}
            </button>
          ))}
          <p className="px-3 pb-1 pt-1 text-[10px] text-slate-400">Sistem = ikuti tema OS</p>
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-4" onClick={onNavigate}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-lg shadow-blue-500/20">
          C
        </div>
        <div className="leading-tight">
          <p className="font-bold text-slate-900 dark:text-white">Corely</p>
          <p className="text-[11px] text-slate-500">Your productivity hub</p>
        </div>
      </Link>

      <button
        className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
        type="button"
        onClick={() => window.dispatchEvent(new Event('pd-open-search'))}
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] dark:border-slate-800 dark:bg-slate-950">Ctrl K</kbd>
      </button>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                active
                  ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <p className="px-2 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Preferences
        </p>
        <Link
          href="/settings"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
            pathname === '/settings'
              ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <form action={logout}>
          <button
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
            type="submit"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              U
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">User</p>
              <p className="truncate text-[11px] text-slate-500">user@mail.com · Keluar</p>
            </div>
            <LogOut className="h-4 w-4 text-slate-500" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60 md:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800 sm:px-6">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            type="button"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/settings" className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white sm:flex">
              U
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>

      <GlobalSearch />
      <ToastHost />
    </div>
  );
}
