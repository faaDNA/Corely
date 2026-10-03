import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(120, 'Maksimal 120 karakter'),
  content: z.string().max(5000, 'Maksimal 5000 karakter').optional(),
  category: z.string().min(1, 'Kategori wajib diisi').max(40),
  tags: z.string().optional(),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

export const NOTE_CATEGORIES = ['Programming', 'Career', 'University', 'Personal', 'Ideas', 'Other'] as const;