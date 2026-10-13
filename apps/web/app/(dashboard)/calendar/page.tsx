import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProjects, getTasks } from '@/lib/mappers';
import { workingTasks } from '@/lib/task-retention';
import { CalendarClient } from './calendar-client';

export default async function CalendarPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const [tasks, projects] = await Promise.all([getTasks(user.id), getProjects(user.id)]);
  return <CalendarClient tasks={workingTasks(tasks)} projects={projects} />;
}