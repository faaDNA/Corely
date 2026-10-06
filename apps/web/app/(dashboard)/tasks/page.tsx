'use client';

import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Task, TaskStatus, TaskPriority } from '@repo/types';
import type { TaskFormValues } from '@/components/tasks/task-schema';
import { TaskFormModal } from '@/components/tasks/task-form-modal';
import { TaskListView } from '@/components/tasks/task-views';
import { mockTasks, mockProjects } from '@/lib/mock-data';
import { toast } from '@/components/toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  /** default: hanya tugas tanpa proyek. 'all' = semua termasuk tugas proyek. */
  const [project, setProject] = useState('none');
  const [sort, setSort] = useState<'due' | 'new'>('due');
  const [modal, setModal] = useState<{ open: boolean; initial?: Task | null }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let out = [...tasks];

    if (q) {
      const qq = q.toLowerCase();
      out = out.filter((t) => t.title.toLowerCase().includes(qq) || t.description?.toLowerCase().includes(qq));
    }
    if (status !== 'all') out = out.filter((t) => t.status === status);
    if (priority !== 'all') out = out.filter((t) => t.priority === priority);
    if (project === 'none') out = out.filter((t) => !t.projectId);
    else if (project !== 'all') out = out.filter((t) => t.projectId === project);

    if (sort === 'due') out.sort((a, b) => (a.dueDate ?? '') < (b.dueDate ?? '') ? -1 : 1);
    else out.sort((a, b) => (a.id < b.id ? 1 : -1));

    return out;
  }, [tasks, q, status, priority, project, sort]);

  const scoped = useMemo(() => {
    if (project === 'none') return tasks.filter((t) => !t.projectId);
    if (project === 'all') return tasks;
    return tasks.filter((t) => t.projectId === project);
  }, [tasks, project]);

  const confirmCount: Record<string, number> = {
    all: scoped.length,
    TODO: scoped.filter((t) => t.status === 'TODO').length,
    COMPLETED: scoped.filter((t) => t.status === 'COMPLETED').length,
  };

  function handleToggle(id: string) {
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

  function handleFormSubmit(values: TaskFormValues) {
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
      projectId: values.projectId || undefined,
      tags: values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      completedAt: status === 'COMPLETED' ? modal.initial?.completedAt ?? new Date().toISOString().slice(0, 10) : undefined,
    };

    if (modal.initial) {
      setTasks((prev) => prev.map((t) => (t.id === modal.initial!.id ? payload : t)));
      toast('Tugas diperbarui.');
    } else {
      setTasks((prev) => [...prev, payload]);
      toast('Tugas ditambahkan.');
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    setPendingDelete(id);
  }

  function confirmDelete() {
    if (pendingDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== pendingDelete));
      setPendingDelete(null);
      toast('Tugas dihapus.');
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tugas</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola tugas harian — klik checkbox untuk menyelesaikan.</p>
        </div>
        <Button onClick={() => setModal({ open: true, initial: null })}>
          <Plus className="mr-2 h-4 w-4" />Tugas Baru
        </Button>
      </header>

      {/* Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari tugas (judul / deskripsi)..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['all', 'All'],
                ['TODO', 'Todo'],
                ['COMPLETED', 'Completed'],
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

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="none">Tanpa proyek</option>
            <option value="all">Semua tasks</option>
            {mockProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as never)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="due">Sort: Due date</option>
            <option value="new">Sort: Newest</option>
          </select>
        </div>
      </div>

      <TaskListView tasks={filtered} onToggle={handleToggle} onEdit={(t) => setModal({ open: true, initial: t })} onDelete={handleDelete} />

      <TaskFormModal
        open={modal.open}
        initial={modal.initial ?? null}
        onSubmit={handleFormSubmit}
        onClose={() => setModal({ open: false })}
      />

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hapus tugas ini?</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Tindakan ini tidak bisa dibatalkan.</p>
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