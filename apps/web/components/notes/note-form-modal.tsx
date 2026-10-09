'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@repo/ui';
import type { Note } from '@repo/types';
import { noteSchema, type NoteFormValues, NOTE_CATEGORIES } from './note-schema';

interface Props {
  open: boolean;
  initial?: Note | null;
  onSubmit: (values: NoteFormValues) => void;
  onClose: () => void;
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

export function NoteFormModal({ open, initial, onSubmit, onClose }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: initial?.title ?? '',
      content: initial?.content ?? '',
      category: initial?.category ?? NOTE_CATEGORIES[0],
      tags: initial?.tags?.join(', ') ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: initial?.title ?? '',
        content: initial?.content ?? '',
        category: initial?.category ?? NOTE_CATEGORIES[0],
        tags: initial?.tags?.join(', ') ?? '',
      });
    }
  }, [open, initial, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{initial ? 'Edit Metadata Catatan' : 'Catatan Baru'}</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="n-title" className="text-xs font-medium text-slate-600 dark:text-slate-300">Judul *</label>
            <input id="n-title" {...register('title')} className={inputCls} placeholder="Judul catatan" />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>
          <p className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
            Isi catatan dapat ditulis/diedit langsung di panel editor sebelah kanan setelah disimpan.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="n-cat" className="text-xs font-medium text-slate-600 dark:text-slate-300">Kategori</label>
              <select id="n-cat" {...register('category')} className={inputCls}>
                {NOTE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="n-tags" className="text-xs font-medium text-slate-600 dark:text-slate-300">Tag (pisahkan koma)</label>
              <input id="n-tags" {...register('tags')} className={inputCls} placeholder="app, karir" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit">{initial ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </form>
    </div>
  );
}