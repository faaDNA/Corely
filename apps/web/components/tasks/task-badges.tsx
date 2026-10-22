'use client';

import type { Project, Task } from '@repo/types';
import { cn } from '@repo/ui';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  LOW: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

export function TaskBadges({ task, projects }: { task: Task; projects: Project[] }) {
  const isSchedule = task.dateMode === 'schedule';
  const name = projects.find((p) => p.id === task.projectId)?.name;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={cn('rounded border px-1.5 py-0.5 text-[10px] font-medium', PRIORITY_BADGE[task.priority])}>
        {task.priority}
      </span>
      {task.dueDate && (
        <span
          className={cn(
            'rounded px-1.5 py-0.5 text-[10px]',
            isSchedule ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          )}
        >
          {isSchedule ? '🗓' : '📅'} {task.dueDate}
          {task.dueTime ? ` · ${task.dueTime}` : ''}
        </span>
      )}
      {name && (
        <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-600 dark:text-blue-400">📁 {name}</span>
      )}
      {task.tags?.map((tag) => (
        <span key={tag} className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-600 dark:text-purple-400">
          #{tag}
        </span>
      ))}
    </div>
  );
}