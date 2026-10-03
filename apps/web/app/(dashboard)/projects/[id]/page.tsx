'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Calendar, Cpu, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@repo/ui';
import { mockProjects, mockTasks } from '@/lib/mock-data';
import { PROJECT_STATUS_BADGE, PROJECT_STATUS_LABELS } from '@/components/projects/project-schema';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = useMemo(() => mockProjects.find((p) => p.id === id), [id]);
  const related = useMemo(() => mockTasks.filter((t) => t.projectId === id), [id]);

  if (!project) {
    return (
      <div className="space-y-4">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
          <ArrowLeft className="h-4 w-4" />Kembali ke Proyek
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-sm text-slate-500">
          Proyek tidak ditemukan.
        </div>
      </div>
    );
  }

  const done = related.filter((t) => t.status === 'COMPLETED').length;
  const pct = related.length ? Math.round((done / related.length) * 100) : project.progress;

  return (
    <div className="space-y-4">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
        <ArrowLeft className="h-4 w-4" />Kembali ke Proyek
      </Link>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">{project.name}</h1>
            {project.description && <p className="mt-1.5 text-sm text-slate-400">{project.description}</p>}
          </div>
          <span className={cn('rounded border px-2 py-1 text-[11px] font-medium', PROJECT_STATUS_BADGE[project.status])}>
            {PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS]}
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">Progress</span>
            <span className="font-mono text-blue-400">{project.progress}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
          {project.deadline && (
            <span className="inline-flex items-center gap-2 text-slate-300"><Calendar className="h-4 w-4 text-blue-400" />Tenggat: {project.deadline}</span>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <Github className="h-4 w-4" />Repository
            </a>
          )}
          {project.deployUrl && (
            <a href={project.deployUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <ExternalLink className="h-4 w-4" />Deployment
            </a>
          )}
          {project.technologies?.length ? (
            <span className="inline-flex items-center gap-2 text-slate-300"><Cpu className="h-4 w-4 text-slate-400" />{project.technologies.join(', ')}</span>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-white">Tugas Terkait ({done}/{related.length} selesai · {pct}%)</h2>

        {related.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Belum ada tugas untuk proyek ini.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {related.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                {t.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <Circle className="h-4 w-4 shrink-0 text-slate-600" />}
                <span className={cn('flex-1 text-slate-200', t.status === 'COMPLETED' && 'text-slate-400 line-through')}>{t.title}</span>
                <span className={cn('rounded border px-1.5 py-0.5 text-[10px]', PRIORITY_BADGE[t.priority])}>{t.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}