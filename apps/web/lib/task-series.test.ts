import assert from 'node:assert/strict';
import type { Task } from '@repo/types';
import { taskSeries } from './task-series.ts';

const now = new Date(2026, 9, 13); // Oct 13 2026 (local), Selasa
const t = (over: Partial<Task>): Task => ({ id: 'x', title: 'x', status: 'TODO', priority: 'MEDIUM', ...over });

const sample: Task[] = [
  t({ completedAt: '2026-10-13' }), // hari ini
  t({ completedAt: '2026-10-06' }), // Selasa minggu lalu
  t({ createdAt: '2026-10-07' }), // 7 hari lalu (masuk window daily)
  t({ createdAt: '2026-06-15' }), // Juni — bulan pertama window bulanan
];

// daily: 7 bucket, berakhir hari ini
const daily = taskSeries(sample, 'daily', now);
assert.equal(daily.length, 7);
assert.equal(daily[6].selesai, 1);
assert.equal(daily[6].dibuat, 0);
assert.equal(daily[0].dibuat, 1); // Oct 7 = bucket pertama

// weekly: 4 bucket; Selasa lalu masuk Mgg 3 (Mgg 4 = minggu berjalan Oct 12–18)
const weekly = taskSeries(sample, 'weekly', now);
assert.equal(weekly.length, 4);
assert.equal(weekly[3].selesai, 1); // Oct 13
assert.equal(weekly[2].selesai, 1); // Oct 6
assert.equal(weekly[3].dibuat, 0);

// monthly: MONTHS bucket, Juni = pertama
const monthly = taskSeries(sample, 'monthly', now);
assert.equal(monthly.length, 5);
assert.equal(monthly[0].name.toLowerCase(), 'jun');
assert.equal(monthly[0].dibuat, 1);
assert.equal(monthly[4].selesai, 2); // Oct: 6 + 13
assert.equal(monthly[3].selesai, 0); // Sep kosong

console.log('OK: task-series tests passed');
