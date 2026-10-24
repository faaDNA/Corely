export type GridCell = {
  key: string;
  day: number;
  month: number;
  weekday: number;
  inMonth: boolean;
  row: number;
  col: number;
};

/**
 * Kisi bulan dengan Senin di kolom pertama, memakai UTC agar hasilnya tidak
 * bergantung zona waktu mesin. Jumlah baris menyesuaikan (5 atau 6).
 */
export function buildMonthGrid(year: number, monthIndex: number): GridCell[] {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells = Math.ceil((offset + daysInMonth) / 7) * 7;

  return Array.from({ length: cells }, (_, i) => {
    const d = new Date(Date.UTC(year, monthIndex, 1 - offset + i));
    const month = d.getUTCMonth();
    return {
      key: `${d.getUTCFullYear()}-${String(month + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`,
      day: d.getUTCDate(),
      month,
      weekday: (d.getUTCDay() + 6) % 7,
      inMonth: month === monthIndex,
      row: Math.floor(i / 7),
      col: i % 7,
    };
  });
}
