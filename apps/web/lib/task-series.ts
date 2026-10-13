import type { Task } from '@repo/types';

// ponytail: duplikat RETENTION_MONTHS (task-retention.ts) — impor antar-modul lib bikin node --test perlu ekstensi .ts yang ditolak next build. Satukan kalau ada bundler test.
const MONTHS = 5;

export type Period = 'daily' | 'weekly' | 'monthly';
export type SeriesPoint = { name: string; selesai: number; dibuat: number };

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type Bucket = { name: string; from: string; to: string };

/**
 * Bucket "Selesai vs Dibuat":
 * - daily: 7 hari terakhir (berakhir hari ini)
 * - weekly: 4 minggu terakhir (Sen–Min, berakhir minggu berjalan)
 * - monthly: RETENTION_MONTHS bulan (ikut window retensi), berakhir bulan ini
 */
function bucketRange(period: Period, now: Date): Bucket[] {
  if (period === 'daily') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
      return { name: d.toLocaleDateString('id-ID', { weekday: 'short' }), from: iso(d), to: iso(d) };
    });
  }
  if (period === 'weekly') {
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
    return Array.from({ length: 4 }, (_, i) => {
      const start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - (3 - i) * 7);
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      return { name: `Mgg ${i + 1}`, from: iso(start), to: iso(end) };
    });
  }
  return Array.from({ length: MONTHS }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return { name: start.toLocaleDateString('id-ID', { month: 'short' }), from: iso(start), to: iso(end) };
  });
}

/** Deret harian/mingguan/bulanan dari `completedAt` (selesai) & `createdAt` (dibuat). */
export function taskSeries(tasks: Task[], period: Period, now: Date = new Date()): SeriesPoint[] {
  return bucketRange(period, now).map((b) => ({
    name: b.name,
    selesai: tasks.filter((t) => t.completedAt && t.completedAt >= b.from && t.completedAt <= b.to).length,
    dibuat: tasks.filter((t) => t.createdAt && t.createdAt >= b.from && t.createdAt <= b.to).length,
  }));
}
