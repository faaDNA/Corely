import { redirect } from 'next/navigation';
import { getProjects, getTasks } from '@/lib/mappers';
import { getUser } from '@/lib/auth';
import { ProjectsClient } from './projects-client';

export default async function ProjectsPage({ searchParams }: { searchParams: { q?: string } }) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [projects, tasks] = await Promise.all([getProjects(user.id), getTasks(user.id)]);
  return <ProjectsClient initialProjects={projects} tasks={tasks} initialQ={searchParams.q ?? ''} />;
}