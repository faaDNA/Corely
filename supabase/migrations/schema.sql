-- Corely schema — skema penuh: tabel, trigger, index, RLS, purge cron.
-- Semua perintah idempotent (if not exists / drop if exists) — aman dijalankan berulang.
-- Tabel diubah kelak? Edit blok terkait, jalankan ulang. (ponytail: kalau DB sudah ada data produksi, tambahkan file migration terpisah alih-alih edit in-place.)

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type task_status as enum ('TODO', 'COMPLETED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_priority as enum ('LOW', 'MEDIUM', 'HIGH');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_date_mode as enum ('deadline', 'schedule');
exception when duplicate_object then null; end $$;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- profiles (1:1 auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  nickname text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  on_hold boolean not null default false,
  archived boolean not null default false,
  deadline date,
  technologies text[],
  repo_url text,
  deploy_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status task_status not null default 'TODO',
  priority task_priority not null default 'MEDIUM',
  due_date date,
  due_time time,
  date_mode task_date_mode not null default 'deadline',
  project_id uuid references public.projects(id) on delete set null,
  tags text[],
  completed_at date,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- notes
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null default '',
  category text not null,
  tags text[],
  pinned boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- bookmarks
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  category text not null,
  tags text[],
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  frequency text not null default 'daily',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- habit_logs (streak dihitung dari sini)
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  logged_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, logged_date)
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['profiles','projects','tasks','notes','bookmarks','habits'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- index
create index if not exists tasks_user_active_idx on public.tasks (user_id, deleted_at);
create index if not exists tasks_project_idx on public.tasks (project_id);
create index if not exists tasks_due_idx on public.tasks (due_date);
create index if not exists tasks_completed_idx on public.tasks (completed_at);
create index if not exists projects_user_idx on public.projects (user_id);
create index if not exists notes_user_idx on public.notes (user_id);
create index if not exists bookmarks_user_idx on public.bookmarks (user_id);
create index if not exists habits_user_idx on public.habits (user_id);
create index if not exists habit_logs_habit_idx on public.habit_logs (habit_id);

-- auto-profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, nickname, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'nickname', 'User'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: satu pola untuk semua tabel
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

drop policy if exists "own profiles" on public.profiles;
create policy "own profiles" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own projects" on public.projects;
create policy "own projects" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own tasks" on public.tasks;
create policy "own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own notes" on public.notes;
create policy "own notes" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own bookmarks" on public.bookmarks;
create policy "own bookmarks" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own habits" on public.habits;
create policy "own habits" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own habit logs" on public.habit_logs;
create policy "own habit logs" on public.habit_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Purge sampah task setiap tanggal 1, 00:30 — floor = awal bulan now - 4 bulan
-- (5 bulan termasuk bulan ini, ikut window Analitik — sama dengan retentionFloor() di apps/web/lib/task-retention.ts).
-- pg_cron wajib di-enable dulu di Dashboard Supabase; kalau belum, blok ini dilewati tanpa menggagalkan file.
do $$ begin
  create extension if not exists pg_cron;
  select cron.unschedule('purge-deleted-tasks-5m');
exception when insufficient_privilege then
  raise notice 'pg_cron tidak tersedia — purge manual.';
end $$;

do $$ begin
  select cron.schedule(
    'purge-deleted-tasks-5m',
    '30 0 1 * *',
    $$ delete from public.tasks
       where deleted_at is not null
         and deleted_at < date_trunc('month', now() - interval '4 months'); $$
  );
exception when undefined_object or insufficient_privilege then
  raise notice 'cron tidak dijadwalkan — aktifkan pg_cron.';
end $$;