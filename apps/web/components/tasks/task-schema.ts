import { z } from 'zod';

export const taskSchema = z
  .object({
    title: z.string().min(1, 'Judul wajib diisi').max(120, 'Maksimal 120 karakter'),
    description: z.string().max(500, 'Maksimal 500 karakter').optional(),
    // status tidak diisi dari form — tugas baru selalu TODO, ubah via centang di list
    status: z.enum(['TODO', 'COMPLETED']).optional().default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    // 'none' hanya untuk form — server simpan dateMode apa adanya (kolom DB default 'deadline')
    dateMode: z.enum(['none', 'deadline', 'schedule']),
    dueDate: z.string().optional(),
    dueTime: z.string().optional(),
    projectId: z.string().optional(),
    tags: z.string().optional(),
  })
  // tanggal opsional secara total, tapi kalau mode tenggat/jadwal dipilih, tanggalnya wajib diisi
  .superRefine((v, ctx) => {
    if (v.dateMode !== 'none' && !v.dueDate) {
      ctx.addIssue({ code: 'custom', path: ['dueDate'], message: 'Isi tanggal, atau pilih Tanpa tanggal.' });
    }
  });

export type TaskFormValues = z.infer<typeof taskSchema>;

export const STATUS_LABELS = {
  TODO: 'Belum',
  COMPLETED: 'Selesai',
} as const;

export const PRIORITY_LABELS = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi',
} as const;

// Nilai enum tak dikenal → tampil apa adanya.
export const priorityLabel = (p: string) => PRIORITY_LABELS[p as keyof typeof PRIORITY_LABELS] ?? p;
export const statusLabel = (s: string) => STATUS_LABELS[s as keyof typeof STATUS_LABELS] ?? s;