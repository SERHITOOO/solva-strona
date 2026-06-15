const DEFAULT_SHEET_ID = "";
const LEADS_SHEET = "Leady - klienci";
const PARTNERS_SHEET = "Handlowcy";
const SHEET_ID_PROPERTY = "SOLVA_SHEET_ID";

const THEME = {
  navy: "#07324f",
  blue: "#17698f",
  amber: "#f2a12c",
  amberSoft: "#fff3dc",
  blueSoft: "#eaf5f9",
  greenSoft: "#e9f7ee",
  redSoft: "#fdecec",
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

function setupSheet(sheet, headers) {
  sheet.getBandings().forEach((banding) => banding.remove());
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  styleSheet(sheet, headers);
}

function styleSheet(sheet, headers) {
  sheet.getBandings().forEach((banding) => banding.remove());
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground(THEME.navy)
    .setFontColor(THEME.white)
    .setFontWeight("bold")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left")
    .setBorder(false, false, true, false, false, false, THEME.amber, SpreadsheetApp.BorderStyle.SOLID_THICK);

  sheet.setRowHeight(1, 46);
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), headers.length)
    .setVerticalAlignment("top")
    .setWrap(true)
    .setFontColor(THEME.text);

  const widths = [150, 120, 120, 150, 170, 190, 130, 210, 160, 150, 150, 170, 160, 140, 280, 160, 150, 190, 160, 280];
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Nowy", "W trakcie", "Oddzwonić", "Umówione", "Zamknięte", "Nieaktualne"], true)
    .setAllowInvalid(false)
    .build();
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Wysoki", "Średni", "Niski"], true)
    .setAllowInvalid(true)
    .build();

  sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1).setDataValidation(statusRule);
  sheet.getRange(2, 3, sheet.getMaxRows() - 1, 1).setDataValidation(priorityRule);
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1).setNumberFormat("@");
  sheet.getRange(2, 8, sheet.getMaxRows() - 1, 1).setNumberFormat("@");

  const bandingRange = sheet.getRange(1, 1, sheet.getMaxRows(), headers.length);
  const banding = bandingRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  banding.setHeaderRowColor(THEME.navy);
  banding.setFirstRowColor(THEME.white);
  banding.setSecondRowColor(THEME.blueSoft);

  applyConditionalFormatting(sheet, headers.length);
}

function applyConditionalFormatting(sheet, headerCount) {
  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  const statusRange = sheet.getRange(2, 2, maxRows, 1);
  const priorityRange = sheet.getRange(2, 3, maxRows, 1);
  const stageRange = sheet.getRange(2, 19, maxRows, 1);

  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Nowy")
      .setBackground(THEME.blueSoft)
      .setFontColor(THEME.navy)
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("W trakcie")
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
      .whenTextEqualTo("Wysoki")
      .setBackground("#ffe5df")
      .setFontColor("#962b18")
      .setRanges([priorityRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Średni")
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
      .whenTextContains("kontakt")
      .setBackground("#edf7fb")
      .setFontColor(THEME.navy)
      .setRanges([stageRange])
      .build()
  ];

  sheet.setConditionalFormatRules(rules);
  sheet.getRange(1, 1, sheet.getMaxRows(), headerCount)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

function styleSpreadsheet() {
  const spreadsheet = getSpreadsheet();
  const leadsSheet = spreadsheet.getSheetByName(LEADS_SHEET);
  const partnersSheet = spreadsheet.getSheetByName(PARTNERS_SHEET);

  if (leadsSheet) {
    styleSheet(leadsSheet, LEADS_HEADERS);
  }

  if (partnersSheet) {
    styleSheet(partnersSheet, PARTNERS_HEADERS);
  }

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

  setupSheet(leadsSheet, LEADS_HEADERS);
  setupSheet(partnersSheet, PARTNERS_HEADERS);

  const sheets = spreadsheet.getSheets();
  sheets.forEach((sheet) => {
    if (![LEADS_SHEET, PARTNERS_SHEET].includes(sheet.getName())) {
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
      sheets: [LEADS_SHEET, PARTNERS_SHEET]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
