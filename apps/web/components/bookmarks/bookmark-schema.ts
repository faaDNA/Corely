import { z } from 'zod';

export const bookmarkSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(120, 'Maksimal 120 karakter'),
  url: z.string().url('URL tidak valid'),
  description: z.string().max(300, 'Maksimal 300 karakter').optional(),
  category: z.string().min(1, 'Kategori wajib diisi').max(40),
  tags: z.string().optional(),
});

export type BookmarkFormValues = z.infer<typeof bookmarkSchema>;

export const BOOKMARK_CATEGORIES = ['Programming', 'Learning', 'Tools', 'Design', 'News', 'Personal', 'Other'] as const;