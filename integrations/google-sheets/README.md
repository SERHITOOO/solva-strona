# Google Sheets bridge

Arkusz produkcyjny:

https://docs.google.com/spreadsheets/d/1a3Zaxd-yK4DGCgRrg6vUbPPhNUgYPi0fUf35tUSap6Y/edit

Zakladki:

- `Leady - klienci`
- `Handlowcy`

Formularze dalej zapisuja sie w Supabase. Google Sheets dostaje kopie robocza
dla szybkiego podgladu leadow i kandydatow.

## Wdrozony webhook

Projekt Apps Script:

https://script.google.com/d/1jn1ZvXOpE1-YAUUN3fi7EU9t_2O21WfSQ0uZyG18K438h8ftM4fVgvtK/edit

Web app URL jest ustawiony w Supabase jako sekret `GOOGLE_SHEETS_WEBHOOK_URL`.
Token jest ustawiony w Supabase jako sekret `GOOGLE_SHEETS_WEBHOOK_TOKEN` oraz w
Apps Script jako wlasciwosc skryptu `SOLVA_WEBHOOK_TOKEN`.

## Jak odtworzyc recznie

1. W arkuszu wybierz `Rozszerzenia -> Apps Script`.
2. Wklej zawartosc pliku `Code.gs`.
3. W `Project Settings -> Script properties` dodaj:
   - `SOLVA_WEBHOOK_TOKEN`
   - opcjonalnie `SOLVA_SHEET_ID`, jesli chcesz podpiac inny arkusz
4. Wdrozenie: `Deploy -> New deployment -> Web app`.
5. Dostep: `Anyone`.
6. Skopiuj URL web app.
7. W Supabase ustaw sekrety:

```bash
npx supabase secrets set GOOGLE_SHEETS_WEBHOOK_URL="URL_Z_APPS_SCRIPT"
npx supabase secrets set GOOGLE_SHEETS_WEBHOOK_TOKEN="TEN_SAM_TOKEN"
npx supabase functions deploy submit-form
```
