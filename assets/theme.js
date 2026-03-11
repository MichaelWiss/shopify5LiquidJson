/**
 * Theme.js - Modular Architecture
 * 
 * This file serves as the main entry point with functionality organized
 * into logical modules (Utils, Cart, Product, Header, Collection).
 * 
 * For Shopify CDN compatibility, all modules are inlined in this file.
 * The architecture supports easy extraction to separate ES modules
 * when migrating to a build tool (Vite, Rollup, esbuild).
 * 
 * Module Structure:
 * - Utils: Error handling, money formatting
 * - Cart: Cart drawer, AJAX cart, focus trapping, bundle handling
 * - Product: Variant selection, price updates
 * - Header: Scroll behavior, dynamic colors
 * - Collection: Filter/view toggles
 */

(function ThemeApp() {
  'use strict';

  // ========================================
  // UTILS MODULE
  // ========================================
  const Utils = {
    ErrorHandler: {
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
    },

    formatMoney(cents) {
      if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
        const format = window.Shopify.money_format ||
          window.Shopify.currency?.active_format ||
          window.Shopify.currency?.money_format ||
          '${{amount}}';
        return window.Shopify.formatMoney(cents, format);
      }
      return `$${(cents / 100).toFixed(2)}`;
    },

    getCartBaseURL() {
      const base = window.Shopify?.routes?.root || '/';
      return base.endsWith('/') ? base : `${base}/`;
    }
  };

  // ========================================
  // CART MODULE
  // ========================================
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
        Utils.ErrorHandler.handle(error, 'Update Cart Item', 'Unable to update cart.');
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
          const cartResponse = await fetch(`${Utils.getCartBaseURL()}cart?sections=cart`);
          if (cartResponse.ok) {
            const cartHTML = await cartResponse.json();
            if (cartHTML.cart) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(cartHTML.cart, 'text/html');
              cartSection.replaceChildren(...doc.body.childNodes);
            }
          }
        }
      } catch (error) {
        Utils.ErrorHandler.handle(error, 'Refresh Cart');
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
        // Add all variants to cart in sequence
        const items = variantIds.map(id => ({ id: parseInt(id, 10), quantity: 1 }));
        
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.description || 'Failed to add bundle to cart');
        }

        const cartResponse = await fetch('/cart.js');
        const cart = await cartResponse.json();
        this.updateCountDisplay(cart.item_count);
        await this.refresh();
      } catch (error) {
        Utils.ErrorHandler.handle(error, 'Add Bundle', 'Unable to add bundle to cart.');
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
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
          Utils.ErrorHandler.handle(error, 'Add to Cart', 'Unable to add item.');
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

  // ========================================
  // PRODUCT MODULE
  // ========================================
  const Product = {
    init() {
      const forms = document.querySelectorAll('.product-form[data-section-id]');
      forms.forEach(form => this.initForm(form));
    },

    initForm(form) {
      const sectionId = form.dataset.sectionId;
      const script = document.querySelector(`script[data-product-json="${CSS.escape(sectionId)}"]`);
      if (!script) return;

      let productData;
      try {
        productData = JSON.parse(script.textContent);
      } catch (error) {
        Utils.ErrorHandler.handle(error, 'Parse Product JSON');
        return;
      }

      const wrapper = form.closest('[data-product-section]');
      const variantInput = form.querySelector('[data-variant-id-input]');
      if (!variantInput || !productData?.variants?.length) return;

      const optionInputs = form.querySelectorAll('[data-option-position]');
      optionInputs.forEach(input => {
        input.addEventListener('change', () => {
          this.handleChange({ form, productData, wrapper, variantInput });
        });
      });

      this.handleChange({ form, productData, wrapper, variantInput });
    },

    handleChange({ form, productData, wrapper, variantInput }) {
      const totalOptions = Array.isArray(productData.options) ? productData.options.length : 0;
      let variant = productData.variants[0] || null;

      if (totalOptions > 0 && form.querySelector('[data-option-position]')) {
        const selected = this.getSelectedOptions(form, totalOptions);
        variant = selected.includes(undefined) ? null : this.findVariant(productData.variants, selected);
      }

      this.updateUI({ form, variant, wrapper, variantInput });
    },

    getSelectedOptions(form, count) {
      const selections = new Array(count);
      form.querySelectorAll('[data-option-position]').forEach(input => {
        const pos = Number(input.dataset.optionPosition);
        if (!pos) return;
        if (input.tagName === 'SELECT') {
          selections[pos - 1] = input.value;
        } else if (input.matches('input[type="radio"]') && input.checked) {
          selections[pos - 1] = input.value;
        }
      });
      return selections;
    },

    findVariant(variants, selected) {
      return variants.find(v => v.options.every((val, i) => val === selected[i]));
    },

    updateUI({ form, variant, wrapper, variantInput }) {
      const atcBtn = form.querySelector('[data-product-atc]');
      const availability = form.querySelector('[data-product-availability]');
      const price = wrapper?.querySelector('[data-product-price]');
      const skuRow = wrapper?.querySelector('[data-product-sku-row]');
      const skuValue = skuRow?.querySelector('[data-product-sku]');

      if (!variant) {
        if (availability) availability.textContent = availability.dataset.unavailableCopy || 'Unavailable';
        if (atcBtn) {
          atcBtn.disabled = true;
          atcBtn.textContent = atcBtn.dataset.soldOutLabel || 'Sold out';
        }
        if (variantInput) variantInput.value = '';
        return;
      }

      variantInput.value = variant.id;
      if (price) price.textContent = Utils.formatMoney(variant.price);

      if (skuRow && skuValue) {
        skuValue.textContent = variant.sku || '';
        skuRow.hidden = !variant.sku;
      }

      if (atcBtn) {
        atcBtn.disabled = !variant.available;
        atcBtn.textContent = variant.available
          ? (atcBtn.dataset.defaultLabel || atcBtn.textContent)
          : (atcBtn.dataset.soldOutLabel || 'Sold out');
      }

      if (availability) {
        availability.textContent = variant.available ? '' : (availability.dataset.unavailableCopy || 'Unavailable');
      }
    }
  };

  // ========================================
  // HEADER MODULE
  // ========================================
  const Header = {
    init() {
      this.initScroll();
      this.initDynamicColor();
      this.initScrollFade();
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

  // ========================================
  // COLLECTION MODULE
  // ========================================
  const Collection = {
    init() {
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;

        if (action === 'toggle-filters') {
          e.preventDefault();
          const panel = document.getElementById('collectionFilters');
          const icon = target.querySelector('.collection-page__filter-icon');

          if (panel) {
            const isOpen = panel.classList.toggle('is-open');
            target.setAttribute('aria-expanded', isOpen);
            panel.setAttribute('aria-hidden', !isOpen);
            if (icon) icon.textContent = isOpen ? '—' : '+';
          }
        }

        if (action === 'toggle-view') {
          e.preventDefault();
          const view = target.dataset.view;
          const grid = document.querySelector('.collection-page__grid[data-view]');
          const buttons = document.querySelectorAll('[data-action="toggle-view"]');

          if (grid) {
            buttons.forEach(btn => btn.classList.remove('is-active'));
            target.classList.add('is-active');
            grid.setAttribute('data-view', view);
          }
        }
      });
    }
  };

  // ========================================
  // INITIALIZATION
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    // Core modules - every page
    Header.init();
    Cart.init();

    // Template-specific modules
    const template = document.body.dataset.template ||
      document.body.className.match(/template-(\w+)/)?.[1];

    if (template === 'product') {
      Product.init();
    }

    if (['collection', 'list-collections', 'search'].includes(template)) {
      Collection.init();
    }
  });

  // Expose for external access if needed
  window.ThemeApp = { Utils, Cart, Product, Header, Collection };
})();
