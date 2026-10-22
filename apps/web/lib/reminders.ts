export type ReminderKind = 'H' | 'H1';

/** Jam kirim default (WIB) untuk tugas tanpa jam. */
export const DEFAULT_REMINDER_TIME = '08:00';

/**
 * Waktu kirim pengingat sebagai epoch "dinding WIB" (jam WIB dilabeli Z —
 * bandingkan dengan wibNow().getTime(), lihat lib/day.ts).
 * - H-1: jam yang sama, sehari sebelum.
 * - H: 1 jam sebelum jadwal. Tanpa jam → 08:00 WIB di hari H (dan 08:00 sehari sebelum).
 */
export function reminderTargets(dueDate: string, dueTime?: string): Record<ReminderKind, number> {
  const due = Date.parse(`${dueDate}T${dueTime ?? DEFAULT_REMINDER_TIME}:00Z`);
  return { H: dueTime ? due - 3_600_000 : due, H1: due - 86_400_000 };
}
