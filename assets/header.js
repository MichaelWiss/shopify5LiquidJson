/**
 * Header Module
 * Handles scroll detection, dynamic color switching, and scroll fade effects
 */

(function HeaderModule() {
  'use strict';

  const Header = {
    init() {
      this.initScroll();
      this.initMobileMenu();
      this.initDynamicColor();
      this.initScrollFade();
    },

    initMobileMenu() {
      const toggle = document.querySelector('.header-mobile-toggle');
      const drawer = document.getElementById('MobileMenu');
      if (!toggle || !drawer) return;

      const closeBtn = drawer.querySelector('.mobile-menu-close');
      const backdrop = drawer;

      const openMenu = () => {
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      const closeMenu = () => {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
      });

      closeBtn?.addEventListener('click', closeMenu);
      
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeMenu();
      });
    },

    initScroll() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      const threshold = 50;
      const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > threshold);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    },

    initDynamicColor() {
      const header = document.querySelector('.site-header[data-color-mode="dynamic"]');
      if (!header) return;

      let ticking = false;
      const hero = document.querySelector('.hero');

      const update = () => {
        if (!hero) { ticking = false; return; }

        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scroll = window.scrollY;

        if (scroll === 0) {
          header.style.setProperty('--dynamic-header-bg', '#1a1a1a');
          header.style.setProperty('--dynamic-header-text', '#ffffff');
        } else if (scroll < heroBottom) {
          header.style.setProperty('--dynamic-header-bg', 'transparent');
          header.style.setProperty('--dynamic-header-text', '#ffffff');
        } else {
          header.style.setProperty('--dynamic-header-bg', 'transparent');
          header.style.setProperty('--dynamic-header-text', '#1a1a1a');
        }
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });

      update();
    },

    initScrollFade() {
      const elements = document.querySelectorAll('[data-scroll-fade]');
      if (!elements.length) return;

      let ticking = false;
      const update = () => {
        const percent = window.scrollY / window.innerHeight;
        elements.forEach(el => {
          el.style.opacity = Math.max(0, 1 - percent * 2);
          el.style.transform = `translateY(${percent * 50}px)`;
        });
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Header.init());
  } else {
    Header.init();
  }

  // Expose for external access
  window.Header = Header;
})();
