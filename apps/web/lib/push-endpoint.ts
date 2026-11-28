/**
 * Validasi langganan Web Push dari client sebelum disimpan.
 * Server nanti POST ke `endpoint` (lib/webpush.ts) — tanpa validasi, user bisa
 * menyuruh server menembak URL internal (SSRF). Hanya push service browser resmi.
 */
const PUSH_HOSTS = [
  'fcm.googleapis.com', // Chrome, Edge (lama), Opera, Android
  'updates.push.services.mozilla.com', // Firefox
  'push.services.mozilla.com',
  'web.push.apple.com', // Safari / iOS 16.4+
  'notify.windows.com', // Edge (WNS, subdomain *.notify.windows.com)
];

export function isPushEndpoint(endpoint: string): boolean {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.port !== '' || url.username || url.password) return false;
  const host = url.hostname.toLowerCase();
  return PUSH_HOSTS.some((h) => host === h || host.endsWith('.' + h));
}

// base64url: p256dh = 65 byte (87 char), auth = 16 byte (22 char); toleransi padding.
const B64URL = /^[A-Za-z0-9_-]+={0,2}$/;
export function isPushKeys(keys: { p256dh: string; auth: string }): boolean {
  return (
    B64URL.test(keys.p256dh) && keys.p256dh.length >= 86 && keys.p256dh.length <= 90 &&
    B64URL.test(keys.auth) && keys.auth.length >= 21 && keys.auth.length <= 24
  );
}

/** URL yang boleh disimpan & dirender di <a href>: hanya http(s). Tolak javascript:, data:, dll. */
export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}
