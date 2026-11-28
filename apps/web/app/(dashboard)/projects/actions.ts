'use server';

import { revalidatePath } from 'next/cache';
import type { Project } from '@repo/types';
import { createClient } from '@/lib/supabase/server';
import { requireUserId } from '@/lib/auth';
import { getProjects, toProjectRow } from '@/lib/mappers';
import { isHttpUrl } from '@/lib/push-endpoint';

const COLS = 'id, name, description, on_hold, archived, deadline, technologies, repo_url, deploy_url';

// Satu sumber: lib/auth (getClaims, tanpa round trip Auth bila JWT asimetrik).
const requireUser = requireUserId;

function refresh() {
  revalidatePath('/projects');
  revalidatePath('/tasks');
  revalidatePath('/projects/[id]', 'page');
  revalidatePath('/dashboard');
}

export async function saveProject(project: Project): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    // Dirender di <a href>: tolak javascript:/data: yang lolos z.string().url() di client.
    for (const u of [project.repoUrl, project.deployUrl]) {
      if (u && !isHttpUrl(u)) return { ok: false, error: 'URL harus diawali http:// atau https://.' };
    }
    const row = toProjectRow(userId, project);
    const exists = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.id);

    if (exists) {
      const { error } = await supabase.from('projects').update(row).eq('id', project.id).eq('user_id', userId);
      if (error) return { ok: false, error: error.message };
      refresh();
      return { ok: true };
    }

    const { error } = await supabase.from('projects').insert(row);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyimpan proyek.' };
  }
}

export async function deleteProject(projectId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUser();
    const supabase = createClient();
    const { error } = await supabase.from('projects').delete().eq('id', projectId).eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghapus proyek.' };
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const userId = await requireUser();
    return await getProjects(userId);
  } catch {
    return [];
  }
}
