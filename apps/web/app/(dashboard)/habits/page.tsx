import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getHabits } from '@/lib/mappers';
import { HabitsClient } from './habits-client';

export default async function HabitsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  return <HabitsClient initialHabits={await getHabits(user.id)} />;
}