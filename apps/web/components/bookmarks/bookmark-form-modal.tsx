'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@repo/ui';
import type { Bookmark } from '@repo/types';
import { bookmarkSchema, type BookmarkFormValues, BOOKMARK_CATEGORIES } from './bookmark-schema';

interface Props {
  open: boolean;
  initial?: Bookmark | null;
  onSubmit: (values: BookmarkFormValues) => void;
  onClose: () => void;
}

const inputCls =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

export function BookmarkFormModal({ open, initial, onSubmit, onClose }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: initial?.title ?? '',
      url: initial?.url ?? '',
      description: initial?.description ?? '',
      category: initial?.category ?? BOOKMARK_CATEGORIES[0],
      tags: initial?.tags?.join(', ') ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: initial?.title ?? '',
        url: initial?.url ?? '',
        description: initial?.description ?? '',
        category: initial?.category ?? BOOKMARK_CATEGORIES[0],
        tags: initial?.tags?.join(', ') ?? '',
      });
    }
  }, [open, initial, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-slate-200" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <h3 className="text-lg font-semibold text-white">{initial ? 'Edit Bookmark' : 'Bookmark Baru'}</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="b-title" className="text-xs font-medium text-slate-300">Judul *</label>
            <input id="b-title" {...register('title')} className={inputCls} placeholder="Nama situs / sumber" />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="b-url" className="text-xs font-medium text-slate-300">URL *</label>
            <input id="b-url" {...register('url')} className={inputCls} placeholder="https://..." />
            {errors.url && <p className="text-xs text-red-400">{errors.url.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="b-desc" className="text-xs font-medium text-slate-300">Deskripsi</label>
            <textarea id="b-desc" {...register('description')} rows={2} className={inputCls} placeholder="Catatan singkat..." />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="b-cat" className="text-xs font-medium text-slate-300">Kategori</label>
              <select id="b-cat" {...register('category')} className={inputCls}>
                {BOOKMARK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="b-tags" className="text-xs font-medium text-slate-300">Tag (pisahkan koma)</label>
              <input id="b-tags" {...register('tags')} className={inputCls} placeholder="docs, react" />
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