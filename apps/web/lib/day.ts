/**
 * 'Hari ini' versi WIB (GMT+7).
 * Server Vercel ber-TZ UTC — `new Date().getDate()` di server bisa tertinggal
 * satu hari untuk user WIB. Pakai fungsi ini, jangan getter lokal.
 */

/** Date yang sudah digeser +7 jam. Baca dengan getter UTC (getUTCFullYear dst). */
export function wibNow(at: Date = new Date()): Date {
  return new Date(at.getTime() + 7 * 3600_000);
}

/** 'YYYY-MM-DD' hari ini menurut WIB. */
export function isoWIB(at: Date = new Date()): string {
  const d = wibNow(at);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}
