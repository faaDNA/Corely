# Corely

Ruang produktivitas pribadi — tugas, proyek, catatan, bookmark, kebiasaan, dan kalender terpadu.

## Cara Jalankan

```powershell
pnpm install
pnpm -C apps/web dev --port 3100
```

Buka http://localhost:3100. Alur: Landing `/` → `/login` (dummy) → `/dashboard`.

## Halaman

`/` landing · `/login` `/register` dummy auth · `/dashboard` · `/tasks` (list view + mode tenggat/jadwal) · `/projects` + `/projects/[id]` (status & progres otomatis) · `/notes` · `/bookmarks` · `/habits` · `/calendar` (agregat otomatis) · `/analytics` · `/settings`

## Fitur Utama & Penyederhanaan
- **Tugas**: Status Todo & Completed (tanpa In Progress). Opsi tipe **Tenggat** (tanggal) vs **Jadwal** (tanggal + jam).
- **Proyek**: Status (**In Progress** & **Completed**) dan progres (%) diturunkan otomatis dari tugas terkait. Opsi manual: **On Hold** (jeda) & **Archived** (arsip).
- **Kalender**: Mengumpulkan otomatis tenggat tugas, jadwal hari-H, dan batas proyek tanpa input ulang.
- **Pencarian Global**: `Ctrl+K` untuk cari di seluruh modul.

Semua data masih **dummy** (`lib/mock-data.ts`), tersimpan di local state.

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Radix UI · Lucide · next-themes · Recharts · react-hook-form · Zod · Turborepo · pnpm
