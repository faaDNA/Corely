'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isoWIB } from '@/lib/day';

async function requireUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  if (!user) throw new Error('Sesi berakhir. Masuk ulang.');
  return user.id;
}

function refresh() {
  revalidatePath('/habits');
  revalidatePath('/dashboard');
}

export async function addHabit(name: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!name.trim()) return { ok: false, error: 'Nama kebiasaan wajib diisi.' };
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase.from('habits').insert({ user_id: userId, name: name.trim(), frequency: 'daily' });
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menambah kebiasaan.' };
  }
}

export async function deleteHabit(habitId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase.from('habits').delete().eq('id', habitId).eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghapus kebiasaan.' };
  }
}

/** Tandai/lepas hari ini di habit_logs. streak dihitung ulang di server (getHabits). */
export async function toggleHabitToday(habitId: string, done: boolean): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const iso = isoWIB(); // WIB (GMT+7) — server UTC, jangan new Date() lokal

    if (done) {
      const { error } = await supabase
        .from('habit_logs')
        .upsert({ habit_id: habitId, user_id: userId, logged_date: iso }, { onConflict: 'habit_id,logged_date' });
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('user_id', userId)
        .eq('logged_date', iso);
      if (error) return { ok: false, error: error.message };
    }
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui kebiasaan.' };
  }
}