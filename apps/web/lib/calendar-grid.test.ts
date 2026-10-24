import assert from 'node:assert/strict';
import { buildMonthGrid } from './calendar-grid.ts';

// Oktober 2026: 1 Okt Kamis → kisi mulai Senin 28 September, 31 hari = 5 baris.
const oct = buildMonthGrid(2026, 9);
assert.equal(oct.length, 35);
assert.equal(oct[0].key, '2026-09-28');
assert.equal(oct[0].weekday, 0); // Senin
assert.equal(oct[3].key, '2026-10-01');
assert.equal(oct[3].weekday, 3); // Kamis
assert.equal(oct[7].key, '2026-10-05');
assert.equal(oct[5].key, '2026-10-03');
assert.equal(oct[5].weekday, 5); // Sabtu
assert.equal(oct[6].key, '2026-10-04');
assert.equal(oct[6].weekday, 6); // Minggu
assert.equal(oct.filter((c) => c.inMonth).length, 31);
assert.equal(oct[33].key, '2026-10-31');
assert.equal(oct[33].row, 4);
assert.equal(oct[33].col, 5); // Sabtu
assert.equal(oct[34].key, '2026-11-01');

// Maret 2026: 1 Maret Minggu → butuh 6 baris (42 sel) agar tanggal 31 masuk.
const mar = buildMonthGrid(2026, 2);
assert.equal(mar.length, 42);
assert.equal(mar[0].key, '2026-02-23');
assert.equal(mar[0].weekday, 0);
assert.equal(mar[6].key, '2026-03-01');
assert.equal(mar.filter((c) => c.inMonth).length, 31);

// Februari 2027 (28 hari, mulai Senin): tepat 4 minggu, tanpa sel bulan lain di ujung.
const feb = buildMonthGrid(2027, 1);
assert.equal(feb.length, 28);
assert.equal(feb.every((c) => c.inMonth), true);
