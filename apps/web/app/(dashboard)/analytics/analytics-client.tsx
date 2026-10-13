'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@repo/ui';
import type { Habit, Project, Task } from '@repo/types';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';
import { taskSeries, type Period } from '@/lib/task-series';

const STATUS_COLORS: Record<string, string> = { TODO: '#94a3b8', COMPLETED: '#10b981' };

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

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl dark:border-slate-700 dark:bg-slate-900">
      {label != null && label !== '' && <p className="mb-1 font-semibold text-slate-900 dark:text-white">{label}</p>}
      {payload.map((p: any, i: number) => {
        const dot = p.color ?? p.payload?.fill ?? p.fill;
        const name = p.name ?? label ?? '';
        return (
          <p key={`${name}-${i}`} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            {dot && <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />}
            {name}: <span className="font-semibold text-slate-900 dark:text-white">{p.value}</span>
          </p>
        );
      })}
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
    .map((p) => ({ name: p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name, progress: projectProgress(p, workingTasks) }));

  const habitData = habits.map((h) => ({
    name: h.name.length > 12 ? h.name.slice(0, 12) + '…' : h.name,
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
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
          {PERIODS.map((p) => (
            <button key={p} type="button" onClick={() => setPeriod(p)} className={cn('rounded-lg px-3 py-1.5 text-xs transition', period === p ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200')}>
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

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Tugas Selesai vs Dibuat — {PERIOD_LABEL[period]}</h2>
        {!nonEmpty ? (
          <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            Belum ada tugas pada periode ini — buat tugas untuk melihat deret waktu.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDibuat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="selesai" stroke="#10b981" fillOpacity={1} fill="url(#colorSelesai)" name="Selesai" />
              <Area type="monotone" dataKey="dibuat" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDibuat)" name="Dibuat" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Distribusi Status Tugas</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {statusData.map((d) => <Cell key={d.key} fill={STATUS_COLORS[d.key]} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Progres Proyek Aktif (%)</h2>
          {projectData.length === 0 ? (
            <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              Belum ada proyek aktif.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={projectData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="name" width={110} stroke="#64748b" fontSize={11} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#1e293b40' }} />
                <Bar dataKey="progress" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Konsistensi Kebiasaan — Streak Aktif vs Rekor</h2>
          {habitData.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              Belum ada kebiasaan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={habitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#1e293b40' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="streak" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Streak aktif" />
                <Bar dataKey="rekor" fill="#64748b" radius={[6, 6, 0, 0]} name="Rekor" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
