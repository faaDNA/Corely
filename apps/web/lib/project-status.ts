import type { Project, ProjectStatus, Task } from '@repo/types';

/** Progress nyata: rasio tugas selesai. Fallback ke progress manual bila belum ada tugas. */
export function projectProgress(p: Project, tasks: Task[]): number {
  const related = tasks.filter((t) => t.projectId === p.id);
  if (related.length === 0) return p.progress;
  return Math.round((related.filter((t) => t.status === 'COMPLETED').length / related.length) * 100);
}

/** Status diturunkan otomatis. User hanya menyentuh onHold / archived. */
export function deriveProjectStatus(p: Project, tasks: Task[]): ProjectStatus {
  if (p.archived) return 'ARCHIVED';
  if (p.onHold) return 'ON_HOLD';
  return projectProgress(p, tasks) >= 100 ? 'COMPLETED' : 'IN_PROGRESS';
}