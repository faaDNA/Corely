import type { ReactNode } from 'react';
import { AppShell, type SearchItem } from '@/components/app-shell';
import { getProfile } from '@/lib/profile';
import { createClient } from '@/lib/supabase/server';
import { getBookmarks, getNotes, getProjects, getTasks } from '@/lib/mappers';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [profile, search] = await Promise.all([getProfile(), getSearchItems()]);
  return (
    <AppShell profile={profile} searchItems={search}>
      {children}
    </AppShell>
  );
}

async function getSearchItems(): Promise<SearchItem[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const [projects, notes, bookmarks, tasks] = await Promise.all([
    getProjects(user.id),
    getNotes(user.id),
    getBookmarks(user.id),
    getTasks(user.id),
  ]);
  const items: SearchItem[] = [];
  for (const p of projects) {
    items.push({
      id: `p-${p.id}`,
      label: p.name,
      sub: `${projectProgress(p, tasks)}% · ${deriveProjectStatus(p, tasks).replace('_', ' ')}`,
      group: 'Projects',
      href: `/projects/${p.id}`,
      icon: 'project',
    });
  }
  for (const n of notes) {
    items.push({ id: `n-${n.id}`, label: n.title, sub: n.category, group: 'Notes', href: '/notes', icon: 'note' });
  }
  for (const b of bookmarks) {
    items.push({ id: `b-${b.id}`, label: b.title, sub: b.url, group: 'Bookmarks', href: '/bookmarks', icon: 'bookmark' });
  }
  for (const t of tasks) {
    if (t.deletedAt) continue;
    items.push({ id: `t-${t.id}`, label: t.title, sub: `${t.status} · ${t.priority}`, group: 'Tasks', href: '/tasks', icon: 'task' });
  }
  return items;
}
