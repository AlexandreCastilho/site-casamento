/**
 * CASAMENTO ALEXANDRE & LARISSA - APP.JS
 * Lógica geral, tela de carregamento, contagem regressiva, parallax e navegação
 */

// Iniciar preloader imediatamente
initPreloader();

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initNavbar();
  initScrollAnimations();
  initParallelPhotoParallax();
  initLightbox();
  initResizeHandler();
});

/* ==========================================================================
   0. TELA DE CARREGAMENTO NOBRE (PRELOADER)
   ========================================================================== */
function initPreloader() {
  function dismiss() {
    const preloader = document.getElementById('sitePreloader');
    if (!preloader || preloader.classList.contains('is-hidden')) return;

    preloader.classList.add('is-hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
    }, 850);
  }

  // Quando a página e todos os recursos forem 100% carregados
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 500);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismiss, 600);
    });
  }

  // Fail-safe de segurança (máximo 2.8s para nunca travar o usuário)
  setTimeout(dismiss, 2800);
}

/* ==========================================================================
   1. CONTAGEM REGRESSIVA (28 DE NOVEMBRO ÀS 16:00)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Data do casamento: 28 de Novembro às 16:00
  const now = new Date();
  let weddingYear = now.getFullYear();
  let weddingDate = new Date(weddingYear, 10, 28, 16, 0, 0); // Mês 10 = Novembro (0-indexed)

  if (now.getTime() > weddingDate.getTime()) {
    weddingDate = new Date(weddingYear + 1, 10, 28, 16, 0, 0);
  }

  function updateTimer() {
    const currentTime = new Date().getTime();
    const difference = weddingDate.getTime() - currentTime;

    if (difference <= 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minutesEl.innerText = '00';
      secondsEl.innerText = '00';
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.innerText = d < 10 ? '0' + d : d;
    hoursEl.innerText = h < 10 ? '0' + h : h;
    minutesEl.innerText = m < 10 ? '0' + m : m;
    secondsEl.innerText = s < 10 ? '0' + s : s;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. NAVBAR & MENU MOBILE COM BACKDROP E SUPORTE A REDIMENSIONAMENTO
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  const progressBar = document.getElementById('scrollProgressBar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileClose = document.getElementById('mobileMenuClose');
  const backdrop = document.getElementById('navBackdrop');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');

  // Scroll bar de progresso & mudança de cor do header
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = docHeight > 0 ? (winScroll / docHeight) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (navbar) {
      if (winScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  function openMenu() {
    if (navMenu) navMenu.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('menu-open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu && navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Fechar menu ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. ANIMAÇÕES DE SCROLL FLUIDAS E CONTÍNUAS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Remove ao sair da tela para reativar a animação sempre que o usuário scrollar novamente
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. FOTOS FLUTUANTES PARALELAS COM PARALLAX SUAVE E CONTÍNUO (SEM PISCAR)
   ========================================================================== */
function initParallelPhotoParallax() {
  const railLeft = document.getElementById('railLeft');
  const railRight = document.getElementById('railRight');
  const leftCards = Array.from(document.querySelectorAll('#leftRailTrack .floating-photo-card'));
  const rightCards = Array.from(document.querySelectorAll('#rightRailTrack .floating-photo-card'));

  if (!railLeft || !railRight || !leftCards.length || !rightCards.length) return;

  // Rotações sutis alternadas para aspecto artesanal polaroid
  const rotationsLeft = [-3.5, 4, -2.5, 3, -4, 2.5, -3, 3.5];
  const rotationsRight = [4, -3.5, 3, -4, 2.5, -3, 3.5, -2.5];

  // Configurar moldura interna (fallback) e definir rotação individual como variável CSS
  leftCards.forEach((card, i) => {
    if (!card.querySelector('.floating-photo-frame')) {
      const frame = document.createElement('div');
      frame.className = 'floating-photo-frame';
      while (card.firstChild) frame.appendChild(card.firstChild);
      card.appendChild(frame);
    }
    const rot = rotationsLeft[i % rotationsLeft.length];
    card.style.setProperty('--card-rot', `${rot}deg`);
  });

  rightCards.forEach((card, i) => {
    if (!card.querySelector('.floating-photo-frame')) {
      const frame = document.createElement('div');
      frame.className = 'floating-photo-frame';
      while (card.firstChild) frame.appendChild(card.firstChild);
      card.appendChild(frame);
    }
    const rot = rotationsRight[i % rotationsRight.length];
    card.style.setProperty('--card-rot', `${rot}deg`);
  });

  const mensagemSection = document.getElementById('mensagem');
  const historiaSection = document.getElementById('historia');

  let ticking = false;

  function updateParallax() {
    // Em telas menores que 1200px (tablets e celulares), desativar e ocultar completamente
    if (window.innerWidth < 1200) {
      railLeft.style.opacity = '0';
      railRight.style.opacity = '0';
      railLeft.style.visibility = 'hidden';
      railRight.style.visibility = 'hidden';
      return;
    }

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (!mensagemSection || !historiaSection) {
          ticking = false;
          return;
        }

        const vh = window.innerHeight;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Limites físicos exatos das seções no viewport
        const msgRect = mensagemSection.getBoundingClientRect();
        const histRect = historiaSection.getBoundingClientRect();

        const sectionTop = msgRect.top;       // Posição no viewport do topo de "Mensagem"
        const sectionBottom = histRect.bottom; // Posição no viewport da base de "Nossa história"

        // REGRA ABSOLUTA: Se a área conjunta de "Mensagem" e "Nossa história" não estiver no viewport,
        // oculta imediatamente os trilhos (ex: quando na Hero section ou em seções posteriores como Local)
        if (sectionTop >= vh || sectionBottom <= 0) {
          railLeft.style.opacity = '0';
          railRight.style.opacity = '0';
          railLeft.style.visibility = 'hidden';
          railRight.style.visibility = 'hidden';
          leftCards.forEach(c => { c.style.opacity = '0'; c.style.pointerEvents = 'none'; });
          rightCards.forEach(c => { c.style.opacity = '0'; c.style.pointerEvents = 'none'; });
          ticking = false;
          return;
        }

        // Tornar trilhos visíveis dentro da zona permitida
        railLeft.style.visibility = 'visible';
        railRight.style.visibility = 'visible';
        railLeft.style.opacity = '1';
        railRight.style.opacity = '1';

        // BLINDAGEM DE HARDWARE (CLIP-PATH): Corta milimetricamente qualquer pixel fora de Mensagem / Nossa História
        const clipTop = Math.max(0, Math.ceil(sectionTop));
        const clipBottom = Math.max(0, Math.ceil(vh - sectionBottom));
        const clipStyle = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;
        railLeft.style.clipPath = clipStyle;
        railRight.style.clipPath = clipStyle;
        railLeft.style.webkitClipPath = clipStyle;
        railRight.style.webkitClipPath = clipStyle;

        // Scroll relativo ancorado ao início da seção Mensagem
        const mensagemTopDoc = mensagemSection.offsetTop;
        const relativeScroll = Math.max(0, scrollY - (mensagemTopDoc - vh));

        // Dimensões responsivas dos cards e do espaçamento
        const isCompact = window.innerWidth < 1400;
        const cardSpacing = isCompact ? 360 : 400;
        const cardHeight = isCompact ? 105 : 125;
        const totalHeightLeft = leftCards.length * cardSpacing;
        const totalHeightRight = rightCards.length * cardSpacing;

        const speedLeft = 1.25;
        const speedRight = 1.45;
        const fadeZone = 90; // Pixels para transição suave de opacidade antes dos limites

        // Atualizar trilho esquerdo
        leftCards.forEach((card, i) => {
          const basePos = i * cardSpacing;
          const rawPos = (basePos - (relativeScroll * speedLeft)) % totalHeightLeft;
          const currentY = ((rawPos % totalHeightLeft) + totalHeightLeft) % totalHeightLeft - 150;

          card.style.transform = `translate3d(0, ${currentY.toFixed(1)}px, 0)`;

          const cardTop = currentY;
          const cardBottom = currentY + cardHeight;

          // 1. Fade contra invasão do topo (Hero section)
          const distFromHero = cardTop - sectionTop;
          let factorTop = 1;
          if (distFromHero <= 0) {
            factorTop = 0;
          } else if (distFromHero < fadeZone) {
            factorTop = distFromHero / fadeZone;
          }

          // 2. Fade contra invasão da base (Local section)
          const distFromLocal = sectionBottom - cardBottom;
          let factorBottom = 1;
          if (distFromLocal <= 0) {
            factorBottom = 0;
          } else if (distFromLocal < fadeZone) {
            factorBottom = distFromLocal / fadeZone;
          }

          // 3. Fade suave nas bordas do viewport
          let factorVpTop = 1;
          if (cardTop < 50) {
            factorVpTop = Math.max(0, cardTop / 50);
          }
          let factorVpBottom = 1;
          if (cardBottom > vh - 50) {
            factorVpBottom = Math.max(0, (vh - cardBottom) / 50);
          }

          const finalOpacity = Math.max(0, Math.min(1, Math.min(factorTop, factorBottom, factorVpTop, factorVpBottom)));
          card.style.opacity = finalOpacity.toFixed(2);
          card.style.pointerEvents = finalOpacity > 0.1 ? 'auto' : 'none';
        });

        // Atualizar trilho direito
        rightCards.forEach((card, i) => {
          const basePos = i * cardSpacing + (cardSpacing * 0.5); // Deslocamento para alternar com a esquerda
          const rawPos = (basePos - (relativeScroll * speedRight)) % totalHeightRight;
          const currentY = ((rawPos % totalHeightRight) + totalHeightRight) % totalHeightRight - 150;

          card.style.transform = `translate3d(0, ${currentY.toFixed(1)}px, 0)`;

          const cardTop = currentY;
          const cardBottom = currentY + cardHeight;

          // 1. Fade contra invasão do topo (Hero section)
          const distFromHero = cardTop - sectionTop;
          let factorTop = 1;
          if (distFromHero <= 0) {
            factorTop = 0;
          } else if (distFromHero < fadeZone) {
            factorTop = distFromHero / fadeZone;
          }

          // 2. Fade contra invasão da base (Local section)
          const distFromLocal = sectionBottom - cardBottom;
          let factorBottom = 1;
          if (distFromLocal <= 0) {
            factorBottom = 0;
          } else if (distFromLocal < fadeZone) {
            factorBottom = distFromLocal / fadeZone;
          }

          // 3. Fade suave nas bordas do viewport
          let factorVpTop = 1;
          if (cardTop < 50) {
            factorVpTop = Math.max(0, cardTop / 50);
          }
          let factorVpBottom = 1;
          if (cardBottom > vh - 50) {
            factorVpBottom = Math.max(0, (vh - cardBottom) / 50);
          }

          const finalOpacity = Math.max(0, Math.min(1, Math.min(factorTop, factorBottom, factorVpTop, factorVpBottom)));
          card.style.opacity = finalOpacity.toFixed(2);
          card.style.pointerEvents = finalOpacity > 0.1 ? 'auto' : 'none';
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });
  window.addEventListener('load', updateParallax, { passive: true });
  updateParallax();
}

/* ==========================================================================
   5. LIGHTBOX DE FOTOS DO CASAL
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxImg) return;

  const galleryItems = document.querySelectorAll('.gallery-item img, .floating-photo-card img, .welcome-photo-frame img, .story-card-photo img');
  const photoList = [];

  galleryItems.forEach((img, index) => {
    const isPolaroid = Boolean(img.closest('.floating-photo-card'));
    photoList.push({
      src: img.getAttribute('src') || img.src,
      alt: isPolaroid ? '' : (img.getAttribute('alt') || ''),
      isPolaroid: isPolaroid
    });

    const parent = img.closest('.gallery-item, .floating-photo-card, .welcome-photo-frame, .story-card-photo');
    if (parent) {
      parent.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    }
  });

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = photoList[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.isPolaroid ? 'Alexandre & Larissa' : (item.alt || 'Alexandre & Larissa');
    if (lightboxCaption) {
      if (item.isPolaroid || !item.alt) {
        lightboxCaption.innerText = '';
        lightboxCaption.style.display = 'none';
      } else {
        lightboxCaption.innerText = item.alt;
        lightboxCaption.style.display = 'block';
      }
    }
  }

  function nextPhoto() {
    currentIndex = (currentIndex + 1) % photoList.length;
    updateLightboxContent();
  }

  function prevPhoto() {
    currentIndex = (currentIndex - 1 + photoList.length) % photoList.length;
    updateLightboxContent();
  }

  // Suporte a gestos touch (swipe lateral) para celulares e tablets
  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    // Se o movimento horizontal for predominante e maior que 40px
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
  }, { passive: true });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextPhoto);
  if (prevBtn) prevBtn.addEventListener('click', prevPhoto);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
}

/* ==========================================================================
   6. REDIMENSIONAMENTO DE JANELA DINÂMICO (DESKTOP / WINDOWS / MOBILE)
   ========================================================================== */
function initResizeHandler() {
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Se redimensionar para Desktop (> 1024px), fechar menu mobile e restaurar scroll
      if (window.innerWidth > 1024) {
        const navMenu = document.getElementById('navMenu');
        const backdrop = document.getElementById('navBackdrop');
        if (navMenu) navMenu.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    }, 150);
  }, { passive: true });
}
