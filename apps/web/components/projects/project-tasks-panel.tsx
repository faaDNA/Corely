'use client';

import { Dialog, DialogDescription, DialogTitle } from '@/components/dialog';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Project, Task, TaskStatus, TaskPriority } from '@repo/types';
import { TaskFormModal } from '@/components/tasks/task-form-modal';
import { priorityLabel, type TaskFormValues } from '@/components/tasks/task-schema';
import { deleteTask, saveTask, toggleTask } from '@/app/(dashboard)/tasks/actions';
import { toast } from '@/components/toast';
import { toISO } from '@/lib/calendar-range';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  LOW: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

/** Tugas milik satu proyek. State diangkat dari halaman detail agar progress header ikut update (ponytail: global store saat backend ada). */
export function ProjectTasksPanel({ projectId, projectName, projects, tasks, setTasks, onChanged }: {
  projectId: string;
  projectName: string;
  projects: Project[];
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  onChanged?: () => void;
}) {
  const [modal, setModal] = useState<{ open: boolean; initial?: Task | null }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const related = useMemo(
    () => tasks.filter((t) => t.projectId === projectId && !t.deletedAt).sort((a, b) => Number(a.status === 'COMPLETED') - Number(b.status === 'COMPLETED')),
    [tasks, projectId]
  );
  const done = related.filter((t) => t.status === 'COMPLETED').length;

  async function toggle(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const next: TaskStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: next, completedAt: next === 'TODO' ? undefined : toISO(new Date()) }
          : t
      )
    );
    const res = await toggleTask(task);
    if (!res.ok) {
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      toast(res.error ?? 'Gagal memperbarui tugas.', 'error');
      return;
    }
  }

  async function submit(values: TaskFormValues) {
    // status tidak dari form — tugas baru selalu TODO, edit pertahankan status lama
    const status: TaskStatus = modal.initial?.status ?? 'TODO';
    const payload: Task = {
      id: modal.initial?.id ?? `new-${Date.now()}`,
      title: values.title,
      description: values.description || undefined,
      status,
      priority: values.priority as TaskPriority,
      dueDate: values.dateMode === 'none' ? undefined : values.dueDate || undefined,
      dueTime: values.dateMode === 'none' ? undefined : values.dueTime || undefined,
      dateMode: values.dateMode === 'none' ? undefined : values.dateMode,
      // Hormati pilihan "Proyek" di form (pindah proyek / tanpa proyek), jangan paksa proyek ini.
      projectId: values.projectId || undefined,
      tags: values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      completedAt: status === 'COMPLETED' ? modal.initial?.completedAt ?? toISO(new Date()) : undefined,
    };
    const stays = payload.projectId === projectId;
    setModal({ open: false });
    if (modal.initial) {
      setTasks((prev) =>
        stays ? prev.map((t) => (t.id === modal.initial!.id ? payload : t)) : prev.filter((t) => t.id !== modal.initial!.id)
      );
    } else if (stays) {
      setTasks((prev) => [...prev, payload]);
    }
    const res = await saveTask(payload);
    if (!res.ok) {
      toast(res.error ?? 'Gagal menyimpan tugas.', 'error');
      onChanged?.(); // refresh menarik ulang data benar dari server
      return;
    }
    if (!stays) {
      const target = projects.find((p) => p.id === payload.projectId)?.name;
      toast(target ? `Tugas dipindah ke ${target}.` : 'Tugas dikeluarkan dari proyek ini.');
    } else {
      toast(modal.initial ? 'Tugas diperbarui.' : `Tugas ditambahkan ke ${projectName}.`);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete;
    const backup = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, deletedAt: toISO(new Date()) } : t)));
    setPendingDelete(null);
    const res = await deleteTask(id);
    if (!res.ok) {
      setTasks(backup);
      toast(res.error ?? 'Gagal menghapus tugas.', 'error');
      return;
    }
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
              <button type="button" onClick={() => toggle(t.id)} aria-label={t.status === 'COMPLETED' ? `Tandai belum selesai: ${t.title}` : `Tandai selesai: ${t.title}`} aria-pressed={t.status === 'COMPLETED'} className="-m-2.5 shrink-0 p-2.5">
                {t.status === 'COMPLETED'
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  : <Circle className="h-5 w-5 text-slate-400 transition hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400" />}
              </button>
              <span className={cn('min-w-0 flex-1 text-slate-800 dark:text-slate-200', t.status === 'COMPLETED' && 'text-slate-500 line-through dark:text-slate-400')}>
                {t.title}
                {t.dateMode === 'schedule' && t.dueDate && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">{t.dueDate}{t.dueTime ? ` · ${t.dueTime}` : ''}</span>
                )}
                {t.dateMode !== 'schedule' && t.dueDate && <span className="ml-2 text-amber-600 dark:text-amber-400">{t.dueDate}</span>}
              </span>
              <span className={cn('shrink-0 rounded border px-1.5 py-0.5 text-[10px]', PRIORITY_BADGE[t.priority])}>{priorityLabel(t.priority)}</span>
              <span className="-my-1.5 flex shrink-0 gap-1 transition group-focus-within:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                <button type="button" onClick={() => setModal({ open: true, initial: t })} aria-label={`Ubah ${t.title}`} className="inline-flex items-center justify-center rounded p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"><Pencil className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => setPendingDelete(t.id)} aria-label={`Hapus ${t.title}`} className="inline-flex items-center justify-center rounded p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </span>
            </div>
          ))}
        </div>
      )}

      <TaskFormModal
        open={modal.open}
        initial={modal.initial ?? null}
        defaultProjectId={projectId}
        projects={projects}
        onSubmit={submit}
        onClose={() => setModal({ open: false })}
      />

      {pendingDelete && (
        <Dialog open onClose={() => setPendingDelete(null)} withDescription>
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <DialogTitle className="text-sm font-semibold text-slate-900 dark:text-white">Hapus tugas ini?</DialogTitle>
            <DialogDescription className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Tugas dihapus dari daftar.</DialogDescription>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={confirmDelete}>Hapus</Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}