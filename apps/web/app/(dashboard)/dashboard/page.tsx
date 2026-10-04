import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  NotebookPen,
  FolderKanban,
  CalendarClock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, cn } from '@repo/ui';
import { Greeting } from '@/components/greeting';
import { mockTasks, mockProjects, mockNotes, mockHabits, mockEvents, mockStats } from '@/lib/mock-data';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function DashboardPage() {
  const today = '2026-10-04';
  const todayTasks = mockTasks.filter((t) => t.dueDate === today);
  const activeProjects = mockProjects
    .filter((p) => deriveProjectStatus(p, mockTasks) === 'IN_PROGRESS')
    .map((p) => ({ ...p, progress: projectProgress(p, mockTasks) }));
  const upcomingDeadlines = mockTasks
    .filter((t) => t.dueDate && t.dueDate > today && t.status !== 'COMPLETED' && t.dateMode !== 'schedule')
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 4);
  const upcomingSchedules = mockTasks
    .filter((t) => t.dueDate && t.status !== 'COMPLETED' && t.dateMode === 'schedule')
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));
  const recentNotes = [...mockNotes].sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1)).slice(0, 3);

  const stats = [
    { label: 'Tugas Pending', value: mockStats.pendingTasks, sub: `${mockStats.completedToday} selesai hari ini`, icon: Circle, color: 'text-blue-400' },
    { label: 'Proyek Aktif', value: mockStats.activeProjects, sub: `${mockStats.upcomingDeadlines} mendekati tenggat`, icon: FolderKanban, color: 'text-emerald-400' },
    { label: 'Streak Kebiasaan', value: `${mockStats.habitStreak} Hari`, sub: 'Rekor: 24 hari', icon: Flame, color: 'text-amber-400' },
    { label: 'Catatan', value: mockNotes.length, sub: `${mockNotes.filter((n) => n.pinned).length} disematkan`, icon: NotebookPen, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Greeting />
        <div className="flex gap-2">
          <Link href="/tasks" className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"><CheckCircle2 className="mr-2 h-4 w-4" />Tugas</Link>
          <Link href="/projects" className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"><FolderKanban className="mr-2 h-4 w-4" />Proyek</Link>
          <Link href="/notes" className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"><NotebookPen className="mr-2 h-4 w-4" />Catatan</Link>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{s.label}</span>
              <s.icon className={cn('h-4 w-4', s.color)} />
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{s.value}</div>
            <div className="mt-1 text-[11px] text-slate-500">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's tasks */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Tugas Hari Ini</CardTitle>
            <Link href="/tasks" className="text-xs text-blue-400 hover:text-blue-300">Lihat Semua</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayTasks.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">Belum ada tugas untuk hari ini 🎉</p>
            )}
            {todayTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs">
                <span className={cn(t.status === 'COMPLETED' && 'text-emerald-400')}>
                  {t.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4 text-slate-600" />}
                </span>
                <span className={cn('flex-1 text-slate-200', t.status === 'COMPLETED' && 'text-slate-400 line-through')}>
                  {t.title}
                </span>
                <span className={cn('rounded border px-2 py-0.5 text-[10px]', PRIORITY_BADGE[t.priority])}>
                  {t.priority}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active projects */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Proyek Aktif</CardTitle>
            <Link href="/projects" className="text-xs text-blue-400 hover:text-blue-300">Detail</Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map((p) => (
              <div key={p.id}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-slate-200">{p.name}</span>
                  <span className="font-mono text-blue-400">{p.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))}
            {activeProjects.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">Belum ada proyek aktif.</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Tenggat Terdekat</CardTitle>
            <Link href="/calendar" className="text-xs text-blue-400 hover:text-blue-300">Kalender</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingDeadlines.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs">
                <CalendarClock className="h-4 w-4 shrink-0 text-amber-400" />
                <span className="flex-1 text-slate-200">{t.title}</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="h-3 w-3" />
                  {t.dueDate}
                </span>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">Tidak ada tenggat terdekat.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Recent notes */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Catatan Terbaru</CardTitle>
              <Link href="/notes" className="text-xs text-blue-400 hover:text-blue-300">Semua</Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentNotes.map((n) => (
                <div key={n.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs">
                  <NotebookPen className="h-4 w-4 shrink-0 text-purple-400" />
                  <span className="flex-1 truncate text-slate-200">{n.title}</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">{n.category}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Habit summary */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Habit Hari Ini</CardTitle>
              <Link href="/habits" className="text-xs text-blue-400 hover:text-blue-300">Semua</Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockHabits.map((h) => (
                  <span
                    key={h.id}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs',
                      h.completedToday
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    )}
                  >
                    <Flame className="h-3 w-3" />
                    {h.name} · {h.streak}🔥
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming events */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Acara &amp; Jadwal Mendatang</CardTitle>
          <Link href="/calendar" className="text-xs text-blue-400 hover:text-blue-300">Kalender</Link>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {upcomingSchedules.map((t) => (
            <span key={t.id} className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">
              <CalendarClock className="h-4 w-4 text-blue-400" />
              <span className="font-medium">{t.title}</span>
              <span className="text-blue-400/80">{t.dueDate}{t.dueTime ? ` · ${t.dueTime}` : ''}</span>
            </span>
          ))}
          {mockEvents.map((e) => (
            <span key={e.id} className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              {e.title}
              <span className="text-slate-500">{e.startDate}</span>
            </span>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}