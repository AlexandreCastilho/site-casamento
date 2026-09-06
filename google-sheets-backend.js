/**
 * ==============================================================================
 * CASAMENTO ALEXANDRE & LARISSA - GOOGLE APPS SCRIPT BACKEND (V2 - ABA ÚNICA)
 * ==============================================================================
 * 
 * Este script gerencia:
 * 1. Aba "Convidados": Lista unificada com todos os convidados, status de presença (RSVP),
 *    transporte de Van, endereço em Manaus, data da resposta e último recado.
 * 2. Aba "Recados": Armazena todas as mensagens públicas e curtidas do Mural.
 * 
 * INSTRUÇÕES PARA ATUALIZAR NA SUA PLANILHA:
 * 1. Abra a planilha "Casamento Alexandre e Larissa" no Google Sheets.
 * 2. No menu superior, clique em: Extensões > Apps Script.
 * 3. Substitua TODO o código existente por este arquivo completo.
 * 4. Clique em Salvar (ícone de disquete).
 * 5. Clique em: "Implantar" (canto superior direito) > "Gerenciar implantações".
 * 6. Clique no ícone de lápis (Editar) na implantação ativa.
 * 7. Em "Versão", selecione: "Nova versão" (e clique em Salvar/Implantar).
 * Pronto! A aba "Convidados" será inicializada e sincronizada automaticamente.
 * ==============================================================================
 */

// Lista inicial para pré-popular a aba "Convidados" caso ela ainda não exista
var INITIAL_GUESTS = [
  "Adriana",
  "Afonso",
  "Alvaro Nascimento",
  "Ana Claudia Romero",
  "Ana Lúcia Castilho",
  "Andreza Libório",
  "Andrezza Uchôa",
  "Anne Camila",
  "Arthur Yves",
  "Avó da Larissa",
  "Ayesa Nascimento",
  "Ayla Couto",
  "Beatriz Dantas",
  "Brenda Gomes",
  "Caio Alves",
  "Camilly Moss",
  "Carol Santos",
  "Cris",
  "Daniel",
  "Daniel Magalhães",
  "Danielle",
  "Danilo",
  "Davi",
  "Edna Colares",
  "Eduardo Dias",
  "Eloise Silva",
  "Emanuel Oliveira",
  "Emily Brito",
  "Evelyn Campos",
  "Ewerton Moss",
  "Fabio",
  "Fábio Tomaselli",
  "Fabiola",
  "Felipe Colares",
  "Frank Leite",
  "Gabriel Colares",
  "Gabriela Saline",
  "Geovanna Pinheiro",
  "Gleuza Botinelly",
  "Guiomar Colares",
  "Hanna",
  "Harvey Colares",
  "Heitor",
  "Helder Cruz",
  "Heliomar",
  "Henrique Colares",
  "Hermes Pontes Lima Jr",
  "Humberto",
  "Ioha",
  "Isabele França",
  "Isabella Litaiff",
  "Israel Alves",
  "Izidorio França",
  "Jasmim Oliveira",
  "Jeferson",
  "Jefferson Paixão",
  "Jessica Hellen Lima",
  "Jocely Castilho",
  "Joice Caster",
  "José Amilton Colares",
  "Joyce Montefusco",
  "Joyce Paixão",
  "Julio",
  "Karina",
  "Kelly Linhares",
  "Kleber Colares",
  "Lana Colares",
  "Larissa Freire",
  "Larissa Lima",
  "Laura Dias De Lima Souto",
  "Laura Pantoja",
  "Leda",
  "Leodete Pantoja",
  "Leonardo Castilho",
  "Letícia Figueiredo",
  "Letícia Nascimento",
  "Letycia Brasil",
  "Liz Colares",
  "Lourdes",
  "Luan",
  "Luana Amazonas",
  "Luana Beatriz",
  "Luana Botinelly",
  "Luana Vicente",
  "Lucas Castilho",
  "Luciana Castilho",
  "Lucivaldo Castilho",
  "Luiz Botinelly",
  "Luna Colares",
  "Madchen Marques",
  "Magnum Pereira",
  "Maitê Filó",
  "Manoel",
  "Marcelo Hermido",
  "Márcio Oliveira",
  "Marcus Vinicius Menezes",
  "Maria Colares",
  "Maria Paula",
  "Mariana Castilho",
  "Matheus Queiroz",
  "Matheus Velho",
  "Max Oliveira",
  "Milie",
  "Moisés Moss",
  "Naide Albuquerque",
  "Olívia Moss",
  "Patrice Castilho",
  "Paulo Victor Calderaro",
  "Phillip da Letícia",
  "Rafael Colares",
  "Rafaela",
  "Rafaelly Colares",
  "Reginaldo Colares",
  "Renan Albuquerque",
  "Rita Silva",
  "Robeilton Gomes",
  "Rodrigo Colares",
  "Ruan",
  "Ruben Colares",
  "Samir Figueiredo",
  "Samuel Jansley",
  "Sirlene Castilho",
  "Tânia",
  "Thalita Soares",
  "Thiago Litaiff",
  "Vânia",
  "Vera",
  "Victor Chaves",
  "Vitória Rassy",
  "Yuji Yano"
];

// Utilitário para limpar e comparar nomes ignorando acentos, maiúsculas e espaços extras
function cleanGuestName(str) {
  return String(str || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// Obtém ou cria a aba "Convidados" com formatação completa
function getOrCreateConvidadosSheet(ss) {
  var sheet = ss.getSheetByName("Convidados");
  if (!sheet) {
    sheet = ss.insertSheet("Convidados");
    
    // Cabeçalhos
    var headers = [
      "Nome do Convidado",
      "Presença (RSVP)",
      "Precisa de Van?",
      "Bairro / Endereço em Manaus",
      "Data/Hora da Resposta",
      "Último Recado / Mensagem"
    ];
    sheet.appendRow(headers);
    
    // Estilização do cabeçalho
    var headerRange = sheet.getRange("A1:F1");
    headerRange.setFontWeight("bold")
               .setBackground("#234635")
               .setFontColor("#ffffff")
               .setHorizontalAlignment("center");
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);
    
    // Configura larguras de coluna
    sheet.setColumnWidth(1, 220); // Nome
    sheet.setColumnWidth(2, 140); // Presença
    sheet.setColumnWidth(3, 150); // Van
    sheet.setColumnWidth(4, 260); // Endereço
    sheet.setColumnWidth(5, 170); // Data
    sheet.setColumnWidth(6, 320); // Recado
    
    // Carga inicial dos nomes com status Pendente
    var initialRows = [];
    for (var i = 0; i < INITIAL_GUESTS.length; i++) {
      initialRows.push([
        INITIAL_GUESTS[i],
        "Pendente",
        "Pendente",
        "",
        "",
        ""
      ]);
    }
    
    if (initialRows.length > 0) {
      sheet.getRange(2, 1, initialRows.length, 6).setValues(initialRows);
    }
  }
  return sheet;
}

// Retorna a lista de nomes da coluna A da aba "Convidados"
function getGuestsList(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var guests = [];
  
  for (var i = 0; i < values.length; i++) {
    var name = String(values[i][0] || "").trim();
    if (name) {
      guests.push(name);
    }
  }
  
  return guests;
}

// Localiza a linha de um convidado na aba "Convidados" (1-indexed)
function findGuestRow(sheet, guestName) {
  var cleanTarget = cleanGuestName(guestName);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  
  var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (cleanGuestName(values[i][0]) === cleanTarget) {
      return i + 2; // +2 porque o range começa na linha 2
    }
  }
  return -1;
}

// Obtém ou cria a aba "Recados"
function getOrCreateRecadosSheet(ss) {
  var sheet = ss.getSheetByName("Recados");
  if (!sheet) {
    sheet = ss.insertSheet("Recados");
    sheet.appendRow(["ID", "Data/Hora", "Nome do Convidado", "Mensagem / Recado", "Curtidas", "Status"]);
    sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#234635").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// -----------------------------------------------------------------------------
// GET: Retorna os dados em tempo real para o site
// -----------------------------------------------------------------------------
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Obter lista de convidados da aba "Convidados"
  var sheetConvidados = getOrCreateConvidadosSheet(ss);
  var guests = getGuestsList(sheetConvidados);
  
  // 2. Obter mensagens da aba "Recados"
  var sheetRecados = getOrCreateRecadosSheet(ss);
  var data = sheetRecados.getDataRange().getValues();
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
  
  // Suporte a filtro opcional por parâmetro
  if (e && e.parameter && e.parameter.only === "guests") {
    return ContentService.createTextOutput(JSON.stringify(guests))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && e.parameter.only === "messages") {
    return ContentService.createTextOutput(JSON.stringify(messages))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Retorno unificado padrão
  var payload = {
    guests: guests,
    messages: messages
  };
  
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// -----------------------------------------------------------------------------
// POST: Recebe confirmações, pedidos de van, recados e curtidas
// -----------------------------------------------------------------------------
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetConvidados = getOrCreateConvidadosSheet(ss);
    var nowStr = payload.date || new Date().toLocaleString("pt-BR");
    
    // ---------------------------------------------------------
    // 1. SOLICITAÇÃO OU DISPENSA DA VAN
    // ---------------------------------------------------------
    if (payload.action === "van_request") {
      var guestName = payload.name || "Convidado";
      var rowIndex = findGuestRow(sheetConvidados, guestName);
      var vanStatus = payload.status || (payload.address ? "Sim (Vaga Solicitada)" : "Não (Transporte Próprio)");
      var vanAddress = payload.address || "Não informado";
      
      if (rowIndex !== -1) {
        // Atualiza a linha existente do convidado
        sheetConvidados.getRange(rowIndex, 3).setValue(vanStatus);  // Coluna C: Van
        sheetConvidados.getRange(rowIndex, 4).setValue(vanAddress); // Coluna D: Endereço
        sheetConvidados.getRange(rowIndex, 5).setValue(nowStr);     // Coluna E: Data
      } else {
        // Adiciona nova linha caso o convidado não estivesse na lista
        sheetConvidados.appendRow([
          guestName,
          "Pendente",
          vanStatus,
          vanAddress,
          nowStr,
          ""
        ]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, type: "van" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ---------------------------------------------------------
    // 2. CURTIDA NO MURAL DE RECADOS
    // ---------------------------------------------------------
    if (payload.action === "like") {
      var sheetRecados = getOrCreateRecadosSheet(ss);
      var data = sheetRecados.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(payload.id)) {
          var currentLikes = Number(data[i][4]) || 0;
          var delta = payload.delta ? Number(payload.delta) : 1;
          sheetRecados.getRange(i + 1, 5).setValue(Math.max(0, currentLikes + delta));
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, type: "like" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ---------------------------------------------------------
    // 3. RECUSA DE PRESENÇA (NÃO PODERÁ COMPARECER)
    // ---------------------------------------------------------
    if (payload.action === "rsvp_declined") {
      var guestNameDecline = payload.author || payload.name || "Convidado";
      var rowDecline = findGuestRow(sheetConvidados, guestNameDecline);
      var msgTextDecline = payload.text || "";
      
      if (rowDecline !== -1) {
        sheetConvidados.getRange(rowDecline, 2).setValue("Não comparecerá"); // Coluna B: Presença
        sheetConvidados.getRange(rowDecline, 3).setValue("Não");             // Coluna C: Van
        sheetConvidados.getRange(rowDecline, 5).setValue(nowStr);            // Coluna E: Data
        if (msgTextDecline) {
          sheetConvidados.getRange(rowDecline, 6).setValue(msgTextDecline);  // Coluna F: Recado
        }
      } else {
        sheetConvidados.appendRow([
          guestNameDecline,
          "Não comparecerá",
          "Não",
          "",
          nowStr,
          msgTextDecline
        ]);
      }
      
      // Registra também na aba de Recados
      var sheetRecadosDecline = getOrCreateRecadosSheet(ss);
      var msgIdDecline = payload.id || ("msg-" + new Date().getTime());
      sheetRecadosDecline.appendRow([
        msgIdDecline,
        nowStr,
        guestNameDecline,
        msgTextDecline || "Não poderei comparecer, mas envio meus melhores votos e muito amor ao casal!",
        1,
        "declined"
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, type: "rsvp_declined" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ---------------------------------------------------------
    // 4. CONFIRMAÇÃO DE PRESENÇA (RSVP PADRÃO OU COM RECADO)
    // ---------------------------------------------------------
    var guestNameConfirm = payload.author || payload.name || "Convidado";
    var rowConfirm = findGuestRow(sheetConvidados, guestNameConfirm);
    var msgTextConfirm = payload.text || "";
    
    if (rowConfirm !== -1) {
      sheetConvidados.getRange(rowConfirm, 2).setValue("Confirmado"); // Coluna B: Presença
      sheetConvidados.getRange(rowConfirm, 5).setValue(nowStr);       // Coluna E: Data
      if (msgTextConfirm) {
        sheetConvidados.getRange(rowConfirm, 6).setValue(msgTextConfirm); // Coluna F: Recado
      }
    } else {
      sheetConvidados.appendRow([
        guestNameConfirm,
        "Confirmado",
        "Pendente",
        "",
        nowStr,
        msgTextConfirm
      ]);
    }
    
    // Registra na aba Recados para alimentar o mural público
    var sheetRecadosGeral = getOrCreateRecadosSheet(ss);
    var msgId = payload.id || ("msg-" + new Date().getTime());
    sheetRecadosGeral.appendRow([
      msgId,
      nowStr,
      guestNameConfirm,
      msgTextConfirm || "Presença confirmada com muita alegria! Mal posso esperar pelo grande dia! 🥂✨",
      Number(payload.likes) || 1,
      payload.status || "confirmed"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, id: msgId, type: "rsvp_confirm" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
