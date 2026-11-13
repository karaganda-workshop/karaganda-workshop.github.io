/**
 * Семинар «Бизнес в современных условиях».
 * Если лист уже создан со старыми колонками, скрипт дописывает
 * сферу и ответ в колонку «Мероприятие» через поле event.
 * После обновления кода: Развернуть → Управление развёртываниями →
 * карандаш → новая версия. Доступ: Все.
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Заявки");
    if (!sheet) {
      sheet = ss.insertSheet("Заявки");
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Дата", "Имя", "Телефон", "Сфера", "Что болит"]);
    }
    var data = JSON.parse(e.postData.contents);
    var header = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].join("|");
    if (header.indexOf("Сфера") !== -1) {
      sheet.appendRow([
        new Date(),
        data.name || "",
        data.phone || "",
        data.sphere || "",
        data.pain || "",
      ]);
    } else {
      sheet.appendRow([
        new Date(),
        data.name || "",
        data.age || "",
        data.phone || "",
        data.event || "",
      ]);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
