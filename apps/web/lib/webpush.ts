import webpush from 'web-push';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

let ready: boolean | null = null;

/** VAPID dari env. Tanpa key → false (caller kasih pesan jelas, jangan throw). */
function init(): boolean {
  if (ready !== null) return ready;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    ready = false;
    return false;
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? 'mailto:admin@corely.app', pub, priv);
  ready = true;
  return true;
}

export type PushPayload = { title: string; body: string; url?: string };

/**
 * Kirim push ke semua langganan user. Subscription mati (404/410) dihapus dari tabel.
 * `db` opsional — cron pakai service-role client (lihat lib/supabase/service.ts).
 */
export async function sendPushToUser(userId: string, payload: PushPayload, db?: SupabaseClient): Promise<number> {
  if (!init()) throw new Error('VAPID belum dikonfigurasi (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).');
  const supabase = db ?? createClient();
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', userId);
  if (!subs?.length) return 0;

  let sent = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload)
      );
      sent++;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await supabase.from('push_subscriptions').delete().eq('id', s.id);
      }
    }
  }
  return sent;
}
