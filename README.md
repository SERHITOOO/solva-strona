# SOLVA

Landing page marki SOLVA, partnera Hydro NRG, z backendem do pozyskiwania leadów klientów oraz zgłoszeń handlowców.

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
- Dla publicznego hostingu statycznego można ustawić `VITE_FORM_ENDPOINT` jako adres przyjmujący zgłoszenia.
- Po wdrożeniu osobnego backendu można ustawić `VITE_API_BASE`, np. `https://api.solvaoze.pl`.

## Tani start bez CRM

Aktualny wariant na pierwszy miesiąc:

- GitHub Pages + domena `solvaoze.pl` - frontend bez kosztu miesięcznego.
- Supabase Free - baza zgłoszeń `submissions` i funkcja `submit-form`.
- Mailbox `kontakt@solvaoze.pl` - kontakt firmowy w OVH/Zimbra.
- Statusy i pola są już przygotowane pod CRM: `status`, `zrodlo`, `marka`, `podmiot`, tracking UTM.
- Gdy CRM będzie gotowy, najprostsza migracja to przekierowanie formularzy na `VITE_API_BASE` albo `VITE_FORM_ENDPOINT`.

Kolejny etap po walidacji leadów:

- Cloudflare Turnstile do antyspamu.
- Resend do automatycznych powiadomień mailowych na `kontakt@solvaoze.pl`.
- Docelowo własny CRM i API pod `api.solvaoze.pl`.

Szczegółowy plan uruchomienia darmowego backendu znajduje się w `BACKEND_START.md`.
Repo zawiera też gotowe pliki Supabase:

- `supabase/migrations/202606030001_create_submissions.sql` - tabela zgłoszeń.
- `supabase/functions/submit-form/index.ts` - endpoint przyjmujący formularze; po dodaniu `RESEND_API_KEY` wyśle też powiadomienie przez Resend.

Po wdrożeniu funkcji w Supabase ustaw w GitHub Actions zmienną:

```text
VITE_FORM_ENDPOINT=https://sraivpmzkqkiasfjftjq.supabase.co/functions/v1/submit-form
```

Workflow GitHub Pages przekaże tę zmienną do buildu strony.

## Materiały do podmiany

- Podglądy linków: `public/assets/og/*.jpg`
- Logo: `public/assets/solva-logo.svg`
- Sekcje realizacji, materiałów Hydro, wideo i 3D są teraz przygotowane pod późniejszą podmianę na realne zdjęcia, filmy, certyfikaty i opisy usług.
- Logo pod Pracuj.pl: `public/assets/job-boards/pracuj-logo-180.png` albo większe `public/assets/job-boards/pracuj-logo-512.png`.
- Logo pod RocketJobs.pl: `public/assets/job-boards/rocketjobs-logo-512.png`; dodatkowo poziomy wariant `public/assets/job-boards/rocketjobs-logo-horizontal.png`.
- Sekcja interaktywnego motywu instalacji jest przygotowana pod wycięty dom z panelami, mini-scenę 3D lub krótki materiał video po dosłaniu prawdziwych zdjęć.

## Notatki do finalizacji treści

- Nie publikować stawek, szczegółowych zapisów umów ani danych poufnych z dokumentów handlowych.
- Benefity dla handlowców opisywać ogólnie: jasny proces, CRM, szkolenie produktowe, zatwierdzona oferta, komplet dokumentów i praca na przypisanych klientach.
- Po otrzymaniu materiałów Hydro NRG uzupełnić sekcje: realizacje, certyfikaty, case studies, wideo, opisy produktów i logotypy.
