'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Task } from '@repo/types';
import { mockProjects } from '@/lib/mock-data';
import { taskSchema, type TaskFormValues, STATUS_LABELS, PRIORITY_LABELS } from './task-schema';

interface Props {
  open: boolean;
  initial?: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  onClose: () => void;
}

const inputCls =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

export function TaskFormModal({ open, initial, onSubmit, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      status: initial?.status ?? 'TODO',
      priority: initial?.priority ?? 'MEDIUM',
      dueDate: initial?.dueDate ?? '',
      projectId: initial?.projectId ?? '',
      tags: initial?.tags?.join(', ') ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: initial?.title ?? '',
        description: initial?.description ?? '',
        status: initial?.status ?? 'TODO',
        priority: initial?.priority ?? 'MEDIUM',
        dueDate: initial?.dueDate ?? '',
        projectId: initial?.projectId ?? '',
        tags: initial?.tags?.join(', ') ?? '',
      });
    }
  }, [open, initial, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-semibold text-white">{initial ? 'Edit Tugas' : 'Tugas Baru'}</h3>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="t-title" className="text-xs font-medium text-slate-300">Judul *</label>
            <input id="t-title" {...register('title')} className={inputCls} placeholder="Apa yang harus dikerjakan?" />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="t-desc" className="text-xs font-medium text-slate-300">Deskripsi</label>
            <textarea id="t-desc" {...register('description')} rows={2} className={inputCls} placeholder="Detail opsional..." />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="t-status" className="text-xs font-medium text-slate-300">Status</label>
              <select id="t-status" {...register('status')} className={inputCls}>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="t-priority" className="text-xs font-medium text-slate-300">Prioritas</label>
              <select id="t-priority" {...register('priority')} className={inputCls}>
                {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="t-due" className="text-xs font-medium text-slate-300">Tenggat</label>
              <input id="t-due" type="date" {...register('dueDate')} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="t-project" className="text-xs font-medium text-slate-300">Proyek</label>
              <select id="t-project" {...register('projectId')} className={inputCls}>
                <option value="">— Tanpa proyek —</option>
                {mockProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="t-tags" className="text-xs font-medium text-slate-300">Tag (pisahkan koma)</label>
            <input id="t-tags" {...register('tags')} className={inputCls} placeholder="urgent, kuliah" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit">{initial ? 'Simpan Perubahan' : 'Tambah Tugas'}</Button>
        </div>
      </form>
    </div>
  );
}
