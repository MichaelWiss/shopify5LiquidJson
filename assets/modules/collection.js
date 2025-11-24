/**
 * Collection Module
 * Filter toggles, view switching
 * @module collection
 */

/**
 * Initialize collection page interactions
 */
export function initCollection() {
  // Event delegation for collection actions
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    // Filter toggle
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

    // View toggle (grid size)
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
}
