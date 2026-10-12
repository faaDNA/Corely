import { redirect } from 'next/navigation';
import { getTasks, getProjects } from '@/lib/mappers';
import { createClient } from '@/lib/supabase/server';
import { TasksClient } from './tasks-client';

export default async function TasksPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [tasks, projects] = await Promise.all([getTasks(user.id), getProjects(user.id)]);

  return <TasksClient initialTasks={tasks} projects={projects} />;
}