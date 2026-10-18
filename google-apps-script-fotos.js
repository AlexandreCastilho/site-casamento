/**
 * ==============================================================================
 * CASAMENTO ALEXANDRE & LARISSA - ÁLBUM DOS CONVIDADOS (GOOGLE APPS SCRIPT)
 * ==============================================================================
 *
 * Complemento do google-sheets-backend.js. Gerencia:
 * 1. Recebimento das fotos e vídeos enviados pela página fotos.html.
 * 2. Separação automática por horário em pastas do Google Drive:
 *    "Cerimônia" (até 18h), "Recepção" (18h às 20h) e "Festa" (depois das 20h).
 * 3. Aba "Fotos" na planilha com autor, desafio, curtidas e comentários.
 * 4. (Opcional) Cópia das fotos para álbuns do Google Fotos.
 *
 * INSTRUÇÕES:
 * 1. No editor do Apps Script da planilha, clique em "+" > "Script" e crie um
 *    arquivo chamado "Fotos". Cole este arquivo inteiro nele.
 * 2. Atualize também o google-sheets-backend.js (ele chama as funções daqui).
 * 3. Implante uma nova versão (Implantar > Gerenciar implantações > Editar > Nova versão).
 *    Na primeira execução o Google vai pedir permissão para acessar o Drive.
 * 4. No site, preencha PHOTOS_WEBAPP_URL em js/fotos.js com a mesma URL do Web App.
 * ==============================================================================
 */

var PHOTOS_ROOT_FOLDER_NAME = "Casamento Alexandre & Larissa - Fotos dos Convidados";
var PHOTOS_SHEET_NAME = "Fotos";
var PHOTOS_TIMEZONE = "America/Manaus";

var PHOTO_ALBUMS = {
  cerimonia: "Cerimônia",
  recepcao: "Recepção",
  festa: "Festa"
};

// Colunas da aba "Fotos"
var COL = {
  id: 0, uploadedAt: 1, author: 2, album: 3, challenge: 4, takenAt: 5,
  type: 6, fileId: 7, likes: 8, comments: 9, googlePhotos: 10
};

// -----------------------------------------------------------------------------
// Regras de álbum por horário (mesma regra do js/fotos.js)
// -----------------------------------------------------------------------------
function albumForTime(timestamp) {
  var hhmm = Utilities.formatDate(new Date(timestamp), PHOTOS_TIMEZONE, "HH:mm").split(":");
  var minutes = Number(hhmm[0]) * 60 + Number(hhmm[1]);
  if (minutes < 6 * 60) return "festa";
  if (minutes < 18 * 60) return "cerimonia";
  if (minutes < 20 * 60) return "recepcao";
  return "festa";
}

// Usa o horário da foto quando ele é plausível; se a foto for antiga
// (escolhida da galeria de outro dia), usa o horário do envio.
function resolveTakenAt(takenAt) {
  var now = Date.now();
  var t = Number(takenAt) || now;
  if (t > now + 5 * 60 * 1000 || now - t > 36 * 60 * 60 * 1000) return now;
  return t;
}

// -----------------------------------------------------------------------------
// Drive e planilha
// -----------------------------------------------------------------------------
function getOrCreateFolder(parent, name) {
  var it = parent ? parent.getFoldersByName(name) : DriveApp.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parent ? parent.createFolder(name) : DriveApp.createFolder(name);
}

function getAlbumFolder(albumId) {
  var root = getOrCreateFolder(null, PHOTOS_ROOT_FOLDER_NAME);
  return getOrCreateFolder(root, PHOTO_ALBUMS[albumId] || PHOTO_ALBUMS.festa);
}

function getOrCreateFotosSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(PHOTOS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PHOTOS_SHEET_NAME);
    sheet.appendRow(["ID", "Enviada em", "Autor", "Álbum", "Desafio", "Tirada em",
                     "Tipo", "Arquivo (Drive)", "Curtidas", "Comentários", "Google Fotos"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold");
  }
  return sheet;
}

function findPhotoRow(sheet, id) {
  var ids = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
  for (var i = 1; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 1;
  }
  return -1;
}

function rowToPhoto(row) {
  var fileId = String(row[COL.fileId]);
  var isVideo = row[COL.type] === "video";
  var comments = [];
  try { comments = JSON.parse(row[COL.comments] || "[]"); } catch (err) {}
  return {
    id: String(row[COL.id]),
    type: isVideo ? "video" : "image",
    author: String(row[COL.author]),
    album: String(row[COL.album]),
    challenge: String(row[COL.challenge] || ""),
    takenAt: Number(row[COL.takenAt]),
    likes: Number(row[COL.likes]) || 0,
    comments: comments,
    thumb: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w600",
    url: isVideo
      ? "https://drive.google.com/file/d/" + fileId + "/preview"
      : "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w2000"
  };
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// -----------------------------------------------------------------------------
// GET ?only=photos
// -----------------------------------------------------------------------------
function getPhotosResponse() {
  var sheet = getOrCreateFotosSheet();
  var data = sheet.getDataRange().getValues();
  var photos = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][COL.id] && data[i][COL.fileId]) photos.push(rowToPhoto(data[i]));
  }
  return jsonOut({ photos: photos });
}

// -----------------------------------------------------------------------------
// POST action: photo_upload | photo_like | photo_comment
// -----------------------------------------------------------------------------
function handlePhotoAction(payload) {
  var lock = LockService.getScriptLock();
  try {
    if (payload.action === "photo_upload") {
      // O arquivo vai para o Drive antes de travar a planilha
      var author = String(payload.author || "Convidado").substring(0, 40);
      var takenAt = resolveTakenAt(payload.takenAt);
      var album = albumForTime(takenAt);
      var isVideo = String(payload.mimeType || "").indexOf("video/") === 0;
      var id = "foto-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

      var stamp = Utilities.formatDate(new Date(takenAt), PHOTOS_TIMEZONE, "HH'h'mm");
      var ext = isVideo ? (String(payload.fileName || "").split(".").pop() || "mp4") : "jpg";
      var blob = Utilities.newBlob(
        Utilities.base64Decode(payload.data),
        payload.mimeType || "image/jpeg",
        stamp + " - " + author + "." + ext
      );
      var file = getAlbumFolder(album).createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      lock.waitLock(20000);
      var row = [id, new Date(), author, album, String(payload.challenge || ""), takenAt,
                 isVideo ? "video" : "image", file.getId(), 0, "[]", ""];
      getOrCreateFotosSheet().appendRow(row);
      return jsonOut({ success: true, photo: rowToPhoto(row) });
    }

    lock.waitLock(20000);
    var sheet = getOrCreateFotosSheet();
    var rowNum = findPhotoRow(sheet, payload.id);
    if (rowNum < 0) return jsonOut({ success: false, error: "Foto não encontrada" });

    if (payload.action === "photo_like") {
      var likesCell = sheet.getRange(rowNum, COL.likes + 1);
      var delta = Number(payload.delta) < 0 ? -1 : 1;
      likesCell.setValue(Math.max(0, (Number(likesCell.getValue()) || 0) + delta));
      return jsonOut({ success: true });
    }

    if (payload.action === "photo_comment") {
      var text = String(payload.text || "").trim().substring(0, 200);
      if (!text) return jsonOut({ success: false, error: "Comentário vazio" });
      var commentsCell = sheet.getRange(rowNum, COL.comments + 1);
      var comments = [];
      try { comments = JSON.parse(commentsCell.getValue() || "[]"); } catch (err) {}
      comments.push({ author: String(payload.author || "Convidado").substring(0, 40), text: text, at: Date.now() });
      commentsCell.setValue(JSON.stringify(comments));
      return jsonOut({ success: true });
    }

    return jsonOut({ success: false, error: "Ação desconhecida" });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// -----------------------------------------------------------------------------
// (OPCIONAL) CÓPIA PARA O GOOGLE FOTOS
// -----------------------------------------------------------------------------
// O Google só deixa um app adicionar fotos em álbuns criados pelo próprio app,
// então este script cria os álbuns "Casamento - Cerimônia", "Casamento - Recepção"
// e "Casamento - Festa" na conta dos noivos e copia as fotos para lá.
//
// Para ativar:
// 1. Vincule o Apps Script a um projeto do Google Cloud com a
//    "Photos Library API" ativada (Configurações do projeto > Projeto do GCP).
// 2. Em Configurações do projeto, marque "Mostrar appsscript.json" e adicione em
//    "oauthScopes":
//      "https://www.googleapis.com/auth/spreadsheets",
//      "https://www.googleapis.com/auth/drive",
//      "https://www.googleapis.com/auth/script.external_request",
//      "https://www.googleapis.com/auth/script.scriptapp",
//      "https://www.googleapis.com/auth/photoslibrary.appendonly"
// 3. Execute ativarSincronizacaoGoogleFotos uma vez pelo editor: ela pede a
//    autorização e liga a cópia automática a cada 10 minutos.
// -----------------------------------------------------------------------------
function getGooglePhotosAlbumId(albumId) {
  var props = PropertiesService.getScriptProperties();
  var key = "gphotos_album_" + albumId;
  var existing = props.getProperty(key);
  if (existing) return existing;

  var res = UrlFetchApp.fetch("https://photoslibrary.googleapis.com/v1/albums", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({ album: { title: "Casamento - " + PHOTO_ALBUMS[albumId] } })
  });
  var created = JSON.parse(res.getContentText());
  props.setProperty(key, created.id);
  return created.id;
}

function syncPhotosToGooglePhotos() {
  var sheet = getOrCreateFotosSheet();
  var data = sheet.getDataRange().getValues();
  var token = ScriptApp.getOAuthToken();
  var deadline = Date.now() + 4 * 60 * 1000; // limite de execução do Apps Script

  for (var i = 1; i < data.length && Date.now() < deadline; i++) {
    if (!data[i][COL.fileId] || data[i][COL.googlePhotos]) continue;

    var blob = DriveApp.getFileById(String(data[i][COL.fileId])).getBlob();
    var uploadToken = UrlFetchApp.fetch("https://photoslibrary.googleapis.com/v1/uploads", {
      method: "post",
      contentType: "application/octet-stream",
      headers: {
        Authorization: "Bearer " + token,
        "X-Goog-Upload-Content-Type": blob.getContentType(),
        "X-Goog-Upload-Protocol": "raw"
      },
      payload: blob.getBytes()
    }).getContentText();

    var description = data[i][COL.author] + (data[i][COL.challenge] ? " • Desafio: " + data[i][COL.challenge] : "");
    UrlFetchApp.fetch("https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate", {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + token },
      payload: JSON.stringify({
        albumId: getGooglePhotosAlbumId(String(data[i][COL.album])),
        newMediaItems: [{ description: description, simpleMediaItem: { uploadToken: uploadToken, fileName: blob.getName() } }]
      })
    });

    sheet.getRange(i + 1, COL.googlePhotos + 1).setValue("Enviada " + new Date().toLocaleString("pt-BR"));
  }
}

// Execute esta função UMA vez pelo editor (botão "Executar") para autorizar o
// Google Fotos e ligar a cópia automática a cada 10 minutos.
function ativarSincronizacaoGoogleFotos() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "syncPhotosToGooglePhotos") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("syncPhotosToGooglePhotos").timeBased().everyMinutes(10).create();
  syncPhotosToGooglePhotos();
}
