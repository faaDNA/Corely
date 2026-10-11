import type { Project, ProjectStatus, Task } from '@repo/types';

/** Task murni aktif — sampah (deletedAt) dikeluarkan, overdue tetap dihitung sampai user hapus manual. */
function effective(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.deletedAt);
}

/** Progress nyata: selesai/total dari tugas terkait. 0 tugas = 0%. Sampah tidak dihitung. */
export function projectProgress(p: Project, tasks: Task[]): number {
  const related = effective(tasks).filter((t) => t.projectId === p.id);
  if (related.length === 0) return 0;
  return Math.round((related.filter((t) => t.status === 'COMPLETED').length / related.length) * 100);
}

/** Status diturunkan otomatis. User hanya menyentuh onHold / archived. */
export function deriveProjectStatus(p: Project, tasks: Task[]): ProjectStatus {
  if (p.archived) return 'ARCHIVED';
  if (p.onHold) return 'ON_HOLD';
  return projectProgress(p, tasks) >= 100 ? 'COMPLETED' : 'IN_PROGRESS';
}