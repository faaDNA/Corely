/** Helper tanggal kalender (lokal, bukan UTC). */

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Minggu (Min–Sab) yang memuat `d`. */
export function weekStartOf(d: Date): Date {
  const out = new Date(d);
  out.setDate(out.getDate() - out.getDay());
  return out;
}

/** 42 sel (6 minggu) untuk bulan yang memuat `d`. */
export function monthCellsFor(d: Date): Date[] {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  start.setDate(1 - start.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const cell = new Date(start);
    cell.setDate(start.getDate() + i);
    return cell;
  });
}

/** Geser bulan dinormalkan ke tanggal 1 — tanpa ini 31 Januari + 1 bulan jadi 3 Maret. */
export function shiftMonth(d: Date, delta: number): Date {
  const out = new Date(d);
  out.setDate(1);
  out.setMonth(out.getMonth() + delta);
  return out;
}
