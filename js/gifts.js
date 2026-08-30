/**
 * CASAMENTO ALEXANDRE & LARISSA - GIFTS.JS
 * Lista Oficial dos 30 Presentes com Fotos Curadas, Valores e Suporte a Links de Pagamento
 */

const LUDIC_GIFTS = [
  {
    id: 'presente-1',
    title: 'Tênis para a Larissa caminhar em Roma',
    price: 487.90,
    icon: '👟',
    image: 'assets/gifts/gift-1.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-2',
    title: 'Dinheiro pro Alex levar a Larissa para Roma',
    price: 2850.00,
    icon: '✈️',
    image: 'assets/gifts/gift-2.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-3',
    title: 'Fotógrafo para o Alex descansar na lua de mel',
    price: 1240.50,
    icon: '📸',
    image: 'assets/gifts/gift-3.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-4',
    title: 'Looks novos para a lua de mel',
    price: 890.00,
    icon: '👗',
    image: 'assets/gifts/gift-4.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-5',
    title: 'Misto quente para levar na lancheira e comer no aeroporto',
    price: 115.40,
    icon: '🥪',
    image: 'assets/gifts/gift-5.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-6',
    title: 'Cueca sexy para o Alexandre',
    price: 139.90,
    icon: '🩲',
    image: 'assets/gifts/gift-6.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-7',
    title: 'Lenço pro Alex chorar na cerimônia (não reembolsável)',
    price: 108.50,
    icon: '🤧',
    image: 'assets/gifts/gift-7.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-8',
    title: 'Kit calmante para noiva',
    price: 245.00,
    icon: '🍵',
    image: 'assets/gifts/gift-8.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-9',
    title: 'Sofá confortável para o noivo caso o kit calmante não funcione',
    price: 1890.00,
    icon: '🛋️',
    image: 'assets/gifts/gift-9.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-10',
    title: 'Prioridade na fila do buffet',
    price: 360.00,
    icon: '🍽️',
    image: 'assets/gifts/gift-10.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-11',
    title: 'EU NÃO VOU EMBORA: Vaquinha para a hora extra da festa',
    price: 2450.00,
    icon: '🎉',
    image: 'assets/gifts/gift-11.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-12',
    title: 'Obrigar o noivo a tirar foto',
    price: 175.00,
    icon: '🤳',
    image: 'assets/gifts/gift-12.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-13',
    title: 'Jogar o buquê na sua direção',
    price: 520.00,
    icon: '💐',
    image: 'assets/gifts/gift-13.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-14',
    title: 'Cota Parintins 2027 para os noivos',
    price: 2970.00,
    icon: '🐂',
    image: 'assets/gifts/gift-14.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-15',
    title: '1º mês da escola do Xandy Junior',
    price: 1150.00,
    icon: '👶',
    image: 'assets/gifts/gift-15.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-16',
    title: 'Dinheiro para a Larissa convencer o Alex para termos um cachorro',
    price: 780.00,
    icon: '🐶',
    image: 'assets/gifts/gift-16.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-17',
    title: 'Kit ração pro cachorro que o Alex vai dar para a Larissa',
    price: 295.90,
    icon: '🦴',
    image: 'assets/gifts/gift-17.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-18',
    title: 'Rolo de macarrão caso o Alex faça raiva',
    price: 129.00,
    icon: '🧑‍🍳',
    image: 'assets/gifts/gift-18.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-19',
    title: 'Capacete para o Alex poder fazer raiva para a Larissa',
    price: 210.00,
    icon: '⛑️',
    image: 'assets/gifts/gift-19.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-20',
    title: '1º mês de chocolate para o casal',
    price: 185.50,
    icon: '🍫',
    image: 'assets/gifts/gift-20.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-21',
    title: 'Um trocadinho para liberar o noivo pro RPG no fim de semana',
    price: 150.00,
    icon: '🎲',
    image: 'assets/gifts/gift-21.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-22',
    title: 'Vaga para jantar na casa dos noivos 🍜',
    price: 142.80,
    icon: '🍜',
    image: 'assets/gifts/gift-22.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-23',
    title: 'Livro de jardinagem para a noiva não matar mais plantas',
    price: 164.90,
    icon: '🌱',
    image: 'assets/gifts/gift-23.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-24',
    title: 'Buquê de flores mensal',
    price: 640.00,
    icon: '🌸',
    image: 'assets/gifts/gift-24.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-25',
    title: 'Implante capilar para o noivo',
    price: 2990.00,
    icon: '💇‍♂️',
    image: 'assets/gifts/gift-25.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-26',
    title: 'Monjauro para os noivos meterem o shape',
    price: 1680.00,
    icon: '💉',
    image: 'assets/gifts/gift-26.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-27',
    title: 'Esteroides pesados pro noivo ficar trincado pra lua de mel',
    price: 430.00,
    icon: '💪',
    image: 'assets/gifts/gift-27.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-28',
    title: 'Curso para aprender a segurar os pensamentos intrusivos',
    price: 315.00,
    icon: '🧠',
    image: 'assets/gifts/gift-28.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-29',
    title: 'Patrocínio para tirar nosso nome do SERASA',
    price: 1490.00,
    icon: '💸',
    image: 'assets/gifts/gift-29.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-30',
    title: 'Só pra não dizer que não dei nada',
    price: 102.50,
    icon: '🪙',
    image: 'assets/gifts/gift-30.jpg',
    paymentLink: ''
  }
];

// Chave PIX do Casal (Fallback para quando o link direto não estiver preenchido)
const CASAL_PIX_KEY = 'casamento.alexandre.larissa@gmail.com';
let currentSelectedGift = null;

// Executar no carregamento da página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGiftsSection);
} else {
  initGiftsSection();
}

function initGiftsSection() {
  renderGiftsGrid();
  initGiftModal();
}

/* Renderizar Grid de Presentes com Imagem Curada, Preço e Botão de Pagamento */
function renderGiftsGrid() {
  const container = document.getElementById('giftsGridContainer');
  if (!container) return;

  container.innerHTML = LUDIC_GIFTS.map(gift => `
    <div class="gift-card" data-id="${gift.id}">
      <div class="gift-img-frame">
        <img src="${gift.image}" alt="${escapeHtml(gift.title)}" loading="lazy" />
        <span class="gift-emoji-badge">${gift.icon}</span>
      </div>
      <div class="gift-card-body">
        <h4 class="gift-title">${escapeHtml(gift.title)}</h4>
        <div class="gift-card-footer">
          <div class="gift-price">
            <span class="gift-currency">R$</span>${gift.price.toFixed(2).replace('.', ',')}
          </div>
          <button type="button" class="btn btn-primary btn-sm presentear-btn" data-id="${gift.id}">
            Presentear ✨
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Ouvintes para os botões de presentear e clique no card
  container.querySelectorAll('.gift-card').forEach(card => {
    card.addEventListener('click', () => {
      const giftId = card.getAttribute('data-id');
      const gift = LUDIC_GIFTS.find(g => g.id === giftId);
      if (gift) handleGiftClick(gift);
    });
  });

  container.querySelectorAll('.presentear-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const giftId = btn.getAttribute('data-id');
      const gift = LUDIC_GIFTS.find(g => g.id === giftId);
      if (gift) handleGiftClick(gift);
    });
  });
}

function handleGiftClick(gift) {
  // Se o presente tiver um link de pagamento configurado, redireciona diretamente
  if (gift.paymentLink && gift.paymentLink.trim().length > 0 && gift.paymentLink !== '#') {
    window.open(gift.paymentLink, '_blank', 'noopener,noreferrer');
  } else {
    // Caso contrário, abre o modal PIX
    openGiftModal(gift);
  }
}

/* Modal PIX */
function initGiftModal() {
  const modal = document.getElementById('giftModal');
  const closeBtn = document.getElementById('giftModalClose');
  const copyBtn = document.getElementById('copyPixBtn');
  const pixInput = document.getElementById('pixKeyDisplay');
  const form = document.getElementById('giftConfirmForm');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Copiar chave PIX
  if (copyBtn && pixInput) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(CASAL_PIX_KEY).then(() => {
        const orig = copyBtn.innerText;
        copyBtn.innerText = 'Copiado! ✓';
        copyBtn.style.backgroundColor = 'var(--color-green-primary)';
        setTimeout(() => {
          copyBtn.innerText = orig;
          copyBtn.style.backgroundColor = '';
        }, 2200);
      }).catch(() => {
        pixInput.select();
        document.execCommand('copy');
        copyBtn.innerText = 'Copiado! ✓';
      });
    });
  }

  // Confirmação do Presente com Recado
  if (form && modal) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('giftGuestName').value.trim() || 'Amigo Querido';
      const guestMsg = document.getElementById('giftGuestMessage').value.trim();

      if (guestMsg && window.addRecadoFromGift) {
        window.addRecadoFromGift(guestName, guestMsg, currentSelectedGift ? currentSelectedGift.title : 'Presente especial');
      }

      modal.innerHTML = `
        <div class="gift-modal-card" style="text-align: center; padding: 45px 30px;">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">🥂🎁✨</div>
          <h3 style="font-family: var(--font-serif-display); color: var(--color-green-dark); font-size: 1.9rem; margin-bottom: 12px;">
            Muito Obrigado, ${escapeHtml(guestName)}!
          </h3>
          <p style="color: var(--color-text-muted); font-size: 1.05rem; margin-bottom: 24px; line-height: 1.6;">
            Seu presente e seu carinho significam muito para nós! Mal podemos esperar para comemorar com você no dia 28 de Novembro na Chácara Monte Rey!
          </p>
          <button class="btn btn-primary" onclick="document.getElementById('giftModal').classList.remove('active'); location.reload();">
            Voltar ao Site
          </button>
        </div>
      `;
    });
  }
}

function openGiftModal(gift) {
  currentSelectedGift = gift;
  const modal = document.getElementById('giftModal');
  const titleEl = document.getElementById('modalGiftTitle');
  const priceEl = document.getElementById('modalGiftPrice');
  const pixInput = document.getElementById('pixKeyDisplay');

  if (titleEl) titleEl.innerText = `${gift.icon} ${gift.title}`;
  if (priceEl) priceEl.innerText = `R$ ${gift.price.toFixed(2).replace('.', ',')}`;
  if (pixInput) pixInput.value = CASAL_PIX_KEY;

  if (modal) modal.classList.add('active');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
