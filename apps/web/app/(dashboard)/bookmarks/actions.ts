'use server';

import { revalidatePath } from 'next/cache';
import type { Bookmark } from '@repo/types';
import { createClient } from '@/lib/supabase/server';
import { toBookmarkRow } from '@/lib/mappers';

async function requireUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  if (!user) throw new Error('Sesi berakhir. Masuk ulang.');
  return user.id;
}

function refresh() {
  revalidatePath('/bookmarks');
  revalidatePath('/dashboard');
}

export async function saveBookmark(bookmark: Bookmark): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const row = toBookmarkRow(userId, bookmark);
    const exists =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookmark.id);

    if (exists) {
      const { error } = await supabase.from('bookmarks').update(row).eq('id', bookmark.id).eq('user_id', userId);
      if (error) return { ok: false, error: error.message };
      refresh();
      return { ok: true };
    }

    const { error } = await supabase.from('bookmarks').insert(row);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyimpan bookmark.' };
  }
}

export async function toggleBookmark(bookmark: Bookmark): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase
      .from('bookmarks')
      .update({ favorite: !bookmark.favorite })
      .eq('id', bookmark.id)
      .eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui bookmark.' };
  }
}

export async function deleteBookmark(bookmarkId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase.from('bookmarks').delete().eq('id', bookmarkId).eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghapus bookmark.' };
  }
}
