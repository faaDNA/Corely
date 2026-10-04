'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CheckSquare, FolderKanban, NotebookPen, Bookmark, CornerDownLeft } from 'lucide-react';
import { cn } from '@repo/ui';
import { mockTasks, mockProjects, mockNotes, mockBookmarks } from '@/lib/mock-data';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';

interface Result {
  id: string;
  label: string;
  sub: string;
  group: string;
  href: string;
  icon: React.ReactNode;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQ('');
        setCursor(0);
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    function onOpen() {
      setQ('');
      setCursor(0);
      setOpen(true);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('pd-open-search', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pd-open-search', onOpen);
    };
  }, []);

  const results = useMemo<Result[]>(() => {
    if (!q.trim()) return [];
    const qq = q.toLowerCase();
    const out: Result[] = [];

    mockProjects
      .filter((p) => p.name.toLowerCase().includes(qq))
      .forEach((p) => out.push({ id: `p-${p.id}`, label: p.name, sub: `${projectProgress(p, mockTasks)}% · ${deriveProjectStatus(p, mockTasks).replace('_', ' ')}`, group: 'Projects', href: `/projects/${p.id}`, icon: <FolderKanban className="h-4 w-4" /> }));

    mockNotes
      .filter((n) => n.title.toLowerCase().includes(qq) || n.content.toLowerCase().includes(qq))
      .forEach((n) => out.push({ id: `n-${n.id}`, label: n.title, sub: n.category, group: 'Notes', href: '/notes', icon: <NotebookPen className="h-4 w-4" /> }));

    mockBookmarks
      .filter((b) => b.title.toLowerCase().includes(qq) || b.url.toLowerCase().includes(qq))
      .forEach((b) => out.push({ id: `b-${b.id}`, label: b.title, sub: b.url, group: 'Bookmarks', href: '/bookmarks', icon: <Bookmark className="h-4 w-4" /> }));

    mockTasks
      .filter((t) => t.title.toLowerCase().includes(qq))
      .forEach((t) => out.push({ id: `t-${t.id}`, label: t.title, sub: `${t.status} · ${t.priority}`, group: 'Tasks', href: '/tasks', icon: <CheckSquare className="h-4 w-4" /> }));

    return out;
  }, [q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Result[]>();
    results.forEach((r) => {
      const arr = map.get(r.group) ?? [];
      arr.push(r);
      map.set(r.group, arr);
    });
    return [...map.entries()];
  }, [results]);

  const flat = grouped.flatMap(([, items]) => items);

  function go(r: Result) {
    setOpen(false);
    setQ('');
    router.push(r.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && flat[cursor]) {
      e.preventDefault();
      go(flat[cursor]);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setCursor(0); }}
            onKeyDown={onInputKey}
            placeholder="Cari tugas, proyek, catatan, bookmark..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-[10px] text-slate-500">Esc</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {!q.trim() && (
            <p className="p-4 text-center text-xs text-slate-500">Ketik untuk mencari di seluruh data... (Ctrl+K)</p>
          )}
          {q.trim() && flat.length === 0 && (
            <p className="p-4 text-center text-xs text-slate-500">Tidak ada hasil untuk &ldquo;{q}&rdquo;</p>
          )}
          {grouped.map(([group, items]) => (
            <div key={group} className="mb-2">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{group}</p>
              {items.map((r) => {
                const idx = flat.indexOf(r);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => go(r)}
                    onMouseEnter={() => setCursor(idx)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition',
                      idx === cursor ? 'bg-blue-600/15 text-blue-300' : 'text-slate-300 hover:bg-slate-800/60'
                    )}
                  >
                    <span className="text-slate-500">{r.icon}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">{r.label}</span>
                    <span className="truncate text-xs text-slate-500">{r.sub}</span>
                    {idx === cursor && <CornerDownLeft className="h-3.5 w-3.5 text-slate-500" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}