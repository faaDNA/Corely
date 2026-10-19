import assert from 'node:assert/strict';
import { fromISO, monthCellsFor, shiftMonth, toISO, weekStartOf } from './calendar-range.ts';

// weekStartOf: selalu hari Minggu dan memuat tanggal inputnya
const today = new Date(2026, 9, 19); // Senin 19 Okt 2026
assert.equal(weekStartOf(today).getDay(), 0);
assert.equal(toISO(weekStartOf(today)), '2026-10-18');
assert.ok(weekStartOf(today) <= today && today.getTime() <= weekStartOf(today).getTime() + 6 * 864e5);
// hari Minggu sendiri = awal minggunya sendiri
assert.equal(toISO(weekStartOf(new Date(2026, 9, 18))), '2026-10-18');

// monthCellsFor: 42 sel, mulai Minggu, memuat tanggal input (bukan hanya tanggal 1)
const cells = monthCellsFor(today);
assert.equal(cells.length, 42);
assert.equal(cells[0].getDay(), 0);
assert.ok(cells[0] <= new Date(2026, 9, 1) && cells[0].getDay() === 0); // sel pertama mulai bulan sebelumnya
assert.ok(cells.some((d) => toISO(d) === toISO(today)));
// dipanggil dari tanggal 1 pun tetap sama
assert.deepEqual(cells.map(toISO), monthCellsFor(new Date(2026, 9, 1)).map(toISO));

// shiftMonth: dinormalkan ke tanggal 1 supaya tidak melompat 2 bulan
assert.equal(toISO(shiftMonth(new Date(2026, 9, 31), 1)), '2026-11-01');
assert.equal(toISO(shiftMonth(new Date(2026, 0, 31), 1)), '2026-02-01');
assert.equal(toISO(shiftMonth(new Date(2026, 2, 30), -1)), '2026-02-01');
assert.equal(toISO(shiftMonth(new Date(2026, 11, 31), 1)), '2027-01-01');

// ISO lokal, bukan UTC
assert.equal(toISO(fromISO('2026-10-19')), '2026-10-19');

console.log('calendar-range.test.ts OK');