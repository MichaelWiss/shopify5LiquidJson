/**
 * Utils Module
 * Shared utilities: error handling, money formatting
 * @module utils
 */

export const ErrorHandler = {
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

/**
 * Format cents to currency string
 * Uses Shopify.formatMoney if available, otherwise fallback
 */
export function formatMoney(cents) {
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

/**
 * Get Shopify cart base URL (handles localized stores)
 */
export function getCartBaseURL() {
  const base = window.Shopify?.routes?.root || '/';
  return base.endsWith('/') ? base : `${base}/`;
}
