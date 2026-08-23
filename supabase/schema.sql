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
  -- Per-goal objective difficulty (supersedes profiles.difficulty, which
  -- only ever seeds the initial value) — a user can be Beginner on one
  -- goal and Advanced on another once objective escalation exists.
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  -- When the current difficulty tier began; reset on escalation. Kept
  -- separate from created_at so escalating never affects the 12-week
  -- goal progress bar, which is anchored to created_at.
  difficulty_started_at timestamptz default now() not null,
  -- Highest escalation checkpoint (0, 4, or 8 weeks) already resolved —
  -- accepted or declined — so each checkpoint prompts at most once.
  last_escalation_checkpoint smallint not null default 0,
  unique(user_id, goal_id)
);

-- Columns above are added via `if not exists` for installs that already
-- have a user_goals table predating objective escalation.
alter table public.user_goals
  add column if not exists difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  add column if not exists difficulty_started_at timestamptz default now() not null,
  add column if not exists last_escalation_checkpoint smallint not null default 0;

-- Backfill difficulty from the profile default for any goal rows that
-- predate the per-goal column.
update public.user_goals ug
set difficulty = p.difficulty
from public.profiles p
where p.id = ug.user_id
  and ug.difficulty is null;

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

-- Objective logs (per-goal daily check-off of the assigned objective,
-- independent of the objective's own target_frequency — a weekly-target
-- objective can still be checked off any day; achievement against the
-- target is derived client-side from these rows)
create table if not exists public.objective_logs (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  goal_id    text not null,
  log_date   date not null default current_date,
  completed  boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, goal_id, log_date)
);

-- Weekly rollup of objective completions and MYMOP scores, one row per
-- (user, goal, Monday-aligned week) — pure aggregation only; the product
-- rules (targets, "consistent success" thresholds) live client-side in
-- constants/goals.ts and hooks/useEscalation.ts, since a goal's target
-- count/frequency isn't known to the database.
--
-- security_invoker is required: without it the view would run with the
-- owning role's privileges and bypass the RLS on objective_logs/daily_logs,
-- leaking every user's data to any authenticated caller.
create or replace view public.goal_weekly_rollup
with (security_invoker = true) as
select
  coalesce(o.user_id, m.user_id) as user_id,
  coalesce(o.goal_id, m.goal_id) as goal_id,
  coalesce(o.week_start, m.week_start) as week_start,
  coalesce(o.objective_completed_count, 0) as objective_completed_count,
  m.mymop_avg,
  coalesce(m.mymop_check_ins, 0) as mymop_check_ins
from (
  select user_id, goal_id, date_trunc('week', log_date)::date as week_start,
         count(*) filter (where completed) as objective_completed_count
  from public.objective_logs
  group by user_id, goal_id, week_start
) o
full outer join (
  select user_id, goal_id, date_trunc('week', log_date)::date as week_start,
         avg(score) as mymop_avg, count(*) as mymop_check_ins
  from public.daily_logs
  group by user_id, goal_id, week_start
) m using (user_id, goal_id, week_start);

grant select on public.goal_weekly_rollup to authenticated;

-- ── PostgREST role grants (required in addition to RLS) ─────

grant usage on schema public to anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_goals to authenticated;
grant select, insert, update on public.daily_logs to authenticated;
grant select, insert, update on public.objective_logs to authenticated;

-- ── Row Level Security ──────────────────────────────────────

alter table public.profiles      enable row level security;
alter table public.user_goals    enable row level security;
alter table public.daily_logs    enable row level security;
alter table public.objective_logs enable row level security;

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

-- objective_logs
create policy "own objective logs select"
  on public.objective_logs for select using (auth.uid() = user_id);

create policy "own objective logs insert"
  on public.objective_logs for insert with check (auth.uid() = user_id);

create policy "own objective logs update"
  on public.objective_logs for update using (auth.uid() = user_id);

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
