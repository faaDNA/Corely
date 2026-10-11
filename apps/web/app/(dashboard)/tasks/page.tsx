'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArchiveRestore, Plus, Search, Trash2 } from 'lucide-react';
import { Button, cn } from '@repo/ui';
import type { Task, TaskStatus, TaskPriority } from '@repo/types';
import type { TaskFormValues } from '@/components/tasks/task-schema';
import { TaskFormModal } from '@/components/tasks/task-form-modal';
import { TaskListView } from '@/components/tasks/task-views';
import { mockTasks, mockProjects } from '@/lib/mock-data';
import { purgeExpired, purgeAtLabel, retentionFloor, RETENTION_MONTHS } from '@/lib/task-retention';
import { toast } from '@/components/toast';

type ViewTab = 'active' | 'trash';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [tab, setTab] = useState<ViewTab>('active');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  /** default: hanya tugas tanpa proyek. 'all' = semua termasuk tugas proyek. */
  const [project, setProject] = useState('none');
  const [sort, setSort] = useState<'due' | 'new'>('due');
  const [modal, setModal] = useState<{ open: boolean; initial?: Task | null }>({ open: false });
  const [pendingSoftDelete, setPendingSoftDelete] = useState<string | null>(null);
  const [pendingHardDelete, setPendingHardDelete] = useState<string | null>(null);

  // Auto-purge sampah yang sudah keluar window bulan (ganti cron backend)
  useEffect(() => {
    setTasks((prev) => {
      const next = purgeExpired(prev);
      return next.length === prev.length ? prev : next;
    });
  }, []);

  const retained = useMemo(() => purgeExpired(tasks), [tasks]);
  const activeTasks = useMemo(() => retained.filter((t) => !t.deletedAt), [retained]);
  const trashTasks = useMemo(() => retained.filter((t) => Boolean(t.deletedAt)), [retained]);

  const base = tab === 'trash' ? trashTasks : activeTasks;

  const filtered = useMemo(() => {
    let out = [...base];

    if (q) {
      const qq = q.toLowerCase();
      out = out.filter((t) => t.title.toLowerCase().includes(qq) || t.description?.toLowerCase().includes(qq));
    }
    if (status !== 'all') out = out.filter((t) => t.status === status);
    if (priority !== 'all') out = out.filter((t) => t.priority === priority);
    if (project === 'none') out = out.filter((t) => !t.projectId);
    else if (project !== 'all') out = out.filter((t) => t.projectId === project);

    if (tab === 'trash') out.sort((a, b) => (b.deletedAt ?? '') < (a.deletedAt ?? '') ? -1 : 1);
    else if (sort === 'due') out.sort((a, b) => (a.dueDate ?? '') < (b.dueDate ?? '') ? -1 : 1);
    else out.sort((a, b) => (a.id < b.id ? 1 : -1));

    return out;
  }, [base, q, status, priority, project, sort, tab]);

  const scoped = useMemo(() => {
    if (project === 'none') return base.filter((t) => !t.projectId);
    if (project === 'all') return base;
    return base.filter((t) => t.projectId === project);
  }, [base, project]);

  const confirmCount: Record<string, number> = {
    all: scoped.length,
    TODO: scoped.filter((t) => t.status === 'TODO').length,
    COMPLETED: scoped.filter((t) => t.status === 'COMPLETED').length,
  };

  function handleToggle(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: (t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED') as TaskStatus,
              completedAt: t.status === 'COMPLETED' ? undefined : todayISO(),
            }
          : t
      )
    );
  }

  function handleFormSubmit(values: TaskFormValues) {
    const st: TaskStatus = modal.initial?.status ?? 'TODO';
    const payload: Task = {
      id: modal.initial?.id ?? `t${Date.now()}`,
      title: values.title,
      description: values.description || undefined,
      status: st,
      priority: values.priority as TaskPriority,
      dueDate: values.dueDate || undefined,
      dueTime: values.dateMode === 'schedule' ? values.dueTime || undefined : undefined,
      dateMode: values.dateMode,
      projectId: values.projectId || undefined,
      tags: values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      completedAt: st === 'COMPLETED' ? modal.initial?.completedAt ?? todayISO() : undefined,
      // pertahankan deletedAt saat edit (sampah tidak diedit dari tab Aktif)
      deletedAt: modal.initial?.deletedAt,
    };

    if (modal.initial) {
      setTasks((prev) => prev.map((t) => (t.id === modal.initial!.id ? payload : t)));
      toast('Tugas diperbarui.');
    } else {
      setTasks((prev) => [...prev, payload]);
      toast('Tugas ditambahkan.');
    }
    setModal({ open: false });
  }

  function confirmSoftDelete() {
    if (!pendingSoftDelete) return;
    setTasks((prev) => prev.map((t) => (t.id === pendingSoftDelete ? { ...t, deletedAt: todayISO() } : t)));
    setPendingSoftDelete(null);
    toast(`Dipindah ke Sampah — hilang permanen awal ${purgeAtLabel(todayISO())}.`);
  }

  function restore(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, deletedAt: undefined } : t)));
    toast('Tugas dipulihkan.');
  }

  function confirmHardDelete() {
    if (!pendingHardDelete) return;
    setTasks((prev) => prev.filter((t) => t.id !== pendingHardDelete));
    setPendingHardDelete(null);
    toast('Tugas dihapus permanen.');
  }

  const floorLabel = retentionFloor().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tugas</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola tugas harian — klik checkbox untuk menyelesaikan.</p>
        </div>
        <Button onClick={() => setModal({ open: true, initial: null })}>
          <Plus className="mr-2 h-4 w-4" />Tugas Baru
        </Button>
      </header>

      {/* Aktif | Sampah */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setTab('active')}
            className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition', tab === 'active' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200')}
          >
            Aktif ({activeTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('trash')}
            className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition', tab === 'trash' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200')}
          >
            Sampah ({trashTasks.length})
          </button>
        </div>
        {tab === 'trash' && trashTasks.length > 0 && (
          <span className="text-[11px] text-slate-500">Terhapus sebelum {floorLabel} akan hilang permanen.</span>
        )}
      </div>

      {/* Toolbar — hidden di Sampah kecuali pencarian & filter status tetap berguna */}
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tab === 'trash' ? 'Cari di Sampah...' : 'Cari tugas (judul / deskripsi)...'}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['all', 'All'],
                ['TODO', 'Todo'],
                ['COMPLETED', 'Completed'],
              ] as const
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => setStatus(v)}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-medium transition',
                  status === v ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
                )}
              >
                {l} ({confirmCount[v]})
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="none">Tanpa proyek</option>
            <option value="all">Semua tasks</option>
            {mockProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {tab === 'active' && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as never)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="due">Sort: Due date</option>
              <option value="new">Sort: Newest</option>
            </select>
          )}
          {tab === 'trash' && (
            <span className="text-[11px] text-slate-500">Retensi {RETENTION_MONTHS} bulan — ikut window Analitik.</span>
          )}
        </div>
      </div>

      {tab === 'active' ? (
        <TaskListView tasks={filtered} onToggle={handleToggle} onEdit={(t) => setModal({ open: true, initial: t })} onDelete={(id) => setPendingSoftDelete(id)} />
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">Sampah kosong.</p>
              <p className="mt-1 text-xs text-slate-500">Tugas yang dihapus akan muncul di sini dan bisa dipulihkan sebelum hilang permanen.</p>
            </div>
          ) : (
            filtered.map((t) => (
              <div key={t.id} className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {t.status === 'COMPLETED' ? 'Selesai · tetap dihitung statistik' : 'Belum selesai · tidak dihitung'} · dihapus {t.deletedAt} · hilang permanen awal {t.deletedAt ? purgeAtLabel(t.deletedAt) : '—'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => restore(t.id)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ArchiveRestore className="h-3.5 w-3.5" />Pulihkan
                  </button>
                  <button type="button" onClick={() => setPendingHardDelete(t.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-500">
                    <Trash2 className="h-3.5 w-3.5" />Hapus permanen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <TaskFormModal
        open={modal.open}
        initial={modal.initial ?? null}
        onSubmit={handleFormSubmit}
        onClose={() => setModal({ open: false })}
      />

      {pendingSoftDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingSoftDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Pindah ke Sampah?</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Tugas akan masuk Sampah dan bisa dipulihkan. Hilang permanen awal {purgeAtLabel(todayISO())} (ikut window {RETENTION_MONTHS} bulan Analitik). Overdue tidak auto-hapus.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingSoftDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={confirmSoftDelete}>Pindah ke Sampah</Button>
            </div>
          </div>
        </div>
      )}

      {pendingHardDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPendingHardDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hapus permanen?</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Tidak bisa dibatalkan. Statistik untuk tugas ini akan hilang.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingHardDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={confirmHardDelete}>Hapus permanen</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
