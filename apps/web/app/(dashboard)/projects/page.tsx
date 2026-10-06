'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Github, ExternalLink } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Project } from '@repo/types';
import { mockProjects, mockTasks } from '@/lib/mock-data';
import { ProjectFormModal } from '@/components/projects/project-form-modal';
import { PROJECT_STATUS_BADGE, PROJECT_STATUS_LABELS, type ProjectFormValues } from '@/components/projects/project-schema';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [modal, setModal] = useState<{ open: boolean; initial?: Project | null }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const withStatus = useMemo(
    () => projects.map((p) => ({ p, status: deriveProjectStatus(p, mockTasks), progress: projectProgress(p, mockTasks) })),
    [projects]
  );

  const filtered = useMemo(() => {
    let out = withStatus;
    if (q) {
      const qq = q.toLowerCase();
      out = out.filter(({ p }) => p.name.toLowerCase().includes(qq) || p.description?.toLowerCase().includes(qq));
    }
    if (status !== 'all') out = out.filter((x) => x.status === status);
    return out;
  }, [withStatus, q, status]);

  const confirmCount: Record<string, number> = {
    all: projects.length,
    IN_PROGRESS: withStatus.filter((x) => x.status === 'IN_PROGRESS').length,
    COMPLETED: withStatus.filter((x) => x.status === 'COMPLETED').length,
    ON_HOLD: withStatus.filter((x) => x.status === 'ON_HOLD').length,
    ARCHIVED: withStatus.filter((x) => x.status === 'ARCHIVED').length,
  };

  function relatedCount(id: string) {
    return mockTasks.filter((t) => t.projectId === id).length;
  }

  function handleFormSubmit(values: ProjectFormValues) {
    const payload: Project = {
      id: modal.initial?.id ?? `p${Date.now()}`,
      name: values.name,
      description: values.description || undefined,
      onHold: values.manualStatus === 'on_hold' || undefined,
      archived: values.manualStatus === 'archived' || undefined,
      deadline: values.deadline || undefined,
      technologies: values.technologies ? values.technologies.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      repoUrl: values.repoUrl || undefined,
      deployUrl: values.deployUrl || undefined,
    };
    if (modal.initial) setProjects((prev) => prev.map((p) => (p.id === modal.initial!.id ? payload : p)));
    else setProjects((prev) => [...prev, payload]);
    setModal({ open: false });
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Proyek</h1>
          <p className="mt-1 text-sm text-slate-400">Aktivitas jangka panjang dengan progres, teknologi, dan tugas terkait.</p>
        </div>
        <Button onClick={() => setModal({ open: true, initial: null })}><Plus className="mr-2 h-4 w-4" />Proyek Baru</Button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari proyek..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['IN_PROGRESS', 'In Progress'],
              ['COMPLETED', 'Completed'],
              ['ON_HOLD', 'On Hold'],
              ['ARCHIVED', 'Archived'],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setStatus(v)}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-xs font-medium transition',
                status === v ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
              )}
            >
              {l} ({confirmCount[v]})
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-900/40 p-12 text-center text-sm text-slate-500">
          Tidak ada proyek yang cocok.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ p, status: st, progress: pr }) => (
            <div key={p.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  <Link href={`/projects/${p.id}`} className="hover:text-blue-400">{p.name}</Link>
                </h3>
                <span className={cn('shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium', PROJECT_STATUS_BADGE[st])}>
                  {PROJECT_STATUS_LABELS[st as keyof typeof PROJECT_STATUS_LABELS]}
                </span>
              </div>

              {p.description && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{p.description}</p>}

              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{pr}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pr}%` }} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.technologies?.map((t) => (
                    <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                {p.deadline && <span>📅 {p.deadline}</span>}
                <span className="ml-auto">📋 {relatedCount(p.id)} tugas</span>
              </div>

              {(p.repoUrl || p.deployUrl) && (
                <div className="mt-3 flex items-center gap-3 text-xs">
                  {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"><Github className="h-3.5 w-3.5" />Repo</a>}
                  {p.deployUrl && <a href={p.deployUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"><ExternalLink className="h-3.5 w-3.5" />Live</a>}
                  <Link href={`/projects/${p.id}`} className="ml-auto text-blue-400 hover:text-blue-300">Detail →</Link>
                </div>
              )}

              <div className="mt-3 flex justify-end gap-1 border-t border-slate-200 pt-3 opacity-0 transition group-hover:opacity-100 dark:border-slate-800">
                <button type="button" onClick={() => setModal({ open: true, initial: p })} aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => setPendingDelete(p.id)} aria-label="Delete" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectFormModal
        open={modal.open}
        initial={modal.initial ?? null}
        onSubmit={handleFormSubmit}
        onClose={() => setModal({ open: false })}
      />

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hapus proyek ini?</h3>
            <p className="mt-2 text-xs text-slate-400">Tugas terkait akan dihapus dari proyek (dummy). Tindakan tidak bisa dibatalkan.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={() => { setProjects((prev) => prev.filter((p) => p.id !== pendingDelete)); setPendingDelete(null); }}>Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}