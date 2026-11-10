import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getProjects, getTasks } from '@/lib/mappers';
import { workingTasks } from '@/lib/task-retention';
import { CalendarClient } from './calendar-client';

export default async function CalendarPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  const [tasks, projects] = await Promise.all([getTasks(user.id), getProjects(user.id)]);
  return <CalendarClient tasks={workingTasks(tasks)} projects={projects} />;
}