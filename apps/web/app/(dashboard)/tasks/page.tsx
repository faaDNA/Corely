import { redirect } from 'next/navigation';
import { getTasks, getProjects } from '@/lib/mappers';
import { getUser } from '@/lib/auth';
import { TasksClient } from './tasks-client';

export default async function TasksPage({ searchParams }: { searchParams: { q?: string } }) {
  const user = await getUser();
  if (!user) redirect('/login');

  const [tasks, projects] = await Promise.all([getTasks(user.id), getProjects(user.id)]);

  return <TasksClient initialTasks={tasks} projects={projects} initialQ={searchParams.q ?? ''} />;
}