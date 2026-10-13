'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2, Send } from 'lucide-react';
import { cn } from '@repo/ui';
import { vapidKeyToBytes } from '@/lib/vapid';
import { removePushSubscription, savePushSubscription, sendTestNotification } from '@/app/(dashboard)/push-actions';
import { toast } from '@/components/toast';

export function NotificationsBell() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ok = typeof Notification !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
    setSupported(ok);
    if (ok) setPermission(Notification.permission);
    (async () => {
      try {
        const reg = await navigator.serviceWorker?.ready;
        const sub = await reg?.pushManager?.getSubscription();
        if (sub) setSubscribed(true);
      } catch {
        // belum siap → tetap default.
      }
    })();
  }, []);

  async function enable() {
    if (!supported) return toast('Browser tidak mendukung notifikasi.');
    const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!pub) return toast('Kunci VAPID belum dikonfigurasi.');
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        if (perm === 'denied') toast('Izin diblokir. Buka pengaturan situs browser untuk mengizinkan kembali.');
        else toast('Izin ditolak.');
        return;
      }
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeyToBytes(pub) as BufferSource,
      });
      const j = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
      if (!j.endpoint || !j.keys?.p256dh || !j.keys?.auth) throw new Error('Langganan tidak lengkap.');
      const res = await savePushSubscription({ endpoint: j.endpoint, keys: { p256dh: j.keys.p256dh, auth: j.keys.auth } });
      if (!res.ok) throw new Error(res.error);
      setSubscribed(true);
      toast('Notifikasi diaktifkan. Perangkat ini akan menerima pengingat.');
      setOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Gagal mengaktifkan notifikasi.');
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await removePushSubscription(endpoint);
      }
      setSubscribed(false);
      toast('Notifikasi dimatikan untuk perangkat ini.');
      setOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Gagal mematikan notifikasi.');
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    const res = await sendTestNotification();
    toast(res.ok ? 'Notifikasi uji dikirim.' : res.error ?? 'Gagal kirim notifikasi.');
  }

  if (!supported) return null;

  const blocked = permission === 'denied';

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={subscribed ? 'Notifikasi aktif' : blocked ? 'Notifikasi diblokir' : 'Notifikasi mati'}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border transition',
          subscribed
            ? 'border-blue-500/50 bg-blue-600/10 text-blue-600 dark:bg-blue-600/15 dark:text-blue-400'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white',
          blocked && 'border-red-900/40 text-red-600 dark:text-red-400'
        )}
      >
        {subscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        {subscribed && !blocked && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" aria-hidden />}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifikasi</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Pengingat tenggat dikirim sebagai notifikasi browser OS. Aktifkan agar pengingat H-1 dan H tiba di perangkat ini.
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Status: {blocked ? 'diblokir' : subscribed ? 'aktif' : 'mati'}
          </p>
          {blocked && (
            <p className="mt-2 rounded-lg bg-red-950/20 px-2 py-1.5 text-[11px] text-red-600 dark:text-red-300">
              Izin diblokir browser. Buka pengaturan situs lalu izinkan Notifikasi.
            </p>
          )}

          <div className="mt-4 flex gap-2">
            {!subscribed ? (
              <button
                type="button"
                disabled={busy || blocked}
                onClick={enable}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Aktifkan
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={disable}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Matikan
              </button>
            )}
            <button
              type="button"
              onClick={test}
              title="Kirim notifikasi uji"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              disabled={!subscribed}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}