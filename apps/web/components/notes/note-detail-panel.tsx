'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Pin, PinOff, Archive, Pencil, Trash2, Check, X } from 'lucide-react';
import { cn } from '@repo/ui';
import type { Note } from '@repo/types';
import { toast } from '@/components/toast';

/** Single Enter = baris baru (<br>), double Enter = paragraf baru. Tanpa ini markdown collapse `\n` jadi spasi. */
function withHardBreaks(text: string): string {
  return text.split('\n\n').map((part) => part.replace(/\n/g, '  \n')).join('\n\n');
}

interface Props {
  note: Note;
  onMetaEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onSaveContent: (id: string, content: string) => void;
}

const proseCls =
  'text-sm leading-relaxed text-slate-700 dark:text-slate-300 [&_code]:rounded [&_code]:bg-slate-100 dark:[&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-blue-600 dark:[&_code]:text-blue-400 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-2 [&_pre]:mb-3 [&_pre]:rounded-lg [&_pre]:bg-slate-100 dark:[&_pre]:bg-slate-950 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-slate-800 dark:[&_pre]:text-slate-100 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-500 dark:[&_blockquote]:text-slate-400';

/** Panel kanan notes: judul/meta via modal, isi edit inline tanpa scroll internal. */
export function NoteDetailPanel({ note, onMetaEdit, onDelete, onTogglePin, onToggleArchive, onSaveContent }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.content);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // ganti catatan → keluar mode edit, sinkron draft
  useEffect(() => {
    setEditing(false);
    setDraft(note.content);
  }, [note.id, note.content]);

  // auto-grow textarea mengikuti isi (tanpa scroll internal)
  useEffect(() => {
    const el = areaRef.current;
    if (el && editing) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [editing, draft]);

  function startEdit() {
    setDraft(note.content);
    setEditing(true);
  }

  function save() {
    if (draft.length > 5000) {
      toast('Isi maksimal 5000 karakter.');
      return;
    }
    onSaveContent(note.id, draft);
    setEditing(false);
    toast('Isi catatan disimpan.');
  }

  const rendered = useMemo(() => withHardBreaks(note.content), [note.content]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{note.title}</h2>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-400">{note.category}</span>
            {note.tags?.map((t) => (
              <span key={t} className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-600 dark:text-purple-400">#{t}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => onTogglePin(note.id)} aria-label="Pin" className={cn('rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800', note.pinned ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500')}>
            {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => onToggleArchive(note.id)} aria-label="Archive" className={cn('rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800', note.archived ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500')}>
            <Archive className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onMetaEdit(note)} aria-label="Edit judul/kategori/tag" title="Edit judul, kategori, tag" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onDelete(note.id)} aria-label="Delete" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {editing ? (
          <div className="space-y-3">
            <textarea
              ref={areaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }}
              rows={10}
              placeholder="Tulis isi catatan (Markdown)..."
              className="w-full resize-none overflow-hidden rounded-lg border border-blue-600 bg-white dark:bg-slate-950 px-3 py-2 font-mono text-xs leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
            <p className={cn('text-right text-[11px]', draft.length > 5000 ? 'text-red-400' : 'text-slate-600')}>
              {draft.length}/5000
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setDraft(note.content); setEditing(false); }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-3.5 w-3.5" />Batal
              </button>
              <button
                type="button"
                onClick={save}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
              >
                <Check className="h-3.5 w-3.5" />Simpan isi
              </button>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <button
              type="button"
              onClick={startEdit}
              title="Klik untuk edit isi"
              className="absolute right-0 top-0 rounded-lg p-1.5 text-slate-500 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <div onClick={startEdit} title="Klik untuk edit isi" className="cursor-text">
              <div className={proseCls}>
                <ReactMarkdown>{rendered || '*Kosong — klik untuk menulis...*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
