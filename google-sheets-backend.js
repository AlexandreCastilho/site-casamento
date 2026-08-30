function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Recados");
  
  if (!sheet) {
    sheet = ss.insertSheet("Recados");
    sheet.appendRow(["ID", "Data/Hora", "Nome do Convidado", "Mensagem / Recado", "Curtidas", "Status"]);
    sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#234635").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  var messages = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row && row[2]) {
      messages.push({
        id: String(row[0] || ("msg-" + i)),
        date: String(row[1] || ""),
        author: String(row[2]),
        text: String(row[3] || ""),
        likes: Number(row[4]) || 0,
        status: String(row[5] || "confirmed")
      });
    }
  }

  messages.reverse();

  return ContentService.createTextOutput(JSON.stringify(messages))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. AÇÃO: PEDIDO DE VAGA NA VAN DE SEGURANÇA
    if (payload.action === "van_request") {
      var sheetVan = ss.getSheetByName("Van_Seguranca");
      if (!sheetVan) {
        sheetVan = ss.insertSheet("Van_Seguranca");
        sheetVan.appendRow(["Data/Hora", "Nome do Convidado", "Precisa de Van?", "Bairro / Endereço em Manaus"]);
        sheetVan.getRange("A1:D1").setFontWeight("bold").setBackground("#B85D3B").setFontColor("#ffffff");
        sheetVan.setFrozenRows(1);
      }
      sheetVan.appendRow([
        payload.date || new Date().toLocaleString("pt-BR"),
        payload.name || "Convidado",
        payload.status || (payload.address ? "Sim (Vaga solicitada)" : "Não (Dispensou)"),
        payload.address || "Não informado / Transporte próprio"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true, type: "van" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. AÇÃO: CURTIR RECADO NO MURAL
    if (payload.action === "like") {
      var sheetRecados = ss.getSheetByName("Recados");
      if (sheetRecados) {
        var data = sheetRecados.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(payload.id)) {
            var currentLikes = Number(data[i][4]) || 0;
            var delta = payload.delta ? Number(payload.delta) : 1;
            sheetRecados.getRange(i + 1, 5).setValue(Math.max(0, currentLikes + delta));
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, type: "like" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. AÇÃO PADRÃO: NOVO RECADO / RSVP
    var sheetRecadosGeral = ss.getSheetByName("Recados");
    if (!sheetRecadosGeral) {
      sheetRecadosGeral = ss.insertSheet("Recados");
      sheetRecadosGeral.appendRow(["ID", "Data/Hora", "Nome do Convidado", "Mensagem / Recado", "Curtidas", "Status"]);
      sheetRecadosGeral.getRange("A1:F1").setFontWeight("bold").setBackground("#234635").setFontColor("#ffffff");
      sheetRecadosGeral.setFrozenRows(1);
    }

    var msgId = payload.id || ("msg-" + new Date().getTime());
    sheetRecadosGeral.appendRow([
      msgId,
      payload.date || new Date().toLocaleString("pt-BR"),
      payload.author || "Convidado",
      payload.text || "",
      Number(payload.likes) || 1,
      payload.status || "confirmed"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, id: msgId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
