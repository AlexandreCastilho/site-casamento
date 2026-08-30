/**
 * CASAMENTO ALEXANDRE & LARISSA - RSVP-MURAL.JS
 * Integração 100% direta com a Planilha Google (Google Sheets) em Tempo Real
 */

const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx0407WmbxsZZ5jGSg3ECMaH9xIzVz2eqPm0ctG-6yEFKS0HiG8KC_1RJ7iIbGwba6y/exec';

const STORAGE_KEY_MESSAGES = 'casamento_recados_alexandre_larissa';
const STORAGE_KEY_LIKES = 'casamento_recados_likes';
const STORAGE_KEY_VAN = 'casamento_van_requests';

// Lista Oficial de Convidados (Convidados.txt)
const OFFICIAL_GUESTS = [
  "Patrice Castilho",
  "Mariana Castilho",
  "Márcio Oliveira",
  "Emanuel Oliveira",
  "Carol Santos",
  "Lana Colares",
  "Reginaldo Colares",
  "Rodrigo Colares",
  "Rafael Colares",
  "Luana Amazonas",
  "Ruben Colares",
  "Gabriel Colares",
  "Rafaelly Colares",
  "Harvey Colares",
  "Luna Colares",
  "Liz Colares",
  "Frank Leite",
  "Rita Silva",
  "Edna Colares",
  "Kleber Colares",
  "Guiomar Colares",
  "Henrique Colares",
  "Felipe Colares",
  "Leodete Pantoja",
  "Laura Pantoja",
  "Kelly Linhares",
  "Joice Caster",
  "Cris",
  "Milie",
  "José Amilton Colares",
  "Maria Colares",
  "Jasmim Oliveira",
  "Israel Alves",
  "Laura Dias De Lima Souto",
  "Izidorio França",
  "Isabele França",
  "Alvaro Nascimento",
  "Ayesa Nascimento",
  "Olívia Moss",
  "Ewerton Moss",
  "Moisés Moss",
  "Camilly Moss",
  "Marcus Vinicius Menezes",
  "Vitória Rassy",
  "Leonardo Castilho",
  "Geovanna Pinheiro",
  "Lucivaldo Castilho",
  "Ana Lúcia Castilho",
  "Jocely Castilho",
  "Sirlene Castilho",
  "Letycia Brasil",
  "Renan Albuquerque",
  "Luciana Castilho",
  "Lucas Castilho",
  "Larissa Lima",
  "Afonso",
  "Rafaela",
  "Tânia",
  "Daniel",
  "Jeferson",
  "Karina",
  "Leda",
  "Manoel",
  "Luan",
  "Ruan",
  "Vera",
  "Vânia",
  "Heliomar",
  "Humberto",
  "Fabio",
  "Fabiola",
  "Adriana",
  "Lourdes",
  "Danielle",
  "Danilo",
  "Davi",
  "Julio",
  "Hanna",
  "Heitor",
  "Ayla Couto",
  "Isabella Litaiff",
  "Thiago Litaiff",
  "Jessica Hellen Lima",
  "Luana Beatriz",
  "Eduardo Dias",
  "Evelyn Campos",
  "Robeilton Gomes",
  "Maria Paula",
  "Samir Figueiredo",
  "Matheus Velho",
  "Luana Botinelly",
  "Gleuza Botinelly",
  "Luiz Botinelly",
  "Arthur Yves",
  "Letícia Nascimento",
  "Phillip da Letícia",
  "Helder Cruz",
  "Joyce Paixão",
  "Fábio Tomaselli",
  "Jefferson Paixão",
  "Anne Camila",
  "Caio Alves",
  "Avó da Larissa"
];

// Remover duplicatas e ordenar alfabeticamente
const UNIQUE_GUESTS = Array.from(new Set(OFFICIAL_GUESTS)).sort((a, b) => a.localeCompare(b, 'pt-BR'));

let lastConfirmedGuestName = '';
let currentMuralData = [];

document.addEventListener('DOMContentLoaded', () => {
  initMural();
  initGuestSearchAutocomplete();
  initRsvpForm();
  initVanModal();
});

/* ==========================================================================
   1. AUTOCOMPLETE / CAMPO DE PESQUISA DE CONVIDADOS
   ========================================================================== */
function initGuestSearchAutocomplete() {
  const input = document.getElementById('guestSearchInput');
  const dropdown = document.getElementById('guestDropdownList');
  const selectedHidden = document.getElementById('selectedGuestName');
  const errorMsg = document.getElementById('guestSearchError');

  if (!input || !dropdown || !selectedHidden) return;

  function filterGuests(query) {
    if (!query) {
      dropdown.classList.remove('show');
      return;
    }

    const cleanQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matches = UNIQUE_GUESTS.filter(guest => {
      const cleanGuest = guest.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return cleanGuest.includes(cleanQuery);
    });

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="guest-dropdown-empty">
          Nenhum convidado encontrado com "<strong>${escapeHtml(query)}</strong>".
        </div>
      `;
    } else {
      dropdown.innerHTML = matches.map(guest => `
        <div class="guest-dropdown-item" data-name="${escapeHtml(guest)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-green-primary); flex-shrink:0;">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>${escapeHtml(guest)}</span>
        </div>
      `).join('');
    }

    dropdown.classList.add('show');
  }

  input.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    selectedHidden.value = '';
    input.classList.remove('is-valid', 'is-invalid');
    if (errorMsg) errorMsg.style.display = 'none';
    filterGuests(val);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length > 0) {
      filterGuests(input.value.trim());
    }
  });

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.guest-dropdown-item');
    if (item) {
      const name = item.getAttribute('data-name');
      input.value = name;
      selectedHidden.value = name;
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      dropdown.classList.remove('show');
      if (errorMsg) errorMsg.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.guest-search-wrapper')) {
      dropdown.classList.remove('show');
    }
  });
}

/* ==========================================================================
   2. FORMULÁRIO DE RSVP E VALIDAÇÃO DA LISTA
   ========================================================================== */
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const input = document.getElementById('guestSearchInput');
  const selectedHidden = document.getElementById('selectedGuestName');
  const errorMsg = document.getElementById('guestSearchError');
  const messageInput = document.getElementById('rsvpMessage');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedName = selectedHidden.value.trim();
    const typedName = input.value.trim();

    // Validar se o nome está na lista oficial de convidados
    const validGuest = UNIQUE_GUESTS.find(g => 
      g.toLowerCase() === (selectedName || typedName).toLowerCase()
    );

    if (!validGuest) {
      if (errorMsg) {
        errorMsg.innerText = '⚠️ Por favor, selecione seu nome na lista oficial de convidados.';
        errorMsg.style.display = 'block';
      }
      input.classList.add('is-invalid');
      input.focus();
      return;
    }

    const messageText = messageInput.value.trim();
    lastConfirmedGuestName = validGuest;

    // Feedback no botão de envio
    const origBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando para a lista... ⏳';
    }

    if (messageText) {
      const now = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('pt-BR', options);

      const newMessage = {
        id: 'msg-' + Date.now(),
        author: validGuest,
        date: formattedDate,
        text: messageText,
        status: 'confirmed',
        likes: 1
      };

      // Adiciona na visualização local imediatamente
      currentMuralData.unshift(newMessage);
      renderMuralMessages(currentMuralData);

      // Envia diretamente para a Planilha Google
      await postToGoogleSheets(newMessage);

      // Atualiza após 800ms diretamente da planilha
      setTimeout(syncFromGoogleSheets, 800);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;
    }

    // Resetar formulário
    form.reset();
    selectedHidden.value = '';
    input.classList.remove('is-valid');
    if (errorMsg) errorMsg.style.display = 'none';

    // Abrir o Modal da Van de Segurança
    openVanModal(validGuest);
  });
}

/* ==========================================================================
   3. MODAL DA VAN DE SEGURANÇA PÓS-CONFIRMAÇÃO
   ========================================================================== */
function openVanModal(guestName) {
  const modal = document.getElementById('vanModal');
  const nameDisplay = document.getElementById('vanGuestNameDisplay');
  if (nameDisplay) nameDisplay.innerText = guestName;
  if (modal) modal.classList.add('active');
}

function initVanModal() {
  const modal = document.getElementById('vanModal');
  const form = document.getElementById('vanRequestForm');
  const dismissBtn = document.getElementById('vanDismissBtn');
  const addressInput = document.getElementById('vanAddressInput');

  if (!modal) return;

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      // Registrar na planilha que o convidado dispensou a van
      postToGoogleSheets({
        action: 'van_request',
        name: lastConfirmedGuestName,
        status: 'Não (Transporte Próprio / Uber)',
        address: 'Dispensou a van',
        date: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });

      modal.classList.remove('active');
      showSuccessToast(`Presença confirmada, ${lastConfirmedGuestName}! Seu recado está salvo. 🎉`);
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const address = addressInput.value.trim();
      if (!address) {
        alert('Por favor, informe seu bairro ou endereço.');
        return;
      }

      const formattedNow = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      // Salvar solicitação da van localmente
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_VAN) || '[]');
      existing.push({
        name: lastConfirmedGuestName,
        status: 'Sim (Vaga Solicitada)',
        address: address,
        date: formattedNow
      });
      localStorage.setItem(STORAGE_KEY_VAN, JSON.stringify(existing));

      // Sincronizar pedido da van na aba 'Van_Seguranca' do Google Sheets
      postToGoogleSheets({
        action: 'van_request',
        name: lastConfirmedGuestName,
        status: 'Sim (Vaga Solicitada)',
        address: address,
        date: formattedNow
      });

      modal.classList.remove('active');
      addressInput.value = '';
      showSuccessToast(`Vaga na van solicitada com sucesso para ${lastConfirmedGuestName}! 🚐🥂`);
    });
  }
}

function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.className = 'custom-toast-notification';
  toast.innerHTML = `
    <div style="font-size: 1.5rem;">✨</div>
    <div>${message}</div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

/* ==========================================================================
   4. MURAL DE RECADOS CONECTADO DIRETAMENTE AO GOOGLE SHEETS
   ========================================================================== */
function renderMuralMessages(messages) {
  const feed = document.getElementById('muralFeed');
  const countBadge = document.getElementById('muralCountBadge');
  if (!feed) return;

  const list = Array.isArray(messages) ? messages : [];
  const userLikes = JSON.parse(localStorage.getItem(STORAGE_KEY_LIKES) || '{}');

  if (countBadge) {
    countBadge.innerText = `${list.length} ${list.length === 1 ? 'recado' : 'recados'}`;
  }

  // Estado vazio quando ainda não houver recados na planilha
  if (list.length === 0) {
    feed.innerHTML = `
      <div style="text-align: center; padding: 45px 20px; background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px dashed var(--color-border-light);">
        <div style="font-size: 2.6rem; margin-bottom: 12px;">💌🌿</div>
        <h4 style="font-family: var(--font-serif-display); color: var(--color-green-dark); font-size: 1.3rem; margin-bottom: 6px;">
          Nenhum recado publicado ainda
        </h4>
        <p style="color: var(--color-text-muted); font-size: 0.92rem; line-height: 1.5; max-width: 320px; margin: 0 auto;">
          Seja o primeiro a confirmar sua presença e deixar uma mensagem de carinho para Alexandre &amp; Larissa!
        </p>
      </div>
    `;
    return;
  }

  feed.innerHTML = list.map(msg => {
    const isLiked = !!userLikes[msg.id];
    return `
      <div class="message-card" id="${msg.id}">
        <div class="message-card-header">
          <span class="message-author">${escapeHtml(msg.author)}</span>
          <span class="message-date">${escapeHtml(msg.date)}</span>
        </div>
        <p class="message-text">"${escapeHtml(msg.text)}"</p>
        <div class="message-card-footer">
          <span class="presence-status-pill status-confirmed">✓ Presença Confirmada</span>
          <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${msg.id}" aria-label="Curtir recado">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="like-count">${msg.likes || 0}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  feed.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msgId = btn.getAttribute('data-id');
      toggleLikeMessage(msgId);
    });
  });
}

function toggleLikeMessage(msgId) {
  const userLikes = JSON.parse(localStorage.getItem(STORAGE_KEY_LIKES) || '{}');
  const msg = currentMuralData.find(m => String(m.id) === String(msgId));
  if (!msg) return;

  const isLiked = !!userLikes[msgId];

  if (isLiked) {
    msg.likes = Math.max(0, (msg.likes || 1) - 1);
    delete userLikes[msgId];
  } else {
    msg.likes = (msg.likes || 0) + 1;
    userLikes[msgId] = true;
  }

  localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(userLikes));
  renderMuralMessages(currentMuralData);

  // Sincronizar curtida no Google Sheets
  postToGoogleSheets({
    action: 'like',
    id: msgId,
    delta: isLiked ? -1 : 1
  });
}

// Enviar dados para a Planilha Google (usando text/plain para evitar bloqueios de CORS do browser)
async function postToGoogleSheets(payload) {
  if (!GOOGLE_SHEETS_WEBAPP_URL) return;
  try {
    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Erro ao enviar para Google Sheets:', e);
  }
}

// Buscar dados mais recentes da Planilha Google (com cache-buster e diff inteligente)
async function syncFromGoogleSheets() {
  if (!GOOGLE_SHEETS_WEBAPP_URL) return;
  try {
    const urlWithCacheBuster = GOOGLE_SHEETS_WEBAPP_URL + (GOOGLE_SHEETS_WEBAPP_URL.includes('?') ? '&' : '?') + 't=' + Date.now();
    const res = await fetch(urlWithCacheBuster, {
      method: 'GET',
      cache: 'no-store'
    });

    if (res.ok) {
      const cloudMessages = await res.json();
      if (Array.isArray(cloudMessages)) {
        // Apenas re-renderiza o DOM se houver alteração real nos dados
        const isDifferent = JSON.stringify(cloudMessages) !== JSON.stringify(currentMuralData);
        if (isDifferent) {
          currentMuralData = cloudMessages;
          localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(cloudMessages));
          renderMuralMessages(currentMuralData);
        }
      }
    }
  } catch (err) {
    console.warn('Google Sheets offline/local fallback:', err);
  }
}

function initMural() {
  // Carrega do cache local primeiro para resposta visual instantânea
  const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (saved) {
    try {
      currentMuralData = JSON.parse(saved);
      renderMuralMessages(currentMuralData);
    } catch (e) {
      renderMuralMessages([]);
    }
  } else {
    renderMuralMessages([]);
  }

  // Busca imediatamente da Planilha Google na nuvem
  syncFromGoogleSheets();

  // Atualiza suavemente ao voltar para a aba ou a cada 30 segundos sem recarregar desnecessariamente
  window.addEventListener('focus', syncFromGoogleSheets);
  setInterval(syncFromGoogleSheets, 30000);
}

// Presentes
window.addRecadoFromGift = function(authorName, textContent, giftTitle) {
  const now = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = now.toLocaleDateString('pt-BR', options);

  const newMessage = {
    id: 'msg-' + Date.now(),
    author: authorName,
    date: formattedDate,
    text: `${textContent} (Presenteou: ${giftTitle} 🎁)`,
    status: 'confirmed',
    likes: 2
  };

  currentMuralData.unshift(newMessage);
  renderMuralMessages(currentMuralData);
  postToGoogleSheets(newMessage);
  setTimeout(syncFromGoogleSheets, 800);
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
