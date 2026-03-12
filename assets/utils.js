/**
 * Shared Utilities Module
 * Single source of truth for: ErrorHandler, formatMoney, getCartBaseURL,
 * trapFocus/releaseFocus, cartAPI helpers, and DOMContentLoaded init.
 *
 * Consumed by theme.js, cart-drawer.js, product-form.js, header.js,
 * and collection-filters.js via window.ThemeUtils.
 */

(function SharedUtils() {
  'use strict';

  // ========================================
  // ERROR HANDLER
  // ========================================
  const ErrorHandler = {
    log(error, context = '') {
      console.error(`[Theme Error${context ? ` - ${context}` : ''}]:`, error);
    },
    showUserMessage(message) {
      console.warn('User message:', message);
    },
    handle(error, context = '', userMessage = null) {
      this.log(error, context);
      if (userMessage) this.showUserMessage(userMessage);
    }
  };

  // ========================================
  // MONEY FORMATTING
  // ========================================
  function formatMoney(cents) {
    if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
      const format = window.Shopify.money_format ||
        window.Shopify.currency?.active_format ||
        window.Shopify.currency?.money_format ||
        '${{amount}}';
      return window.Shopify.formatMoney(cents, format);
    }
    return `$${(cents / 100).toFixed(2)}`;
  }

  // ========================================
  // CART BASE URL
  // ========================================
  function getCartBaseURL() {
    const base = window.Shopify?.routes?.root || '/';
    return base.endsWith('/') ? base : `${base}/`;
  }

  // ========================================
  // FOCUS TRAPPING
  // ========================================
  const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]):not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, state) {
    if (!container) return;
    const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTORS);
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    firstElement?.focus();

    state.keydownHandler = (event) => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    container.addEventListener('keydown', state.keydownHandler);
  }

  function releaseFocus(container, state) {
    if (state.keydownHandler && container) {
      container.removeEventListener('keydown', state.keydownHandler);
      state.keydownHandler = null;
    }
    if (state.lastTrigger?.focus) {
      state.lastTrigger.focus();
    }
    state.lastTrigger = null;
  }

  // ========================================
  // CART API HELPERS
  // ========================================
  const cartAPI = {
    async add(body) {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
        body: body instanceof FormData ? body : JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.description || 'Failed to add to cart');
      return data;
    },

    async change(line, quantity) {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity })
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Unable to update cart item');
      return data;
    },

    async get() {
      const response = await fetch('/cart.js');
      return response.json();
    }
  };

  // ========================================
  // DOM READY HELPER
  // ========================================
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // ========================================
  // EXPOSE
  // ========================================
  window.ThemeUtils = {
    ErrorHandler,
    formatMoney,
    getCartBaseURL,
    trapFocus,
    releaseFocus,
    cartAPI,
    onReady,
    FOCUSABLE_SELECTORS
  };
})();
