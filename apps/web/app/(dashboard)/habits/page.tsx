import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getHabits } from '@/lib/mappers';
import { HabitsClient } from './habits-client';

export default async function HabitsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <HabitsClient initialHabits={await getHabits(user.id)} />;
}