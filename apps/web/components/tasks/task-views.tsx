'use client';

import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@repo/ui';
import type { Task } from '@repo/types';
import { mockProjects } from '@/lib/mock-data';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

function projectName(id?: string) {
  return mockProjects.find((p) => p.id === id)?.name;
}

export function TaskBadges({ task }: { task: Task }) {
  const isSchedule = task.dateMode === 'schedule';
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={cn('rounded border px-1.5 py-0.5 text-[10px] font-medium', PRIORITY_BADGE[task.priority])}>
        {task.priority}
      </span>
      {task.dueDate && (
        <span className={cn('rounded px-1.5 py-0.5 text-[10px]', isSchedule ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400')}>
          {isSchedule ? '🗓' : '📅'} {task.dueDate}{isSchedule && task.dueTime ? ` · ${task.dueTime}` : ''}
        </span>
      )}
      {projectName(task.projectId) && (
        <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400">📁 {projectName(task.projectId)}</span>
      )}
      {task.tags?.map((tag) => (
        <span key={tag} className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-400">#{tag}</span>
      ))}
    </div>
  );
}

function ToggleButton({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} aria-label="Toggle complete" className="shrink-0">
      {task.status === 'COMPLETED'
        ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        : <Circle className="h-5 w-5 text-slate-600 transition hover:text-emerald-400" />}
    </button>
  );
}

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mt-0.5"><ToggleButton task={task} onToggle={onToggle} /></div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className={cn('text-sm font-medium text-slate-100', task.status === 'COMPLETED' && 'text-slate-400 line-through')}>
          {task.title}
        </p>
        {task.description && <p className="text-xs text-slate-500">{task.description}</p>}
        <TaskBadges task={task} />
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
        <button type="button" onClick={onEdit} aria-label="Edit" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={onDelete} aria-label="Delete" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-950 hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function TaskListView({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
        <p className="text-sm text-slate-400">Tidak ada tugas yang cocok. 🎉</p>
        <p className="mt-1 text-xs text-slate-500">Ubah filter atau tambah tugas baru.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={() => onToggle(t.id)} onEdit={() => onEdit(t)} onDelete={() => onDelete(t.id)} />
      ))}
    </div>
  );
}