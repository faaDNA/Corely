import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getHabits, getProjects, getTasks } from '@/lib/mappers';
import { purgeExpired, workingTasks } from '@/lib/task-retention';
import { AnalyticsClient } from './analytics-client';

export default async function AnalyticsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  const [rawTasks, projects, habits] = await Promise.all([getTasks(user.id), getProjects(user.id), getHabits(user.id)]);
  // Retensi: sampah lewat window dibuang; sampah dalam window tetap — DONE ter-trash tetap dihitung (nilai riil)
  const tracked = purgeExpired(rawTasks);
  const working = workingTasks(rawTasks);
  return <AnalyticsClient tasks={tracked} workingTasks={working} projects={projects} habits={habits} />;
}