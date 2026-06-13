# SOLVA - backend zgłoszeń

Aktualny cel: przez 1-2 miesiace zbierac kontakty ze strony bez stalego kosztu serwera, a pozniej podpiac je pod wlasny CRM.

## Co juz dziala

- Frontend: GitHub Pages pod domena `https://solvaoze.pl`.
- Backend formularzy: Supabase project `SOLVA`.
- Edge Function: `submit-form`.
- Endpoint produkcyjny: ustawiany w GitHub Actions jako `VITE_FORM_ENDPOINT`.
- GitHub Actions variable: `VITE_FORM_ENDPOINT` ustawione na endpoint Supabase.
- Baza danych: tabela `public.submissions`.
- Kopia robocza zgłoszeń: Google Sheets `SOLVA - Leady i handlowcy`.
- Mailbox firmowy: `kontakt@solvaoze.pl` w OVH/Zimbra.

## Gdzie trafiaja zgloszenia

Supabase Dashboard:

```text
Supabase Dashboard -> projekt SOLVA -> Table Editor
```

Tabela:

```text
public.submissions
```

Typy zgloszen:

- `kind = lead` - formularz klienta.
- `kind = partner` - formularz handlowca.

Najwazniejsze pola:

- `status` - domyslnie `new`.
- `full_name`, `phone`, `email`, `location`.
- `payload` - pelna tresc formularza.
- `tracking` - strona, referrer i parametry UTM.
- `created_at` - data wplyniecia.

Google Sheets:

```text
Arkusz roboczy SOLVA - Leady i handlowcy, link trzymaj w prywatnej dokumentacji operacyjnej.
```

Zakladki:

- `Leady - klienci`
- `Handlowcy`

## Co jeszcze nie jest aktywne

Cloudflare Turnstile jest przygotowany w kodzie, ale wymaga jeszcze:

- GitHub Actions variable: `VITE_TURNSTILE_SITE_KEY`
- Supabase secret: `TURNSTILE_SECRET_KEY`

Automatyczne powiadomienia e-mail nie sa jeszcze wlaczone, bo brakuje `RESEND_API_KEY`.

Funkcja jest juz przygotowana tak, zeby po dodaniu klucza wysylac powiadomienia na:

```text
kontakt@solvaoze.pl
```

## Jak wlaczyc powiadomienia e-mail

1. Zaloz konto w Resend.
2. Dodaj domene `solvaoze.pl`.
3. W OVH dodaj rekordy DNS pokazane przez Resend.
4. Po weryfikacji domeny utworz API Key.
5. Ustaw sekret w Supabase:

```bash
npx supabase secrets set RESEND_API_KEY=TU_WKLEJ_KLUCZ_RESEND
npx supabase functions deploy submit-form
```

## Koszty na start

- GitHub Pages: `0 zl / miesiac` dla obecnego hostingu frontendu.
- Supabase Free: `0 zl / miesiac` na start, w limicie m.in. 500 MB bazy i 500 000 wywolan Edge Functions.
- Resend Free: `0 zl / miesiac` na start, po konfiguracji domeny i API key.
- OVH: domena i mailbox sa osobno po stronie OVH.

Na tym etapie nie ma sensu placic za drogi hosting backendu. Supabase Free spokojnie wystarczy do walidacji, czy leady i handlowcy faktycznie wplywaja.

## Migracja do CRM

Gdy CRM bedzie gotowy, najlepszy wariant:

- zostawic `submissions` jako bufor danych,
- dodac endpoint CRM,
- po zapisie w Supabase przekazywac rekord do CRM,
- albo zmienic `VITE_FORM_ENDPOINT` na docelowe `https://api.solvaoze.pl/...`.

Nie trzeba przebudowywac calej strony.
