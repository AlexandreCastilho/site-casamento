/**
 * CASAMENTO ALEXANDRE & LARISSA - APP.JS
 * Lógica geral, contagem regressiva, parallax de fotos no scroll, navegação responsiva e lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initNavbar();
  initScrollAnimations();
  initParallelPhotoParallax();
  initLightbox();
  initResizeHandler();
});

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
  const leftTrack = document.getElementById('leftRailTrack');
  const rightTrack = document.getElementById('rightRailTrack');

  if (!railLeft || !railRight || !leftTrack || !rightTrack) return;

  let ticking = false;

  function updateParallax() {
    // Em telas menores que 1100px (tablets e celulares), esmaecer
    if (window.innerWidth < 1100) {
      railLeft.style.opacity = '0';
      railRight.style.opacity = '0';
      return;
    }

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Cálculo contínuo de fade-in e fade-out
        const fadeIn = Math.min(1, Math.max(0, (scrollY - 80) / 220));
        const fadeOut = Math.min(1, Math.max(0, (totalDocHeight - scrollY) / 300));
        const currentOpacity = Math.max(0, Math.min(0.95, fadeIn * fadeOut * 0.95));

        railLeft.style.opacity = currentOpacity.toFixed(3);
        railRight.style.opacity = currentOpacity.toFixed(3);

        // Movimento proporcional contínuo ao longo de todo o scroll da página
        const progress = totalDocHeight > 0 ? (scrollY / totalDocHeight) : 0;
        const maxOffsetLeft = 320;
        const maxOffsetRight = 440;

        leftTrack.style.transform = `translate3d(0, ${-(progress * maxOffsetLeft).toFixed(1)}px, 0)`;
        rightTrack.style.transform = `translate3d(0, ${-(progress * maxOffsetRight).toFixed(1)}px, 0)`;

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });
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
    photoList.push({
      src: img.getAttribute('src') || img.src,
      alt: img.getAttribute('alt') || 'Alexandre & Larissa'
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
    lightboxImg.alt = item.alt;
    if (lightboxCaption) {
      lightboxCaption.innerText = item.alt;
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
      // Se redimensionar para Desktop (>= 768px), fechar menu mobile e restaurar scroll
      if (window.innerWidth >= 768) {
        const navMenu = document.getElementById('navMenu');
        const backdrop = document.getElementById('navBackdrop');
        if (navMenu) navMenu.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    }, 150);
  }, { passive: true });
}
