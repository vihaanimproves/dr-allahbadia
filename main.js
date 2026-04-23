/* ============================================================
   Dr. Vivek Allahbadia | main.js
   Handles: nav, mobile menu, scroll effects, carousels, FAQ
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active Nav Link ───────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[data-page]').forEach(a => {
    if (a.dataset.page === currentPage) a.classList.add('active');
  });

  /* ── Mobile Menu Toggle ────────────────────────────────────── */
  const menuBtn   = document.getElementById('menu-btn');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Intersection Observer – Reveal on Scroll ──────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children if parent has data-stagger
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => observer.observe(el));
  }

  /* ── Reviews Carousel (horizontal scroll + buttons) ────────── */
  const carousel  = document.getElementById('reviews-carousel');
  const prevBtn   = document.getElementById('reviews-prev');
  const nextBtn   = document.getElementById('reviews-next');

  if (carousel && nextBtn && prevBtn) {
    const scrollAmount = 430;
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  /* ── FAQ Accordion ─────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Scroll-to-top Button ──────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth Scroll for anchor links ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Header shadow on scroll ───────────────────────────────── */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 40px rgba(0,53,95,0.10)';
      } else {
        header.style.boxShadow = '0 2px 40px rgba(0,53,95,0.06)';
      }
    });
  }

  /* ── 3D Knee Interactive Hint (robot page) ─────────────────── */
  const kneeModel = document.getElementById('knee-model-hint');
  if (kneeModel) {
    let tilt = 0;
    kneeModel.addEventListener('mousemove', (e) => {
      const rect = kneeModel.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      kneeModel.style.transform = `perspective(600px) rotateY(${dx * 14}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
    });
    kneeModel.addEventListener('mouseleave', () => {
      kneeModel.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
    kneeModel.style.transition = 'transform 0.25s ease';
  }

  /* ── Counter Animation ─────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1400;
          const start = performance.now();
          const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => countObserver.observe(c));
  }

});
