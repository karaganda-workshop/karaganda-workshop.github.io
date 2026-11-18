/**
 * Приём заявок в Google Таблицу (лист «Заявки»).
 *
 * ВНИМАНИЕ: текущая версия сайта этот скрипт НЕ использует — запись идёт
 * через WhatsApp. Если скрипт не нужен, отключите его развёртывание:
 * Развернуть → Управление развёртываниями → Архивировать.
 * Адрес развёртывания публичный (есть в истории репозитория), поэтому
 * всё, что приходит, считается недоверенным вводом.
 *
 * Защита:
 *  - строгая проверка полей: только ожидаемые поля, типы, длина, формат телефона;
 *  - защита от инъекции формул: значения, начинающиеся с = + - @ (и табуляции /
 *    перевода строки), записываются как текст и не выполняются таблицей;
 *  - «ловушка» для ботов (скрытое поле website должно быть пустым);
 *  - ограничение частоты: не больше MAX_PER_MINUTE заявок в минуту на весь скрипт;
 *  - ответы без внутренних деталей ошибок.
 *
 * После изменения кода: Развернуть → Управление развёртываниями →
 * карандаш → Новая версия.
 */

var SHEET_NAME = "Заявки";
var MAX_BODY_BYTES = 4000;
var MAX_PER_MINUTE = 20;

var FIELDS = {
  name: { max: 80, required: true },
  phone: { max: 20, required: true, pattern: /^\+?[0-9 ()\-]{7,20}$/ },
  sphere: { max: 120, required: false },
  pain: { max: 1000, required: false },
};

function doPost(e) {
  try {
    if (!e || !e.postData || typeof e.postData.contents !== "string") {
      return respond_(false, "bad_request");
    }
    if (e.postData.contents.length > MAX_BODY_BYTES) {
      return respond_(false, "too_large");
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return respond_(false, "bad_request");
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return respond_(false, "bad_request");
    }

    // Honeypot: real visitors never fill this hidden field.
    if (data.website) {
      return respond_(true);
    }

    var clean = {};
    for (var key in FIELDS) {
      var rule = FIELDS[key];
      var value = data[key];
      if (value === undefined || value === null || value === "") {
        if (rule.required) return respond_(false, "invalid_" + key);
        clean[key] = "";
        continue;
      }
      if (typeof value !== "string") return respond_(false, "invalid_" + key);
      value = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
      if (value.length > rule.max) return respond_(false, "invalid_" + key);
      if (rule.pattern && !rule.pattern.test(value)) return respond_(false, "invalid_" + key);
      if (rule.required && !value) return respond_(false, "invalid_" + key);
      clean[key] = neutralizeFormula_(value);
    }

    if (!allowRate_()) {
      return respond_(false, "rate_limited");
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      var sheet = getSheet_();
      sheet.appendRow([new Date(), clean.name, clean.phone, clean.sphere, clean.pain]);
    } finally {
      lock.releaseLock();
    }
    return respond_(true);
  } catch (err) {
    console.error(err); // visible only to the owner in Apps Script logs
    return respond_(false, "server_error");
  }
}

/** Prefix values a spreadsheet would treat as a formula so they stay plain text. */
function neutralizeFormula_(value) {
  return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}

function allowRate_() {
  var cache = CacheService.getScriptCache();
  var bucket = "rate_" + Math.floor(Date.now() / 60000);
  var count = Number(cache.get(bucket) || 0);
  if (count >= MAX_PER_MINUTE) return false;
  cache.put(bucket, String(count + 1), 120);
  return true;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Дата", "Имя", "Телефон", "Сфера", "Что болит"]);
  }
  return sheet;
}

function respond_(ok, error) {
  var body = ok ? { ok: true } : { ok: false, error: error };
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
