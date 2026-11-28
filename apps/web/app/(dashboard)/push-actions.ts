'use server';

import { createClient } from '@/lib/supabase/server';
import { requireUserId } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase/service';
import { sendPushToUser } from '@/lib/webpush';
import { isPushEndpoint, isPushKeys } from '@/lib/push-endpoint';

type Result = { ok: boolean; error?: string; sent?: number };

// Satu sumber: lib/auth (getClaims, tanpa round trip Auth bila JWT asimetrik).
const requireUser = requireUserId;

/** Simpan/perbarui langganan push perangkat ini. */
export async function savePushSubscription(sub: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<Result> {
  try {
    const userId = await requireUser();
    // Server nanti POST ke endpoint ini → wajib push service resmi (cegah SSRF).
    if (typeof sub?.endpoint !== 'string' || !isPushEndpoint(sub.endpoint) || !sub.keys || !isPushKeys(sub.keys)) {
      return { ok: false, error: 'Langganan notifikasi tidak valid.' };
    }
    // Endpoint yang sama bisa masih tercatat atas akun lain di browser ini (logout lama
    // tanpa melepas langganan). Baris itu tak terlihat lewat RLS → upsert gagal. Memegang
    // endpoint = menguasai browsernya, jadi baris lama boleh dilepas.
    try {
      await createServiceClient().from('push_subscriptions').delete().eq('endpoint', sub.endpoint).neq('user_id', userId);
    } catch (e) {
      console.error('push cleanup lintas akun dilewati:', e);
    }
    const supabase = createClient();
    const { error } = await supabase.from('push_subscriptions').upsert(
      { user_id: userId, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      { onConflict: 'endpoint' }
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyimpan langganan.' };
  }
}

/** Hapus langganan perangkat ini (saat nonaktifkan). */
export async function removePushSubscription(endpoint: string): Promise<Result> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)
      .eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghapus langganan.' };
  }
}

/** Kirim notifikasi uji ke perangkat user. */
export async function sendTestNotification(): Promise<Result> {
  try {
    const userId = await requireUser();
    const sent = await sendPushToUser(userId, {
      title: 'Corely',
      body: 'Notifikasi aktif. Pengingat tenggat akan dikirim ke sini.',
      url: '/tasks',
    });
    if (sent === 0) return { ok: false, error: 'Tidak ada perangkat aktif. Aktifkan notifikasi dulu.' };
    return { ok: true, sent };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal kirim notifikasi uji.' };
  }
}