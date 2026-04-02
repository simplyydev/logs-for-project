create extension if not exists pgcrypto;

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null,
  kind text not null,
  title text not null,
  description_full text,
  description_public text,
  approval_status text,
  files_full jsonb,
  files_public jsonb,
  command_full text,
  command_public text,
  task_id text,
  progress integer,
  visibility text default 'public_redacted',
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

create index if not exists logs_timestamp_idx on public.logs (timestamp desc);
create index if not exists logs_kind_idx on public.logs (kind);
create index if not exists logs_task_id_idx on public.logs (task_id);
