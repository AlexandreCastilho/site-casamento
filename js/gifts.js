/**
 * CASAMENTO ALEXANDRE & LARISSA - GIFTS.JS
 * Lista Oficial dos 30 Presentes Organizada por Valores e Pares Temáticos
 * Com Ordenação Dinâmica (Menor/Maior, Maior/Menor, A-Z) e QR Code Oficial PIX
 */

const OFFICIAL_PIX_CODE = '00020126360014BR.GOV.BCB.PIX0114+55929824155315204000053039865802BR5921Larissa Leite Colares6009SAO PAULO6214051041Y5k2W4pd6304FCB0';

// Lista Organizada: Menor para maior valor, mantendo juntos os pares temáticos
const SUGGESTED_GIFTS_ORDER = [
  {
    id: 'presente-pix-personalizado',
    title: 'Cota Livre: Presenteie com Qualquer Valor via PIX',
    price: 0,
    isCustomPix: true,
    icon: '💖',
    image: 'assets/gifts/gift-pix-custom.jpg',
    paymentLink: ''
  },
  {
    id: 'presente-30',
    title: 'Só pra não dizer que não dei nada',
    price: 102.50,
    icon: '🪙',
    image: 'assets/gifts/gift-30.jpg',
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
    id: 'presente-5',
    title: 'Misto quente para levar na lancheira e comer no aeroporto',
    price: 115.40,
    icon: '🥪',
    image: 'assets/gifts/gift-5.jpg',
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
    id: 'presente-6',
    title: 'Cueca sexy para o Alexandre',
    price: 139.90,
    icon: '🩲',
    image: 'assets/gifts/gift-6.jpg',
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
    id: 'presente-21',
    title: 'Um trocadinho para liberar o noivo pro RPG no fim de semana',
    price: 150.00,
    icon: '🎲',
    image: 'assets/gifts/gift-21.jpg',
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
    id: 'presente-12',
    title: 'Obrigar o noivo a tirar foto',
    price: 175.00,
    icon: '🤳',
    image: 'assets/gifts/gift-12.jpg',
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
    id: 'presente-17',
    title: 'Kit ração pro cachorro que o Alex vai dar para a Larissa',
    price: 295.90,
    icon: '🦴',
    image: 'assets/gifts/gift-17.jpg',
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
    id: 'presente-28',
    title: 'Curso para aprender a segurar os pensamentos intrusivos',
    price: 315.00,
    icon: '🧠',
    image: 'assets/gifts/gift-28.jpg',
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
    id: 'presente-27',
    title: 'Esteroides pesados pro noivo ficar trincado pra lua de mel',
    price: 430.00,
    icon: '💪',
    image: 'assets/gifts/gift-27.jpg',
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
    id: 'presente-13',
    title: 'Jogar o buquê na sua direção',
    price: 520.00,
    icon: '💐',
    image: 'assets/gifts/gift-13.jpg',
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
    id: 'presente-4',
    title: 'Looks novos para a lua de mel',
    price: 890.00,
    icon: '👗',
    image: 'assets/gifts/gift-4.jpg',
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
    id: 'presente-15',
    title: '1º mês da escola do Xandy Junior',
    price: 1150.00,
    icon: '👶',
    image: 'assets/gifts/gift-15.jpg',
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
    id: 'presente-11',
    title: 'EU NÃO VOU EMBORA: Vaquinha para a hora extra da festa',
    price: 2450.00,
    icon: '🎉',
    image: 'assets/gifts/gift-11.jpg',
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
    id: 'presente-25',
    title: 'Implante capilar para o noivo',
    price: 2990.00,
    icon: '💇‍♂️',
    image: 'assets/gifts/gift-25.jpg',
    paymentLink: ''
  }
];

let currentGiftSort = 'suggested';
let currentSelectedGift = null;

// Executar no carregamento da página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGiftsSection);
} else {
  initGiftsSection();
}

function initGiftsSection() {
  initGiftSorting();
  renderGiftsGrid();
  initGiftModal();
}

/* Inicializar Controles de Ordenação */
function initGiftSorting() {
  const sortSelect = document.getElementById('giftSortSelect');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    currentGiftSort = e.target.value;
    renderGiftsGrid();
  });
}

/* Retornar lista de presentes ordenada de acordo com a seleção do usuário */
function getSortedGifts() {
  // O item de PIX livre fica sempre fixado em primeiro lugar
  const pixItem = SUGGESTED_GIFTS_ORDER.find(g => g.isCustomPix);
  const itemsWithoutPix = SUGGESTED_GIFTS_ORDER.filter(g => !g.isCustomPix);

  let sorted = [];

  switch (currentGiftSort) {
    case 'price-asc':
      // Menor para maior valor absoluto
      sorted = [...itemsWithoutPix].sort((a, b) => a.price - b.price);
      break;

    case 'price-desc':
      // Maior para menor valor absoluto
      sorted = [...itemsWithoutPix].sort((a, b) => b.price - a.price);
      break;

    case 'name-asc':
      // Ordem alfabética (A - Z)
      sorted = [...itemsWithoutPix].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
      break;

    case 'suggested':
    default:
      // Ordem sugerida padrão (crescente com pares temáticos agrupados)
      sorted = [...itemsWithoutPix];
      break;
  }

  return pixItem ? [pixItem, ...sorted] : sorted;
}

/* Renderizar Grid de Presentes */
function renderGiftsGrid() {
  const container = document.getElementById('giftsGridContainer');
  if (!container) return;

  const giftList = getSortedGifts();

  container.innerHTML = giftList.map(gift => {
    const isCustom = !!gift.isCustomPix;
    const priceDisplay = isCustom 
      ? '<span style="font-size: 1.02rem; font-weight: 700; color: var(--color-green-primary);">Valor Livre via PIX</span>' 
      : `<span class="gift-currency">R$</span>${gift.price.toFixed(2).replace('.', ',')}`;

    return `
      <div class="gift-card ${isCustom ? 'gift-card-custom' : ''}" data-id="${gift.id}">
        <div class="gift-img-frame">
          <img src="${gift.image}" alt="${escapeHtml(gift.title)}" loading="lazy" />
          <span class="gift-emoji-badge">${gift.icon}</span>
        </div>
        <div class="gift-card-body">
          <h4 class="gift-title">${escapeHtml(gift.title)}</h4>
          <div class="gift-card-footer">
            <div class="gift-price">
              ${priceDisplay}
            </div>
            <button type="button" class="btn ${isCustom ? 'btn-secondary' : 'btn-primary'} btn-sm presentear-btn" data-id="${gift.id}">
              ${isCustom ? 'Contribuir 📱' : 'Presentear ✨'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Ouvintes para os botões de presentear e clique no card
  container.querySelectorAll('.gift-card').forEach(card => {
    card.addEventListener('click', () => {
      const giftId = card.getAttribute('data-id');
      const gift = SUGGESTED_GIFTS_ORDER.find(g => g.id === giftId);
      if (gift) handleGiftClick(gift);
    });
  });

  container.querySelectorAll('.presentear-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const giftId = btn.getAttribute('data-id');
      const gift = SUGGESTED_GIFTS_ORDER.find(g => g.id === giftId);
      if (gift) handleGiftClick(gift);
    });
  });
}

function handleGiftClick(gift) {
  // Se for o presente de valor personalizado ou se não tiver link direto, abre o modal PIX com o QR Code
  if (gift.isCustomPix || !gift.paymentLink || gift.paymentLink.trim().length === 0 || gift.paymentLink === '#') {
    openGiftModal(gift);
  } else {
    // Redireciona diretamente para o link de pagamento
    window.open(gift.paymentLink, '_blank', 'noopener,noreferrer');
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

  // Copiar código PIX oficial (Copia e Cola)
  if (copyBtn && pixInput) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(OFFICIAL_PIX_CODE).then(() => {
        const orig = copyBtn.innerText;
        copyBtn.innerText = 'Código PIX Copiado! ✓';
        copyBtn.style.backgroundColor = 'var(--color-green-primary)';
        setTimeout(() => {
          copyBtn.innerText = orig;
          copyBtn.style.backgroundColor = '';
        }, 2500);
      }).catch(() => {
        pixInput.select();
        document.execCommand('copy');
        copyBtn.innerText = 'Código PIX Copiado! ✓';
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
        window.addRecadoFromGift(guestName, guestMsg, currentSelectedGift ? currentSelectedGift.title : 'Presente via PIX');
      }

      modal.innerHTML = `
        <div class="gift-modal-card" style="text-align: center; padding: 45px 30px;">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">🥂💖🌿</div>
          <h3 style="font-family: var(--font-serif-display); color: var(--color-green-dark); font-size: 1.9rem; margin-bottom: 12px;">
            Muito Obrigado, ${escapeHtml(guestName)}!
          </h3>
          <p style="color: var(--color-text-muted); font-size: 1.05rem; margin-bottom: 24px; line-height: 1.6;">
            Seu presente e seu carinho significam o mundo para nós! Mal podemos esperar para comemorar com você no dia 28 de Novembro na Chácara Monte Rey!
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
  if (priceEl) {
    priceEl.innerText = gift.isCustomPix 
      ? 'Valor Livre (Defina no App do seu Banco)' 
      : `R$ ${gift.price.toFixed(2).replace('.', ',')}`;
  }
  if (pixInput) pixInput.value = OFFICIAL_PIX_CODE;

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
