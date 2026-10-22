import assert from 'node:assert/strict';
import { reminderTargets, DEFAULT_REMINDER_TIME } from './reminders.ts';

// jadwal 22 Okt 10:00 WIB → H = 09:00 tgl 22, H-1 = 10:00 tgl 21
const t = reminderTargets('2026-10-22', '10:00');
assert.equal(new Date(t.H).toISOString(), '2026-10-22T09:00:00.000Z');
assert.equal(new Date(t.H1).toISOString(), '2026-10-21T10:00:00.000Z');

// tanpa jam → default 08:00 WIB, H = jam 08:00 hari H (bukan dikurangi 1 jam)
const n = reminderTargets('2026-10-22');
assert.equal(new Date(n.H).toISOString(), '2026-10-22T08:00:00.000Z');
assert.equal(new Date(n.H1).toISOString(), '2026-10-21T08:00:00.000Z');
assert.equal(DEFAULT_REMINDER_TIME, '08:00');

// jadwal lewat tengah malam: 00:30 → H = 23:30 sehari sebelum (melewati batas hari)
const m = reminderTargets('2026-10-22', '00:30');
assert.equal(new Date(m.H).toISOString(), '2026-10-21T23:30:00.000Z');

console.log('reminders.test.ts OK');
