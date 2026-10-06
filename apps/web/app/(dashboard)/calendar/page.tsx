'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { EventItem, Task } from '@repo/types';
import { mockEvents, mockTasks, mockProjects } from '@/lib/mock-data';

type ViewMode = 'month' | 'week' | 'day';

const TYPE_BADGE: Record<string, string> = {
  personal: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  task: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  schedule: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  project: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  habit: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
};

/** Semua item kalender diturunkan otomatis — user tidak perlu input dua kali. */
function deriveItems(events: EventItem[], tasks: Task[]): EventItem[] {
  const fromTasks: EventItem[] = tasks
    .filter((t) => t.dueDate && t.status !== 'COMPLETED')
    .map((t) => ({
      id: `task-${t.id}`,
      title: t.dateMode === 'schedule' ? `${t.title}${t.dueTime ? ` · ${t.dueTime}` : ''}` : t.title,
      startDate: t.dueDate!,
      type: t.dateMode === 'schedule' ? 'schedule' : 'task',
    }));
  const fromProjects: EventItem[] = mockProjects
    .filter((p) => p.deadline && !p.archived)
    .map((p) => ({ id: `proj-${p.id}`, title: p.name, startDate: p.deadline!, type: 'project' as const }));
  return [...events, ...fromTasks, ...fromProjects];
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const items = useMemo(() => deriveItems(events, mockTasks), [events]);
  const [view, setView] = useState<ViewMode>('month');
  const [cursor, setCursor] = useState(new Date('2026-10-01T00:00:00'));
  const [selected, setSelected] = useState(toISO(new Date('2026-10-04T00:00:00')));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: selected, type: 'personal' });

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
    const d = new Date(cursor);
    if (view === 'month') d.setMonth(d.getMonth() + delta);
    else if (view === 'week') d.setDate(d.getDate() + delta * 7);
    else d.setDate(d.getDate() + delta);
    setCursor(d);
  }

  function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setEvents((prev) => [
      ...prev,
      { id: `e${Date.now()}`, title: form.title.trim(), startDate: form.date, type: form.type as EventItem['type'] },
    ]);
    setForm({ title: '', date: selected, type: 'personal' });
    setOpen(false);
  }

  const selectedEvents = eventsOn(selected);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kalender</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Acara pribadi, tenggat tugas, dan batas proyek dalam satu tampilan.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Acara Baru</Button>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
        {/* Calendar toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => move(-1)} aria-label="Previous" className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-[160px] text-center text-sm font-semibold text-slate-900 dark:text-white">{monthLabel}</span>
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
                        <div key={e.id} className={cn('truncate rounded border px-1 py-0.5 text-[9px]', TYPE_BADGE[e.type])}>{e.title}</div>
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
                      <div key={e.id} className={cn('truncate rounded border px-1 py-0.5 text-[10px]', TYPE_BADGE[e.type])}>{e.title}</div>
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
              {new Date(selected + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="space-y-2">
              {selectedEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm">
                  <span className={cn('rounded border px-2 py-0.5 text-[10px] uppercase', TYPE_BADGE[e.type])}>{e.type}</span>
                  <span className="flex-1 text-slate-800 dark:text-slate-200">{e.title}</span>
                  <span className="text-xs text-slate-500">{e.startDate}</span>
                  {!e.id.startsWith('task-') && !e.id.startsWith('proj-') && (
                    <button type="button" onClick={() => setEvents((prev) => prev.filter((x) => x.id !== e.id))} aria-label="Delete" className="text-slate-600 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
              {selectedEvents.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-800 p-6 text-center text-xs text-slate-500">Tidak ada acara pada tanggal ini.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />Personal / Jadwal Tugas</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />Tenggat Tugas</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />Batas Proyek</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Habit</span>
        <span className="text-[11px] text-slate-500">Tenggat &amp; jadwal tugas serta batas proyek muncul otomatis.</span>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <form onSubmit={addEvent} className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Acara Baru</h3>
            <div className="mt-4 space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Judul acara"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="personal">Personal</option>
                <option value="task">Tenggat Tugas</option>
                <option value="project">Batas Proyek</option>
                <option value="habit">Habit</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit">Tambah</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}