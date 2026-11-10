import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getNotes } from '@/lib/mappers';
import { NotesClient } from './notes-client';

export default async function NotesPage({ searchParams }: { searchParams: { q?: string } }) {
  const user = await getUser();
  if (!user) redirect('/login');
  return <NotesClient initialNotes={await getNotes(user.id)} initialQ={searchParams.q ?? ''} />;
}