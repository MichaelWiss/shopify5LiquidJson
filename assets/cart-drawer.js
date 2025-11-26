/**
 * Cart Drawer Module
 * Handles cart drawer UI, AJAX cart operations, and focus management
 */

(function CartDrawerModule() {
  'use strict';

  // Shared utility - minimal inline version
  const formatMoney = (cents) => {
    if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
      const format = window.Shopify.money_format ||
        window.Shopify.currency?.active_format ||
        window.Shopify.currency?.money_format ||
        '${{amount}}';
      return window.Shopify.formatMoney(cents, format);
    }
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getCartBaseURL = () => {
    const base = window.Shopify?.routes?.root || '/';
    return base.endsWith('/') ? base : `${base}/`;
  };

  const ErrorHandler = {
    log(error, context = '') {
      console.error(`[Cart Error${context ? ` - ${context}` : ''}]:`, error);
    },
    handle(error, context = '', userMessage = null) {
      this.log(error, context);
      if (userMessage) console.warn('User message:', userMessage);
    }
  };

  // Cart State & Logic
  const Cart = {
    state: {
      drawer: null,
      overlay: null,
      content: null,
      count: null,
      lastTrigger: null,
      keydownHandler: null
    },

    get isOpen() {
      return this.state.drawer?.classList.contains('is-open');
    },

    init() {
      this.state.drawer = document.getElementById('cartDrawer');
      this.state.overlay = document.getElementById('cartOverlay');
      this.state.content = document.getElementById('cartDrawerContent');
      this.state.count = document.querySelector('.cart-count');

      if (this.state.count) {
        this.updateCountDisplay(Number(this.state.count.textContent));
      }

      this.bindEvents();
    },

    open(triggerElement) {
      if (!this.state.drawer || !this.state.overlay) return;
      document.body.classList.add('cart-drawer-open');
      this.state.drawer.classList.add('is-open');
      this.state.drawer.setAttribute('aria-hidden', 'false');
      this.state.overlay.classList.add('is-visible');
      this.state.lastTrigger = triggerElement || document.activeElement;
      this.trapFocus();
    },

    close() {
      if (!this.state.drawer || !this.state.overlay) return;
      document.body.classList.remove('cart-drawer-open');
      this.state.drawer.classList.remove('is-open');
      this.state.drawer.setAttribute('aria-hidden', 'true');
      this.state.overlay.classList.remove('is-visible');
      this.releaseFocus();
    },

    trapFocus() {
      if (!this.state.drawer) return;
      const focusableSelectors = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]):not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusableElements = this.state.drawer.querySelectorAll(focusableSelectors);
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      firstElement?.focus();

      this.state.keydownHandler = (event) => {
        if (event.key !== 'Tab') return;
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      };

      this.state.drawer.addEventListener('keydown', this.state.keydownHandler);
    },

    releaseFocus() {
      if (this.state.keydownHandler && this.state.drawer) {
        this.state.drawer.removeEventListener('keydown', this.state.keydownHandler);
        this.state.keydownHandler = null;
      }
      if (this.state.lastTrigger?.focus) {
        this.state.lastTrigger.focus();
      }
      this.state.lastTrigger = null;
    },

    async updateItem(line, quantity) {
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line, quantity })
        });
        const data = await response.json();
        if (!response.ok) throw new Error('Unable to update cart item');

        this.updateCountDisplay(data.item_count);
        if (data.item_count === 0) this.close();
        await this.refresh();
      } catch (error) {
        ErrorHandler.handle(error, 'Update Cart Item', 'Unable to update cart.');
      }
    },

    async refresh() {
      try {
        const { pathname, search } = window.location;
        const requestUrl = `${pathname}${search || ''}`;

        if (this.state.content) {
          const drawerResponse = await fetch(`${requestUrl}${search ? '&' : '?'}sections=cart-drawer`);
          if (!drawerResponse.ok) throw new Error('Failed to fetch cart drawer');
          const drawerSections = await drawerResponse.json();
          this.updateFromHTML(drawerSections['cart-drawer']);
        }

        const cartSection = document.getElementById('shopify-section-cart');
        if (cartSection) {
          const cartResponse = await fetch(`${getCartBaseURL()}cart?sections=cart`);
          if (cartResponse.ok) {
            const cartHTML = await cartResponse.json();
            if (cartHTML.cart) cartSection.innerHTML = cartHTML.cart;
          }
        }
      } catch (error) {
        ErrorHandler.handle(error, 'Refresh Cart');
      }
    },

    updateFromHTML(sectionHTML) {
      if (!this.state.content || !sectionHTML) return;
      const temp = document.createElement('div');
      temp.innerHTML = sectionHTML;
      const updated = temp.querySelector('#cartDrawerContent');
      if (updated) this.state.content.innerHTML = updated.innerHTML;
    },

    updateCountDisplay(count) {
      if (!this.state.count) return;
      const parsed = Number(count) || 0;
      this.state.count.textContent = parsed;
      this.state.count.classList.toggle('visually-hidden', parsed === 0);
    },

    bindEvents() {
      // Click delegation for cart actions
      document.addEventListener('click', async (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;

        if (action === 'open-cart') {
          e.preventDefault();
          this.open(target);
        } else if (action === 'close-cart') {
          e.preventDefault();
          this.close();
        } else if (action === 'cart-qty-increase' || action === 'cart-qty-decrease') {
          e.preventDefault();
          const line = target.dataset.line;
          const item = target.closest('.cart-item');
          const qtyEl = item?.querySelector('.cart-item__qty-value');
          let qty = parseInt(qtyEl?.textContent || 0);
          qty = action === 'cart-qty-increase' ? qty + 1 : Math.max(1, qty - 1);
          await this.updateItem(line, qty);
        } else if (action === 'cart-remove') {
          e.preventDefault();
          await this.updateItem(target.dataset.line, 0);
        }
      });

      // Overlay click
      this.state.overlay?.addEventListener('click', (e) => {
        if (e.target === this.state.overlay) this.close();
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Add to cart form
      document.addEventListener('submit', async (e) => {
        if (!e.target.matches('form[action*="/cart/add"]')) return;
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn?.textContent || '';

        // Add loading class and disable all form inputs
        form.classList.add('form-loading');
        const formFields = form.querySelectorAll('input, select, button, textarea');
        formFields.forEach(field => {
          field.dataset.wasDisabled = field.disabled;
          field.disabled = true;
        });

        if (submitBtn) {
          submitBtn.textContent = 'Adding...';
        }

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: new FormData(form)
          });
          const data = await response.json();

          if (response.ok) {
            const cartResponse = await fetch('/cart.js');
            const cart = await cartResponse.json();
            this.updateCountDisplay(cart.item_count);
            await this.refresh();
            this.open();
          } else {
            throw new Error(data.description || 'Failed to add to cart');
          }
        } catch (error) {
          ErrorHandler.handle(error, 'Add to Cart', 'Unable to add item.');
        } finally {
          // Remove loading class and restore form fields
          form.classList.remove('form-loading');
          formFields.forEach(field => {
            field.disabled = field.dataset.wasDisabled === 'true';
            delete field.dataset.wasDisabled;
          });

          if (submitBtn) {
            submitBtn.textContent = originalText;
          }
        }
      });
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Cart.init());
  } else {
    Cart.init();
  }

  // Expose for external access
  window.CartDrawer = Cart;
})();
