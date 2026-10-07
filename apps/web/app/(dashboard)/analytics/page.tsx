'use client';

import { useState } from 'react';
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
import { mockTasks, mockProjects, mockHabits } from '@/lib/mock-data';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';

type Period = 'daily' | 'weekly' | 'monthly';

const SERIES: Record<Period, { label: string; data: { name: string; selesai: number; dibuat: number }[] }> = {
  daily: {
    label: 'Harian',
    data: [
      { name: 'Sen', selesai: 3, dibuat: 4 },
      { name: 'Sel', selesai: 5, dibuat: 3 },
      { name: 'Rab', selesai: 2, dibuat: 5 },
      { name: 'Kam', selesai: 6, dibuat: 4 },
      { name: 'Jum', selesai: 4, dibuat: 2 },
      { name: 'Sab', selesai: 2, dibuat: 3 },
      { name: 'Min', selesai: 1, dibuat: 1 },
    ],
  },
  weekly: {
    label: 'Mingguan',
    data: [
      { name: 'Mgg 1', selesai: 18, dibuat: 22 },
      { name: 'Mgg 2', selesai: 24, dibuat: 19 },
      { name: 'Mgg 3', selesai: 21, dibuat: 25 },
      { name: 'Mgg 4', selesai: 27, dibuat: 20 },
    ],
  },
  monthly: {
    label: 'Bulanan',
    data: [
      { name: 'Jun', selesai: 74, dibuat: 82 },
      { name: 'Jul', selesai: 91, dibuat: 88 },
      { name: 'Ags', selesai: 85, dibuat: 95 },
      { name: 'Sep', selesai: 98, dibuat: 90 },
      { name: 'Okt', selesai: 63, dibuat: 71 },
    ],
  },
};

const STATUS_COLORS: Record<string, string> = {
  TODO: '#94a3b8',
  COMPLETED: '#10b981',
};

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white" style={color ? { color } : undefined}>{value}</div>
      {sub && <div className="mt-1 text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl dark:border-slate-700 dark:bg-slate-900">
      {label != null && label !== '' && (
        <p className="mb-1 font-semibold text-slate-900 dark:text-white">{label}</p>
      )}
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('daily');

  const completed = mockTasks.filter((t) => t.status === 'COMPLETED').length;
  const pending = mockTasks.filter((t) => t.status !== 'COMPLETED').length;
  const completionRate = mockTasks.length ? Math.round((completed / mockTasks.length) * 100) : 0;

  const statusData = ['TODO', 'COMPLETED'].map((s) => ({
    name: s === 'TODO' ? 'Todo' : 'Completed',
    value: mockTasks.filter((t) => t.status === s).length,
    key: s,
  }));

  const projectData = mockProjects.filter((p) => deriveProjectStatus(p, mockTasks) === 'IN_PROGRESS').map((p) => ({
    name: p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name,
    progress: projectProgress(p, mockTasks),
  }));

  const habitData = mockHabits.map((h) => ({
    name: h.name.length > 12 ? h.name.slice(0, 12) + '…' : h.name,
    streak: h.streak,
    rekor: h.longestStreak,
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analitik</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Statistik produktivitas — tugas, proyek, dan konsistensi kebiasaan.</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
          {(Object.keys(SERIES) as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn('rounded-lg px-3 py-1.5 text-xs transition', period === p ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200')}
            >
              {SERIES[p].label}
            </button>
          ))}
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tugas Selesai" value={String(completed)} sub={`${completionRate}% completion rate`} color="#10b981" />
        <StatCard label="Tugas Tertunda" value={String(pending)} sub="Belum diselesaikan" color="#3b82f6" />
        <StatCard label="Streak Terpanjang" value={`${Math.max(...mockHabits.map((h) => h.longestStreak))} Hari`} sub="Dari semua kebiasaan" color="#f59e0b" />
        <StatCard label="Progres Proyek" value={`${Math.round(mockProjects.filter((p) => deriveProjectStatus(p, mockTasks) === 'IN_PROGRESS').reduce((a, p) => a + projectProgress(p, mockTasks), 0) / Math.max(1, mockProjects.filter((p) => deriveProjectStatus(p, mockTasks) === 'IN_PROGRESS').length))}%`} sub="Rata-rata proyek aktif" color="#a78bfa" />
      </div>

      {/* Completion over time */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Tugas Selesai vs Dibuat — {SERIES[period].label}</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={SERIES[period].data}>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status distribution */}
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

        {/* Project progress */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Progres Proyek Aktif (%)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={projectData} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
              <YAxis type="category" dataKey="name" width={110} stroke="#64748b" fontSize={11} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#1e293b40' }} />
              <Bar dataKey="progress" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Habit streaks */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Konsistensi Kebiasaan — Streak Aktif vs Rekor</h2>
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
        </div>
      </div>
    </div>
  );
}