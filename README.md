# Corely

Ruang produktivitas pribadi — tugas, proyek, catatan, bookmark, kebiasaan, dan kalender dalam satu dashboard. Data diinput sekali; modul lain menghitung sendiri.

## Fitur

- **Tugas** — status `TODO` / `COMPLETED` saja. Mode tanggal: tanpa tanggal, **Tenggat**, atau **Jadwal** (tanggal + jam).
- **Proyek** — status (In Progress / Completed) dan progres (%) diturunkan otomatis dari tugas terkait. Manual hanya **On Hold** dan **Archived**.
- **Kalender** — agregasi otomatis tenggat tugas, jadwal, dan batas proyek. Tanpa event manual.
- **Kebiasaan** — streak dihitung dari log harian, tidak disimpan.
- **Catatan** (Markdown), **Bookmark**, **Analitik**, **Pencarian Global** (`Ctrl+K`).
- **Pengingat** — web push zona WIB, dikirim cron `/api/cron/reminders`.
- **Hapus** — soft delete, retensi 5 bulan lalu purge.
- Tema terang & gelap (default ikut sistem). UI Bahasa Indonesia.

## Halaman

`/` landing · `/login` `/register` `/forgot-password` `/reset-password` · `/dashboard` · `/tasks` · `/projects` + `/projects/[id]` · `/notes` · `/bookmarks` · `/habits` · `/calendar` · `/analytics` · `/settings` · `/privacy` `/terms`

## Struktur

```
apps/web            Next.js app (App Router)
  app/              route & API (api/cron/reminders)
  lib/              logika domain + test (project-status, task-retention, reminders, ...)
  lib/supabase/     client.ts (browser), server.ts (server), service.ts (service role)
packages/ui         komponen bersama (@repo/ui)
packages/types      tipe bersama (@repo/types)
packages/config     konfigurasi bersama
supabase/migrations/schema.sql   skema database (idempotent)
```

## Setup

1. Install dependensi:
   ```powershell
   pnpm install
   ```
2. Salin `apps/web/.env.example` ke `apps/web/.env.local`, isi kredensial Supabase, VAPID, `CRON_SECRET`, dan `SUPABASE_SERVICE_ROLE_KEY`.
   Tanpa env Supabase, middleware jatuh ke sesi dummy agar UI tetap bisa dijalankan.
3. Database: jalankan `supabase/migrations/schema.sql` di Supabase SQL Editor (aman dijalankan ulang). Aktifkan `pg_cron` di Dashboard > Database > Extensions untuk purge & pengingat terjadwal.
4. Jalankan:
   ```powershell
   pnpm -C apps/web dev --turbo
   ```
   Buka http://localhost:3000.

## Build & Test

```powershell
pnpm -C apps/web build
node --test apps/web/lib/task-retention.test.ts
```

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Radix UI · Lucide · next-themes · Recharts · react-hook-form · Zod · Supabase (`@supabase/ssr`) · Web Push · Turborepo · pnpm

## Lisensi

MIT — lihat [LICENSE](LICENSE).
