document.documentElement.classList.remove('no-js');

// ========================================
// UNIFIED ERROR HANDLER
// ========================================
const ErrorHandler = {
  log(error, context = '') {
    console.error(`[Theme Error${context ? ` - ${context}` : ''}]:`, error);
  },

  showUserMessage(message) {
    // Future: Could add toast notification system here
    console.warn('User message:', message);
  },

  handle(error, context = '', userMessage = null) {
    this.log(error, context);
    if (userMessage) {
      this.showUserMessage(userMessage);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ========================================
  // CART STATE MANAGEMENT
  // ========================================
  const CartState = {
    drawer: document.getElementById('cartDrawer'),
    overlay: document.getElementById('cartOverlay'),
    content: document.getElementById('cartDrawerContent'),
    count: document.querySelector('.cart-count'),
    lastTrigger: null,
    keydownHandler: null,
    
    get isOpen() {
      return this.drawer?.classList.contains('is-open');
    }
  };

  // ========================================
  // HEADER SCROLL DETECTION
  // ========================================
  const siteHeader = document.querySelector('.site-header');
  const scrollThreshold = 50;
  
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }
  
  if (siteHeader) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Initialize cart count display
  if (CartState.count) {
    updateCartCountDisplay(Number(CartState.count.textContent));
  }

  // ========================================
  // CART DRAWER FUNCTIONS
  // ========================================
  function openCartDrawer(triggerElement) {
    if (!CartState.drawer || !CartState.overlay) return;
    document.body.classList.add('cart-drawer-open');
    CartState.drawer.classList.add('is-open');
    CartState.drawer.setAttribute('aria-hidden', 'false');
    CartState.overlay.classList.add('is-visible');
    CartState.lastTrigger = triggerElement || document.activeElement;
    trapFocusInCartDrawer();
  }

  function closeCartDrawer() {
    if (!CartState.drawer || !CartState.overlay) return;
    document.body.classList.remove('cart-drawer-open');
    CartState.drawer.classList.remove('is-open');
    CartState.drawer.setAttribute('aria-hidden', 'true');
    CartState.overlay.classList.remove('is-visible');
    releaseCartDrawerFocus();
  }

  function trapFocusInCartDrawer() {
    if (!CartState.drawer) return;
    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input:not([type="hidden"]):not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = CartState.drawer.querySelectorAll(focusableSelectors);
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    firstElement?.focus();

    CartState.keydownHandler = (event) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    CartState.drawer.addEventListener('keydown', CartState.keydownHandler);
  }

  function releaseCartDrawerFocus() {
    if (CartState.keydownHandler && CartState.drawer) {
      CartState.drawer.removeEventListener('keydown', CartState.keydownHandler);
      CartState.keydownHandler = null;
    }

    if (CartState.lastTrigger && typeof CartState.lastTrigger.focus === 'function') {
      CartState.lastTrigger.focus();
    }
    CartState.lastTrigger = null;
  }

  async function updateCartItem(line, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error('Unable to update cart item');

      updateCartCountDisplay(data.item_count);
      if (data.item_count === 0) {
        closeCartDrawer();
      }
      await refreshCartDrawer();
    } catch (error) {
      ErrorHandler.handle(error, 'Update Cart Item', 'Unable to update cart. Please try again.');
    }
  }

  async function refreshCartDrawer() {
    try {
      const { pathname, search } = window.location;
      const requestUrl = `${pathname}${search || ''}`;

      if (CartState.content) {
        const drawerResponse = await fetch(`${requestUrl}${search ? '&' : '?'}sections=cart-drawer`);
        if (!drawerResponse.ok) throw new Error('Failed to fetch cart drawer section');
        
        const drawerSections = await drawerResponse.json();
        updateDrawerSectionFromHTML(drawerSections['cart-drawer']);
      }

      const cartSectionWrapper = document.getElementById('shopify-section-cart');
      if (cartSectionWrapper) {
        const cartResponse = await fetch(`${getCartBaseURL()}cart?sections=cart`);
        if (cartResponse.ok) {
          const cartSectionHTML = await cartResponse.json();
          if (cartSectionHTML.cart) {
            cartSectionWrapper.innerHTML = cartSectionHTML.cart;
          }
        }
      }
    } catch (error) {
      ErrorHandler.handle(error, 'Refresh Cart');
    }
  }

  function updateDrawerSectionFromHTML(sectionHTML) {
    if (!CartState.content || !sectionHTML) return;
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = sectionHTML;
    const updatedContent = tempWrapper.querySelector('#cartDrawerContent');
    if (updatedContent) {
      CartState.content.innerHTML = updatedContent.innerHTML;
    }
  }

  function getCartBaseURL() {
    const base = window.Shopify?.routes?.root || '/';
    return base.endsWith('/') ? base : `${base}/`;
  }

  function updateCartCountDisplay(count) {
    if (!CartState.count) return;
    const parsedCount = Number(count) || 0;
    CartState.count.textContent = parsedCount;
    const hiddenClass = 'visually-hidden';
    
    if (parsedCount > 0) {
      CartState.count.classList.remove(hiddenClass);
    } else {
      CartState.count.classList.add(hiddenClass);
    }
  }

  function formatMoney(cents) {
    if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
      const format =
        window.Shopify.money_format ||
        window.Shopify.currency?.active_format ||
        window.Shopify.currency?.money_format ||
        '${{amount}}';
      return window.Shopify.formatMoney(cents, format);
    }

    const amount = (cents / 100).toFixed(2);
    return `$${amount}`;
  }

  // ========================================
  // EVENT DELEGATION - UNIFIED EVENT HANDLER
  // ========================================
  document.addEventListener('click', async (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    // Cart drawer open
    if (action === 'open-cart') {
      e.preventDefault();
      openCartDrawer(target);
      return;
    }

    // Cart drawer close
    if (action === 'close-cart') {
      e.preventDefault();
      closeCartDrawer();
      return;
    }

    // Cart quantity controls
    if (action === 'cart-qty-increase' || action === 'cart-qty-decrease') {
      e.preventDefault();
      const line = target.dataset.line;
      const item = target.closest('.cart-item');
      const qtyEl = item?.querySelector('.cart-item__qty-value');
      let qty = parseInt(qtyEl?.textContent || 0);
      
      if (action === 'cart-qty-increase') {
        qty++;
      } else if (action === 'cart-qty-decrease' && qty > 1) {
        qty--;
      }
      
      await updateCartItem(line, qty);
      return;
    }

    // Cart remove item
    if (action === 'cart-remove') {
      e.preventDefault();
      const line = target.dataset.line;
      await updateCartItem(line, 0);
      return;
    }

    // Collection filter toggle
    if (action === 'toggle-filters') {
      e.preventDefault();
      const filterPanel = document.getElementById('collectionFilters');
      const filterIcon = target.querySelector('.collection-page__filter-icon');
      
      if (filterPanel) {
        const isOpen = filterPanel.classList.toggle('is-open');
        target.setAttribute('aria-expanded', isOpen);
        filterPanel.setAttribute('aria-hidden', !isOpen);
        
        if (filterIcon) {
          filterIcon.textContent = isOpen ? '—' : '+';
        }
      }
      return;
    }

    // Collection view toggle
    if (action === 'toggle-view') {
      e.preventDefault();
      const viewSize = target.dataset.view;
      const productGrid = document.querySelector('.collection-page__grid[data-view]');
      const viewButtons = document.querySelectorAll('[data-action="toggle-view"]');
      
      if (productGrid) {
        viewButtons.forEach(btn => btn.classList.remove('is-active'));
        target.classList.add('is-active');
        productGrid.setAttribute('data-view', viewSize);
      }
      return;
    }
  });

  // Overlay click (close if clicking outside drawer)
  if (CartState.overlay) {
    CartState.overlay.addEventListener('click', (event) => {
      if (event.target === CartState.overlay) {
        closeCartDrawer();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && CartState.isOpen) {
      closeCartDrawer();
    }
  });

  // ========================================
  // ADD TO CART FORM SUBMISSION
  // ========================================
  document.addEventListener('submit', async (e) => {
    if (!e.target.matches('form[action*="/cart/add"]')) return;
    
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn?.textContent || '';
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding...';
    }
    
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const cartResponse = await fetch('/cart.js');
        const cart = await cartResponse.json();
        
        updateCartCountDisplay(cart.item_count);
        await refreshCartDrawer();
        openCartDrawer();
      } else {
        throw new Error(data.description || 'Failed to add to cart');
      }
    } catch (error) {
      ErrorHandler.handle(error, 'Add to Cart', 'Unable to add item to cart. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });

  // ========================================
  // PRODUCT VARIANT HANDLING
  // ========================================
  function initProductForms() {
    const productForms = document.querySelectorAll('.product-form[data-section-id]');
    productForms.forEach((form) => {
      const sectionId = form.dataset.sectionId;
      const productScript = document.querySelector(`script[data-product-json="${sectionId}"]`);
      if (!productScript) return;

      let productData = null;
      try {
        productData = JSON.parse(productScript.textContent);
      } catch (error) {
        ErrorHandler.handle(error, 'Parse Product JSON');
        return;
      }

      const sectionWrapper = form.closest('[data-product-section]');
      const variantInput = form.querySelector('[data-variant-id-input]');
      if (!variantInput || !productData?.variants?.length) return;

      const optionInputs = form.querySelectorAll('[data-option-position]');
      optionInputs.forEach((input) => {
        input.addEventListener('change', () => {
          handleVariantChange({ form, productData, sectionWrapper, variantInput });
        });
      });

      handleVariantChange({ form, productData, sectionWrapper, variantInput });
    });
  }

  function handleVariantChange({ form, productData, sectionWrapper, variantInput }) {
    const totalOptions = Array.isArray(productData.options) ? productData.options.length : 0;
    let variant = productData.variants[0] || null;
    const hasOptionInputs = form.querySelector('[data-option-position]') !== null;

    if (totalOptions > 0 && hasOptionInputs) {
      const selectedOptions = getSelectedOptions(form, totalOptions);
      if (selectedOptions.includes(undefined)) {
        variant = null;
      } else {
        variant = findMatchingVariant(productData.variants, selectedOptions);
      }
    }

    updateVariantUI({ form, variant, sectionWrapper, variantInput });
  }

  function getSelectedOptions(form, optionCount) {
    const selections = new Array(optionCount);
    const optionInputs = form.querySelectorAll('[data-option-position]');

    optionInputs.forEach((input) => {
      const position = Number(input.dataset.optionPosition);
      if (!position) return;

      if (input.tagName === 'SELECT') {
        selections[position - 1] = input.value;
      } else if (input.matches('input[type="radio"]') && input.checked) {
        selections[position - 1] = input.value;
      }
    });

    return selections;
  }

  function findMatchingVariant(variants, selectedOptions) {
    return variants.find((variant) =>
      variant.options.every((value, index) => value === selectedOptions[index])
    );
  }

  function updateVariantUI({ form, variant, sectionWrapper, variantInput }) {
    const addToCartButton = form.querySelector('[data-product-atc]');
    const availabilityNode = form.querySelector('[data-product-availability]');
    const priceNode = sectionWrapper?.querySelector('[data-product-price]');
    const skuRow = sectionWrapper?.querySelector('[data-product-sku-row]');
    const skuValue = skuRow?.querySelector('[data-product-sku]');

    if (!variant) {
      if (availabilityNode) {
        availabilityNode.textContent =
          availabilityNode.dataset.unavailableCopy || availabilityNode.textContent || 'Unavailable';
      }
      if (addToCartButton) {
        addToCartButton.disabled = true;
        addToCartButton.textContent =
          addToCartButton.dataset.soldOutLabel || addToCartButton.textContent || 'Sold out';
      }
      if (variantInput) {
        variantInput.value = '';
      }
      return;
    }

    variantInput.value = variant.id;

    if (priceNode) {
      priceNode.textContent = formatMoney(variant.price);
    }

    if (skuRow && skuValue) {
      if (variant.sku) {
        skuValue.textContent = variant.sku;
        skuRow.hidden = false;
      } else {
        skuValue.textContent = '';
        skuRow.hidden = true;
      }
    }

    if (addToCartButton) {
      addToCartButton.disabled = !variant.available;
      if (variant.available) {
        addToCartButton.textContent = addToCartButton.dataset.defaultLabel || addToCartButton.textContent;
      } else {
        addToCartButton.textContent =
          addToCartButton.dataset.soldOutLabel || addToCartButton.textContent || 'Sold out';
      }
    }

    if (availabilityNode) {
      availabilityNode.textContent = variant.available
        ? ''
        : availabilityNode.dataset.unavailableCopy || availabilityNode.textContent || 'Unavailable';
    }
  }

  // Initialize product forms
  initProductForms();

  // ========================================
  // DYNAMIC HEADER COLOR SWITCHING
  // ========================================
  const header = document.querySelector('.site-header[data-color-mode="dynamic"]');
  if (header) {
    const sectionsWithColor = document.querySelectorAll('[data-header-color]');
    
    if (sectionsWithColor.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const bgColor = entry.target.dataset.headerBg || '#ffffff';
            const textColor = entry.target.dataset.headerText || '#1a1a1a';
            
            header.style.setProperty('--dynamic-header-bg', bgColor);
            header.style.setProperty('--dynamic-header-text', textColor);
          }
        });
      }, {
        threshold: [0, 0.3, 0.5, 0.7, 1],
        rootMargin: '-80px 0px 0px 0px'
      });

      sectionsWithColor.forEach(section => observer.observe(section));
    }
  }

  // ========================================
  // SCROLL-AWARE LOGO FADE
  // ========================================
  const scrollFadeElements = document.querySelectorAll('[data-scroll-fade]');
  if (scrollFadeElements.length > 0) {
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
});
