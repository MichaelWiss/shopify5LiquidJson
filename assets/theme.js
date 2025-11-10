document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {
  // Navigation scroll detection
  const siteHeader = document.querySelector('.site-header');
  let scrollThreshold = 50;
  
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
  
  if (siteHeader) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }

  const cartCount = document.querySelector('.cart-count');
  const cartCountHiddenClass = 'visually-hidden';
  if (cartCount) {
    updateCartCountDisplay(Number(cartCount.textContent));
  }

  // Cart Drawer functionality
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawerClose = document.getElementById('cartDrawerClose');
  const cartIcon = document.querySelector('.header-icon[href="/cart"]');
  const cartDrawerContent = document.getElementById('cartDrawerContent');
  const focusableDrawerSelectors =
    'a[href], button:not([disabled]), textarea, input:not([type="hidden"]):not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastCartTrigger = null;
  let drawerKeydownHandler = null;

  function openCartDrawer(triggerElement) {
    if (!cartDrawer || !cartOverlay) return;
    document.body.classList.add('cart-drawer-open');
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartOverlay.classList.add('is-visible');
    lastCartTrigger = triggerElement || document.activeElement;
    trapFocusInCartDrawer();
  }

  function closeCartDrawer() {
    if (!cartDrawer || !cartOverlay) return;
    document.body.classList.remove('cart-drawer-open');
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartOverlay.classList.remove('is-visible');
    releaseCartDrawerFocus();
  }

  // Open drawer when clicking cart icon
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer(cartIcon);
    });
  }

  // Close drawer
  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', closeCartDrawer);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', (event) => {
      if (event.target === cartOverlay) {
        closeCartDrawer();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('is-open')) {
      closeCartDrawer();
    }
  });

  // Cart item update function
  async function updateCartItem(line, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line,
          quantity
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Unable to update cart item');
      }

      updateCartCountDisplay(data.item_count);

      if (data.item_count === 0) {
        closeCartDrawer();
      }

      await refreshCartDrawer();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Intercept add-to-cart form submissions
  document.querySelectorAll('form[action*="/cart/add"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      
      // Disable button and show loading state
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
          // Fetch updated cart
          const cartResponse = await fetch('/cart.js');
          const cart = await cartResponse.json();
          
          // Update cart count
          updateCartCountDisplay(cart.item_count);
          
          // Refresh cart drawer content
          await refreshCartDrawer();
          
          // Open drawer immediately
          openCartDrawer();
          
          // Reset button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });

  // Function to refresh cart drawer content
  async function refreshCartDrawer() {
    try {
      const { pathname, search } = window.location;
      const requestUrl = `${pathname}${search || ''}`;

      if (cartDrawerContent) {
        const drawerResponse = await fetch(`${requestUrl}${search ? '&' : '?'}sections=cart-drawer`);
        if (!drawerResponse.ok) {
          throw new Error('Failed to fetch cart drawer section');
        }
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

      attachCartEventListeners();
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  }

  function updateDrawerSectionFromHTML(sectionHTML) {
    if (!cartDrawerContent || !sectionHTML) return;
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = sectionHTML;
    const updatedContent = tempWrapper.querySelector('#cartDrawerContent');
    if (updatedContent) {
      cartDrawerContent.innerHTML = updatedContent.innerHTML;
    }
  }

  function getCartBaseURL() {
    const base = window.Shopify?.routes?.root || '/';
    return base.endsWith('/') ? base : `${base}/`;
  }

  function updateCartCountDisplay(count) {
    if (!cartCount) return;
    const parsedCount = Number(count) || 0;
    cartCount.textContent = parsedCount;
    if (parsedCount > 0) {
      cartCount.classList.remove(cartCountHiddenClass);
    } else {
      cartCount.classList.add(cartCountHiddenClass);
    }
  }

  // Format money helper
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

  // Function to attach event listeners to cart items
  function attachCartEventListeners() {
    // Quantity controls
    document.querySelectorAll('.cart-item__qty-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const line = this.dataset.line;
        const action = this.dataset.action;
        const item = this.closest('.cart-item');
        const qtyEl = item.querySelector('.cart-item__qty-value');
        let qty = parseInt(qtyEl.textContent);
        
        if (action === 'increase') {
          qty++;
        } else if (action === 'decrease' && qty > 1) {
          qty--;
        }
        
        updateCartItem(line, qty);
      });
    });

    // Remove buttons
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const line = this.dataset.line;
        updateCartItem(line, 0);
      });
    });
  }

  // Initial attachment
  initProductForms();
  attachCartEventListeners();

  // Collection filter toggle
  const filterToggle = document.getElementById('collectionFilterToggle');
  const filterPanel = document.getElementById('collectionFilters');
  const filterIcon = filterToggle?.querySelector('.collection-page__filter-icon');

  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', () => {
      const isOpen = filterPanel.classList.toggle('is-open');
      filterToggle.setAttribute('aria-expanded', isOpen);
      filterPanel.setAttribute('aria-hidden', !isOpen);
      
      if (filterIcon) {
        filterIcon.textContent = isOpen ? '—' : '+';
      }
    });
  }

  // Collection view size toggle
  const viewButtons = document.querySelectorAll('.collection-page__view-btn');
  const productGrid = document.querySelector('.collection-page__grid[data-view]');

  if (viewButtons.length && productGrid) {
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const viewSize = button.dataset.view;
        
        // Update active state
        viewButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');
        
        // Update grid view
        productGrid.setAttribute('data-view', viewSize);
      });
    });
  }

  function trapFocusInCartDrawer() {
    if (!cartDrawer) return;
    const focusableElements = cartDrawer.querySelectorAll(focusableDrawerSelectors);
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (firstElement) {
      firstElement.focus();
    }

    drawerKeydownHandler = (event) => {
      if (event.key !== 'Tab') {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    cartDrawer.addEventListener('keydown', drawerKeydownHandler);
  }

  function releaseCartDrawerFocus() {
    if (drawerKeydownHandler && cartDrawer) {
      cartDrawer.removeEventListener('keydown', drawerKeydownHandler);
      drawerKeydownHandler = null;
    }

    if (lastCartTrigger && typeof lastCartTrigger.focus === 'function') {
      lastCartTrigger.focus();
    }
    lastCartTrigger = null;
  }

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
        console.error('Unable to parse product JSON', error);
        return;
      }

      const sectionWrapper = form.closest('[data-product-section]');
      const variantInput = form.querySelector('[data-variant-id-input]');
      if (!variantInput || !productData?.variants?.length) {
        return;
      }

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
});
