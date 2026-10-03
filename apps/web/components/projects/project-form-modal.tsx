'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@repo/ui';
import type { Project } from '@repo/types';
import { projectSchema, type ProjectFormValues, PROJECT_STATUS_LABELS } from './project-schema';

interface Props {
  open: boolean;
  initial?: Project | null;
  onSubmit: (values: ProjectFormValues) => void;
  onClose: () => void;
}

const inputCls =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

const statuses = Object.entries(PROJECT_STATUS_LABELS);

function defaults(p?: Project | null): ProjectFormValues {
  return {
    name: p?.name ?? '',
    description: p?.description ?? '',
    status: (p?.status as ProjectFormValues['status']) ?? 'PLANNING',
    progress: p?.progress ?? 0,
    deadline: p?.deadline ?? '',
    technologies: p?.technologies?.join(', ') ?? '',
    repoUrl: p?.repoUrl ?? '',
    deployUrl: p?.deployUrl ?? '',
  };
}

export function ProjectFormModal({ open, initial, onSubmit, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema), defaultValues: defaults(initial) });

  useEffect(() => {
    if (open) reset(defaults(initial));
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

        <h3 className="text-lg font-semibold text-white">{initial ? 'Edit Proyek' : 'Proyek Baru'}</h3>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="p-name" className="text-xs font-medium text-slate-300">Nama *</label>
            <input id="p-name" {...register('name')} className={inputCls} placeholder="Nama proyek" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="p-desc" className="text-xs font-medium text-slate-300">Deskripsi</label>
            <textarea id="p-desc" {...register('description')} rows={2} className={inputCls} placeholder="Deskripsi singkat..." />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="p-status" className="text-xs font-medium text-slate-300">Status</label>
              <select id="p-status" {...register('status')} className={inputCls}>
                {statuses.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="p-progress" className="text-xs font-medium text-slate-300">Progress (%)</label>
              <input id="p-progress" type="number" min={0} max={100} {...register('progress')} className={inputCls} />
              {errors.progress && <p className="text-xs text-red-400">{errors.progress.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="p-deadline" className="text-xs font-medium text-slate-300">Tenggat</label>
            <input id="p-deadline" type="date" {...register('deadline')} className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="p-tech" className="text-xs font-medium text-slate-300">Teknologi (pisahkan koma)</label>
            <input id="p-tech" {...register('technologies')} className={inputCls} placeholder="Next.js, TypeScript" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="p-repo" className="text-xs font-medium text-slate-300">Repository URL</label>
              <input id="p-repo" {...register('repoUrl')} className={inputCls} placeholder="https://github.com/..." />
              {errors.repoUrl && <p className="text-xs text-red-400">{errors.repoUrl.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="p-deploy" className="text-xs font-medium text-slate-300">Deployment URL</label>
              <input id="p-deploy" {...register('deployUrl')} className={inputCls} placeholder="https://..." />
              {errors.deployUrl && <p className="text-xs text-red-400">{errors.deployUrl.message}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit">{initial ? 'Simpan Perubahan' : 'Tambah Proyek'}</Button>
        </div>
      </form>
    </div>
  );
}