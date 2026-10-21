import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getNotes } from '@/lib/mappers';
import { NotesClient } from './notes-client';

export default async function NotesPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <NotesClient initialNotes={await getNotes(user.id)} initialQ={searchParams.q ?? ''} />;
}