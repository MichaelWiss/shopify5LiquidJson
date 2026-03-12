/**
 * Theme.js - Main Orchestrator (Optional)
 *
 * This file is currently disabled in theme.liquid.
 * The standalone modules (utils.js, cart-drawer.js, product-form.js,
 * header.js, collection-filters.js) handle all functionality.
 *
 * If re-enabled, this file provides a unified init and exposes
 * window.ThemeApp for external access.
 *
 * Depends on utils.js being loaded first.
 */

(function ThemeApp() {
  'use strict';

  const U = window.ThemeUtils;
  if (!U) return;

  U.onReady(() => {
    // Core modules — every page
    if (window.HeaderModule) window.HeaderModule.init();
    if (window.CartDrawer) window.CartDrawer.init();

    // Template-specific modules
    const template = document.body.dataset.template ||
      document.body.className.match(/template-(\w+)/)?.[1];

    if (template === 'product' && window.ProductForm) {
      window.ProductForm.init();
    }

    if (['collection', 'list-collections', 'search'].includes(template) && window.CollectionFilters) {
      window.CollectionFilters.init();
    }
  });

  // Expose for external access if needed
  window.ThemeApp = {
    get Utils() { return window.ThemeUtils; },
    get Cart() { return window.CartDrawer; },
    get Product() { return window.ProductForm; },
    get Header() { return window.HeaderModule; },
    get Collection() { return window.CollectionFilters; }
  };
})();
