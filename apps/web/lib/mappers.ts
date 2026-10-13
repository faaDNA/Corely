import type { Project, Task, Note, Habit, Bookmark } from '@repo/types';
import { createClient } from '@/lib/supabase/server';

// DB snake_case → app camelCase

export function taskFromRow(row: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  due_time: string | null;
  date_mode: string;
  project_id: string | null;
  tags: string[] | null;
  completed_at: string | null;
  deleted_at: string | null;
}): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    dueDate: row.due_date ?? undefined,
    // DB time → 'HH:MM:SS' → ambil HH:MM
    dueTime: row.due_time ? row.due_time.slice(0, 5) : undefined,
    dateMode: row.date_mode as Task['dateMode'],
    projectId: row.project_id ?? undefined,
    tags: row.tags ?? undefined,
    completedAt: row.completed_at ?? undefined,
    deletedAt: row.deleted_at ?? undefined,
  };
}

export function projectFromRow(row: {
  id: string;
  name: string;
  description: string | null;
  on_hold: boolean;
  archived: boolean;
  deadline: string | null;
  technologies: string[] | null;
  repo_url: string | null;
  deploy_url: string | null;
}): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    onHold: row.on_hold || undefined,
    archived: row.archived || undefined,
    deadline: row.deadline ?? undefined,
    technologies: row.technologies ?? undefined,
    repoUrl: row.repo_url ?? undefined,
    deployUrl: row.deploy_url ?? undefined,
  };
}

export function toTaskRow(userId: string, t: Task) {
  return {
    user_id: userId,
    title: t.title,
    description: t.description ?? null,
    status: t.status,
    priority: t.priority,
    due_date: t.dueDate ?? null,
    // Postgres time tanpa TZ → slice HH:MM[:SS]
    due_time: t.dueTime ?? null,
    date_mode: t.dateMode ?? 'deadline',
    project_id: t.projectId ?? null,
    tags: t.tags ?? null,
    completed_at: t.completedAt ?? null,
    deleted_at: t.deletedAt ?? null,
  };
}

export function toProjectRow(userId: string, p: Project) {
  return {
    user_id: userId,
    name: p.name,
    description: p.description ?? null,
    on_hold: !!p.onHold,
    archived: !!p.archived,
    deadline: p.deadline ?? null,
    technologies: p.technologies ?? null,
    repo_url: p.repoUrl ?? null,
    deploy_url: p.deployUrl ?? null,
  };
}

export function toNoteRow(userId: string, n: Note) {
  return {
    user_id: userId,
    title: n.title,
    content: n.content,
    category: n.category,
    tags: n.tags ?? null,
    pinned: !!n.pinned,
    archived: !!n.archived,
  };
}

export function toBookmarkRow(userId: string, b: Bookmark) {
  return {
    user_id: userId,
    title: b.title,
    url: b.url,
    description: b.description ?? null,
    category: b.category,
    tags: b.tags ?? null,
    favorite: !!b.favorite,
  };
}

// Queries

export async function getTasks(userId: string): Promise<Task[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('tasks')
    .select('id, title, description, status, priority, due_date, due_time, date_mode, project_id, tags, completed_at, deleted_at')
    .eq('user_id', userId)
    .order('due_date', { ascending: true, nullsFirst: false });
  return (data ?? []).map(taskFromRow);
}

export async function getProjects(userId: string): Promise<Project[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('projects')
    .select('id, name, description, on_hold, archived, deadline, technologies, repo_url, deploy_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  return (data ?? []).map(projectFromRow);
}

export async function getNotes(userId: string): Promise<Note[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('notes')
    .select('id, title, content, category, tags, pinned, archived, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    content: (r.content as string) ?? '',
    category: r.category as string,
    tags: (r.tags as string[] | null) ?? undefined,
    pinned: (r.pinned as boolean) || undefined,
    archived: (r.archived as boolean) || undefined,
    updatedAt: ((r.updated_at as string) ?? '').slice(0, 10),
  }));
}

/** Habit + streak dihitung dari habit_logs (bukan kolom). */
export async function getHabits(userId: string): Promise<Habit[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('habits')
    .select('id, name, frequency, habit_logs(logged_date)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  const today = new Date();
  return (data ?? []).map((h) => {
    const logs = ((h.habit_logs as { logged_date: string }[] | null) ?? [])
      .map((l) => l.logged_date)
      .sort()
      .reverse();
    const { streak, longest } = streaks(logs, today);
    return {
      id: h.id as string,
      name: h.name as string,
      frequency: (h.frequency as string) ?? 'daily',
      streak,
      longestStreak: longest,
      completedToday: logs.includes(isoDay(today)),
      recentDays: logs.slice(0, 14),
    };
  });
}

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('bookmarks')
    .select('id, title, url, description, category, tags, favorite, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    url: r.url as string,
    description: (r.description as string | null) ?? undefined,
    category: r.category as string,
    tags: (r.tags as string[] | null) ?? undefined,
    favorite: (r.favorite as boolean) || undefined,
  }));
}

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Streak berjalan (berakhir hari ini/kemarin) + rekor, dari daftar tanggal urut menurun. */
function streaks(daysDesc: string[], now: Date): { streak: number; longest: number } {
  if (daysDesc.length === 0) return { streak: 0, longest: 0 };
  const days = [...new Set(daysDesc)].sort().reverse();
  const set = new Set(days);
  const day = (offset: number) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    return isoDay(d);
  };

  // streak berjalan
  let streak = 0;
  let start = 0;
  if (!set.has(day(0)) && set.has(day(1))) start = 1; // belum hari ini, tapi kemarin → lanjut
  for (let i = start; set.has(day(i)); i++) streak++;

  // rekor
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + 'T00:00:00');
    const cur = new Date(days[i] + 'T00:00:00');
    const diff = Math.round((prev.getTime() - cur.getTime()) / 86_400_000);
    run = diff === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  return { streak, longest: Math.max(longest, streak) };
}
