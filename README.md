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

Frontend działa przez Vite, a API Express zapisuje zgłoszenia lokalnie w katalogu `data/`.

## Publiczny podgląd

GitHub Pages publikuje statyczny frontend. W takim trybie formularz użyje `VITE_FORM_ENDPOINT`, jeśli zmienna zostanie ustawiona podczas buildu. Bez tej zmiennej formularz otworzy gotową wiadomość e-mail do wysłania na adres kontaktowy.

Na domenie publicznej bez hostowanego backendu formularze działają w trybie przejściowym:

- lokalnie używają `/api/leads` i `/api/partners`,
- produkcyjnie użyją `VITE_FORM_ENDPOINT`, jeśli zostanie ustawiony,
- bez endpointu otworzą gotowego maila z danymi zgłoszenia.

To pozwala wystartować bez stałego kosztu backendu, a później podpiąć Supabase, Make, CRM albo własne API bez przebudowy strony.

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

Rekomendowany wariant na pierwszy miesiąc:

- GitHub Pages + domena `solvaoze.pl` - frontend bez kosztu miesięcznego.
- Formularze w trybie mailowym albo przez darmowy endpoint formularzowy - bez serwera.
- Statusy i pola są już przygotowane pod CRM: `status`, `zrodlo`, `marka`, `podmiot`, tracking UTM.
- Gdy CRM będzie gotowy, najprostsza migracja to przekierowanie formularzy na `VITE_API_BASE` albo `VITE_FORM_ENDPOINT`.

Kolejny etap po walidacji leadów:

- Supabase Free jako baza zgłoszeń klientów i handlowców.
- Cloudflare Turnstile do antyspamu.
- Resend do powiadomień mailowych.
- Docelowo własny CRM i API pod `api.solvaoze.pl`.

## Materiały do podmiany

- Hero: `public/assets/solar-hero.png`
- Logo: `public/assets/solva-logo.svg`
- Sekcje realizacji, materiałów Hydro, wideo i 3D są teraz przygotowane pod późniejszą podmianę na realne zdjęcia, filmy, certyfikaty i opisy usług.
- Logo pod Pracuj.pl: `public/assets/job-boards/pracuj-logo-180.png` albo większe `public/assets/job-boards/pracuj-logo-512.png`.
- Logo pod RocketJobs.pl: `public/assets/job-boards/rocketjobs-logo-512.png`; dodatkowo poziomy wariant `public/assets/job-boards/rocketjobs-logo-horizontal.png`.
- Sekcja interaktywnego motywu instalacji jest przygotowana pod wycięty dom z panelami, mini-scenę 3D lub krótki materiał video po dosłaniu prawdziwych zdjęć.

## Notatki do finalizacji treści

- Nie publikować stawek, szczegółowych zapisów umów ani danych poufnych z dokumentów handlowych.
- Benefity dla handlowców opisywać ogólnie: jasny proces, CRM, szkolenie produktowe, zatwierdzona oferta, komplet dokumentów i praca na przypisanych klientach.
- Po otrzymaniu materiałów Hydro NRG uzupełnić sekcje: realizacje, certyfikaty, case studies, wideo, opisy produktów i logotypy.
