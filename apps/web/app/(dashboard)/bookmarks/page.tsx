import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getBookmarks } from '@/lib/mappers';
import { BookmarksClient } from './bookmarks-client';

export default async function BookmarksPage({ searchParams }: { searchParams: { q?: string } }) {
  const user = await getUser();
  if (!user) redirect('/login');
  return <BookmarksClient initialBookmarks={await getBookmarks(user.id)} initialQ={searchParams.q ?? ''} />;
}