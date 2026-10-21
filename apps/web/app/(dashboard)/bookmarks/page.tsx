import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getBookmarks } from '@/lib/mappers';
import { BookmarksClient } from './bookmarks-client';

export default async function BookmarksPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <BookmarksClient initialBookmarks={await getBookmarks(user.id)} initialQ={searchParams.q ?? ''} />;
}