create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('lead', 'partner')),
  status text not null default 'new',
  full_name text not null,
  phone text not null,
  email text,
  location text,
  source text not null default 'solvaoze.pl',
  payload jsonb not null default '{}'::jsonb,
  tracking jsonb not null default '{}'::jsonb,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

create index if not exists submissions_kind_created_at_idx
  on public.submissions (kind, created_at desc);

create index if not exists submissions_status_created_at_idx
  on public.submissions (status, created_at desc);

create index if not exists submissions_phone_idx
  on public.submissions (phone);
