/* ============================================================
   Dr. Vivek Allahbadia | main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Active Nav Link ─────────────────────────────────────*/
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[data-page]').forEach(a => {
    if (a.dataset.page === currentPage) a.classList.add('active');
  });

  /* ── 2. Mobile Menu ─────────────────────────────────────────*/
  const menuBtn    = document.getElementById('menu-btn');
  const menuClose  = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu()  { mobileMenu.classList.add('open');    document.body.style.overflow = 'hidden'; menuBtn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { mobileMenu.classList.remove('open'); document.body.style.overflow = '';       menuBtn.setAttribute('aria-expanded', 'false'); }

  if (menuBtn)    menuBtn.addEventListener('click', openMenu);
  if (menuClose)  menuClose.addEventListener('click', closeMenu);
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ── 3. Scroll Reveal ───────────────────────────────────────*/
  const revealEls = document.querySelectorAll('.fade-in-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.closest('#editorial-usp')) return;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 4. Editorial USP — always fully visible ────────────────*/
  function lockUsp() {
    const usp = document.getElementById('editorial-usp');
    if (!usp) return;
    usp.classList.remove('fade-in-up');
    usp.classList.add('visible');
    usp.querySelectorAll('*').forEach(c => { c.classList.remove('fade-in-up'); c.classList.add('visible'); });
  }
  lockUsp();
  window.addEventListener('load', lockUsp);

  /* ── 5. Stat Counter Animation ──────────────────────────────*/
  function formatNum(val, fmt, dec) {
    if (dec)              return parseFloat(val).toFixed(parseInt(dec));
    if (fmt === 'thousands') {
      const v = Math.floor(val);
      return v >= 1000 ? Math.floor(v/1000) + ',' + ('000' + (v%1000)).slice(-3) : v.toString();
    }
    return Math.floor(val).toString();
  }

  // Isolate numeric span from suffix span
  document.querySelectorAll('.stat-counter').forEach(el => {
    const suffixSpan = el.querySelector('.stat-suffix');
    const numSpan = document.createElement('span');
    numSpan.className = 'num-val';
    numSpan.textContent = '0';
    el.innerHTML = '';
    el.appendChild(numSpan);
    if (suffixSpan) el.appendChild(suffixSpan);
  });

  let countersStarted = false;
  function runCounters() {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll('.stat-counter').forEach(el => {
      const target = parseFloat(el.dataset.target || 0);
      const fmt    = el.dataset.format  || '';
      const dec    = el.dataset.decimal || '';
      const num    = el.querySelector('.num-val');
      const dur    = 1600;
      const t0     = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        if (num) num.textContent = formatNum(e * target, fmt, dec);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  const heroRight = document.querySelector('.hero-right');
  if (heroRight) heroRight.addEventListener('animationstart', runCounters, { once: true });
  setTimeout(runCounters, 300);

  /* ── 6. Page-exit Transition ────────────────────────────────*/
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href[0] === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });

  /* ── 7. FAQ Accordion ───────────────────────────────────────*/
  document.querySelectorAll('.faq__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body   = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all in same list
      const list = btn.closest('.faq__list') || document.body;
      list.querySelectorAll('.faq__btn.open').forEach(b => {
        b.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
        const icon = b.querySelector('.faq__icon');
        if (icon) icon.style.transform = '';
        const bd = b.nextElementSibling;
        if (bd) bd.style.maxHeight = '0';
      });

      if (!isOpen) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        const icon = btn.querySelector('.faq__icon');
        if (icon) icon.style.transform = 'rotate(45deg)';
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ── 8. Scroll-to-top ───────────────────────────────────────*/
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => scrollBtn.classList.toggle('visible', window.scrollY > 400), { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 9. Header shadow ───────────────────────────────────────*/
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
  }

  /* ── 10. Smooth anchor scrolling ────────────────────────────*/
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── 11. Zigzag split-from-centre animation ─────────────────
     Wraps each side's children in .side-wrap so overflow:hidden
     clips correctly, then observes each .zigzag-item.           */
  const zigzagItems = document.querySelectorAll('.zigzag-item');
  if (zigzagItems.length) {
    zigzagItems.forEach(item => {
      item.querySelectorAll('.video-side, .content-side').forEach(side => {
        const wrap = document.createElement('div');
        wrap.className = 'side-wrap';
        while (side.firstChild) wrap.appendChild(side.firstChild);
        side.appendChild(wrap);
      });
    });

    const zzObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('zz-visible');
          zzObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40% 0px' });

    zigzagItems.forEach(el => zzObserver.observe(el));
  }

  /* ── 12. HTML5 video player ─────────────────────────────────
     Click on a .video-thumb[data-mp4] replaces the thumbnail
     with an inline HTML5 video that autoplays.                  */
  document.querySelectorAll('.video-thumb[data-mp4]').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-mp4');
      if (!src) return;

      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;

      thumb.innerHTML = '';
      thumb.classList.add('is-playing');
      thumb.removeAttribute('data-mp4');
      thumb.appendChild(video);
    });
  });

  /* ── 13. Gallery Lightbox ───────────────────────────────────
     Opens full-size image when a .pol polaroid is clicked.
     Closes on overlay click, close button, or Escape key.     */
  const lb    = document.getElementById('lb');
  const lbImg = document.getElementById('lb-img');
  const lbX   = document.getElementById('lb-x');

  if (lb) {
    document.querySelectorAll('.pol').forEach(pol => {
      pol.addEventListener('click', () => {
        const img = pol.querySelector('img');
        if (!img) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLb = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    };

    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    if (lbX) lbX.addEventListener('click', closeLb);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
    });
  }

  /* ── 14. International Patient Modal ────────────────────────
     Triggered by the CTA button in the appointments page.
     Opens with fade + scale animation, closes on backdrop
     click, close button, or Escape key.                        */
  const modal     = document.getElementById('intl-modal');
  const modalClose = document.getElementById('modal-close');

  if (modal) {
    const openModal = () => {
      modal.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      // Move focus to close button for accessibility
      if (modalClose) setTimeout(() => modalClose.focus(), 50);
    };
    const closeModal = () => {
      modal.classList.remove('modal-open');
      document.body.style.overflow = '';
    };

    // Trigger button
    const modalTrigger = document.getElementById('modal-trigger');
    if (modalTrigger) modalTrigger.addEventListener('click', openModal);

    // Close button
    if (modalClose) modalClose.addEventListener('click', closeModal);

    // Backdrop click
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('modal-open')) closeModal();
    });
  }

});
