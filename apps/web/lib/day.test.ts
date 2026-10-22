import assert from 'node:assert/strict';
import { isoWIB, wibNow } from './day.ts';

// 00:30 WIB (17:30 UTC sebelumnya) → sudah hari berikutnya
assert.equal(isoWIB(new Date('2026-10-21T17:30:00Z')), '2026-10-22');
// 23:59 WIB → masih hari yang sama
assert.equal(isoWIB(new Date('2026-10-21T16:59:00Z')), '2026-10-21');
// wibNow dibaca dengan getter UTC
assert.equal(wibNow(new Date('2026-10-21T17:30:00Z')).getUTCDate(), 22);

console.log('day.test.ts OK');
