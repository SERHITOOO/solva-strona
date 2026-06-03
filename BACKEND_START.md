# SOLVA - tani backend na start

Cel: przez 1-2 miesiace zbierac kontakty ze strony bez placenia za serwer, a pozniej podpiac je pod wlasny CRM.

## Rekomendowany zestaw

- Supabase Free - baza `submissions` i funkcja `submit-form`.
- Resend Free - powiadomienia mailowe o nowych zgłoszeniach na `m.pokora@hydro-energy.pl`.
- Cloudflare Turnstile Free - antyspam do formularzy, do wlaczenia po podstawowym uruchomieniu.
- GitHub Pages - frontend zostaje tam, gdzie jest.

## Dane kont

Rejestracja kont:

- e-mail: `m.pokora@hydro-energy.pl`
- hasla: zapisac w Menedzerze hasel / iCloud Keychain / 1Password / Bitwarden, nie w pliku tekstowym.

## Supabase

1. Utworz projekt w Supabase, np. `solva`.
2. W SQL Editor uruchom migracje:
   `supabase/migrations/202606030001_create_submissions.sql`
3. Zainstaluj i zaloguj CLI, jesli jeszcze go nie ma:

```bash
npm install -g supabase
supabase login
```

4. Polacz repo z projektem:

```bash
supabase link --project-ref TWOJ_PROJECT_REF
```

5. Ustaw sekrety funkcji:

```bash
supabase secrets set NOTIFY_EMAIL=m.pokora@hydro-energy.pl
supabase secrets set FROM_EMAIL="SOLVA <kontakt@solvaoze.pl>"
supabase secrets set ALLOWED_ORIGINS=https://solvaoze.pl,https://www.solvaoze.pl,http://localhost:5174
supabase secrets set RESEND_API_KEY=TU_WKLEJ_KLUCZ_RESEND
```

6. Wdroz funkcje:

```bash
supabase functions deploy submit-form
```

Endpoint bedzie mial format:

```text
https://TWOJ_PROJECT_REF.functions.supabase.co/submit-form
```

## Resend

1. Zaloz konto na `m.pokora@hydro-energy.pl`.
2. Dodaj domene `solvaoze.pl`.
3. W OVH dodaj rekordy DNS pokazane przez Resend.
4. Po weryfikacji domeny utworz API Key.
5. Wklej go do Supabase jako `RESEND_API_KEY`.

## GitHub Pages

W repo `SERHITOOO/solva-strona` ustaw zmienna:

```text
Settings -> Secrets and variables -> Actions -> Variables
VITE_FORM_ENDPOINT=https://TWOJ_PROJECT_REF.functions.supabase.co/submit-form
```

Po zapisaniu zmiennej uruchom ponownie workflow `Deploy GitHub Pages`.

## Co bedzie dzialac

- Formularz klienta zapisuje rekord `kind = lead`.
- Formularz handlowca zapisuje rekord `kind = partner`.
- Kazde zgloszenie wysyla mail na `m.pokora@hydro-energy.pl`.
- Dane zostaja w Supabase do eksportu CSV albo pozniejszego podpiecia CRM.

## Czego nie robimy

- Nie wystawiamy laptopa jako publicznego serwera.
- Nie zapisujemy hasel w zwyklym pliku na pulpicie.
- Nie publikujemy sekretow API w repozytorium.
