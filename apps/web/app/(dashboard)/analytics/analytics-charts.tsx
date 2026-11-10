'use client';

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
import type { SeriesPoint } from '@/lib/task-series';

const STATUS_COLORS: Record<string, string> = { TODO: '#94a3b8', COMPLETED: '#10b981' };

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

export function AnalyticsCharts({
  periodLabel,
  nonEmpty,
  series,
  statusData,
  projectData,
  habitData,
}: {
  periodLabel: string;
  nonEmpty: boolean;
  series: SeriesPoint[];
  statusData: { name: string; value: number; key: string }[];
  projectData: { name: string; progress: number }[];
  habitData: { name: string; streak: number; rekor: number }[];
}) {
  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Tugas Selesai vs Dibuat — {periodLabel}</h2>
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
    </>
  );
}
