'use server';

import { revalidatePath } from 'next/cache';
import type { Note } from '@repo/types';
import { createClient } from '@/lib/supabase/server';
import { toNoteRow } from '@/lib/mappers';

async function requireUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  if (!user) throw new Error('Sesi berakhir. Masuk ulang.');
  return user.id;
}

function refresh() {
  revalidatePath('/notes');
  revalidatePath('/dashboard');
}

export async function saveNote(note: Note): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const row = toNoteRow(userId, note);
    const exists =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(note.id);

    if (exists) {
      const { error } = await supabase.from('notes').update(row).eq('id', note.id).eq('user_id', userId);
      if (error) return { ok: false, error: error.message };
      refresh();
      return { ok: true };
    }

    const { error } = await supabase.from('notes').insert(row);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyimpan catatan.' };
  }
}

export async function toggleNote(note: Note, field: 'pinned' | 'archived'): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase
      .from('notes')
      .update({ [field]: !note[field] })
      .eq('id', note.id)
      .eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui catatan.' };
  }
}

export async function deleteNote(noteId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase.from('notes').delete().eq('id', noteId).eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghapus catatan.' };
  }
}
