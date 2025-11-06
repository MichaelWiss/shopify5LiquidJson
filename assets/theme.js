document.documentElement.classList.remove('no-js');

const initProductCarousels = (root = document) => {
  const carousels = root.querySelectorAll('[data-carousel]');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    if (carousel.dataset.carouselInitialized === 'true') {
      return;
    }

    const track = carousel.querySelector('[data-carousel-track]');
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');

    if (!track || !prevButton || !nextButton) {
      return;
    }

    const getGap = () => {
      const style = window.getComputedStyle(track);
      const gapValue = style.columnGap || style.gap || '0';
      const parsed = parseFloat(gapValue);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const getScrollAmount = () => {
      const firstItem = track.querySelector('[role="listitem"]');
      if (!firstItem) return track.clientWidth;
      const itemWidth = firstItem.getBoundingClientRect().width;
      return itemWidth + getGap();
    };

    const updateButtonState = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const isScrollable = maxScroll > 2;
      const nearStart = track.scrollLeft <= 2;
      const nearEnd = track.scrollLeft >= maxScroll - 2;

      prevButton.disabled = !isScrollable || nearStart;
      nextButton.disabled = !isScrollable || nearEnd;

      carousel.classList.toggle('is-scrollable', isScrollable);
    };

    const handlePrev = () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    };

    const handleNext = () => {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    };

    let scrollRaf = null;

    prevButton.addEventListener('click', handlePrev);
    nextButton.addEventListener('click', handleNext);
    track.addEventListener(
      'scroll',
      () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          updateButtonState();
          scrollRaf = null;
        });
      },
      { passive: true }
    );
    window.addEventListener('resize', updateButtonState);

    updateButtonState();
    carousel.dataset.carouselInitialized = 'true';
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount && Number(cartCount.textContent) > 0) {
    cartCount.removeAttribute('hidden');
  }

  initProductCarousels();
});

document.addEventListener('shopify:section:load', (event) => {
  initProductCarousels(event.target);
});
