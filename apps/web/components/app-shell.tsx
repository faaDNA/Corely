'use client';

import { useEffect, useState } from 'react';
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400">
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:text-white"
      type="button"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
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
          <p className="font-bold text-white">Corely</p>
          <p className="text-[11px] text-slate-500">Your productivity hub</p>
        </div>
      </Link>

      <button
        className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
        type="button"
        onClick={() => window.dispatchEvent(new Event('pd-open-search'))}
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
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
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
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
              ? 'bg-blue-600/10 text-blue-400'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>

      <div className="border-t border-slate-800 p-3">
        <form action={logout}>
          <button
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-slate-800"
            type="submit"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              U
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-white">User</p>
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-900/60 md:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-800 bg-slate-950">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-800 px-4 sm:px-6">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 md:hidden"
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
