'use client';

import { useState } from 'react';
import { Plus, Flame, Check, Trophy, Trash2 } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Habit } from '@repo/types';
import { mockHabits } from '@/lib/mock-data';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  function toggleCheck(id: string) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const nextState = !h.completedToday;
        const nextStreak = nextState ? h.streak + 1 : Math.max(0, h.streak - 1);
        return {
          ...h,
          completedToday: nextState,
          streak: nextStreak,
          longestStreak: Math.max(h.longestStreak, nextStreak),
        };
      })
    );
  }

  function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const newH: Habit = {
      id: `h${Date.now()}`,
      name: name.trim(),
      frequency: 'daily',
      streak: 0,
      longestStreak: 0,
      completedToday: false,
    };
    setHabits((prev) => [...prev, newH]);
    setName('');
    setOpen(false);
  }

  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  // Visual dummy 14 hari terakhir untuk heatmap
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(8, 10);
  });

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kebiasaan</h1>
          <p className="mt-1 text-sm text-slate-400">Bangun kebiasaan baik dengan penandaan harian dan visualisasi streak.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Kebiasaan Baru</Button>
      </header>

      {/* Grid habit cards */}
      <div className="space-y-3">
        {habits.map((h) => (
          <div key={h.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => toggleCheck(h.id)}
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition',
                h.completedToday
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'border-slate-800 bg-slate-950 text-slate-600 hover:border-slate-700 hover:text-slate-400'
              )}
            >
              <Check className="h-6 w-6" />
            </button>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{h.name}</h3>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-400">{h.frequency}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 text-amber-400"><Flame className="h-3.5 w-3.5" />Streak: {h.streak} hari</span>
                <span className="inline-flex items-center gap-1 text-slate-500"><Trophy className="h-3.5 w-3.5" />Rekor: {h.longestStreak} hari</span>
              </div>
            </div>

            {/* Dummy 14-day heatmap */}
            <div className="flex items-center gap-1">
              {days.map((dayNum, idx) => {
                const active = (idx + h.streak) % 3 !== 0 || idx === 13 && h.completedToday;
                return (
                  <div key={dayNum} className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        'h-6 w-3 rounded-sm',
                        active ? 'bg-emerald-500/80' : 'bg-slate-800'
                      )}
                      title={`Hari ${dayNum}`}
                    />
                    <span className="text-[9px] text-slate-600">{dayNum}</span>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={() => deleteHabit(h.id)} aria-label="Delete" className="rounded-lg p-2 text-slate-600 hover:bg-red-950 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-sm text-slate-500">
            Belum ada kebiasaan yang dipantau.
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <form onSubmit={addHabit} className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Kebiasaan Baru</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Baca 20 menit, Olahraga..."
              required
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
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