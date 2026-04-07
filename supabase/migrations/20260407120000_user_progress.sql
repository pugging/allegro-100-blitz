-- Allegro Blitz: cloud progress + RLS
-- Run in Supabase SQL Editor or via supabase db push

create table if not exists public.user_learning_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_blitzes jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_learning_progress enable row level security;

create policy "Users can read own progress"
  on public.user_learning_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_learning_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_learning_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.user_learning_progress
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_learning_progress to authenticated;
