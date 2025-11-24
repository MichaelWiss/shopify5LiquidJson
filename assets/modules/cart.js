/**
 * Cart Module
 * Cart drawer, AJAX cart operations, focus trapping
 * @module cart
 */

import { ErrorHandler, getCartBaseURL } from './utils.js';

// Cart state singleton
const CartState = {
  drawer: null,
  overlay: null,
  content: null,
  count: null,
  lastTrigger: null,
  keydownHandler: null,
  
  init() {
    this.drawer = document.getElementById('cartDrawer');
    this.overlay = document.getElementById('cartOverlay');
    this.content = document.getElementById('cartDrawerContent');
    this.count = document.querySelector('.cart-count');
  },
  
  get isOpen() {
    return this.drawer?.classList.contains('is-open');
  }
};

/**
 * Open cart drawer with accessibility support
 */
export function openCartDrawer(triggerElement) {
  if (!CartState.drawer || !CartState.overlay) return;
  document.body.classList.add('cart-drawer-open');
  CartState.drawer.classList.add('is-open');
  CartState.drawer.setAttribute('aria-hidden', 'false');
  CartState.overlay.classList.add('is-visible');
  CartState.lastTrigger = triggerElement || document.activeElement;
  trapFocusInCartDrawer();
}

/**
 * Close cart drawer and restore focus
 */
export function closeCartDrawer() {
  if (!CartState.drawer || !CartState.overlay) return;
  document.body.classList.remove('cart-drawer-open');
  CartState.drawer.classList.remove('is-open');
  CartState.drawer.setAttribute('aria-hidden', 'true');
  CartState.overlay.classList.remove('is-visible');
  releaseCartDrawerFocus();
}

/**
 * Trap focus within cart drawer for accessibility
 */
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

/**
 * Release focus trap and restore previous focus
 */
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

/**
 * Update cart item quantity via AJAX
 */
export async function updateCartItem(line, quantity) {
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

/**
 * Refresh cart drawer content via section rendering
 */
export async function refreshCartDrawer() {
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

/**
 * Update drawer content from section HTML
 */
function updateDrawerSectionFromHTML(sectionHTML) {
  if (!CartState.content || !sectionHTML) return;
  const tempWrapper = document.createElement('div');
  tempWrapper.innerHTML = sectionHTML;
  const updatedContent = tempWrapper.querySelector('#cartDrawerContent');
  if (updatedContent) {
    CartState.content.innerHTML = updatedContent.innerHTML;
  }
}

/**
 * Update cart count badge display
 */
export function updateCartCountDisplay(count) {
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

/**
 * Initialize cart module
 */
export function initCart() {
  CartState.init();
  
  // Initialize cart count display
  if (CartState.count) {
    updateCartCountDisplay(Number(CartState.count.textContent));
  }

  // Event delegation for cart actions
  document.addEventListener('click', async (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    if (action === 'open-cart') {
      e.preventDefault();
      openCartDrawer(target);
      return;
    }

    if (action === 'close-cart') {
      e.preventDefault();
      closeCartDrawer();
      return;
    }

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

    if (action === 'cart-remove') {
      e.preventDefault();
      const line = target.dataset.line;
      await updateCartItem(line, 0);
      return;
    }
  });

  // Overlay click to close
  if (CartState.overlay) {
    CartState.overlay.addEventListener('click', (event) => {
      if (event.target === CartState.overlay) {
        closeCartDrawer();
      }
    });
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && CartState.isOpen) {
      closeCartDrawer();
    }
  });

  // Add to cart form submission
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
}
