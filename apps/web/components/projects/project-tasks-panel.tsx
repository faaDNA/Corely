'use client';

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Task, TaskStatus, TaskPriority } from '@repo/types';
import { TaskFormModal } from '@/components/tasks/task-form-modal';
import type { TaskFormValues } from '@/components/tasks/task-schema';
import { toast } from '@/components/toast';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  LOW: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

/** Tugas milik satu proyek. State diangkat dari halaman detail agar progress header ikut update (ponytail: global store saat backend ada). */
export function ProjectTasksPanel({ projectId, projectName, tasks, setTasks }: {
  projectId: string;
  projectName: string;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}) {
  const [modal, setModal] = useState<{ open: boolean; initial?: Task | null }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const related = useMemo(() => tasks.filter((t) => t.projectId === projectId), [tasks, projectId]);
  const done = related.filter((t) => t.status === 'COMPLETED').length;

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: (t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED') as TaskStatus,
              completedAt: t.status === 'COMPLETED' ? undefined : new Date().toISOString().slice(0, 10),
            }
          : t
      )
    );
  }

  function submit(values: TaskFormValues) {
    // status tidak dari form — tugas baru selalu TODO, edit pertahankan status lama
    const status: TaskStatus = modal.initial?.status ?? 'TODO';
    const payload: Task = {
      id: modal.initial?.id ?? `t${Date.now()}`,
      title: values.title,
      description: values.description || undefined,
      status,
      priority: values.priority as TaskPriority,
      dueDate: values.dueDate || undefined,
      dueTime: values.dateMode === 'schedule' ? values.dueTime || undefined : undefined,
      dateMode: values.dateMode,
      projectId,
      tags: values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      completedAt: status === 'COMPLETED' ? modal.initial?.completedAt ?? new Date().toISOString().slice(0, 10) : undefined,
    };
    if (modal.initial) {
      setTasks((prev) => prev.map((t) => (t.id === modal.initial!.id ? payload : t)));
      toast('Tugas diperbarui.');
    } else {
      setTasks((prev) => [...prev, payload]);
      toast(`Tugas ditambahkan ke ${projectName}.`);
    }
    setModal({ open: false });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setTasks((prev) => prev.filter((t) => t.id !== pendingDelete));
    setPendingDelete(null);
    toast('Tugas dihapus.');
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tugas Proyek ({done}/{related.length} selesai)</h2>
        <Button size="sm" variant="outline" onClick={() => setModal({ open: true, initial: null })}>
          <Plus className="mr-1.5 h-4 w-4" />Tugas
        </Button>
      </div>

      {related.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Belum ada tugas. Tambahkan tugas proyek — progres &amp; status dihitung otomatis dari sini.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {related.map((t) => (
            <div key={t.id} className="group flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs">
              <button type="button" onClick={() => toggle(t.id)} aria-label="Toggle complete" className="shrink-0">
                {t.status === 'COMPLETED'
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  : <Circle className="h-5 w-5 text-slate-400 transition hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400" />}
              </button>
              <span className={cn('min-w-0 flex-1 text-slate-800 dark:text-slate-200', t.status === 'COMPLETED' && 'text-slate-400 line-through')}>
                {t.title}
                {t.dateMode === 'schedule' && t.dueDate && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">🗓 {t.dueDate}{t.dueTime ? ` · ${t.dueTime}` : ''}</span>
                )}
                {t.dateMode !== 'schedule' && t.dueDate && <span className="ml-2 text-slate-500">📅 {t.dueDate}</span>}
              </span>
              <span className={cn('shrink-0 rounded border px-1.5 py-0.5 text-[10px]', PRIORITY_BADGE[t.priority])}>{t.priority}</span>
              <span className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                <button type="button" onClick={() => setModal({ open: true, initial: t })} aria-label="Edit" className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"><Pencil className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => setPendingDelete(t.id)} aria-label="Delete" className="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </span>
            </div>
          ))}
        </div>
      )}

      <TaskFormModal
        open={modal.open}
        initial={modal.initial ?? null}
        defaultProjectId={projectId}
        onSubmit={submit}
        onClose={() => setModal({ open: false })}
      />

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hapus tugas ini?</h3>
            <p className="mt-2 text-xs text-slate-400">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={confirmDelete}>Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}