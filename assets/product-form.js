/**
 * Product Form Module
 * Handles variant selection, price updates, and availability
 */

(function ProductFormModule() {
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

  const ErrorHandler = {
    log(error, context = '') {
      console.error(`[Product Error${context ? ` - ${context}` : ''}]:`, error);
    },
    handle(error, context = '') {
      this.log(error, context);
    }
  };

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
        ErrorHandler.handle(error, 'Parse Product JSON');
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
      if (price) price.textContent = formatMoney(variant.price);

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

  // Auto-initialize on product pages
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const template = document.body.dataset.template ||
        document.body.className.match(/template-(\w+)/)?.[1];
      if (template === 'product') Product.init();
    });
  } else {
    const template = document.body.dataset.template ||
      document.body.className.match(/template-(\w+)/)?.[1];
    if (template === 'product') Product.init();
  }

  // Expose for external access
  window.ProductForm = Product;
})();
