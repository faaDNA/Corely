'use server';

import { revalidatePath } from 'next/cache';
import type { Task } from '@repo/types';
import { createClient } from '@/lib/supabase/server';
import { getTasks, toTaskRow } from '@/lib/mappers';

const COLS =
  'id, title, description, status, priority, due_date, due_time, date_mode, project_id, tags, completed_at, deleted_at';

async function requireUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  if (!user) throw new Error('Sesi berakhir. Masuk ulang.');
  return user.id;
}

function refresh() {
  revalidatePath('/tasks');
  revalidatePath('/projects');
  revalidatePath('/dashboard');
}

export async function saveTask(task: Task): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const row = toTaskRow(userId, task);
    const exists = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(task.id);

    if (exists) {
      const { error } = await supabase.from('tasks').update(row).eq('id', task.id).eq('user_id', userId).select(COLS);
      if (error) return { ok: false, error: error.message };
      refresh();
      return { ok: true };
    }

    const { error } = await supabase.from('tasks').insert(row);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyimpan tugas.' };
  }
}

export async function toggleTask(task: Task): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const next = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    const { error } = await supabase
      .from('tasks')
      .update({
        status: next,
        completed_at: next === 'COMPLETED' ? new Date().toISOString().slice(0, 10) : null,
      })
      .eq('id', task.id)
      .eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui tugas.' };
  }
}

export async function deleteTask(taskId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', taskId)
      .eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghapus tugas.' };
  }
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const userId = await requireUser();
    return await getTasks(userId);
  } catch {
    return [];
  }
}
