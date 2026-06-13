# Google Sheets bridge

Arkusz produkcyjny trzymaj w prywatnej dokumentacji operacyjnej. W publicznym repo nie zapisujemy ID arkusza.

Zakladki:

- `Leady - klienci`
- `Handlowcy`

Formularze dalej zapisuja sie w Supabase. Google Sheets dostaje kopie robocza
dla szybkiego podgladu leadow i kandydatow.

## Wdrozony webhook

Web app URL jest ustawiony w Supabase jako sekret `GOOGLE_SHEETS_WEBHOOK_URL`.
Token jest ustawiony w Supabase jako sekret `GOOGLE_SHEETS_WEBHOOK_TOKEN` oraz w
Apps Script jako wlasciwosc skryptu `SOLVA_WEBHOOK_TOKEN`.
Operacje administracyjne (`setup`, `cleanup`) moga uzywac osobnego `SOLVA_ADMIN_WEBHOOK_TOKEN`.

## Jak odtworzyc recznie

1. W arkuszu wybierz `Rozszerzenia -> Apps Script`.
2. Wklej zawartosc pliku `Code.gs`.
3. W `Project Settings -> Script properties` dodaj:
   - `SOLVA_SHEET_ID`
   - `SOLVA_WEBHOOK_TOKEN`
   - opcjonalnie `SOLVA_ADMIN_WEBHOOK_TOKEN`, jesli setup/cleanup maja miec osobny token
4. Wdrozenie: `Deploy -> New deployment -> Web app`.
5. Dostep: `Anyone`.
6. Skopiuj URL web app.
7. W Supabase ustaw sekrety:

```bash
npx supabase secrets set GOOGLE_SHEETS_WEBHOOK_URL="URL_Z_APPS_SCRIPT"
npx supabase secrets set GOOGLE_SHEETS_WEBHOOK_TOKEN="TEN_SAM_TOKEN"
npx supabase functions deploy submit-form
```
