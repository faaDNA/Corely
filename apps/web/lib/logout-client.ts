import { logout } from '@/app/(auth)/actions';
import { removePushSubscription } from '@/app/(dashboard)/push-actions';

/**
 * Logout dari browser: lepas langganan push perangkat ini dulu (selagi sesi masih
 * ada), baru keluar. Tanpa ini pengingat akun lama tetap muncul di perangkat yang
 * sama setelah orang lain login. Gagal melepas tidak boleh menghalangi logout.
 */
export async function logoutAndReleasePush() {
  try {
    if ('serviceWorker' in navigator) {
      // getRegistration, bukan .ready: .ready menggantung kalau SW belum pernah terpasang.
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        const { endpoint } = sub;
        await sub.unsubscribe();
        await removePushSubscription(endpoint);
      }
    }
  } catch (e) {
    console.error('lepas langganan push saat logout gagal:', e);
  }
  await logout();
}
