'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Pin, Archive, FileText } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Note } from '@repo/types';
import { mockNotes } from '@/lib/mock-data';
import { NoteFormModal } from '@/components/notes/note-form-modal';
import { NoteDetailPanel } from '@/components/notes/note-detail-panel';
import { NOTE_CATEGORIES, type NoteFormValues } from '@/components/notes/note-schema';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [selectedId, setSelectedId] = useState<string>(mockNotes[0]?.id ?? '');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; initial?: Note | null }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const visible = useMemo(() => {
    let out = notes.filter((n) => Boolean(n.archived) === showArchived);
    if (category !== 'all') out = out.filter((n) => n.category === category);
    if (q) {
      const qq = q.toLowerCase();
      out = out.filter(
        (n) => n.title.toLowerCase().includes(qq) || n.content.toLowerCase().includes(qq) || n.tags?.some((t) => t.includes(qq))
      );
    }
    return out.sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false));
  }, [notes, q, category, showArchived]);

  const selected = visible.find((n) => n.id === selectedId) ?? visible[0];

  // modal kini hanya untuk judul / kategori / tag (isi edit inline)
  function handleFormSubmit(values: NoteFormValues) {
    const payload: Note = {
      id: modal.initial?.id ?? `n${Date.now()}`,
      title: values.title,
      content: modal.initial?.content ?? values.content ?? '',
      category: values.category,
      tags: values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      pinned: modal.initial?.pinned,
      archived: modal.initial?.archived,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    if (modal.initial) setNotes((prev) => prev.map((n) => (n.id === modal.initial!.id ? payload : n)));
    else setNotes((prev) => [payload, ...prev]);
    setSelectedId(payload.id);
    setModal({ open: false });
  }

  function handleInlineSave(id: string, content: string) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content, updatedAt: new Date().toISOString().slice(0, 10) } : n)));
  }

  function togglePin(id: string) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }

  function toggleArchive(id: string) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, archived: !n.archived } : n)));
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catatan</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Knowledge base Markdown dengan kategori, tag, dan pinning.</p>
        </div>
        <Button onClick={() => setModal({ open: true, initial: null })}><Plus className="mr-2 h-4 w-4" />Catatan Baru</Button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari catatan (judul, isi, tag)..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">Semua Kategori</option>
          {NOTE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition',
            showArchived ? 'border-amber-600 bg-amber-600/10 text-amber-600 dark:text-amber-400' : 'border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
          )}
        >
          <Archive className="h-3.5 w-3.5" />{showArchived ? 'Arsip' : 'Aktif'}
        </button>
      </div>

      {/* 2-column */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-2">
          <div className="space-y-2">
            {visible.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
                Belum ada catatan di sini.
              </div>
            )}
            {visible.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedId(n.id)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition',
                  selected?.id === n.id
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
                )}
              >
                <div className="flex items-center gap-2">
                  {n.pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-amber-500 dark:text-amber-400" />}
                  <p className="flex-1 truncate text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{n.content}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{n.category}</span>
                  {n.tags?.map((t) => (
                    <span key={t} className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-600 dark:text-purple-400">#{t}</span>
                  ))}
                  <span className="ml-auto text-[10px] text-slate-600">{n.updatedAt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor / preview */}
        <div className="lg:col-span-3">
          {selected ? (
            <NoteDetailPanel
              note={selected}
              onMetaEdit={(n) => setModal({ open: true, initial: n })}
              onDelete={(id) => setPendingDelete(id)}
              onTogglePin={togglePin}
              onToggleArchive={toggleArchive}
              onSaveContent={handleInlineSave}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <FileText className="h-8 w-8 text-slate-600" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Pilih catatan di samping</p>
              <p className="mt-1 text-xs text-slate-500">atau buat catatan baru untuk mulai menulis.</p>
            </div>
          )}
        </div>
      </div>

      <NoteFormModal open={modal.open} initial={modal.initial ?? null} onSubmit={handleFormSubmit} onClose={() => setModal({ open: false })} />

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hapus catatan ini?</h3>
            <p className="mt-2 text-xs text-slate-400">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={() => { setNotes((prev) => prev.filter((n) => n.id !== pendingDelete)); setPendingDelete(null); }}>Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}