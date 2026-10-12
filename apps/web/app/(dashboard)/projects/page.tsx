import { redirect } from 'next/navigation';
import { getProjects, getTasks } from '@/lib/mappers';
import { createClient } from '@/lib/supabase/server';
import { ProjectsClient } from './projects-client';

export default async function ProjectsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [projects, tasks] = await Promise.all([getProjects(user.id), getTasks(user.id)]);
  return <ProjectsClient initialProjects={projects} tasks={tasks} />;
}