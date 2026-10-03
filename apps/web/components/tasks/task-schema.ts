import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(120, 'Maksimal 120 karakter'),
  description: z.string().max(500, 'Maksimal 500 karakter').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
  tags: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const STATUS_LABELS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const;

export const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;
