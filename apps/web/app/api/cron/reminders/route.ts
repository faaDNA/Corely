import { NextResponse } from 'next/server';
import { isoWIB, wibNow } from '@/lib/day';
import { reminderTargets, type ReminderKind } from '@/lib/reminders';
import { createServiceClient } from '@/lib/supabase/service';
import { sendPushToUser } from '@/lib/webpush';

export const dynamic = 'force-dynamic';

// window: kirim telat maks 5 menit, tidak pernah lebih awal (cron tiap menit)
const WINDOW_MS = 5 * 60_000;

/**
 * Pengingat relatif waktu (WIB): H1 di jam yang sama sehari sebelum,
 * H satu jam sebelum jadwal (tanpa jam → 08:00 WIB, lihat lib/reminders.ts).
 * Dipanggil Vercel Cron tiap menit. Dedupe via tabel `reminder_sent`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const nowMs = wibNow().getTime();
  // rentang 3 hari: jaga-jaga untuk target yang jatuh tepat batas hari (subuh)
  const dates = [-1, 0, 1].map((o) => isoWIB(new Date(Date.now() + o * 86_400_000)));

  // Ambil semua tugas TODO yang punya tanggal & durasi relatif masuk akal
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('id, title, user_id, due_date, due_time')
    .eq('status', 'TODO')
    .is('deleted_at', null)
    .in('due_date', dates);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Filter mana yang jatuh dalam window pemicu saat ini (H atau H1)
  const pending: { task: NonNullable<typeof tasks>[number]; kind: ReminderKind }[] = [];
  for (const t of tasks ?? []) {
    if (!t.due_date) continue;
    const targets = reminderTargets(t.due_date, t.due_time ?? undefined);

    for (const kind of ['H', 'H1'] as const) {
      const diff = nowMs - targets[kind];
      if (diff >= 0 && diff <= WINDOW_MS) pending.push({ task: t, kind });
    }
  }

  if (!pending.length) {
    return NextResponse.json({ ok: true, evaluated: tasks?.length ?? 0, triggered: 0, sent: 0 });
  }

  // Cek mana yang SUDAH terkirim
  const { data: sentRows } = await supabase
    .from('reminder_sent')
    .select('task_id, kind, due_date');
  const sentSet = new Set((sentRows ?? []).map((r) => `${r.task_id}:${r.kind}:${r.due_date}`));

  let sentCount = 0;
  for (const { task, kind } of pending) {
    const key = `${task.id}:${kind}:${task.due_date}`;
    if (sentSet.has(key)) continue;

    const timeLabel = task.due_time ? ` (jam ${task.due_time.slice(0, 5)})` : '';
    const title =
      kind === 'H'
        ? task.due_time ? '🚨 1 Jam Lagi' : '🚨 Hari Ini'
        : '⏰ Besok ada jadwal';
    const body = `${task.title}${timeLabel}`;

    try {
      sentCount += await sendPushToUser(task.user_id, { title, body, url: '/tasks' }, supabase);
    } catch {
      // VAPID belum diset — tetap dicatat supaya tidak spam saat dikoreksi
    }

    // Catat dedupe (mencegah kirim ulang — juga saat tidak ada perangkat aktif)
    await supabase.from('reminder_sent').insert({ task_id: task.id, kind, due_date: task.due_date });
    sentSet.add(key);
  }

  return NextResponse.json({ ok: true, evaluated: tasks?.length ?? 0, triggered: pending.length, sent: sentCount });
}
