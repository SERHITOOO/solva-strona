create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (
    event in (
      'page_view',
      'form_view',
      'form_submit_attempt',
      'form_submit_success',
      'form_submit_error',
      'mailto_fallback'
    )
  ),
  session_id text,
  path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_event_created_at_idx
  on public.analytics_events (event, created_at desc);

create index if not exists analytics_events_path_created_at_idx
  on public.analytics_events (path, created_at desc);
