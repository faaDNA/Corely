'use server';

import { createClient } from '@/lib/supabase/server';
import { sendPushToUser } from '@/lib/webpush';

type Result = { ok: boolean; error?: string; sent?: number };

async function requireUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  if (!user) throw new Error('Sesi berakhir. Masuk ulang.');
  return user.id;
}

/** Simpan/perbarui langganan push perangkat ini. */
export async function savePushSubscription(sub: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<Result> {
  try {
    const userId = await requireUser();
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