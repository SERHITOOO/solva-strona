const DEFAULT_SHEET_ID = "1sOVOBYbLtPjCgEPpUCAcXu9iQOOCwWgCA2risSB-MyU";
const LEADS_SHEET = "Leady - klienci";
const PARTNERS_SHEET = "Handlowcy";
const SHEET_ID_PROPERTY = "SOLVA_SHEET_ID";

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

  return parts.join(" / ");
}

function getSheetId() {
  return PropertiesService.getScriptProperties().getProperty(SHEET_ID_PROPERTY) || DEFAULT_SHEET_ID;
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(getSheetId());
}

function setupSheet(sheet, headers) {
  sheet.getBandings().forEach((banding) => banding.remove());
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground("#07324f")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 42);
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), headers.length)
    .setVerticalAlignment("top")
    .setWrap(true);

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

  const bandingRange = sheet.getRange(1, 1, sheet.getMaxRows(), headers.length);
  bandingRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
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

function appendLead(spreadsheet, createdAt, payload, tracking) {
  const sheet = spreadsheet.getSheetByName(LEADS_SHEET);
  const row = [
    formatDate(createdAt),
    "Nowy",
    "",
    clean(payload.zrodlo) || "strona SOLVA",
    getCampaign(tracking),
    clean(payload.fullName),
    clean(payload.phone),
    clean(payload.email),
    clean(payload.location),
    "",
    clean(payload.monthlyBill),
    clean(payload.solution),
    clean(payload.investmentTime),
    clean(payload.roofType),
    clean(payload.message),
    "Do przydzielenia",
    "",
    "",
    "Do kontaktu",
    ""
  ];

  sheet.appendRow(row);
}

function appendPartner(spreadsheet, createdAt, payload, tracking) {
  const sheet = spreadsheet.getSheetByName(PARTNERS_SHEET);
  const row = [
    formatDate(createdAt),
    "Nowy",
    "",
    clean(payload.zrodlo) || "strona SOLVA",
    getCampaign(tracking),
    clean(payload.fullName),
    clean(payload.phone),
    clean(payload.email),
    clean(payload.city),
    clean(payload.experience),
    clean(payload.leadSource),
    clean(payload.hasTeam),
    clean(payload.preferredProducts),
    clean(payload.availableFrom),
    clean(payload.message),
    "Do przydzielenia",
    "",
    "Nowy",
    "Do kontaktu",
    ""
  ];

  sheet.appendRow(row);
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
  if (!verifyToken(event, {})) {
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

  const spreadsheet = getSpreadsheet();

  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      spreadsheet: spreadsheet.getName(),
      sheets: [LEADS_SHEET, PARTNERS_SHEET]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
