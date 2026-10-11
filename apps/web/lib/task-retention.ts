import type { Task } from '@repo/types';

/** Window retensi = bulan yang ditampilkan analitik (5 bulan terakhir, termasuk bulan ini). */
export const RETENTION_MONTHS = 5;

/** Awal bulan paling awal yang masih disimpan. Sampah sebelum ini → purge permanen. */
export function retentionFloor(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth() - (RETENTION_MONTHS - 1), 1);
}

/** Tanggal lokal YYYY-MM-DD — hindari geser UTC pada `toISOString`. */
function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

/** Buang permanen task sampah yang sudah keluar window bulan. Ini pengganti cron di backend. */
export function purgeExpired(tasks: Task[], now: Date = new Date()): Task[] {
  const floor = localISO(retentionFloor(now)); // deletedAt disimpan YYYY-MM-DD → banding string aman lintas TZ
  return tasks.filter((t) => !t.deletedAt || t.deletedAt.slice(0, 10) >= floor);
}

/** Task yang masih "hidup" di tampilan kerja — bukan sampah, belum ter-purge. */
export function workingTasks(tasks: Task[], now: Date = new Date()): Task[] {
  return purgeExpired(tasks, now).filter((t) => !t.deletedAt);
}

/** Bulan saat item ini akan ter-purge, mis. "November 2026". */
export function purgeAtLabel(deletedAt: string): string {
  const d = new Date(deletedAt);
  return new Date(d.getFullYear(), d.getMonth() + RETENTION_MONTHS, 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}