/**
 * Header Module
 * Scroll detection, dynamic colors, scroll-aware effects
 * @module header
 */

/**
 * Initialize header scroll behavior
 * Adds 'scrolled' class when page is scrolled
 */
export function initHeaderScroll() {
  const siteHeader = document.querySelector('.site-header');
  if (!siteHeader) return;

  const scrollThreshold = 50;
  
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial state
}

/**
 * Initialize dynamic header color switching
 * Changes header bg/text based on scroll position over hero
 */
export function initDynamicHeaderColor() {
  const header = document.querySelector('.site-header[data-color-mode="dynamic"]');
  if (!header) return;

  let ticking = false;
  const heroSection = document.querySelector('.hero');
  
  const updateHeaderColor = () => {
    if (!heroSection) {
      ticking = false;
      return;
    }
    
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const scrollPos = window.scrollY;
    
    // At top of page: dark grey bg with white text
    if (scrollPos === 0) {
      header.style.setProperty('--dynamic-header-bg', '#1a1a1a');
      header.style.setProperty('--dynamic-header-text', '#ffffff');
    }
    // Scrolling over hero image: transparent bg with white text
    else if (scrollPos < heroBottom) {
      header.style.setProperty('--dynamic-header-bg', 'transparent');
      header.style.setProperty('--dynamic-header-text', '#ffffff');
    } 
    // Past hero: transparent bg with dark text
    else {
      header.style.setProperty('--dynamic-header-bg', 'transparent');
      header.style.setProperty('--dynamic-header-text', '#1a1a1a');
    }
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderColor);
      ticking = true;
    }
  }, { passive: true });
  
  updateHeaderColor(); // Initial state
}

/**
 * Initialize scroll-aware fade effects
 * Fades elements with [data-scroll-fade] as user scrolls
 */
export function initScrollFade() {
  const scrollFadeElements = document.querySelectorAll('[data-scroll-fade]');
  if (scrollFadeElements.length === 0) return;

  let ticking = false;
  
  const updateFade = () => {
    const scrollPercent = window.scrollY / window.innerHeight;
    scrollFadeElements.forEach(el => {
      const opacity = Math.max(0, 1 - scrollPercent * 2);
      el.style.opacity = opacity;
      el.style.transform = `translateY(${scrollPercent * 50}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateFade);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Initialize all header behaviors
 */
export function initHeader() {
  initHeaderScroll();
  initDynamicHeaderColor();
  initScrollFade();
}
