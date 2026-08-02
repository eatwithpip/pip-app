-- ============================================================
-- pip-app database schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Profiles (one row per user, id = auth.users.id)
create table if not exists public.profiles (
  id             uuid references auth.users(id) on delete cascade primary key,
  name           text,
  date_of_birth  date,
  gender         text,
  dietary_preferences text[],
  location       text,
  profile_image_url   text,
  difficulty     text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at     timestamptz default now() not null,
  updated_at     timestamptz default now() not null
);

-- User goals (many per user)
create table if not exists public.user_goals (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  goal_id    text not null,
  created_at timestamptz default now() not null,
  unique(user_id, goal_id)
);

-- Daily logs (one mymop score per goal per user per day)
create table if not exists public.daily_logs (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  goal_id    text not null,
  log_date   date not null default current_date,
  score      smallint not null check (score between 0 and 5),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, goal_id, log_date)
);

-- ── PostgREST role grants (required in addition to RLS) ─────

grant usage on schema public to anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_goals to authenticated;
grant select, insert, update on public.daily_logs to authenticated;

-- ── Row Level Security ──────────────────────────────────────

alter table public.profiles   enable row level security;
alter table public.user_goals enable row level security;
alter table public.daily_logs enable row level security;

-- profiles
create policy "own profile select"
  on public.profiles for select using (auth.uid() = id);

create policy "own profile insert"
  on public.profiles for insert with check (auth.uid() = id);

create policy "own profile update"
  on public.profiles for update using (auth.uid() = id);

-- user_goals
create policy "own goals select"
  on public.user_goals for select using (auth.uid() = user_id);

create policy "own goals insert"
  on public.user_goals for insert with check (auth.uid() = user_id);

create policy "own goals delete"
  on public.user_goals for delete using (auth.uid() = user_id);

-- daily_logs
create policy "own daily logs select"
  on public.daily_logs for select using (auth.uid() = user_id);

create policy "own daily logs insert"
  on public.daily_logs for insert with check (auth.uid() = user_id);

create policy "own daily logs update"
  on public.daily_logs for update using (auth.uid() = user_id);

-- ── Email existence check (used by forgot-password flow) ───
-- security definer lets the function query auth.users without
-- exposing that table directly to the anon role.

create or replace function public.check_email_exists(email_to_check text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.users where email = email_to_check
  );
$$;

grant execute on function public.check_email_exists(text) to anon;

-- ── Storage bucket for avatars ──────────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars user upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars user update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
