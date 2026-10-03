'use client';

import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, Circle, Pencil, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@repo/ui';
import type { Task, TaskStatus } from '@repo/types';
import { mockProjects } from '@/lib/mock-data';
import { STATUS_LABELS } from './task-schema';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

function projectName(id?: string) {
  return mockProjects.find((p) => p.id === id)?.name;
}

export function TaskBadges({ task }: { task: Task }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={cn('rounded border px-1.5 py-0.5 text-[10px] font-medium', PRIORITY_BADGE[task.priority])}>
        {task.priority}
      </span>
      {task.dueDate && (
        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">📅 {task.dueDate}</span>
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

function ToggleButton({ task, onToggle, small }: { task: Task; onToggle: () => void; small?: boolean }) {
  const size = small ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <button type="button" onClick={onToggle} aria-label="Toggle complete" className="shrink-0">
      {task.status === 'COMPLETED'
        ? <CheckCircle2 className={cn(size, 'text-emerald-400')} />
        : <Circle className={cn(size, 'text-slate-600 transition hover:text-emerald-400')} />}
    </button>
  );
}

// ---------- List row ----------
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

// ---------- Kanban card ----------
function KanbanCard({
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-sm transition', isDragging && 'opacity-40')}
    >
      <div className="flex items-start gap-2">
        <ToggleButton task={task} onToggle={onToggle} small />
        <button type="button" {...attributes} {...listeners} aria-label="Drag" className="cursor-grab text-slate-600 active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <p className={cn('flex-1 text-xs font-medium text-slate-100', task.status === 'COMPLETED' && 'text-slate-400 line-through')}>
          {task.title}
        </p>
        <div className="flex shrink-0">
          <button type="button" onClick={onEdit} aria-label="Edit" className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onDelete} aria-label="Delete" className="rounded p-1 text-slate-500 hover:bg-red-950 hover:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {task.description && <p className="mt-1.5 pl-6 text-[11px] leading-relaxed text-slate-500">{task.description}</p>}
      <div className="mt-2 pl-6">
        <TaskBadges task={task} />
      </div>
    </div>
  );
}

// ---------- Droppable column ----------
function DroppableColumn({ status, count, children }: { status: TaskStatus; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">{STATUS_LABELS[status]}</h3>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">{count}</span>
      </div>
      <div ref={setNodeRef} className={cn('flex-1 rounded-lg transition', isOver && 'bg-blue-500/5 ring-1 ring-blue-500/30')}>
        {children}
      </div>
    </div>
  );
}

// ---------- Views ----------
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

export function TaskKanbanView({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onDrop,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDrop: (id: string, status: TaskStatus) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const colTasks = useMemo(
    () => COLUMNS.map((s) => ({ status: s, items: tasks.filter((t) => t.status === s) })),
    [tasks]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const source = tasks.find((t) => t.id === activeId);
    if (!source) return;

    const target = tasks.find((t) => t.id === overId);
    const newStatus = target ? target.status : ((COLUMNS as string[]).includes(overId) ? (overId as TaskStatus) : null);
    if (newStatus && source.status !== newStatus) onDrop(activeId, newStatus);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {colTasks.map((col) => (
          <DroppableColumn key={col.status} status={col.status} count={col.items.length}>
            <SortableContext items={col.items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {col.items.map((t) => (
                  <KanbanCard key={t.id} task={t} onToggle={() => onToggle(t.id)} onEdit={() => onEdit(t)} onDelete={() => onDelete(t.id)} />
                ))}
                {col.items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-slate-800 p-4 text-center text-[11px] text-slate-600">
                    Seret kartu ke sini
                  </p>
                )}
              </div>
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}

// ponytail: drag antar-kolom hanya mengubah local state — ganti dengan server action saat backend ada