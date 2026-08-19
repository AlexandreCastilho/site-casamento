/**
 * CASAMENTO ALEXANDRE & LARISSA - GIFTS.JS
 * Lista de presentes fictícios cômicos e lúdicos com modal PIX interativo
 */

const LUDIC_GIFTS = [
  {
    id: 'presente-1',
    title: 'Cota do D20 Crítico pro Noivo no Altar',
    description: 'Garante uma rolagem com vantagem e 20 natural na iniciativa para o Alexandre não gaguejar na hora do "Sim".',
    price: 80.00,
    icon: '🎲',
    image: 'assets/photos/IMG_6812.jpg',
    tag: 'D&D e Estratégia'
  },
  {
    id: 'presente-2',
    title: 'Kit Paciência Histórica da Professora Larissa',
    description: 'Para aguentar uma turma de 30 pré-adolescentes perguntando se na Idade Média já existia TikTok e Wi-Fi.',
    price: 95.00,
    icon: '📜',
    image: 'assets/photos/IMG_6818.jpg',
    tag: 'Educação & História'
  },
  {
    id: 'presente-3',
    title: 'Ftool & Calculadora de Vigas da Casa Nova',
    description: 'Para o Alexandre calcular o momento fletor e garantir que a laje aguenta a Larissa treinando crossfit.',
    price: 150.00,
    icon: '🏗️',
    image: 'assets/photos/IMG_6833.jpg',
    tag: 'Engenharia Civil'
  },
  {
    id: 'presente-4',
    title: 'Toada do Boi Bumbá com Coreografia na Pista',
    description: 'Para a noiva puxar o dois-pra-lá-dois-pra-cá de Garantido e Caprichoso e botar todo mundo pra dançar!',
    price: 110.00,
    icon: '🐂',
    image: 'assets/photos/IMG_6870.jpg',
    tag: 'Boi Bumbá & Dança'
  },
  {
    id: 'presente-5',
    title: 'WOD dos Noivos: 100 Burpees com Bolo',
    description: 'Cota de creatina, whey e reposição de glicose pós-festa para a Larissa bater o PR na lua de mel.',
    price: 70.00,
    icon: '🏋️‍♀️',
    image: 'assets/photos/IMG_6819.jpg',
    tag: 'Crossfit & Energia'
  },
  {
    id: 'presente-6',
    title: 'Setup Gamer Anti-Divórcio com Cervejeira',
    description: 'Um gabinete com RGB e cerveja trincando para o noivo jogar aquele FPS com os amigos em paz.',
    price: 260.00,
    icon: '🎮',
    image: 'assets/photos/IMG_6821.jpg',
    tag: 'Games & Cerveja'
  },
  {
    id: 'presente-7',
    title: 'Manual: Casado com uma Historiadora',
    description: 'Ensina ao noivo que quando ela diz "vamos falar sobre o passado", não é sobre a Revolução Francesa.',
    price: 65.00,
    icon: '🏛️',
    image: 'assets/photos/IMG_6875.jpg',
    tag: 'Guia do Casal'
  },
  {
    id: 'presente-8',
    title: 'Primeira Rodada de Cerveja da Resenha',
    description: 'Para o engenheiro brindar com os amigos e debater se a estrutura do casamento tá bem amarrada.',
    price: 85.00,
    icon: '🍻',
    image: 'assets/photos/IMG_6819.jpg',
    tag: 'Boteco dos Noivos'
  },
  {
    id: 'presente-9',
    title: 'Passeio Romântico no Encontro das Águas',
    description: 'Porque até mestre de masmorra e atleta de crossfit merecem um pôr do sol romântico no Rio Negro.',
    price: 220.00,
    icon: '🚤',
    image: 'assets/photos/IMG_6870.jpg',
    tag: 'Romance Amazônico'
  },
  {
    id: 'presente-10',
    title: 'Cota "Tombamento Histórico do Amor"',
    description: 'Certificado simbólico de tombamento do amor de Alexandre e Larissa como patrimônio cultural imaterial.',
    price: 130.00,
    icon: '✨',
    image: 'assets/photos/IMG_6818.jpg',
    tag: 'Patrimônio Afetivo'
  },
  {
    id: 'presente-11',
    title: 'Armadura +5 contra DRs Matinais',
    description: 'Classe de Armadura épica e resistência total a cara feia antes do primeiro gole de café da manhã.',
    price: 120.00,
    icon: '🛡️',
    image: 'assets/photos/IMG_6812.jpg',
    tag: 'Item Lendário D&D'
  },
  {
    id: 'presente-12',
    title: 'Cota Livre: Cerveja pro Noivo ou Whey pra Noiva',
    description: 'Contribuição livre para abastecer a geladeira com malte gelado ou a coqueteleira com proteína pura!',
    price: 50.00,
    icon: '🎁',
    image: 'assets/photos/IMG_6875.jpg',
    tag: 'Cota Flexível'
  }
];

// Chave PIX do Casal
const CASAL_PIX_KEY = 'casamento.alexandre.larissa@gmail.com';
let currentSelectedGift = null;

// Executar assim que o script carregar ou no DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGiftsSection);
} else {
  initGiftsSection();
}

function initGiftsSection() {
  renderGiftsGrid();
  initGiftModal();
}

/* Renderizar Grid de Presentes Lúdicos (Sempre Visíveis e Sem Bloqueio) */
function renderGiftsGrid() {
  const container = document.getElementById('giftsGridContainer');
  if (!container) return;

  container.innerHTML = LUDIC_GIFTS.map(gift => `
    <div class="gift-card" data-id="${gift.id}">
      <div class="gift-img-wrapper">
        <img src="${gift.image}" alt="${gift.title}" loading="lazy" />
        <span class="gift-category-badge">${gift.icon} ${gift.tag}</span>
      </div>
      <div class="gift-body">
        <h4 class="gift-title">${gift.title}</h4>
        <p class="gift-description">${gift.description}</p>
        <div class="gift-footer">
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

  // Ouvintes para o modal
  container.querySelectorAll('.presentear-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const giftId = btn.getAttribute('data-id');
      const gift = LUDIC_GIFTS.find(g => g.id === giftId);
      if (gift) openGiftModal(gift);
    });
  });

  // Também permitir clicar no card inteiro para presentear
  container.querySelectorAll('.gift-card').forEach(card => {
    card.addEventListener('click', () => {
      const giftId = card.getAttribute('data-id');
      const gift = LUDIC_GIFTS.find(g => g.id === giftId);
      if (gift) openGiftModal(gift);
    });
  });
}

/* Modal e PIX */
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

  // Confirmação do Presente
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
          <div style="font-size: 3.5rem; margin-bottom: 12px;">🥂🎲🌿</div>
          <h3 style="font-family: var(--font-serif-display); color: var(--color-green-dark); font-size: 1.9rem; margin-bottom: 12px;">
            Muito Obrigado, ${guestName}!
          </h3>
          <p style="color: var(--color-text-muted); font-size: 1.05rem; margin-bottom: 24px; line-height: 1.6;">
            Seu presente e seu carinho deixaram a noiva pronta pro WOD e o noivo com bônus de iniciativa! Mal podemos esperar para comemorar com você no dia 28 de Novembro na Chácara Monte Rey!
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
  const imgEl = document.getElementById('modalGiftImg');
  const pixInput = document.getElementById('pixKeyDisplay');

  if (titleEl) titleEl.innerText = `${gift.icon} ${gift.title}`;
  if (priceEl) priceEl.innerText = `R$ ${gift.price.toFixed(2).replace('.', ',')}`;
  if (imgEl) imgEl.src = gift.image;
  if (pixInput) pixInput.value = CASAL_PIX_KEY;

  if (modal) modal.classList.add('active');
}
