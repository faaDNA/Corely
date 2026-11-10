'use server';

import { getUser } from '@/lib/auth';
import { getBookmarks, getNotes, getProjects, getTasks } from '@/lib/mappers';
import { deriveProjectStatus, projectProgress } from '@/lib/project-status';
import type { SearchItem } from '@/components/app-shell';

export async function fetchSearchItems(): Promise<SearchItem[]> {
  const user = await getUser();
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
      sub: `${projectProgress(p, tasks)}% • ${deriveProjectStatus(p, tasks).replace('_', ' ')}`,
      group: 'Projects',
      href: `/projects/${p.id}`,
      icon: 'project',
    });
  }
  for (const n of notes) {
    items.push({
      id: `n-${n.id}`,
      label: n.title,
      sub: n.category,
      group: 'Notes',
      href: `/notes?q=${encodeURIComponent(n.title)}`,
      icon: 'note',
    });
  }
  for (const b of bookmarks) {
    items.push({
      id: `b-${b.id}`,
      label: b.title,
      sub: b.url,
      group: 'Bookmarks',
      href: `/bookmarks?q=${encodeURIComponent(b.title)}`,
      icon: 'bookmark',
    });
  }
  for (const t of tasks) {
    if (t.deletedAt) continue;
    items.push({
      id: `t-${t.id}`,
      label: t.title,
      sub: `${t.status} • ${t.priority}`,
      group: 'Tasks',
      href: `/tasks?q=${encodeURIComponent(t.title)}`,
      icon: 'task',
    });
  }
  return items;
}
