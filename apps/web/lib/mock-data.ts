import type { Task, Project, Note, Bookmark, Habit } from '@repo/types';

export const mockUser = {
  name: 'Daffa Naufal',
  nickname: 'Daffa',
  email: 'daffa@mail.com',
};

export const mockTasks: Task[] = [
  { id: 't1', title: 'Rapikan rencana minggu ini', description: 'Susun prioritas 7 hari ke depan', status: 'TODO', priority: 'HIGH', dateMode: 'deadline', dueDate: '2026-10-04', projectId: 'p1', tags: ['urgent'] },
  { id: 't2', title: 'Tulis catatan ide aplikasi baru', description: 'Brainstorm 3 ide side project', status: 'TODO', priority: 'MEDIUM', dateMode: 'deadline', dueDate: '2026-10-05', tags: ['ideas'] },
  { id: 't3', title: 'Baca 20 halaman buku', description: 'Buku "Deep Work"', status: 'TODO', priority: 'LOW', dateMode: 'deadline', dueDate: '2026-10-04', tags: ['self'] },
  { id: 't4', title: 'Review desain landing page', status: 'COMPLETED', priority: 'MEDIUM', dateMode: 'deadline', dueDate: '2026-10-03', completedAt: '2026-10-03', projectId: 'p1' },
  { id: 't5', title: 'Latihan bahasa Jepang — 30 menit', status: 'TODO', priority: 'MEDIUM', dateMode: 'deadline', dueDate: '2026-10-04', projectId: 'p3', tags: ['learning'] },
  { id: 't6', title: 'Kirim email ke klien', status: 'COMPLETED', priority: 'HIGH', dateMode: 'deadline', dueDate: '2026-10-03', completedAt: '2026-10-03' },
  { id: 't7', title: 'Siapkan daftar belanja renovasi', status: 'TODO', priority: 'LOW', dateMode: 'deadline', dueDate: '2026-10-10', projectId: 'p2' },
  { id: 't8', title: 'Struktur outline tugas kuliah', status: 'TODO', priority: 'HIGH', dateMode: 'deadline', dueDate: '2026-10-08', tags: ['university'] },
  { id: 't9', title: 'Interview pekerjaan — PT Nusantara', description: 'Datang 15 menit lebih awal, bawa CV cetak', status: 'TODO', priority: 'HIGH', dateMode: 'schedule', dueDate: '2026-10-07', dueTime: '10:00', tags: ['career'] },
];

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Corely', description: 'Aplikasi produktivitas pribadi', deadline: '2026-11-01', technologies: ['Next.js', 'TypeScript'], repoUrl: 'https://github.com/user/corely' },
  { id: 'p2', name: 'Renovasi Rumah', description: 'Rencana & anggaran renovasi', deadline: '2026-12-15' },
  { id: 'p3', name: 'Belajar Bahasa Jepang', description: 'Target JLPT N5', deadline: '2026-12-01', technologies: ['Anki'] },
  { id: 'p4', name: 'Kumpulan Resep Masak', onHold: true },
  { id: 'p5', name: 'Setup Blog Pribadi', deployUrl: 'https://blog.example.com' },
];

export const mockNotes: Note[] = [
  { id: 'n1', title: 'Ide fitur aplikasi', content: '## Ide\n- Dark mode\n- Widget kalender\n\n> Fokus pada MVP dulu.\n\n`Cmd+K` untuk pencarian cepat.', category: 'Ideas', tags: ['app'], pinned: true, updatedAt: '2026-10-03' },
  { id: 'n5', title: 'Catatan rapat mingguan', content: '## Agenda\n1. Review sprint\n2. Blokir & risiko\n\n**Action:** update dashboard widget.', category: 'Career', updatedAt: '2026-10-04' },
  { id: 'n6', title: 'Daftar bacaan', content: '- [ ] Atomic Habits\n- [x] Deep Work\n- [ ] Designing Data-Intensive Applications', category: 'Personal', tags: ['books'], archived: true, updatedAt: '2026-09-25' },
  { id: 'n2', title: 'Ringkasan buku Deep Work', content: 'Fokus tanpa distraksi selama 90 menit.', category: 'Personal', updatedAt: '2026-10-02' },
  { id: 'n3', title: 'Cheat sheet Git', content: '`git rebase -i HEAD~3`', category: 'Programming', tags: ['git'], updatedAt: '2026-10-01' },
  { id: 'n4', title: 'Rencana karir Q4', content: 'Update portfolio + lamar 5 perusahaan.', category: 'Career', pinned: true, updatedAt: '2026-09-30' },
];

export const mockBookmarks: Bookmark[] = [
  { id: 'b1', title: 'Next.js Documentation', url: 'https://nextjs.org/docs', category: 'Programming', tags: ['nextjs'], favorite: true },
  { id: 'b2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'Programming', favorite: true },
  { id: 'b3', title: 'Resep nasi goreng', url: 'https://example.com/resep', category: 'Personal' },
];

export const mockHabits: Habit[] = [
  { id: 'h1', name: 'Olahraga pagi', frequency: 'daily', streak: 12, longestStreak: 24, completedToday: true },
  { id: 'h2', name: 'Baca 20 menit', frequency: 'daily', streak: 7, longestStreak: 15, completedToday: false },
  { id: 'h3', name: 'Minum 8 gelas air', frequency: 'daily', streak: 3, longestStreak: 30, completedToday: true },
  { id: 'h4', name: 'Meditasi', frequency: 'daily', streak: 0, longestStreak: 10, completedToday: false },
];

export const mockStats = {
  pendingTasks: 6,
  completedToday: 2,
  activeProjects: 3,
  upcomingDeadlines: 2,
  habitStreak: 12,
};
