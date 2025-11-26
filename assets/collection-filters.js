/**
 * Collection Filters Module
 * Handles filter toggles and view switching on collection pages
 */

(function CollectionFiltersModule() {
  'use strict';

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

  // Auto-initialize on collection/search pages
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const template = document.body.dataset.template ||
        document.body.className.match(/template-(\w+)/)?.[1];
      if (['collection', 'list-collections', 'search'].includes(template)) {
        Collection.init();
      }
    });
  } else {
    const template = document.body.dataset.template ||
      document.body.className.match(/template-(\w+)/)?.[1];
    if (['collection', 'list-collections', 'search'].includes(template)) {
      Collection.init();
    }
  }

  // Expose for external access
  window.CollectionFilters = Collection;
})();
