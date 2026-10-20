import assert from 'node:assert/strict';
import { taskSchema } from './task-schema.ts';

// tanpa tanggal → valid meski dateMode 'none'
assert.equal(taskSchema.safeParse({ title: 'Beli susu', priority: 'LOW', dateMode: 'none' }).success, true);

// tenggat/jadwal tanpa tanggal → ditolak di field dueDate
for (const mode of ['deadline', 'schedule']) {
  const r = taskSchema.safeParse({ title: 'Beli susu', priority: 'LOW', dateMode: mode });
  assert.equal(r.success, false);
  assert.equal(r.error.issues[0].path[0], 'dueDate');
}

// tenggat dengan tanggal, jadwal dengan tanggal + jam → valid
assert.equal(taskSchema.safeParse({ title: 'x', priority: 'HIGH', dateMode: 'deadline', dueDate: '2026-10-21' }).success, true);
assert.equal(taskSchema.safeParse({ title: 'x', priority: 'HIGH', dateMode: 'schedule', dueDate: '2026-10-21', dueTime: '08:30' }).success, true);

console.log('task-schema.test.ts OK');