import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(120, 'Maksimal 120 karakter'),
  description: z.string().max(500, 'Maksimal 500 karakter').optional(),
  status: z.enum(['TODO', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dateMode: z.enum(['deadline', 'schedule']),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  projectId: z.string().optional(),
  tags: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const STATUS_LABELS = {
  TODO: 'Todo',
  COMPLETED: 'Completed',
} as const;

export const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export const DATE_MODE_LABELS = {
  deadline: 'Tenggat (tanggal saja)',
  schedule: 'Jadwal (tanggal + jam)',
} as const;