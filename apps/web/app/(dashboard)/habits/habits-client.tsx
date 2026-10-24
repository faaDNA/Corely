'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Flame, Check, Trophy, Trash2, Loader2 } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Habit } from '@repo/types';
import { addHabit, deleteHabit, toggleHabitToday } from './actions';
import { toast } from '@/components/toast';

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function HabitsClient({ initialHabits }: { initialHabits: Habit[] }) {
  const router = useRouter();
  const [habits, setHabits] = useState(initialHabits);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Sinkron ulang saat server kirim data baru (router.refresh) — item baru muncul tanpa navigasi.
  useEffect(() => setHabits(initialHabits), [initialHabits]);

  async function handleToggle(h: Habit) {
    const next = !h.completedToday;
    const today = isoDay(new Date());
    // Optimistic: flip flag, streak lokal, dan sel heatmap hari ini.
    setHabits((prev) =>
      prev.map((x) => {
        if (x.id !== h.id) return x;
        const days = x.recentDays ?? [];
        const recentDays = next
          ? [...new Set([...days, today])]
          : days.filter((d) => d !== today);
        return {
          ...x,
          completedToday: next,
          streak: next ? x.streak + 1 : Math.max(0, x.streak - 1),
          recentDays,
        };
      })
    );
    const res = await toggleHabitToday(h.id, next);
    if (!res.ok) {
      toast(res.error ?? 'Gagal memperbarui kebiasaan.');
      setHabits(initialHabits);
      return;
    }
    router.refresh();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || adding) return;
    setAdding(true);
    try {
      const res = await addHabit(name.trim());
      if (!res.ok) {
        toast(res.error ?? 'Gagal menambah kebiasaan.');
        return;
      }
      toast('Kebiasaan ditambahkan.');
      setName('');
      setOpen(false);
      router.refresh();
    } finally {
      setAdding(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete;
    const backup = habits;
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setPendingDelete(null);
    const res = await deleteHabit(id);
    if (!res.ok) {
      toast(res.error ?? 'Gagal menghapus kebiasaan.');
      setHabits(backup);
      return;
    }
    toast('Kebiasaan dihapus.');
    router.refresh();
  }

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { label: String(d.getDate()).padStart(2, '0'), iso: isoDay(d) };
  });

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kebiasaan</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Bangun kebiasaan baik dengan penandaan harian dan visualisasi streak.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Kebiasaan Baru</Button>
      </header>

      {/* Grid habit cards */}
      <div className="space-y-3">
        {habits.map((h) => (
          <div key={h.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => handleToggle(h)}
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition',
                h.completedToday
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-600 dark:hover:border-slate-700 dark:hover:text-slate-400'
              )}
            >
              <Check className="h-6 w-6" />
            </button>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{h.name}</h3>
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-600 dark:text-slate-400">{h.frequency}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 text-amber-400"><Flame className="h-3.5 w-3.5" />Streak: {h.streak} hari</span>
                <span className="inline-flex items-center gap-1 text-slate-500"><Trophy className="h-3.5 w-3.5" />Rekor: {h.longestStreak} hari</span>
              </div>
            </div>

            {/* 14-day heatmap — dari habit_logs */}
            <div className="flex items-center gap-1">
              {days.map((cell) => {
                const active = (h.recentDays ?? []).includes(cell.iso);
                return (
                  <div key={cell.iso} className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        'h-6 w-3 rounded-sm',
                        active ? 'bg-emerald-500/80' : 'bg-slate-200 dark:bg-slate-800'
                      )}
                      title={cell.iso}
                    />
                    <span className="text-[10px] text-slate-500 dark:text-slate-600">{cell.label}</span>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={() => setPendingDelete(h.id)} aria-label="Delete" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-600 dark:hover:bg-red-950 dark:hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
            Belum ada kebiasaan yang dipantau.
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <form onSubmit={handleAdd} className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Kebiasaan Baru</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Baca 20 menit, Olahraga..."
              required
              className="mt-4 w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={adding}>
              {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tambah
            </Button>
            </div>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hapus kebiasaan ini?</h3>
            <p className="mt-2 text-xs text-slate-400">Streak dan riwayat penandaan ikut terhapus. Tindakan ini tidak bisa dibatalkan.</p>
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