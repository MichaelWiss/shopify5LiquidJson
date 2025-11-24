/**
 * Product Module
 * Variant selection, price updates, availability
 * @module product
 */

import { ErrorHandler, formatMoney } from './utils.js';

/**
 * Initialize all product forms on the page
 */
export function initProductForms() {
  const productForms = document.querySelectorAll('.product-form[data-section-id]');
  productForms.forEach((form) => {
    const sectionId = form.dataset.sectionId;
    const productScript = document.querySelector(`script[data-product-json="${sectionId}"]`);
    if (!productScript) return;

    let productData = null;
    try {
      productData = JSON.parse(productScript.textContent);
    } catch (error) {
      ErrorHandler.handle(error, 'Parse Product JSON');
      return;
    }

    const sectionWrapper = form.closest('[data-product-section]');
    const variantInput = form.querySelector('[data-variant-id-input]');
    if (!variantInput || !productData?.variants?.length) return;

    const optionInputs = form.querySelectorAll('[data-option-position]');
    optionInputs.forEach((input) => {
      input.addEventListener('change', () => {
        handleVariantChange({ form, productData, sectionWrapper, variantInput });
      });
    });

    // Initial variant state
    handleVariantChange({ form, productData, sectionWrapper, variantInput });
  });
}

/**
 * Handle variant option change
 */
function handleVariantChange({ form, productData, sectionWrapper, variantInput }) {
  const totalOptions = Array.isArray(productData.options) ? productData.options.length : 0;
  let variant = productData.variants[0] || null;
  const hasOptionInputs = form.querySelector('[data-option-position]') !== null;

  if (totalOptions > 0 && hasOptionInputs) {
    const selectedOptions = getSelectedOptions(form, totalOptions);
    if (selectedOptions.includes(undefined)) {
      variant = null;
    } else {
      variant = findMatchingVariant(productData.variants, selectedOptions);
    }
  }

  updateVariantUI({ form, variant, sectionWrapper, variantInput });
}

/**
 * Get currently selected options from form
 */
function getSelectedOptions(form, optionCount) {
  const selections = new Array(optionCount);
  const optionInputs = form.querySelectorAll('[data-option-position]');

  optionInputs.forEach((input) => {
    const position = Number(input.dataset.optionPosition);
    if (!position) return;

    if (input.tagName === 'SELECT') {
      selections[position - 1] = input.value;
    } else if (input.matches('input[type="radio"]') && input.checked) {
      selections[position - 1] = input.value;
    }
  });

  return selections;
}

/**
 * Find variant matching selected options
 */
function findMatchingVariant(variants, selectedOptions) {
  return variants.find((variant) =>
    variant.options.every((value, index) => value === selectedOptions[index])
  );
}

/**
 * Update UI based on selected variant
 */
function updateVariantUI({ form, variant, sectionWrapper, variantInput }) {
  const addToCartButton = form.querySelector('[data-product-atc]');
  const availabilityNode = form.querySelector('[data-product-availability]');
  const priceNode = sectionWrapper?.querySelector('[data-product-price]');
  const skuRow = sectionWrapper?.querySelector('[data-product-sku-row]');
  const skuValue = skuRow?.querySelector('[data-product-sku]');

  if (!variant) {
    if (availabilityNode) {
      availabilityNode.textContent =
        availabilityNode.dataset.unavailableCopy || availabilityNode.textContent || 'Unavailable';
    }
    if (addToCartButton) {
      addToCartButton.disabled = true;
      addToCartButton.textContent =
        addToCartButton.dataset.soldOutLabel || addToCartButton.textContent || 'Sold out';
    }
    if (variantInput) {
      variantInput.value = '';
    }
    return;
  }

  variantInput.value = variant.id;

  if (priceNode) {
    priceNode.textContent = formatMoney(variant.price);
  }

  if (skuRow && skuValue) {
    if (variant.sku) {
      skuValue.textContent = variant.sku;
      skuRow.hidden = false;
    } else {
      skuValue.textContent = '';
      skuRow.hidden = true;
    }
  }

  if (addToCartButton) {
    addToCartButton.disabled = !variant.available;
    if (variant.available) {
      addToCartButton.textContent = addToCartButton.dataset.defaultLabel || addToCartButton.textContent;
    } else {
      addToCartButton.textContent =
        addToCartButton.dataset.soldOutLabel || addToCartButton.textContent || 'Sold out';
    }
  }

  if (availabilityNode) {
    availabilityNode.textContent = variant.available
      ? ''
      : availabilityNode.dataset.unavailableCopy || availabilityNode.textContent || 'Unavailable';
  }
}
