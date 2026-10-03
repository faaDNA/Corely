import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(120, 'Maksimal 120 karakter'),
  description: z.string().max(500, 'Maksimal 500 karakter').optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'ARCHIVED']),
  progress: z.coerce.number().min(0).max(100),
  deadline: z.string().optional(),
  technologies: z.string().optional(),
  repoUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
  deployUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const PROJECT_STATUS_LABELS = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  ARCHIVED: 'Archived',
} as const;

export const PROJECT_STATUS_BADGE: Record<string, string> = {
  PLANNING: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  ON_HOLD: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ARCHIVED: 'bg-slate-700/30 text-slate-500 border-slate-700/40',
};