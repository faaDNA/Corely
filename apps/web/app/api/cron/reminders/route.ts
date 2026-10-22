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
 * Dipanggil pg_cron (Supabase) tiap menit via pg_net POST; GET tetap ada
 * untuk test manual. Dedupe via tabel `reminder_sent`.
 */
async function handle(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const nowMs = wibNow().getTime();
  // rentang 3 hari: jaga-jaga untuk target yang jatuh tepat batas hari (subuh)
  const dates = [-1, 0, 1].map((o) => isoWIB(new Date(Date.now() + o * 86_400_000)));

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('id, title, user_id, due_date, due_time')
    .eq('status', 'TODO')
    .is('deleted_at', null)
    .in('due_date', dates);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // target yang jatuh dalam window pemicu saat ini (H atau H1)
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

  let sentCount = 0;
  let dbIssue: string | undefined;
  for (const { task, kind } of pending) {
    // klaim dulu (dedupe) — kalau sudah pernah terkirim, lewati tanpa spam
    const { error: insErr } = await supabase
      .from('reminder_sent')
      .insert({ task_id: task.id, kind, due_date: task.due_date });
    if (insErr) {
      if (insErr.code !== '23505') { dbIssue = insErr.message; break; } // 23505 = sudah terkirim
      continue;
    }

    const timeLabel = task.due_time ? ` (jam ${task.due_time.slice(0, 5)})` : '';
    const title =
      kind === 'H'
        ? task.due_time ? '🚨 1 Jam Lagi' : '🚨 Hari Ini'
        : '⏰ Besok ada jadwal';

    try {
      sentCount += await sendPushToUser(
        task.user_id,
        { title, body: `${task.title}${timeLabel}`, url: '/tasks' },
        supabase
      );
    } catch {
      // VAPID belum diset — klaim tetap tercatat supaya tidak spam saat dikoreksi
    }
  }

  if (dbIssue) return NextResponse.json({ ok: false, error: dbIssue }, { status: 500 });
  return NextResponse.json({ ok: true, evaluated: tasks?.length ?? 0, triggered: pending.length, sent: sentCount });
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
