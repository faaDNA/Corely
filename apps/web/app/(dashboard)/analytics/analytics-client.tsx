'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { cn } from '@repo/ui';
import type { Habit, Project, Task } from '@repo/types';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';
import { taskSeries, type Period } from '@/lib/task-series';

// Recharts (ratusan kB) dimuat belakangan — render skeleton dulu, charts muncul setelah JS selesai download
const AnalyticsCharts = dynamic(
  () => import('./analytics-charts').then((m) => m.AnalyticsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-2" aria-busy="true" aria-label="Memuat grafik">
        <div className="h-[340px] animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 lg:col-span-2" />
        <div className="h-[320px] animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60" />
        <div className="h-[320px] animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60" />
      </div>
    ),
  }
);

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white" style={color ? { color } : undefined}>
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

const PERIODS: Period[] = ['daily', 'weekly', 'monthly'];
const PERIOD_LABEL: Record<Period, string> = { daily: 'Harian', weekly: 'Mingguan', monthly: 'Bulanan' };

export function AnalyticsClient({
  tasks,
  workingTasks,
  projects,
  habits,
}: {
  tasks: Task[];
  workingTasks: Task[];
  projects: Project[];
  habits: Habit[];
}) {
  const [period, setPeriod] = useState<Period>('daily');

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pending = workingTasks.filter((t) => t.status !== 'COMPLETED').length;
  const completionRate = completed + pending ? Math.round((completed / (completed + pending)) * 100) : 0;

  const statusData = [
    { name: 'Todo', value: pending, key: 'TODO' },
    { name: 'Completed', value: completed, key: 'COMPLETED' },
  ];

  const projectData = projects
    .filter((p) => deriveProjectStatus(p, workingTasks) === 'IN_PROGRESS')
    .map((p) => ({ name: p.name.length > 16 ? p.name.slice(0, 16) + '...' : p.name, progress: projectProgress(p, workingTasks) }));

  const habitData = habits.map((h) => ({
    name: h.name.length > 12 ? h.name.slice(0, 12) + '...' : h.name,
    streak: h.streak,
    rekor: h.longestStreak,
  }));

  const series = useMemo(() => taskSeries(tasks, period), [tasks, period]);
  const nonEmpty = series.some((d) => d.selesai || d.dibuat);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analitik</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Statistik produktivitas — tugas, proyek, dan konsistensi kebiasaan.</p>
        </div>
        <div className="flex w-full rounded-lg border border-slate-200 dark:border-slate-700 sm:w-auto">
          {PERIODS.map((p) => (
            <button key={p} type="button" onClick={() => setPeriod(p)} className={cn('flex-1 rounded-lg px-3 py-1.5 text-xs transition sm:flex-none', period === p ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200')}>
              {PERIOD_LABEL[p]}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tugas Selesai" value={String(completed)} sub={`${completionRate}% completion rate`} color="#10b981" />
        <StatCard label="Tugas Tertunda" value={String(pending)} sub="Belum diselesaikan" color="#3b82f6" />
        <StatCard label="Streak Terpanjang" value={`${habits.length ? `${Math.max(...habits.map((h) => h.longestStreak))} Hari` : '—'}`} sub="Dari semua kebiasaan" color="#f59e0b" />
        <StatCard
          label="Progres Proyek"
          value={projects.filter((p) => deriveProjectStatus(p, workingTasks) === 'IN_PROGRESS').length ? `${Math.round(projects.filter((p) => deriveProjectStatus(p, workingTasks) === 'IN_PROGRESS').reduce((a, p) => a + projectProgress(p, workingTasks), 0) / Math.max(1, projects.filter((p) => deriveProjectStatus(p, workingTasks) === 'IN_PROGRESS').length))}%` : '—'}
          sub="Rata-rata proyek aktif"
          color="#a78bfa"
        />
      </div>

      <AnalyticsCharts
        periodLabel={PERIOD_LABEL[period]}
        nonEmpty={nonEmpty}
        series={series}
        statusData={statusData}
        projectData={projectData}
        habitData={habitData}
      />
    </div>
  );
}