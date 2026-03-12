/**
 * Cart Drawer Module
 * Handles cart drawer UI, AJAX cart operations, and focus management
 *
 * Depends on utils.js (window.ThemeUtils)
 */

(function CartDrawerModule() {
  'use strict';

  const U = window.ThemeUtils;
  const { ErrorHandler, formatMoney, getCartBaseURL, trapFocus, releaseFocus, cartAPI, onReady } = U;

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
      trapFocus(this.state.drawer, this.state);
    },

    releaseFocus() {
      releaseFocus(this.state.drawer, this.state);
    },

    async updateItem(line, quantity) {
      try {
        const data = await cartAPI.change(line, quantity);
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

        const tasks = [];

        if (this.state.content) {
          tasks.push(
            fetch(`${requestUrl}${search ? '&' : '?'}sections=cart-drawer`)
              .then(r => { if (!r.ok) throw new Error('Failed to fetch cart drawer'); return r.json(); })
              .then(sections => this.updateFromHTML(sections['cart-drawer']))
          );
        }

        const cartSection = document.getElementById('shopify-section-cart');
        if (cartSection) {
          tasks.push(
            fetch(`${getCartBaseURL()}cart?sections=cart`)
              .then(r => r.ok ? r.json() : null)
              .then(cartHTML => {
                if (cartHTML?.cart) {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(cartHTML.cart, 'text/html');
                  cartSection.replaceChildren(...doc.body.childNodes);
                }
              })
          );
        }

        await Promise.all(tasks);
      } catch (error) {
        ErrorHandler.handle(error, 'Refresh Cart');
      }
    },

    updateFromHTML(sectionHTML) {
      if (!this.state.content || !sectionHTML) return;
      const parser = new DOMParser();
      const doc = parser.parseFromString(sectionHTML, 'text/html');
      const updated = doc.querySelector('#cartDrawerContent');
      if (updated) this.state.content.replaceChildren(...updated.childNodes);
    },

    updateCountDisplay(count) {
      if (!this.state.count) return;
      const parsed = Number(count) || 0;
      this.state.count.textContent = parsed;
      this.state.count.classList.toggle('visually-hidden', parsed === 0);
    },

    async addBundle(button) {
      const productsString = button.dataset.products;
      if (!productsString) return;

      const variantIds = productsString.split(',').filter(id => id.trim());
      if (!variantIds.length) return;

      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Adding...';

      try {
        const items = variantIds.map(id => ({ id: parseInt(id, 10), quantity: 1 }));
        await cartAPI.add({ items });
        const cart = await cartAPI.get();
        this.updateCountDisplay(cart.item_count);
        await this.refresh();
      } catch (error) {
        ErrorHandler.handle(error, 'Add Bundle', 'Unable to add bundle to cart.');
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    },

    bindEvents() {
      this.bindClickActions();
      this.bindOverlay();
      this.bindEscapeKey();
      this.bindAddToCartForm();
    },

    bindClickActions() {
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
          const line = parseInt(target.dataset.line, 10);
          if (!Number.isFinite(line) || line < 1) return;
          const item = target.closest('.cart-item');
          const qtyEl = item?.querySelector('.cart-item__qty-value');
          let qty = parseInt(qtyEl?.textContent || 0);
          qty = action === 'cart-qty-increase' ? qty + 1 : Math.max(1, qty - 1);
          await this.updateItem(line, qty);
        } else if (action === 'cart-remove') {
          e.preventDefault();
          const removeLine = parseInt(target.dataset.line, 10);
          if (!Number.isFinite(removeLine) || removeLine < 1) return;
          await this.updateItem(removeLine, 0);
        } else if (action === 'add-bundle') {
          e.preventDefault();
          await this.addBundle(target);
        }
      });
    },

    bindOverlay() {
      this.state.overlay?.addEventListener('click', (e) => {
        if (e.target === this.state.overlay) this.close();
      });
    },

    bindEscapeKey() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });
    },

    bindAddToCartForm() {
      document.addEventListener('submit', async (e) => {
        if (!e.target.matches('form[action*="/cart/add"]')) return;
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn?.textContent || '';

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
          await cartAPI.add(new FormData(form));
          const cart = await cartAPI.get();
          this.updateCountDisplay(cart.item_count);
          await this.refresh();
          this.open();
        } catch (error) {
          ErrorHandler.handle(error, 'Add to Cart', 'Unable to add item.');
        } finally {
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
  onReady(() => Cart.init());

  // Expose for external access
  window.CartDrawer = Cart;
})();
