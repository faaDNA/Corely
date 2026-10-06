'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Calendar, Cpu } from 'lucide-react';
import { cn } from '@repo/ui';
import type { Task } from '@repo/types';
import { mockProjects, mockTasks } from '@/lib/mock-data';
import { PROJECT_STATUS_BADGE, PROJECT_STATUS_LABELS } from '@/components/projects/project-schema';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';
import { ProjectTasksPanel } from '@/components/projects/project-tasks-panel';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const project = useMemo(() => mockProjects.find((p) => p.id === id), [id]);
  const related = useMemo(() => tasks.filter((t) => t.projectId === id), [tasks, id]);

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

  const pct = projectProgress(project, tasks);
  const status = deriveProjectStatus(project, tasks);

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
          <span className={cn('rounded border px-2 py-1 text-[11px] font-medium', PROJECT_STATUS_BADGE[status])}>
            {PROJECT_STATUS_LABELS[status as keyof typeof PROJECT_STATUS_LABELS]}
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">Progress</span>
            <span className="font-mono text-blue-400">{pct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
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

      <ProjectTasksPanel projectId={project.id} projectName={project.name} tasks={tasks} setTasks={setTasks} />
    </div>
  );
}