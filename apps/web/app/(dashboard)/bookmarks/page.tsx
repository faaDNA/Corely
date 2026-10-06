'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Star, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Bookmark } from '@repo/types';
import { mockBookmarks } from '@/lib/mock-data';
import { BookmarkFormModal } from '@/components/bookmarks/bookmark-form-modal';
import { BOOKMARK_CATEGORIES, type BookmarkFormValues } from '@/components/bookmarks/bookmark-schema';

function domain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [favOnly, setFavOnly] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; initial?: Bookmark | null }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let out = [...bookmarks];
    if (favOnly) out = out.filter((b) => b.favorite);
    if (category !== 'all') out = out.filter((b) => b.category === category);
    if (q) {
      const qq = q.toLowerCase();
      out = out.filter(
        (b) => b.title.toLowerCase().includes(qq) || b.url.toLowerCase().includes(qq) || b.description?.toLowerCase().includes(qq)
      );
    }
    return out.sort((a, b) => Number(b.favorite ?? false) - Number(a.favorite ?? false));
  }, [bookmarks, q, category, favOnly]);

  function handleFormSubmit(values: BookmarkFormValues) {
    const payload: Bookmark = {
      id: modal.initial?.id ?? `b${Date.now()}`,
      title: values.title,
      url: values.url,
      description: values.description || undefined,
      category: values.category,
      tags: values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      favorite: modal.initial?.favorite,
    };
    if (modal.initial) setBookmarks((prev) => prev.map((b) => (b.id === modal.initial!.id ? payload : b)));
    else setBookmarks((prev) => [payload, ...prev]);
    setModal({ open: false });
  }

  function toggleFav(id: string) {
    setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bookmark</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Simpan situs dan sumber daya penting dengan kategori, tag, dan favorit.</p>
        </div>
        <Button onClick={() => setModal({ open: true, initial: null })}><Plus className="mr-2 h-4 w-4" />Bookmark Baru</Button>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari bookmark..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">Semua Kategori</option>
          {BOOKMARK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="button"
          onClick={() => setFavOnly((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition',
            favOnly ? 'border-amber-600 bg-amber-600/10 text-amber-600 dark:text-amber-400' : 'border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
          )}
        >
          <Star className="h-3.5 w-3.5" />Favorit
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
          Belum ada bookmark yang cocok.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <div key={b.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                  {domain(b.url).slice(0, 2)}
                </div>
                <button type="button" onClick={() => toggleFav(b.id)} aria-label="Favorite" className={cn('rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800', b.favorite ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-600')}>
                  <Star className={cn('h-4 w-4', b.favorite && 'fill-current')} />
                </button>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{b.title}</h3>
              <a href={b.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                {domain(b.url)} <ExternalLink className="h-3 w-3" />
              </a>
              {b.description && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{b.description}</p>}
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-400">{b.category}</span>
                {b.tags?.map((t) => (
                  <span key={t} className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-600 dark:text-purple-400">#{t}</span>
                ))}
              </div>
              <div className="mt-3 flex justify-end gap-1 border-t border-slate-200 dark:border-slate-800 pt-3 opacity-0 transition group-hover:opacity-100">
                <button type="button" onClick={() => setModal({ open: true, initial: b })} aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => setPendingDelete(b.id)} aria-label="Delete" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BookmarkFormModal open={modal.open} initial={modal.initial ?? null} onSubmit={handleFormSubmit} onClose={() => setModal({ open: false })} />

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hapus bookmark ini?</h3>
            <p className="mt-2 text-xs text-slate-400">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={() => { setBookmarks((prev) => prev.filter((b) => b.id !== pendingDelete)); setPendingDelete(null); }}>Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}