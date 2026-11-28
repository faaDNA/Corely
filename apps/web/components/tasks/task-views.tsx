'use client';

import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@repo/ui';
import type { Project, Task } from '@repo/types';
import { TaskBadges } from './task-badges';

function ToggleButton({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={task.status === 'COMPLETED' ? `Tandai belum selesai: ${task.title}` : `Tandai selesai: ${task.title}`}
      aria-pressed={task.status === 'COMPLETED'}
      className="-m-2.5 shrink-0 p-2.5"
    >
      {task.status === 'COMPLETED'
        ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        : <Circle className="h-5 w-5 text-slate-400 transition hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400" />}
    </button>
  );
}

function TaskRow({
  task,
  projects,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  projects: Project[];
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
      <div className="mt-0.5"><ToggleButton task={task} onToggle={onToggle} /></div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className={cn('text-sm font-medium text-slate-900 dark:text-slate-100', task.status === 'COMPLETED' && 'text-slate-500 line-through dark:text-slate-400')}>
          {task.title}
        </p>
        {task.description && <p className="text-xs text-slate-500">{task.description}</p>}
        <TaskBadges task={task} projects={projects} />
      </div>
      <div className="-my-2.5 flex shrink-0 gap-1 transition group-focus-within:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
        <button type="button" onClick={onEdit} aria-label={`Ubah ${task.title}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={onDelete} aria-label={`Hapus ${task.title}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function TaskListView({
  tasks,
  projects,
  onToggle,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  projects: Project[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">Tidak ada tugas yang cocok.</p>
        <p className="mt-1 text-xs text-slate-500">Ubah filter atau tambah tugas baru.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} projects={projects} onToggle={() => onToggle(t)} onEdit={() => onEdit(t)} onDelete={() => onDelete(t.id)} />
      ))}
    </div>
  );
}