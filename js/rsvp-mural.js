/**
 * CASAMENTO ALEXANDRE & LARISSA - RSVP-MURAL.JS
 * Confirmação de Presença com Lista Oficial de Convidados, Modal da Van de Segurança e Mural de Recados
 */

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
  "Beatriz Dantas",
  "Marcus Vinicius Menezes",
  "Daniel Magalhães",
  "Ana Claudia Romero",
  "Eloise Silva",
  "Hermes Pontes Lima Jr",
  "Letycia Brasil",
  "Maitê Filó",
  "Magnum Pereira",
  "Yuji Yano",
  "Victor Chaves",
  "Gabriela Saline",
  "Joyce Montefusco",
  "Max Oliveira",
  "Andrezza Uchôa",
  "Larissa Freire",
  "Madchen Marques",
  "Paulo Victor Calderaro",
  "Luana Vicente",
  "Letícia Figueiredo",
  "Marcelo Hermido",
  "Samuel Jansley",
  "Naide Albuquerque",
  "Ioha",
  "Andreza Libório",
  "Brenda Gomes",
  "Emily Brito",
  "Thalita Soares",
  "Matheus Queiroz",
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

// Mensagens iniciais carinhosas
const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    author: 'Mariana & Thiago Litaiff',
    date: '12 de Agosto, 2026',
    text: 'Amigos queridos! Que honra e felicidade imensa testemunhar esse amor tão puro. Já estamos contando os dias para esse 28 de novembro na Chácara Monte Rey! Alexandre com bônus de carisma e Larissa bailando toada!',
    status: 'confirmed',
    likes: 18
  },
  {
    id: 'msg-2',
    author: 'Patrice Castilho',
    date: '10 de Agosto, 2026',
    text: 'Ver vocês dois juntos é uma inspiração. Que Deus continue abençoando cada passo dessa família linda que se forma. Estaremos lá firmes e fortes para comemorar!',
    status: 'confirmed',
    likes: 14
  },
  {
    id: 'msg-3',
    author: 'Marcus Vinicius Menezes',
    date: '08 de Agosto, 2026',
    text: 'Irmão Alexandre! Parece que foi ontem que você calculava viga no papel e falava da Larissa com brilho nos olhos. O casamento vai ser épico! Já separei a beca esporte fino!',
    status: 'confirmed',
    likes: 21
  },
  {
    id: 'msg-4',
    author: 'Letycia Brasil',
    date: '05 de Agosto, 2026',
    text: 'Larissa, você vai ser a noiva mais deslumbrante desse Amazonas! Estou tão emocionada por vocês dois. Viva Alexandre e Larissa!',
    status: 'confirmed',
    likes: 16
  }
];

let lastConfirmedGuestName = '';

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

  if (!input || !dropdown) return;

  function renderDropdown(items) {
    if (items.length === 0) {
      dropdown.innerHTML = `<div class="guest-dropdown-empty">Nenhum convidado encontrado. Verifique a grafia.</div>`;
      dropdown.classList.add('show');
      return;
    }

    dropdown.innerHTML = items.map(name => `
      <div class="guest-dropdown-item" data-name="${escapeHtml(name)}">
        <span class="guest-icon">👤</span>
        <span class="guest-name-text">${escapeHtml(name)}</span>
      </div>
    `).join('');

    dropdown.classList.add('show');

    dropdown.querySelectorAll('.guest-dropdown-item').forEach(el => {
      el.addEventListener('click', () => {
        const selected = el.getAttribute('data-name');
        input.value = selected;
        selectedHidden.value = selected;
        dropdown.classList.remove('show');
        if (errorMsg) errorMsg.style.display = 'none';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      });
    });
  }

  input.addEventListener('focus', () => {
    const val = input.value.trim().toLowerCase();
    const matches = val 
      ? UNIQUE_GUESTS.filter(g => g.toLowerCase().includes(val))
      : UNIQUE_GUESTS;
    renderDropdown(matches);
  });

  input.addEventListener('input', () => {
    selectedHidden.value = '';
    input.classList.remove('is-valid');
    const val = input.value.trim().toLowerCase();
    
    // Verificar se digitou exatamente igual a um dos nomes
    const exactMatch = UNIQUE_GUESTS.find(g => g.toLowerCase() === val);
    if (exactMatch) {
      selectedHidden.value = exactMatch;
      input.classList.add('is-valid');
      if (errorMsg) errorMsg.style.display = 'none';
    }

    const matches = UNIQUE_GUESTS.filter(g => g.toLowerCase().includes(val));
    renderDropdown(matches);
  });

  // Fechar dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
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

  if (!form) return;

  form.addEventListener('submit', (e) => {
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

    // Salvar recado no mural se preenchido
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
        likes: 1,
        isNew: true
      };

      const messages = getStoredMessages();
      messages.unshift(newMessage);
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
      renderMuralMessages();
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
      modal.classList.remove('active');
      showSuccessToast(`Presença confirmada, ${lastConfirmedGuestName}! Seu recado está no mural. 🎉`);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const address = addressInput.value.trim();
      if (!address) {
        alert('Por favor, informe seu bairro ou endereço.');
        return;
      }

      // Salvar solicitação da van
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_VAN) || '[]');
      existing.push({
        name: lastConfirmedGuestName,
        address: address,
        date: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEY_VAN, JSON.stringify(existing));

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
   4. MURAL DE RECADOS E LIKES
   ========================================================================== */
function getStoredMessages() {
  const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_MESSAGES;
  }
}

function getStoredLikes() {
  const saved = localStorage.getItem(STORAGE_KEY_LIKES);
  if (!saved) return {};
  try {
    return JSON.parse(saved);
  } catch (e) {
    return {};
  }
}

function renderMuralMessages() {
  const feed = document.getElementById('muralFeed');
  const countBadge = document.getElementById('muralCountBadge');
  if (!feed) return;

  const messages = getStoredMessages();
  const userLikes = getStoredLikes();

  if (countBadge) {
    countBadge.innerText = `${messages.length} recados`;
  }

  feed.innerHTML = messages.map(msg => {
    const isLiked = !!userLikes[msg.id];
    return `
      <div class="message-card ${msg.isNew ? 'new-msg' : ''}" id="${msg.id}">
        <div class="message-card-header">
          <span class="message-author">${escapeHtml(msg.author)}</span>
          <span class="message-date">${msg.date}</span>
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
  const messages = getStoredMessages();
  const userLikes = getStoredLikes();
  const msg = messages.find(m => m.id === msgId);
  if (!msg) return;

  if (userLikes[msgId]) {
    msg.likes = Math.max(0, (msg.likes || 1) - 1);
    delete userLikes[msgId];
  } else {
    msg.likes = (msg.likes || 0) + 1;
    userLikes[msgId] = true;
  }

  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(userLikes));
  renderMuralMessages();
}

function initMural() {
  renderMuralMessages();
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
    likes: 2,
    isNew: true
  };

  const messages = getStoredMessages();
  messages.unshift(newMessage);
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  renderMuralMessages();
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
