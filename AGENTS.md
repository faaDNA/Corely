# AGENTS.md — Corely (Personal Dashboard)

## Bahasa & gaya respons

- User berbahasa Indonesia → balas Indonesia. UI aplikasi Indonesia.
- Terse ala caveman: tanpa artikel/filler/basa-basi. Pola: [hal] [aksi] [alasan]. [next step].
- Jargon teknis, path, perintah, string error: verbatim.
- Pengecualian gaya (tulis normal): peringatan keamanan, aksi irreversibel, urutan multi-langkah yang rawan salah baca.

## Prinsip lazy senior (aktif tiap respons)

- Urutan sebelum nulis kode: 1) perlu ada? (YAGNI) 2) stdlib? 3) fitur native platform? 4) dependensi terinstal? 5) satu baris cukup? 6) baru kode minimal.
- Tanpa abstraksi tak diminta, tanpa boilerplate "buat nanti". Hapus > tambah. Boring > clever.
- Penyederhanaan disengaja: komentar `ponytail:` + batas + upgrade path.
- Logika non-trivial: satu self-check assert/test kecil. One-liner: tanpa test.
- Setelah kode: maks 3 baris — apa dilewati, kapan tambah.

## Secrets — JANGAN PERNAH

- **Jangan baca isi `.env` / `.env.local`** (read/cat/echo). Cek eksistensi hanya bila perlu, tanpa buka isi.
- Jangan print secret ke log/chat. Template env: `apps/web/.env.example` (boleh commit).

## Git

- **Jangan commit.** User commit manual. Jangan `git commit`, jangan `git add` kecuali diminta.
- `plan-backend.md` gitignored (rencana internal, jangan commit).

## Build & test

- Build: `pnpm -C apps/web build` (harus 15 route hijau).
- Dev: `pnpm -C apps/web dev --turbo`. pnpm 12.8.1, Turborepo.
- Test retensi: `node --test apps/web/lib/task-retention.test.ts`.

## Stack

- Next.js 14 App Router, TS, Tailwind `darkMode:'class'`, `@repo/ui`, RHF+Zod, Recharts, `next-themes` (system default).
- Backend: Supabase via `@supabase/ssr` (`lib/supabase/client.ts` browser, `lib/supabase/server.ts` server). Auth email+password dulu; tombol Google sambung belakangan.
- Middleware: refresh sesi Supabase + guard route. Tanpa env → fallback dummy `pd_session` agar mock tetap jalan (hapus saat auth nyata live).

## Aturan domain (jangan langgar)

- `TaskStatus`: hanya `TODO` | `COMPLETED`. `TaskDateMode`: `deadline` | `schedule`.
- Status proyek derived via `lib/project-status.ts`, bukan kolom.
- Soft delete: `deletedAt` set saat hapus, hidden dari list. TODO terhapus keluar statistik; COMPLETED terhapus tetap dihitung sampai purge.
- Retensi 5 bln (ikut Analitik): `lib/task-retention.ts`, `RETENTION_MONTHS=5`. Overdue tidak auto-trash.
- Kalender agregasi murni: Tenggat + Jadwal + Batas Proyek. Tanpa event manual. `toISO`/`fromISO` lokal (bukan UTC).
- Habit streak dihitung dari `habit_logs`, tidak disimpan.

## Database

- Satu file: `supabase/migrations/schema.sql` (idempotent, edit in-place, boleh jalan ulang).
- Tanpa prefix timestamp, tanpa file migration baru (keputusan user). `ponytail:` pisah migration kalau sudah data produksi multi-dev.
- Jalankan via Supabase SQL Editor. `pg_cron` wajib enable di Dashboard > Database > Extensions; kalau belum, file hanya notice (aman).
