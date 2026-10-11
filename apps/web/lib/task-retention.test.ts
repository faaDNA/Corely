import assert from 'node:assert/strict';
import type { Task } from '@repo/types';
import { purgeExpired, retentionFloor, workingTasks } from './task-retention.ts';

const mockNow = new Date(2026, 9, 11); // Oct 11 2026 (local)

// toISOString geser ±7 jam di WIB — format lokal agar floor terbaca benar
function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

// RETENTION_MONTHS = 5 → floor = June 1 2026
assert.equal(localISO(retentionFloor(mockNow)), '2026-06-01');

const sampleTasks: Task[] = [
  { id: '1', title: 'Live', status: 'TODO', priority: 'HIGH' },
  { id: '2', title: 'Deleted Oct', status: 'COMPLETED', priority: 'LOW', deletedAt: '2026-10-02' },
  { id: '3', title: 'Deleted Jun', status: 'TODO', priority: 'LOW', deletedAt: '2026-06-01' },
  { id: '4', title: 'Deleted May (expired)', status: 'COMPLETED', priority: 'LOW', deletedAt: '2026-05-31' },
];

const kept = purgeExpired(sampleTasks, mockNow);
assert.deepEqual(
  kept.map((t) => t.id),
  ['1', '2', '3']
); // '4' purged because May 31 < June 1

const active = workingTasks(sampleTasks, mockNow);
assert.deepEqual(
  active.map((t) => t.id),
  ['1']
); // only non-deleted

console.log('OK: task-retention tests passed');
