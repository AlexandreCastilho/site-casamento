/* ==========================================================================
   ÁLBUM DOS CONVIDADOS - ENVIO DE FOTOS, DESAFIOS, CURTIDAS E COMENTÁRIOS
   Página aberta pelo QR Code no dia do casamento (fotos.html).
   ========================================================================== */

// URL do Web App do Google Apps Script (o mesmo do RSVP/Mural).
// Enquanto estiver vazia, a página roda em MODO PRÉVIA: usa fotos de exemplo
// e guarda os envios apenas na memória do aparelho.
const PHOTOS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx0407WmbxsZZ5jGSg3ECMaH9xIzVz2eqPm0ctG-6yEFKS0HiG8KC_1RJ7iIbGwba6y/exec';

const STORAGE_KEY_NAME = 'casamento_album_nome';
const STORAGE_KEY_LIKED = 'casamento_album_curtidas';
const STORAGE_KEY_DEMO = 'casamento_album_demo_interacoes';

// Limites de envio (o Apps Script aceita no máximo ~50 MB por requisição)
const MAX_IMAGE_SIDE = 2048;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;

const ALBUMS = [
  { id: 'todas', label: 'Todas', hint: '' },
  { id: 'cerimonia', label: 'Cerimônia', hint: '15h – 18h' },
  { id: 'recepcao', label: 'Recepção', hint: '18h – 20h' },
  { id: 'festa', label: 'Festa', hint: '20h – 23h30' }
];

const CHALLENGES = [
  { id: 'beijo', emoji: '💋', title: 'Os noivos se beijando' },
  { id: 'desconhecido', emoji: '🤝', title: 'Foto com um desconhecido' },
  { id: 'drink', emoji: '🥂', title: 'Foto com uma bebida alcoólica' },
  { id: 'pista', emoji: '💃', title: 'Foto na pista de dança' },
  { id: 'decoracao', emoji: '🌿', title: 'Foto com a decoração' },
  { id: 'mesa', emoji: '🍽️', title: 'Foto com a sua mesa' }
];

const IS_DEMO = !PHOTOS_WEBAPP_URL;

let guestName = '';
let photos = [];
let activeAlbum = 'todas';
let pendingFiles = [];
let viewerPhotoId = null;
let likedIds = new Set();

// --------------------------------------------------------------------------
// Regras de álbum por horário (horário de Manaus)
// --------------------------------------------------------------------------
function manausMinutes(timestamp) {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Manaus',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date(timestamp));
  const h = Number(parts.find(p => p.type === 'hour').value) % 24;
  const m = Number(parts.find(p => p.type === 'minute').value);
  return h * 60 + m;
}

// Antes das 18h → Cerimônia; 18h–20h → Recepção; depois das 20h (e madrugada) → Festa
function albumForTime(timestamp) {
  const minutes = manausMinutes(timestamp);
  if (minutes < 6 * 60) return 'festa';
  if (minutes < 18 * 60) return 'cerimonia';
  if (minutes < 20 * 60) return 'recepcao';
  return 'festa';
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Manaus',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

function albumLabel(id) {
  const album = ALBUMS.find(a => a.id === id);
  return album ? album.label : '';
}

// Vídeos guardados no Google Drive tocam pelo player do próprio Drive
function isDriveEmbed(photo) {
  return String(photo.url).includes('drive.google.com/file/');
}

function challengeById(id) {
  return CHALLENGES.find(c => c.id === id);
}

// --------------------------------------------------------------------------
// Armazenamento local (nome, curtidas)
// --------------------------------------------------------------------------
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Não foi possível salvar no aparelho:', e);
  }
}

// --------------------------------------------------------------------------
// Dados de exemplo para o modo prévia
// --------------------------------------------------------------------------
function buildDemoPhotos() {
  const day = '2026-11-28T';
  const seed = [
    ['Fotos/polaroids/WhatsApp Image 2026-09-06 at 12.48.22.jpeg', 'Tia Rosa', '16:12', '', 12],
    ['Fotos/polaroids/WhatsApp Image 2026-09-06 at 12.48.22 (1).jpeg', 'Pedro', '16:40', 'beijo', 31],
    ['assets/photos/IMG_6870.jpg', 'Juliana', '17:05', 'decoracao', 9],
    ['Fotos/polaroids/WhatsApp Image 2026-09-06 at 12.48.22 (3).jpeg', 'Marcos', '18:20', 'drink', 14],
    ['Fotos/polaroids/WhatsApp Image 2026-09-06 at 12.50.06.jpeg', 'Camila', '18:47', 'mesa', 7],
    ['assets/photos/IMG_6833.jpg', 'Bruno', '19:15', '', 5],
    ['Fotos/polaroids/WhatsApp Image 2026-09-06 at 12.50.07.jpeg', 'Fernanda', '20:32', 'pista', 22],
    ['Fotos/polaroids/WhatsApp Image 2026-09-06 at 12.51.59 (2).jpeg', 'Lucas', '21:10', 'desconhecido', 18],
    ['assets/photos/IMG_6819.jpg', 'Beatriz', '22:03', 'pista', 11],
    ['Fotos/polaroids/WhatsApp Image 2026-09-06 at 12.48.22 (8).jpeg', 'Rafael', '23:15', '', 8]
  ];
  const sampleComments = {
    1: [{ author: 'Juliana', text: 'Que lindos!! 😍' }, { author: 'Marcos', text: 'Desafio cumprido com sucesso 😂' }],
    6: [{ author: 'Lucas', text: 'A pista tá pegando fogo 🔥' }],
    7: [{ author: 'Fernanda', text: 'Agora somos amigos de infância' }]
  };

  return seed.map(([url, author, time, challenge, likes], i) => {
    const takenAt = new Date(day + time + ':00-04:00').getTime();
    return {
      id: 'demo-' + i,
      url,
      thumb: url,
      type: 'image',
      author,
      takenAt,
      album: albumForTime(takenAt),
      challenge,
      likes,
      comments: (sampleComments[i] || []).map(c => ({ ...c, at: takenAt + 15 * 60 * 1000 }))
    };
  });
}

// Curtidas e comentários feitos no modo prévia ficam salvos no aparelho
function applyDemoInteractions(list) {
  const saved = readStorage(STORAGE_KEY_DEMO, {});
  return list.map(p => {
    const extra = saved[p.id];
    if (!extra) return p;
    return { ...p, likes: p.likes + (extra.likes || 0), comments: p.comments.concat(extra.comments || []) };
  });
}

function saveDemoInteraction(id, change) {
  const saved = readStorage(STORAGE_KEY_DEMO, {});
  const current = saved[id] || { likes: 0, comments: [] };
  if (change.likes) current.likes += change.likes;
  if (change.comment) current.comments.push(change.comment);
  saved[id] = current;
  writeStorage(STORAGE_KEY_DEMO, saved);
}

// --------------------------------------------------------------------------
// Comunicação com o Google Apps Script
// --------------------------------------------------------------------------
async function fetchPhotos() {
  if (IS_DEMO) {
    if (photos.length === 0) photos = applyDemoInteractions(buildDemoPhotos());
    return;
  }
  try {
    const res = await fetch(PHOTOS_WEBAPP_URL + '?only=photos&t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.photos)) photos = data.photos;
  } catch (e) {
    console.warn('Não foi possível carregar o álbum:', e);
  }
}

// text/plain evita o preflight de CORS do Apps Script
async function postAction(payload) {
  const res = await fetch(PHOTOS_WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// --------------------------------------------------------------------------
// Preparação dos arquivos (compressão de fotos, leitura em base64)
// --------------------------------------------------------------------------
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function compressImage(file) {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(img.src);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// --------------------------------------------------------------------------
// Renderização
// --------------------------------------------------------------------------
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderTabs() {
  const tabs = document.getElementById('albumTabs');
  tabs.innerHTML = ALBUMS.map(album => {
    const count = album.id === 'todas' ? photos.length : photos.filter(p => p.album === album.id).length;
    const active = album.id === activeAlbum;
    return `
      <button type="button" class="album-tab${active ? ' is-active' : ''}" role="tab" aria-selected="${active}" data-album="${album.id}">
        <span class="album-tab-label">${album.label} <em>${count}</em></span>
        ${album.hint ? `<span class="album-tab-hint">${album.hint}</span>` : ''}
      </button>`;
  }).join('');
}

function renderGrid() {
  const grid = document.getElementById('albumGrid');
  const visible = photos
    .filter(p => activeAlbum === 'todas' || p.album === activeAlbum)
    .sort((a, b) => b.takenAt - a.takenAt);

  document.getElementById('albumEmpty').hidden = visible.length > 0;

  grid.innerHTML = visible.map(p => {
    const challenge = challengeById(p.challenge);
    const media = p.type === 'video'
      ? (isDriveEmbed(p)
        ? `<img src="${p.thumb}" alt="Vídeo enviado por ${escapeHtml(p.author)}" loading="lazy" />`
        : `<video src="${p.url}" muted playsinline preload="metadata"></video>`) + '<span class="album-tile-play">▶</span>'
      : `<img src="${p.thumb || p.url}" alt="Foto enviada por ${escapeHtml(p.author)}" loading="lazy" />`;
    return `
      <button type="button" class="album-tile" data-id="${p.id}">
        ${media}
        ${challenge ? `<span class="album-tile-badge" title="${challenge.title}">${challenge.emoji}</span>` : ''}
        <span class="album-tile-overlay">
          <span>${escapeHtml(p.author)}</span>
          <span>${likedIds.has(p.id) ? '♥' : '♡'} ${p.likes}${p.comments.length ? ' · 💬 ' + p.comments.length : ''}</span>
        </span>
      </button>`;
  }).join('');
}

function myCompletedChallenges() {
  const done = new Set();
  photos.forEach(p => {
    if (p.challenge && guestName && p.author === guestName) done.add(p.challenge);
  });
  return done;
}

function renderChallenges() {
  const done = myCompletedChallenges();
  const list = document.getElementById('challengeList');
  list.innerHTML = CHALLENGES.map(c => {
    const total = photos.filter(p => p.challenge === c.id).length;
    const isDone = done.has(c.id);
    return `
      <button type="button" class="album-challenge${isDone ? ' is-done' : ''}" data-challenge="${c.id}">
        <span class="album-challenge-emoji">${c.emoji}</span>
        <span class="album-challenge-title">${c.title}</span>
        <span class="album-challenge-count">${isDone ? '✓ Cumprido' : total + (total === 1 ? ' foto' : ' fotos')}</span>
      </button>`;
  }).join('');
  document.getElementById('challengeProgress').textContent = `${done.size} de ${CHALLENGES.length}`;

  const select = document.getElementById('uploadChallengeSelect');
  select.innerHTML = '<option value="">Nenhum desafio</option>' +
    CHALLENGES.map(c => `<option value="${c.id}">${c.emoji} ${c.title}</option>`).join('');
}

function renderAll() {
  renderTabs();
  renderGrid();
  renderChallenges();
}

function showToast(message) {
  const toast = document.getElementById('albumToast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

// --------------------------------------------------------------------------
// Nome do convidado
// --------------------------------------------------------------------------
function applyGuestName() {
  const hasName = Boolean(guestName);
  document.getElementById('nameCard').hidden = hasName;
  document.getElementById('albumGreeting').hidden = !hasName;
  document.getElementById('albumGuestName').textContent = guestName;
}

function requireName() {
  if (guestName) return true;
  document.getElementById('nameCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('nameInput').focus();
  showToast('Antes, conta pra gente seu nome 😊');
  return false;
}

// --------------------------------------------------------------------------
// Envio
// --------------------------------------------------------------------------
function openUploadSheet(files, challengeId) {
  pendingFiles = Array.from(files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
  if (pendingFiles.length === 0) return;

  const tooBig = pendingFiles.filter(f => f.type.startsWith('video/') && f.size > MAX_VIDEO_BYTES);
  if (tooBig.length) {
    showToast('Vídeos precisam ter até 30 MB. Tente um vídeo mais curto.');
    pendingFiles = pendingFiles.filter(f => !tooBig.includes(f));
    if (pendingFiles.length === 0) return;
  }

  const previews = document.getElementById('uploadPreviews');
  previews.innerHTML = '';
  pendingFiles.forEach(file => {
    const url = URL.createObjectURL(file);
    const takenAt = file.lastModified || Date.now();
    const item = document.createElement('div');
    item.className = 'album-sheet-preview';
    item.innerHTML = (file.type.startsWith('video/')
      ? `<video src="${url}" muted playsinline></video>`
      : `<img src="${url}" alt="" />`) +
      `<span>${albumLabel(albumForTime(takenAt))} · ${formatTime(takenAt)}</span>`;
    previews.appendChild(item);
  });

  document.getElementById('uploadChallengeSelect').value = challengeId || '';
  document.getElementById('uploadStatus').textContent =
    pendingFiles.length === 1 ? '1 arquivo selecionado' : `${pendingFiles.length} arquivos selecionados`;
  document.getElementById('uploadProgress').hidden = true;
  document.getElementById('uploadConfirmBtn').disabled = false;
  document.getElementById('uploadSheet').hidden = false;
}

function closeUploadSheet() {
  document.getElementById('uploadSheet').hidden = true;
  document.getElementById('uploadPreviews').querySelectorAll('img, video').forEach(el => URL.revokeObjectURL(el.src));
  pendingFiles = [];
  document.getElementById('fileInputGallery').value = '';
  document.getElementById('fileInputCamera').value = '';
}

async function sendPendingFiles() {
  const challenge = document.getElementById('uploadChallengeSelect').value;
  const files = pendingFiles.slice();
  const bar = document.getElementById('uploadProgressBar');
  const status = document.getElementById('uploadStatus');
  document.getElementById('uploadProgress').hidden = false;
  document.getElementById('uploadConfirmBtn').disabled = true;

  let sent = 0;
  let failed = 0;
  for (const file of files) {
    status.textContent = `Enviando ${sent + failed + 1} de ${files.length}...`;
    const takenAt = file.lastModified || Date.now();
    const isVideo = file.type.startsWith('video/');
    try {
      if (IS_DEMO) {
        const url = URL.createObjectURL(file);
        photos.push({
          id: 'local-' + Date.now() + '-' + sent,
          url,
          thumb: url,
          type: isVideo ? 'video' : 'image',
          author: guestName,
          takenAt,
          album: albumForTime(takenAt),
          challenge,
          likes: 0,
          comments: []
        });
        await new Promise(r => setTimeout(r, 450));
      } else {
        const blob = isVideo ? file : await compressImage(file);
        const result = await postAction({
          action: 'photo_upload',
          author: guestName,
          challenge,
          takenAt,
          fileName: file.name,
          mimeType: isVideo ? file.type : 'image/jpeg',
          data: await blobToBase64(blob)
        });
        if (!result || !result.success) throw new Error(result && result.error);
        if (result.photo) photos.push(result.photo);
      }
      sent++;
    } catch (e) {
      console.warn('Falha ao enviar', file.name, e);
      failed++;
    }
    bar.style.width = Math.round(((sent + failed) / files.length) * 100) + '%';
  }

  closeUploadSheet();
  renderAll();
  if (failed) {
    showToast(`${sent} enviado(s), ${failed} com erro. Tente de novo os que faltaram.`);
  } else {
    const done = challengeById(challenge);
    showToast(done ? `Desafio "${done.title}" cumprido! 🎉` : 'Pronto! Suas fotos já estão no álbum 💚');
  }
}

// --------------------------------------------------------------------------
// Visualizador, curtidas e comentários
// --------------------------------------------------------------------------
function openViewer(id) {
  const photo = photos.find(p => p.id === id);
  if (!photo) return;
  viewerPhotoId = id;

  const media = document.getElementById('viewerMedia');
  media.innerHTML = photo.type === 'video'
    ? (isDriveEmbed(photo)
      ? `<iframe src="${photo.url}" allow="autoplay" allowfullscreen></iframe>`
      : `<video src="${photo.url}" controls autoplay playsinline></video>`)
    : `<img src="${photo.url}" alt="Foto enviada por ${escapeHtml(photo.author)}" />`;

  document.getElementById('viewerAuthor').textContent = photo.author;
  document.getElementById('viewerInfo').textContent = `${albumLabel(photo.album)} · ${formatTime(photo.takenAt)}`;

  const challenge = challengeById(photo.challenge);
  const challengeEl = document.getElementById('viewerChallenge');
  challengeEl.hidden = !challenge;
  if (challenge) challengeEl.textContent = `${challenge.emoji} Desafio: ${challenge.title}`;

  renderViewerSocial(photo);
  document.getElementById('photoViewer').hidden = false;
  document.body.style.overflow = 'hidden';
}

function renderViewerSocial(photo) {
  const liked = likedIds.has(photo.id);
  const likeBtn = document.getElementById('viewerLikeBtn');
  likeBtn.classList.toggle('is-liked', liked);
  likeBtn.setAttribute('aria-pressed', String(liked));
  likeBtn.querySelector('.album-like-heart').textContent = liked ? '♥' : '♡';
  document.getElementById('viewerLikeCount').textContent = photo.likes;

  const comments = document.getElementById('viewerComments');
  comments.innerHTML = photo.comments.length
    ? photo.comments.map(c => `<p><strong>${escapeHtml(c.author)}</strong> ${escapeHtml(c.text)}</p>`).join('')
    : '<p class="album-comments-empty">Seja o primeiro a comentar.</p>';
  comments.scrollTop = comments.scrollHeight;
}

function closeViewer() {
  document.getElementById('photoViewer').hidden = true;
  document.getElementById('viewerMedia').innerHTML = '';
  document.body.style.overflow = '';
  viewerPhotoId = null;
  renderGrid();
}

function toggleLike() {
  const photo = photos.find(p => p.id === viewerPhotoId);
  if (!photo) return;
  const delta = likedIds.has(photo.id) ? -1 : 1;
  if (delta > 0) likedIds.add(photo.id); else likedIds.delete(photo.id);
  photo.likes = Math.max(0, photo.likes + delta);
  writeStorage(STORAGE_KEY_LIKED, Array.from(likedIds));
  renderViewerSocial(photo);

  if (IS_DEMO) {
    if (photo.id.startsWith('demo-')) saveDemoInteraction(photo.id, { likes: delta });
  } else {
    postAction({ action: 'photo_like', id: photo.id, delta }).catch(e => console.warn(e));
  }
}

function addComment(text) {
  const photo = photos.find(p => p.id === viewerPhotoId);
  if (!photo || !text) return;
  const comment = { author: guestName, text, at: Date.now() };
  photo.comments.push(comment);
  renderViewerSocial(photo);

  if (IS_DEMO) {
    if (photo.id.startsWith('demo-')) saveDemoInteraction(photo.id, { comment });
  } else {
    postAction({ action: 'photo_comment', id: photo.id, author: guestName, text }).catch(e => console.warn(e));
  }
}

// --------------------------------------------------------------------------
// Inicialização
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  guestName = readStorage(STORAGE_KEY_NAME, '');
  likedIds = new Set(readStorage(STORAGE_KEY_LIKED, []));
  document.getElementById('demoBanner').hidden = !IS_DEMO;
  applyGuestName();

  document.getElementById('nameForm').addEventListener('submit', e => {
    e.preventDefault();
    const value = document.getElementById('nameInput').value.trim();
    if (!value) return;
    guestName = value;
    writeStorage(STORAGE_KEY_NAME, guestName);
    applyGuestName();
    renderChallenges();
    showToast(`Bem-vindo(a), ${guestName}! 💚`);
  });

  document.getElementById('changeNameBtn').addEventListener('click', () => {
    guestName = '';
    writeStorage(STORAGE_KEY_NAME, '');
    applyGuestName();
    document.getElementById('nameInput').focus();
  });

  // Bloqueia o seletor de arquivos até o convidado dizer o nome
  document.querySelectorAll('.album-upload-main, .album-upload-camera').forEach(label => {
    label.addEventListener('click', e => {
      if (!requireName()) e.preventDefault();
    });
  });

  ['fileInputGallery', 'fileInputCamera'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('change', () => {
      openUploadSheet(input.files, input.dataset.challenge);
      delete input.dataset.challenge;
    });
  });

  document.getElementById('challengeList').addEventListener('click', e => {
    const btn = e.target.closest('[data-challenge]');
    if (!btn || !requireName()) return;
    const input = document.getElementById('fileInputGallery');
    input.dataset.challenge = btn.dataset.challenge;
    input.click();
  });

  document.getElementById('uploadConfirmBtn').addEventListener('click', sendPendingFiles);
  document.getElementById('uploadCancelBtn').addEventListener('click', closeUploadSheet);
  document.getElementById('uploadSheet').addEventListener('click', e => {
    if (e.target.id === 'uploadSheet') closeUploadSheet();
  });

  document.getElementById('albumTabs').addEventListener('click', e => {
    const tab = e.target.closest('[data-album]');
    if (!tab) return;
    activeAlbum = tab.dataset.album;
    renderTabs();
    renderGrid();
  });

  document.getElementById('albumGrid').addEventListener('click', e => {
    const tile = e.target.closest('[data-id]');
    if (tile) openViewer(tile.dataset.id);
  });

  document.getElementById('viewerCloseBtn').addEventListener('click', closeViewer);
  document.getElementById('viewerLikeBtn').addEventListener('click', toggleLike);
  document.getElementById('viewerMedia').addEventListener('dblclick', () => {
    if (!likedIds.has(viewerPhotoId)) toggleLike();
  });
  document.getElementById('commentForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!requireName()) { closeViewer(); return; }
    const input = document.getElementById('commentInput');
    addComment(input.value.trim());
    input.value = '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && viewerPhotoId) closeViewer();
  });

  await fetchPhotos();
  renderAll();

  // Atualiza o álbum periodicamente para mostrar as fotos dos outros convidados
  if (!IS_DEMO) {
    setInterval(async () => {
      if (viewerPhotoId || !document.getElementById('uploadSheet').hidden) return;
      await fetchPhotos();
      renderAll();
    }, 30000);
  }
});
