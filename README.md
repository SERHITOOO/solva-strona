# SOLVA

Landing page marki SOLVA, partnera Hydro Energy, z backendem do pozyskiwania leadów klientów oraz zgłoszeń handlowców.

Strona jest przygotowana pod dwa strumienie kontaktów:

- klientów zainteresowanych analizą inwestycji OZE,
- handlowców, liderów regionalnych i osoby z własną bazą kontaktów.

## Uruchomienie

```bash
npm install
npm run dev
```

Frontend działa przez Vite. Lokalnie można użyć API Express, a produkcyjnie formularze są podpięte do Supabase Edge Function.

## Publiczny podgląd

GitHub Pages publikuje statyczny frontend pod domeną `solvaoze.pl`. Produkcyjny build ma ustawione `VITE_FORM_ENDPOINT`, więc formularze zapisują zgłoszenia w Supabase.

Tryby działania formularzy:

- lokalnie używają `/api/leads` i `/api/partners`,
- produkcyjnie używają Supabase Edge Function `submit-form`,
- bez endpointu otworzą gotowego maila z danymi zgłoszenia jako awaryjny fallback.

To pozwala wystartować bez stałego kosztu backendu, a później podpiąć Make, CRM albo własne API bez przebudowy strony.

Docelowo warto podpiąć jeden z wariantów:

- osobny deploy backendu Express,
- webhook / formularz zewnętrzny,
- Google Sheets lub CRM przez endpoint pośredni.

## Endpointy

- `POST /api/leads` - zapis formularza wyceny fotowoltaiki.
- `POST /api/partners` - zapis formularza rekrutacyjnego handlowca.
- `GET /api/submissions?token=...` - podgląd zgłoszeń po ustawieniu `ADMIN_TOKEN`.
- Formularze zapisują też podstawowe dane trackingowe: `page`, `referrer` i parametry `utm_*`.
- Produkcja zapisuje lekką analitykę w Supabase `analytics_events`: `page_view`, `form_view`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`, bez cookies i bez danych osobowych w eventach.
- Dla publicznego hostingu statycznego można ustawić `VITE_FORM_ENDPOINT` jako adres przyjmujący zgłoszenia.
- `VITE_ANALYTICS_ENDPOINT` może wskazywać na `track-event`; jeśli nie jest ustawiony, frontend spróbuje wyliczyć go z `VITE_FORM_ENDPOINT`.
- Po wdrożeniu osobnego backendu można ustawić `VITE_API_BASE`, np. `https://api.solvaoze.pl`.

## Tani start bez CRM

Aktualny wariant na pierwszy miesiąc:

- GitHub Pages + domena `solvaoze.pl` - frontend bez kosztu miesięcznego.
- Supabase Free - baza zgłoszeń `submissions` i funkcja `submit-form`.
- Google Sheets - roboczy widok zgłoszeń w arkuszu `SOLVA - Leady i handlowcy`.
- Mailbox `kontakt@solvaoze.pl` - kontakt firmowy w OVH/Zimbra.
- Statusy i pola są już przygotowane pod CRM: `status`, `zrodlo`, `marka`, `podmiot`, tracking UTM.
- Gdy CRM będzie gotowy, najprostsza migracja to przekierowanie formularzy na `VITE_API_BASE` albo `VITE_FORM_ENDPOINT`.

Kolejny etap po walidacji leadów:

- Cloudflare Turnstile do antyspamu: frontend czyta `VITE_TURNSTILE_SITE_KEY`, a Supabase sprawdza `TURNSTILE_SECRET_KEY`.
- Resend do automatycznych powiadomień mailowych na `kontakt@solvaoze.pl`.
- Docelowo własny CRM i API pod `api.solvaoze.pl`.

Szczegółowy plan uruchomienia darmowego backendu znajduje się w `BACKEND_START.md`.
Repo zawiera też gotowe pliki Supabase:

- `supabase/migrations/202606030001_create_submissions.sql` - tabela zgłoszeń.
- `supabase/migrations/202606170001_create_analytics_events.sql` - tabela lekkiej analityki strony.
- `supabase/functions/submit-form/index.ts` - endpoint przyjmujący formularze; po dodaniu `RESEND_API_KEY` wyśle też powiadomienie przez Resend.
- `supabase/functions/track-event/index.ts` - endpoint zapisujący pageview i eventy formularzy.
- `supabase/analytics-queries.sql` - gotowe zapytania do szybkiego sprawdzania ruchu, źródeł i konwersji.

Po wdrożeniu funkcji w Supabase ustaw w GitHub Actions zmienną:

```text
VITE_FORM_ENDPOINT=https://TWOJ-PROJEKT.supabase.co/functions/v1/submit-form
VITE_ANALYTICS_ENDPOINT=https://TWOJ-PROJEKT.supabase.co/functions/v1/track-event
VITE_TURNSTILE_SITE_KEY=PUBLICZNY_SITE_KEY_CLOUDFLARE
```

Workflow GitHub Pages przekaże tę zmienną do buildu strony.

## Materiały do podmiany

- Podglądy linków: `public/assets/og/*.jpg`
- Logo: `public/assets/solva-logo.svg`
- Sekcje realizacji, materiałów Hydro, wideo i 3D są teraz przygotowane pod późniejszą podmianę na realne zdjęcia, filmy, certyfikaty i opisy usług.
- Logo Hydro Energy: `public/assets/partners/hydro-energy-full-color.png` oraz `public/assets/partners/hydro-energy-white.png`.
- Logo pod Pracuj.pl: `resources/job-boards/pracuj-logo-180.png` albo większe `resources/job-boards/pracuj-logo-512.png`.
- Logo pod RocketJobs.pl: `resources/job-boards/rocketjobs-logo-512.png`; dodatkowo poziomy wariant `resources/job-boards/rocketjobs-logo-horizontal.png`.
- Sekcja „Instalacja w centrum uwagi” jest przygotowana pod późniejszą podmianę na wycięty dom z panelami, mini-scenę 3D albo krótki materiał video po dosłaniu prawdziwych zdjęć.

## Notatki do finalizacji treści

- Nie publikować stawek, szczegółowych zapisów umów ani danych poufnych z dokumentów handlowych.
- Benefity dla handlowców opisywać ogólnie: jasny proces, CRM, szkolenie produktowe, zatwierdzona oferta, komplet dokumentów i praca na przypisanych klientach.
- Po otrzymaniu kolejnych materiałów Hydro Energy uzupełnić sekcje: certyfikaty, case studies, wideo, opisy produktów i dodatkowe referencje.
