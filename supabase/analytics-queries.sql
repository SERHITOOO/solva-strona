-- SOLVA analytics quick view
-- Wklej w Supabase SQL Editor, żeby szybko sprawdzić ruch i konwersję.

-- 1. Eventy z ostatnich 7 dni.
select
  event,
  count(*) as events,
  count(distinct session_id) as sessions
from public.analytics_events
where created_at >= now() - interval '7 days'
group by event
order by events desc;

-- 2. Konwersja: wejście na podstronę -> zobaczenie formularza -> próba wysyłki -> sukces.
with stats as (
  select
    count(distinct session_id) filter (where event = 'page_view') as sessions,
    count(distinct session_id) filter (where event = 'form_view') as form_views,
    count(distinct session_id) filter (where event = 'form_submit_attempt') as submit_attempts,
    count(distinct session_id) filter (where event = 'form_submit_success') as submit_successes
  from public.analytics_events
  where created_at >= now() - interval '7 days'
)
select
  sessions,
  form_views,
  submit_attempts,
  submit_successes,
  round(form_views::numeric / nullif(sessions, 0) * 100, 1) as form_view_rate_pct,
  round(submit_successes::numeric / nullif(form_views, 0) * 100, 1) as form_success_rate_pct
from stats;

-- 3. Najważniejsze podstrony.
select
  path,
  count(*) filter (where event = 'page_view') as page_views,
  count(distinct session_id) filter (where event = 'page_view') as sessions,
  count(*) filter (where event = 'form_view') as form_views,
  count(*) filter (where event = 'form_submit_success') as submit_successes
from public.analytics_events
where created_at >= now() - interval '7 days'
group by path
order by page_views desc;

-- 4. Źródła ruchu po UTM.
select
  coalesce(nullif(utm_source, ''), 'brak') as utm_source,
  coalesce(nullif(utm_medium, ''), 'brak') as utm_medium,
  coalesce(nullif(utm_campaign, ''), 'brak') as utm_campaign,
  count(distinct session_id) as sessions,
  count(*) filter (where event = 'form_submit_success') as submit_successes
from public.analytics_events
where created_at >= now() - interval '30 days'
group by 1, 2, 3
order by sessions desc;

-- 5. Błędy formularzy, jeśli coś blokuje użytkowników.
select
  metadata ->> 'kind' as form_kind,
  metadata ->> 'error' as error,
  count(*) as errors
from public.analytics_events
where event = 'form_submit_error'
  and created_at >= now() - interval '30 days'
group by 1, 2
order by errors desc;
