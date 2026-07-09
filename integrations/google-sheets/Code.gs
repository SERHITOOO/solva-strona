const DEFAULT_SHEET_ID = "";
const LEADS_SHEET = "Leady - klienci";
const PARTNERS_SHEET = "Handlowcy";
const DASHBOARD_SHEET = "Panel";
const SHEET_ID_PROPERTY = "SOLVA_SHEET_ID";

const THEME = {
  navy: "#07324f",
  navySoft: "#0d4668",
  blue: "#17698f",
  cyan: "#087f9f",
  amber: "#f2a12c",
  amberSoft: "#fff3dc",
  blueSoft: "#eaf5f9",
  cyanSoft: "#e8f8fb",
  greenSoft: "#e9f7ee",
  redSoft: "#fdecec",
  greySoft: "#f5f8fa",
  text: "#173247",
  muted: "#5f7180",
  border: "#d7e6ec",
  white: "#ffffff"
};

const LEADS_HEADERS = [
  "Data zgłoszenia",
  "Status",
  "Priorytet",
  "Źródło",
  "Kampania / UTM",
  "Imię i nazwisko",
  "Telefon",
  "E-mail",
  "Miejscowość",
  "Województwo",
  "Rachunek / zużycie",
  "Zakres",
  "Termin inwestycji",
  "Typ dachu",
  "Wiadomość",
  "Opiekun",
  "Data kontaktu",
  "Następny krok",
  "Etap",
  "Notatki"
];

const PARTNERS_HEADERS = [
  "Data zgłoszenia",
  "Status",
  "Priorytet",
  "Źródło",
  "Kampania / UTM",
  "Imię i nazwisko",
  "Telefon",
  "E-mail",
  "Miasto / region",
  "Doświadczenie",
  "Źródła klientów",
  "Własny zespół",
  "Preferowane produkty",
  "Dostępność od",
  "Wiadomość",
  "Opiekun",
  "Data kontaktu",
  "Etap rekrutacji",
  "Następny krok",
  "Notatki"
];

const STATUS_OPTIONS = [
  "Nowy",
  "Do kontaktu",
  "Kontakt podjęty",
  "Oddzwonić",
  "Umówione",
  "Wysłane dalej",
  "Brak odpowiedzi",
  "Zamknięte",
  "Nieaktualne"
];

const PRIORITY_OPTIONS = ["Pilny", "Wysoki", "Normalny", "Niski"];

const OWNER_OPTIONS = [
  "Do przydzielenia",
  "Mikołaj",
  "Aleksander Jurkowski",
  "Arkadiusz Górka",
  "Tomasz Mitoraj",
  "Robert Kwaśniewski",
  "Iwo Skoczek",
  "Hydro Energy / Ola"
];

const LEAD_STAGE_OPTIONS = [
  "Nowe zgłoszenie",
  "Do weryfikacji",
  "Po pierwszym kontakcie",
  "Wysłane do Hydro Energy",
  "Oferta",
  "Zamknięte"
];

const PARTNER_STAGE_OPTIONS = [
  "Nowy",
  "Brak CV",
  "Wstępny kontakt",
  "CV otrzymane",
  "Przekazany do opiekuna",
  "Autoryzacja",
  "Odrzucony",
  "Zamknięty"
];

function clean(value) {
  return String(value || "").trim();
}

function sheetText(value) {
  const text = clean(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  return Utilities.formatDate(date, "Europe/Warsaw", "yyyy-MM-dd HH:mm:ss");
}

function getCampaign(tracking) {
  const parts = [
    tracking.utm_source,
    tracking.utm_medium,
    tracking.utm_campaign,
    tracking.utm_content,
    tracking.utm_term
  ].filter(Boolean);

  return sheetText(parts.join(" / "));
}

function getSheetId() {
  const sheetId = PropertiesService.getScriptProperties().getProperty(SHEET_ID_PROPERTY) || DEFAULT_SHEET_ID;

  if (!sheetId) {
    throw new Error("Brakuje SOLVA_SHEET_ID w Project Settings -> Script properties.");
  }

  return sheetId;
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(getSheetId());
}

function setupSheet(sheet, headers, kind) {
  sheet.getBandings().forEach((banding) => banding.remove());
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  styleSheet(sheet, headers, kind);
}

function ensureSheetCapacity(sheet, headers) {
  const missingColumns = headers.length - sheet.getMaxColumns();
  if (missingColumns > 0) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), missingColumns);
  }

  if (sheet.getMaxRows() < 80) {
    sheet.insertRowsAfter(sheet.getMaxRows(), 80 - sheet.getMaxRows());
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function applyValidation(sheet, column, options) {
  const rowCount = Math.max(sheet.getMaxRows() - 1, 1);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(true)
    .build();

  sheet.getRange(2, column, rowCount, 1).setDataValidation(rule);
}

function normalizeOperationalColumns(sheet, headers, kind) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return;
  }

  const rowCount = lastRow - 1;
  const range = sheet.getRange(2, 1, rowCount, headers.length);
  const values = range.getValues();

  values.forEach((row) => {
    if (!clean(row[1])) row[1] = "Nowy";
    if (!clean(row[2])) row[2] = "Normalny";
    if (!clean(row[3])) row[3] = "strona SOLVA";
    if (!clean(row[15])) row[15] = "Do przydzielenia";
    if (!clean(row[17])) row[17] = kind === "partner" ? "Brak CV / rozmowa" : "Do kontaktu";
    if (!clean(row[18])) row[18] = kind === "partner" ? "Nowy" : "Nowe zgłoszenie";
  });

  range.setValues(values);
}

function styleSheet(sheet, headers, kind) {
  ensureSheetCapacity(sheet, headers);
  normalizeOperationalColumns(sheet, headers, kind);
  sheet.getBandings().forEach((banding) => banding.remove());
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);
  sheet.setHiddenGridlines(true);
  sheet.setTabColor(kind === "partner" ? THEME.amber : THEME.blue);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground(THEME.navy)
    .setFontColor(THEME.white)
    .setFontWeight("bold")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left")
    .setBorder(false, false, true, false, false, false, THEME.amber, SpreadsheetApp.BorderStyle.SOLID_THICK);

  sheet.setRowHeight(1, 48);
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), headers.length)
    .setVerticalAlignment("top")
    .setWrap(true)
    .setFontSize(10)
    .setFontColor(THEME.text);

  const widths = [155, 135, 120, 145, 165, 190, 140, 220, 170, 150, 160, 185, 165, 160, 300, 170, 150, 210, 180, 320];
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));

  applyValidation(sheet, 2, STATUS_OPTIONS);
  applyValidation(sheet, 3, PRIORITY_OPTIONS);
  applyValidation(sheet, 16, OWNER_OPTIONS);
  applyValidation(sheet, 19, kind === "partner" ? PARTNER_STAGE_OPTIONS : LEAD_STAGE_OPTIONS);

  sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1).setNumberFormat("@");
  sheet.getRange(2, 8, sheet.getMaxRows() - 1, 1).setNumberFormat("@");
  sheet.getRange(2, 17, sheet.getMaxRows() - 1, 1).setNumberFormat("yyyy-mm-dd");

  const existingFilter = sheet.getFilter();
  if (existingFilter) {
    existingFilter.remove();
  }

  const filterRows = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(1, 1, filterRows, headers.length).createFilter();

  const bandingRange = sheet.getRange(1, 1, sheet.getMaxRows(), headers.length);
  const banding = bandingRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  banding.setHeaderRowColor(THEME.navy);
  banding.setFirstRowColor(THEME.white);
  banding.setSecondRowColor(THEME.blueSoft);

  applyConditionalFormatting(sheet, headers.length);
}

function applyConditionalFormatting(sheet, headerCount) {
  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  const fullRowsRange = sheet.getRange(2, 1, maxRows, headerCount);
  const statusRange = sheet.getRange(2, 2, maxRows, 1);
  const priorityRange = sheet.getRange(2, 3, maxRows, 1);
  const ownerRange = sheet.getRange(2, 16, maxRows, 1);
  const nextContactRange = sheet.getRange(2, 17, maxRows, 1);
  const nextStepRange = sheet.getRange(2, 18, maxRows, 1);
  const stageRange = sheet.getRange(2, 19, maxRows, 1);

  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Nowy")
      .setBackground(THEME.cyanSoft)
      .setFontColor(THEME.navy)
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Do kontaktu")
      .setBackground("#eaf4ff")
      .setFontColor(THEME.navy)
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Kontakt podjęty")
      .setBackground(THEME.amberSoft)
      .setFontColor(THEME.navy)
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Oddzwonić")
      .setBackground("#fff0e6")
      .setFontColor("#8a3b00")
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Umówione")
      .setBackground(THEME.greenSoft)
      .setFontColor("#155a31")
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Wysłane dalej")
      .setBackground("#edf0ff")
      .setFontColor("#27346b")
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Brak odpowiedzi")
      .setBackground("#f3f0e9")
      .setFontColor("#6d5631")
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Zamknięte")
      .setBackground("#eef2f5")
      .setFontColor(THEME.muted)
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Nieaktualne")
      .setBackground(THEME.redSoft)
      .setFontColor("#8b1d1d")
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Pilny")
      .setBackground("#ffd6cc")
      .setFontColor("#8b1d1d")
      .setRanges([priorityRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Wysoki")
      .setBackground("#ffe5df")
      .setFontColor("#962b18")
      .setRanges([priorityRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Normalny")
      .setBackground(THEME.amberSoft)
      .setFontColor("#785000")
      .setRanges([priorityRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Niski")
      .setBackground(THEME.greenSoft)
      .setFontColor("#155a31")
      .setRanges([priorityRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Do przydzielenia")
      .setBackground("#fff7e8")
      .setFontColor("#8a3b00")
      .setRanges([ownerRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenDateBefore(SpreadsheetApp.RelativeDate.TODAY)
      .setBackground("#ffe5df")
      .setFontColor("#8b1d1d")
      .setRanges([nextContactRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("CV")
      .setBackground("#fff7e8")
      .setFontColor("#8a3b00")
      .setRanges([nextStepRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("kontakt")
      .setBackground(THEME.cyanSoft)
      .setFontColor(THEME.navy)
      .setRanges([stageRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="Zamknięte"')
      .setBackground("#f1f4f6")
      .setFontColor(THEME.muted)
      .setRanges([fullRowsRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="Nieaktualne"')
      .setBackground("#f7eeee")
      .setFontColor(THEME.muted)
      .setRanges([fullRowsRange])
      .build()
  ];

  sheet.setConditionalFormatRules(rules);
  sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 24), headerCount)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

function countActiveRows(sheet) {
  const lastRow = sheet ? sheet.getLastRow() : 0;
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, 2, lastRow - 1, 5).getValues();
  return values.filter((row) => {
    const status = clean(row[0]);
    const name = clean(row[4]);
    return name && status !== "Zamknięte" && status !== "Nieaktualne";
  }).length;
}

function countByStatus(sheet, statusName) {
  const lastRow = sheet ? sheet.getLastRow() : 0;
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  return values.filter((row) => clean(row[0]) === statusName).length;
}

function getDashboardRows(sheet, kind, limit) {
  const lastRow = sheet ? sheet.getLastRow() : 0;
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 20).getDisplayValues();
  const rows = values
    .filter((row) => {
      const status = clean(row[1]);
      const name = clean(row[5]);
      return name && status !== "Zamknięte" && status !== "Nieaktualne";
    })
    .map((row) => [
      kind,
      row[5],
      row[6],
      row[8],
      row[1] || "Nowy",
      row[17] || "Do kontaktu",
      row[15] || "Do przydzielenia",
      row[0]
    ]);

  return rows.slice(0, limit);
}

function styleDashboardCards(sheet, rangeA1) {
  sheet.getRange(rangeA1)
    .setBackground(THEME.white)
    .setFontColor(THEME.text)
    .setBorder(true, true, true, true, false, false, THEME.border, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("middle");
}

function refreshDashboard(spreadsheet) {
  const leadsSheet = spreadsheet.getSheetByName(LEADS_SHEET);
  const partnersSheet = spreadsheet.getSheetByName(PARTNERS_SHEET);
  let dashboard = spreadsheet.getSheetByName(DASHBOARD_SHEET);

  if (!dashboard) {
    dashboard = spreadsheet.insertSheet(DASHBOARD_SHEET, 0);
  }

  dashboard.getDataRange().breakApart();
  dashboard.clear();
  dashboard.setHiddenGridlines(true);
  dashboard.setTabColor(THEME.navy);
  dashboard.setFrozenRows(10);

  const widths = [150, 210, 150, 170, 140, 220, 180, 160];
  widths.forEach((width, index) => dashboard.setColumnWidth(index + 1, width));

  dashboard.getRange("A1:H1").merge()
    .setValue("SOLVA - panel zgłoszeń")
    .setBackground(THEME.navy)
    .setFontColor(THEME.white)
    .setFontSize(18)
    .setFontWeight("bold")
    .setVerticalAlignment("middle");
  dashboard.setRowHeight(1, 56);

  dashboard.getRange("A2:H2").merge()
    .setValue("Roboczy widok do szybkiego sprawdzania klientów i kandydatów. Szczegóły edytuj w zakładkach: Leady - klienci oraz Handlowcy.")
    .setBackground(THEME.greySoft)
    .setFontColor(THEME.muted)
    .setFontSize(10);

  const cards = [
    ["Aktywni klienci", countActiveRows(leadsSheet), "Zgłoszenia, które nie są zamknięte"],
    ["Nowi klienci", countByStatus(leadsSheet, "Nowy"), "Do pierwszego kontaktu"],
    ["Aktywni handlowcy", countActiveRows(partnersSheet), "Kandydaci w procesie"],
    ["Nowi handlowcy", countByStatus(partnersSheet, "Nowy"), "Do weryfikacji / CV"]
  ];

  dashboard.getRange(4, 1, 1, 8).setValues([[
    cards[0][0], cards[0][1],
    cards[1][0], cards[1][1],
    cards[2][0], cards[2][1],
    cards[3][0], cards[3][1]
  ]]);
  dashboard.getRange(5, 1, 1, 8).setValues([[
    cards[0][2], "",
    cards[1][2], "",
    cards[2][2], "",
    cards[3][2], ""
  ]]);
  styleDashboardCards(dashboard, "A4:B5");
  styleDashboardCards(dashboard, "C4:D5");
  styleDashboardCards(dashboard, "E4:F5");
  styleDashboardCards(dashboard, "G4:H5");
  dashboard.getRange("B4:D4").setFontSize(16).setFontWeight("bold").setFontColor(THEME.cyan);
  dashboard.getRange("F4:H4").setFontSize(16).setFontWeight("bold").setFontColor(THEME.amber);
  dashboard.getRange("A5:H5").setFontSize(9).setFontColor(THEME.muted);
  dashboard.setRowHeights(4, 2, 34);

  dashboard.getRange("A8:H8").merge()
    .setValue("Najbliższe działania")
    .setBackground(THEME.navySoft)
    .setFontColor(THEME.white)
    .setFontWeight("bold")
    .setFontSize(12);

  const headers = ["Typ", "Imię i nazwisko", "Telefon", "Miasto / region", "Status", "Następny krok", "Opiekun", "Data zgłoszenia"];
  dashboard.getRange(10, 1, 1, headers.length).setValues([headers])
    .setBackground(THEME.blue)
    .setFontColor(THEME.white)
    .setFontWeight("bold")
    .setVerticalAlignment("middle");

  const rows = [
    ...getDashboardRows(leadsSheet, "Klient", 10),
    ...getDashboardRows(partnersSheet, "Handlowiec", 10)
  ].slice(0, 18);

  if (rows.length) {
    dashboard.getRange(11, 1, rows.length, headers.length).setValues(rows);
  } else {
    dashboard.getRange("A11:H11").merge()
      .setValue("Brak aktywnych zgłoszeń do pokazania.")
      .setBackground(THEME.greySoft)
      .setFontColor(THEME.muted);
  }

  dashboard.getRange(10, 1, Math.max(rows.length + 1, 2), headers.length)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID)
    .setWrap(true)
    .setVerticalAlignment("top");

  dashboard.getRange("A30:H30").merge()
    .setValue("Zasada pracy: po kontakcie uzupełnij Status, Opiekuna, Datę kontaktu i Następny krok. Dzięki temu arkusz nie zamieni się w listę bez właściciela.")
    .setBackground(THEME.amberSoft)
    .setFontColor(THEME.text)
    .setFontWeight("bold")
    .setWrap(true);
}

function styleSpreadsheet() {
  const spreadsheet = getSpreadsheet();
  const leadsSheet = spreadsheet.getSheetByName(LEADS_SHEET);
  const partnersSheet = spreadsheet.getSheetByName(PARTNERS_SHEET);

  if (leadsSheet) {
    styleSheet(leadsSheet, LEADS_HEADERS, "lead");
  }

  if (partnersSheet) {
    styleSheet(partnersSheet, PARTNERS_HEADERS, "partner");
  }

  refreshDashboard(spreadsheet);

  return spreadsheet.getUrl();
}

function repairTextColumnsInSheet(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return 0;
  }

  const range = sheet.getRange(2, 7, lastRow - 1, 2);
  const formulas = range.getFormulas();
  const values = range.getDisplayValues();
  let repaired = 0;

  const nextValues = values.map((row, rowIndex) => row.map((value, columnIndex) => {
    const formula = formulas[rowIndex][columnIndex];
    const rawText = formula ? formula.replace(/^=/, "") : value;
    const safeText = sheetText(rawText);

    if (formula || safeText !== value) {
      repaired++;
    }

    return safeText;
  }));

  range.setNumberFormat("@");
  range.setValues(nextValues);

  return repaired;
}

function repairSpreadsheet() {
  const spreadsheet = getSpreadsheet();

  return {
    url: spreadsheet.getUrl(),
    leads: repairTextColumnsInSheet(spreadsheet.getSheetByName(LEADS_SHEET)),
    partners: repairTextColumnsInSheet(spreadsheet.getSheetByName(PARTNERS_SHEET))
  };
}

function appendSafeRow(sheet, row) {
  const nextRow = sheet.getLastRow() + 1;
  const range = sheet.getRange(nextRow, 1, 1, row.length);

  sheet.getRange(nextRow, 7, 1, 2).setNumberFormat("@");
  range.setValues([row]);
}

function setupSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheet;
  const existingId = props.getProperty(SHEET_ID_PROPERTY);

  if (existingId) {
    spreadsheet = SpreadsheetApp.openById(existingId);
    return spreadsheet.getUrl();
  } else {
    spreadsheet = SpreadsheetApp.create("SOLVA - Leady i handlowcy");
    props.setProperty(SHEET_ID_PROPERTY, spreadsheet.getId());
  }

  let leadsSheet = spreadsheet.getSheetByName(LEADS_SHEET);
  if (!leadsSheet) {
    leadsSheet = spreadsheet.insertSheet(LEADS_SHEET);
  }

  let partnersSheet = spreadsheet.getSheetByName(PARTNERS_SHEET);
  if (!partnersSheet) {
    partnersSheet = spreadsheet.insertSheet(PARTNERS_SHEET);
  }

  setupSheet(leadsSheet, LEADS_HEADERS, "lead");
  setupSheet(partnersSheet, PARTNERS_HEADERS, "partner");
  refreshDashboard(spreadsheet);

  const sheets = spreadsheet.getSheets();
  sheets.forEach((sheet) => {
    if (![DASHBOARD_SHEET, LEADS_SHEET, PARTNERS_SHEET].includes(sheet.getName())) {
      spreadsheet.deleteSheet(sheet);
    }
  });

  return spreadsheet.getUrl();
}

function deleteTestRowsFromSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return 0;
  }

  const values = sheet.getRange(2, 6, lastRow - 1, 1).getValues();
  let removed = 0;

  for (let index = values.length - 1; index >= 0; index--) {
    const name = clean(values[index][0]).toUpperCase();
    if (name.startsWith("TEST ")) {
      sheet.deleteRow(index + 2);
      removed++;
    }
  }

  return removed;
}

function cleanupTestRows() {
  const spreadsheet = getSpreadsheet();

  return {
    leads: deleteTestRowsFromSheet(spreadsheet.getSheetByName(LEADS_SHEET)),
    partners: deleteTestRowsFromSheet(spreadsheet.getSheetByName(PARTNERS_SHEET))
  };
}

function setSheetId(sheetId) {
  if (!sheetId || String(sheetId).length < 20) {
    throw new Error("Nieprawidlowe ID arkusza.");
  }

  PropertiesService.getScriptProperties().setProperty(SHEET_ID_PROPERTY, String(sheetId));
  return "SOLVA_SHEET_ID zapisany";
}

function verifyToken(event, body) {
  const expected = PropertiesService.getScriptProperties().getProperty("SOLVA_WEBHOOK_TOKEN");

  if (!expected) {
    return true;
  }

  const token = clean(event && event.parameter ? event.parameter.token : "") || clean(body.token);
  return token === expected;
}

function verifyAdminToken(event, body) {
  const expected =
    PropertiesService.getScriptProperties().getProperty("SOLVA_ADMIN_WEBHOOK_TOKEN") ||
    PropertiesService.getScriptProperties().getProperty("SOLVA_WEBHOOK_TOKEN");

  if (!expected) {
    return true;
  }

  const token = clean(event && event.parameter ? event.parameter.token : "") || clean(body.token);
  return token === expected;
}

function appendLead(spreadsheet, createdAt, payload, tracking) {
  const sheet = spreadsheet.getSheetByName(LEADS_SHEET);
  const row = [
    formatDate(createdAt),
    "Nowy",
    "",
    sheetText(payload.zrodlo) || "strona SOLVA",
    getCampaign(tracking),
    sheetText(payload.fullName),
    sheetText(payload.phone),
    sheetText(payload.email),
    sheetText(payload.location),
    "",
    sheetText(payload.monthlyBill),
    sheetText(payload.solution),
    sheetText(payload.investmentTime),
    sheetText(payload.roofType),
    sheetText(payload.message),
    "Do przydzielenia",
    "",
    "",
    "Do kontaktu",
    ""
  ];

  appendSafeRow(sheet, row);
}

function appendPartner(spreadsheet, createdAt, payload, tracking) {
  const sheet = spreadsheet.getSheetByName(PARTNERS_SHEET);
  const row = [
    formatDate(createdAt),
    "Nowy",
    "",
    sheetText(payload.zrodlo) || "strona SOLVA",
    getCampaign(tracking),
    sheetText(payload.fullName),
    sheetText(payload.phone),
    sheetText(payload.email),
    sheetText(payload.city),
    sheetText(payload.experience),
    sheetText(payload.leadSource),
    sheetText(payload.hasTeam),
    sheetText(payload.preferredProducts),
    sheetText(payload.availableFrom),
    sheetText(payload.message),
    "Do przydzielenia",
    "",
    "Nowy",
    "Do kontaktu",
    ""
  ];

  appendSafeRow(sheet, row);
}

function setWebhookToken(token) {
  if (!token || String(token).length < 24) {
    throw new Error("Token musi miec minimum 24 znaki.");
  }

  PropertiesService.getScriptProperties().setProperty("SOLVA_WEBHOOK_TOKEN", String(token));
  return "SOLVA_WEBHOOK_TOKEN zapisany";
}

function doPost(event) {
  const body = JSON.parse(event.postData.contents || "{}");

  if (!verifyToken(event, body)) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const payload = body.payload || {};
  const tracking = body.tracking || {};
  const spreadsheet = getSpreadsheet();

  if (body.kind === "partner") {
    appendPartner(spreadsheet, body.created_at || body.createdAt, payload, tracking);
  } else {
    appendLead(spreadsheet, body.created_at || body.createdAt, payload, tracking);
  }

  refreshDashboard(spreadsheet);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(event) {
  if (!verifyAdminToken(event, {})) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (clean(event && event.parameter ? event.parameter.setup : "") === "1") {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        url: setupSpreadsheet(),
        sheetId: getSheetId()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (clean(event && event.parameter ? event.parameter.cleanup : "") === "1") {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        removed: cleanupTestRows()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (clean(event && event.parameter ? event.parameter.style : "") === "1") {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        url: styleSpreadsheet()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (clean(event && event.parameter ? event.parameter.repair : "") === "1") {
    styleSpreadsheet();

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        repaired: repairSpreadsheet()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const spreadsheet = getSpreadsheet();

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        spreadsheet: spreadsheet.getName(),
      sheets: [DASHBOARD_SHEET, LEADS_SHEET, PARTNERS_SHEET]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
