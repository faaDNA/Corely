'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { EventItem, Task } from '@repo/types';
import { mockTasks, mockProjects } from '@/lib/mock-data';

type ViewMode = 'month' | 'week' | 'day';

const TYPE_BADGE: Record<string, string> = {
  task: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  schedule: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  project: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
};

/** Badge aman — tipe tak dikenal jatuh ke task. */
function badgeFor(type: string): string {
  return TYPE_BADGE[type] ?? TYPE_BADGE.task;
}

const TYPE_LABEL: Record<string, string> = {
  task: 'Tenggat Tugas',
  schedule: 'Jadwal Tugas',
  project: 'Batas Proyek',
};

/**
 * Kalender murni agregasi: 2 tipe tugas (Tenggat & Jadwal) + tenggat proyek.
 * Tidak ada input manual — semua turunan dari Task & Project.
 */
function deriveItems(tasks: Task[], projects: typeof mockProjects): EventItem[] {
  const fromTasks: EventItem[] = tasks
    .filter((t) => t.dueDate && t.status !== 'COMPLETED')
    .map((t) => ({
      id: `task-${t.id}`,
      title: t.dateMode === 'schedule' ? `${t.title}${t.dueTime ? ` · ${t.dueTime}` : ''}` : t.title,
      startDate: t.dueDate!,
      type: t.dateMode === 'schedule' ? 'schedule' : 'task',
    }));
  const fromProjects: EventItem[] = projects
    .filter((p) => p.deadline && !p.archived)
    .map((p) => ({ id: `proj-${p.id}`, title: p.name, startDate: p.deadline!, type: 'project' as const }));
  return [...fromTasks, ...fromProjects];
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

function fromISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function CalendarPage() {
  const items = useMemo(() => deriveItems(mockTasks, mockProjects), []);
  const [view, setView] = useState<ViewMode>('month');
  const [cursor, setCursor] = useState(new Date('2026-10-01T00:00:00'));
  const [selected, setSelected] = useState(toISO(new Date('2026-10-04T00:00:00')));

  const monthLabel = cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const weekStart = useMemo(() => {
    const d = new Date(cursor);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }, [cursor]);

  const monthCells = useMemo(() => {
    const first = new Date(cursor);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; }),
    [weekStart]
  );

  function eventsOn(iso: string) {
    return items.filter((e) => e.startDate === iso);
  }

  function move(delta: number) {
    if (view === 'day') {
      const d = fromISO(selected);
      d.setDate(d.getDate() + delta);
      const iso = toISO(d);
      setSelected(iso);
      setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
      return;
    }
    const d = new Date(cursor);
    if (view === 'month') d.setMonth(d.getMonth() + delta);
    else if (view === 'week') d.setDate(d.getDate() + delta * 7);
    setCursor(d);
  }

  const selectedEvents = eventsOn(selected);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kalender</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tenggat &amp; jadwal tugas serta batas proyek, otomatis dalam satu tampilan.</p>
        </div>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
        {/* Calendar toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => move(-1)} aria-label="Previous" className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-[160px] text-center text-sm font-semibold text-slate-900 dark:text-white">
              {view === 'day'
                ? fromISO(selected).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                : monthLabel}
            </span>
            <button type="button" onClick={() => move(1)} aria-label="Next" className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"><ChevronRight className="h-4 w-4" /></button>
            <Button variant="outline" size="sm" onClick={() => { const now = new Date('2026-10-04T00:00:00'); setCursor(new Date(now.getFullYear(), now.getMonth(), 1)); setSelected(toISO(now)); }}>Hari Ini</Button>
          </div>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn('rounded-lg px-3 py-1.5 text-xs transition', view === v ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200')}
              >
                {v === 'month' ? 'Bulan' : v === 'week' ? 'Minggu' : 'Hari'}
              </button>
            ))}
          </div>
        </div>

        {/* Month view */}
        {view === 'month' && (
          <div className="p-3">
            <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-slate-500">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthCells.map((d, i) => {
                const iso = toISO(d);
                const inMonth = d.getMonth() === cursor.getMonth();
                const isSel = iso === selected;
                const evs = eventsOn(iso);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(iso)}
                    className={cn(
                      'min-h-[68px] rounded-lg border p-1.5 text-left transition',
                      isSel ? 'border-blue-500 bg-blue-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700',
                      !inMonth && 'opacity-40'
                    )}
                  >
                    <span className={cn('text-xs font-medium', isSel ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300')}>{d.getDate()}</span>
                    <div className="mt-1 space-y-0.5">
                      {evs.slice(0, 2).map((e) => (
                        <div key={e.id} className={cn('truncate rounded border px-1 py-0.5 text-[9px]', badgeFor(e.type))}>{e.title}</div>
                      ))}
                      {evs.length > 2 && <div className="text-[9px] text-slate-500">+{evs.length - 2} lagi</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Week view */}
        {view === 'week' && (
          <div className="grid gap-1 p-3 md:grid-cols-7">
            {weekDays.map((d) => {
              const iso = toISO(d);
              const evs = eventsOn(iso);
              const isSel = iso === selected;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  className={cn(
                    'rounded-lg border p-2 text-left transition',
                    isSel ? 'border-blue-500 bg-blue-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                  )}
                >
                  <div className="text-[10px] uppercase text-slate-500">{d.toLocaleDateString('id-ID', { weekday: 'short' })}</div>
                  <div className={cn('text-lg font-semibold', isSel ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white')}>{d.getDate()}</div>
                  <div className="mt-1 space-y-1">
                    {evs.map((e) => (
                      <div key={e.id} className={cn('truncate rounded border px-1 py-0.5 text-[10px]', badgeFor(e.type))}>{e.title}</div>
                    ))}
                    {evs.length === 0 && <div className="text-[10px] text-slate-600">—</div>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Day view */}
        {view === 'day' && (
          <div className="p-4">
            <p className="mb-3 text-xs text-slate-400">
              {fromISO(selected).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="space-y-2">
              {selectedEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm">
                  <span className={cn('rounded border px-2 py-0.5 text-[10px] uppercase', badgeFor(e.type))}>{TYPE_LABEL[e.type]}</span>
                  <span className="flex-1 text-slate-800 dark:text-slate-200">{e.title}</span>
                  <span className="text-xs text-slate-500">{e.startDate}</span>
                </div>
              ))}
              {selectedEvents.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-800 p-6 text-center text-xs text-slate-500">Tidak ada agenda pada tanggal ini.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />Tenggat Tugas</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />Jadwal Tugas</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />Batas Proyek</span>
        <span className="text-[11px] text-slate-500">Semua agenda muncul otomatis dari Tugas &amp; Proyek.</span>
      </div>
    </div>
  );
}
