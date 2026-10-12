import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getTasks } from '@/lib/mappers';
import { createClient } from '@/lib/supabase/server';
import ProjectDetailClient from './client';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [projects, tasks] = await Promise.all([getProjects(user.id), getTasks(user.id)]);
  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    return (
      <div className="space-y-4">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
          ← Kembali ke Proyek
        </Link>
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 p-12 text-center text-sm text-slate-500">
          Proyek tidak ditemukan.
        </div>
      </div>
    );
  }

  return <ProjectDetailClient project={project} projects={projects} tasks={tasks} />;
}