# Variant Selection Testing Checklist

Manual test checklist for validating product variant selection functionality in the Shopify theme.

## Prerequisites

Before testing, ensure you have:

- [ ] A product with **multiple variants** (at least 2 options with 2-3 values each)
- [ ] At least one variant marked as **sold out** or unavailable
- [ ] Variants with **different prices** (e.g., $10, $15, $20)
- [ ] Variants with **SKU values** assigned
- [ ] The product detail page accessible via `shopify theme dev`

### Recommended Test Product Setup

Create a test product with these characteristics:

**Product:** "Test Lamp"

**Options:**
- **Option 1 - Finish:** Brass, Bronze, Black
- **Option 2 - Size:** Small, Medium, Large

**Variants:**
| Finish | Size   | Price  | SKU        | Available |
|--------|--------|--------|------------|-----------|
| Brass  | Small  | $100   | LAMP-BR-SM | ✅ Yes    |
| Brass  | Medium | $150   | LAMP-BR-MD | ✅ Yes    |
| Brass  | Large  | $200   | LAMP-BR-LG | ❌ No     |
| Bronze | Small  | $110   | LAMP-BZ-SM | ✅ Yes    |
| Bronze | Medium | $160   | LAMP-BZ-MD | ❌ No     |
| Bronze | Large  | $210   | LAMP-BZ-LG | ✅ Yes    |
| Black  | Small  | $105   | LAMP-BK-SM | ✅ Yes    |
| Black  | Medium | $155   | LAMP-BK-MD | ✅ Yes    |
| Black  | Large  | $205   | LAMP-BK-LG | ✅ Yes    |

---

## Test Cases

### Test 1: Variant ID Updates When Options Change

**Objective:** Verify that the hidden input field (`name="id"`) contains the correct variant ID when product options are changed.

#### Steps:
1. Open the product detail page in your browser
2. Open browser DevTools (Inspector)
3. Locate the hidden input: `<input type="hidden" name="id" data-variant-id-input>`
4. Note the initial variant ID value (e.g., `12345678901234`)
5. Change the first option (e.g., from "Brass" to "Bronze")
6. Inspect the hidden input again
7. Change the second option (e.g., from "Small" to "Medium")
8. Inspect the hidden input again

#### Expected Results:
- [ ] Hidden input value changes when first option is changed
- [ ] Hidden input value changes when second option is changed
- [ ] Each combination produces a unique variant ID
- [ ] No JavaScript errors in console

#### Notes:
```
Initial variant ID: _____________
After changing Finish: _____________
After changing Size: _____________
```

---

### Test 2: Product Price Updates When Variant Changes

**Objective:** Verify that the displayed price updates to reflect the selected variant's price.

#### Steps:
1. Open the product detail page
2. Note the initial displayed price (should match first available variant)
3. Locate the price element with `data-product-price` attribute
4. Change options to select "Brass / Medium" ($150)
5. Verify price display updates
6. Change options to select "Bronze / Large" ($210)
7. Verify price display updates
8. Change options to select "Black / Small" ($105)
9. Verify price display updates

#### Expected Results:
- [ ] Price displays "$100" initially (or first variant price)
- [ ] Price updates to "$150" when "Brass / Medium" is selected
- [ ] Price updates to "$210" when "Bronze / Large" is selected
- [ ] Price updates to "$105" when "Black / Small" is selected
- [ ] Price formatting matches Shopify currency settings
- [ ] No flash of old price before update (smooth transition)

#### Notes:
```
Initial price: _____________
Brass/Medium: _____________
Bronze/Large: _____________
Black/Small: _____________
```

---

### Test 3: Unavailable Variant Handling

**Objective:** Verify that when an unavailable variant is selected, the add-to-cart button is disabled and appropriate messaging is displayed.

#### Steps:
1. Open the product detail page
2. Select options for an **available** variant (e.g., "Brass / Small")
3. Verify the add-to-cart button is enabled
4. Note the button text (should be "Add to cart" or configured label)
5. Select options for an **unavailable** variant (e.g., "Brass / Large")
6. Verify the add-to-cart button becomes disabled
7. Check the button text changes to "Sold out"
8. Check for availability message (element with `data-product-availability`)
9. Attempt to click the disabled button
10. Switch back to an available variant (e.g., "Bronze / Large")
11. Verify button re-enables

#### Expected Results:
- [ ] Add-to-cart button is **enabled** for available variants
- [ ] Add-to-cart button shows default label ("Add to cart")
- [ ] Add-to-cart button becomes **disabled** for unavailable variants
- [ ] Button text changes to "Sold out" when unavailable
- [ ] Availability message displays "Unavailable" or configured text
- [ ] Button cannot be clicked when disabled (no form submission)
- [ ] Button re-enables when switching back to available variant
- [ ] Button text reverts to "Add to cart" when re-enabled

#### Notes:
```
Available variant button state: _____________
Unavailable variant button state: _____________
Button text when unavailable: _____________
Availability message: _____________
```

---

### Test 4: findMatchingVariant Function Logic

**Objective:** Verify that the JavaScript function correctly matches selected options to the corresponding variant.

#### Steps:
1. Open the product detail page
2. Open browser DevTools Console
3. Paste the following test script:

```javascript
// Get product data
const productScript = document.querySelector('script[data-product-json]');
const product = JSON.parse(productScript.textContent);

// Test helper
function testVariantMatch(option1Value, option2Value) {
  const selectedOptions = [option1Value, option2Value];
  const variant = product.variants.find(v =>
    v.options.every((val, idx) => val === selectedOptions[idx])
  );
  console.log(`Testing: ${option1Value} / ${option2Value}`);
  console.log(`Found variant:`, variant ? variant.id : 'NOT FOUND');
  console.log(`Expected options:`, selectedOptions);
  console.log(`Actual options:`, variant ? variant.options : 'N/A');
  console.log('---');
  return variant;
}

// Run tests
console.log('=== Variant Matching Tests ===');
testVariantMatch('Brass', 'Small');
testVariantMatch('Bronze', 'Medium');
testVariantMatch('Black', 'Large');
testVariantMatch('Invalid', 'Option'); // Should return undefined
```

4. Review console output for each test case

#### Expected Results:
- [ ] "Brass / Small" returns a valid variant object
- [ ] "Bronze / Medium" returns a valid variant object
- [ ] "Black / Large" returns a valid variant object
- [ ] Invalid option combinations return `undefined` or `null`
- [ ] Each variant object contains correct `id`, `price`, `sku`, `available` properties
- [ ] No JavaScript errors thrown

#### Notes:
```
Brass/Small variant ID: _____________
Bronze/Medium variant ID: _____________
Black/Large variant ID: _____________
Invalid combo result: _____________
```

---

### Test 5: SKU Display Updates When Variant Changes

**Objective:** Verify that the displayed SKU (if enabled) updates to reflect the selected variant's SKU.

**Note:** This test requires the "Show SKU" setting to be enabled in the product detail section's meta block.

#### Setup:
1. Go to Shopify theme editor
2. Navigate to the product detail section
3. Find the "Meta" block
4. Enable "Show SKU" checkbox
5. Save changes

#### Steps:
1. Open the product detail page
2. Verify SKU row is visible (element with `data-product-sku-row`)
3. Note the initial SKU value (element with `data-product-sku`)
4. Select "Brass / Medium" variant
5. Verify SKU updates to "LAMP-BR-MD"
6. Select "Black / Large" variant
7. Verify SKU updates to "LAMP-BK-LG"
8. If available, select a variant **without** a SKU value
9. Verify SKU row is hidden (has `hidden` attribute)
10. Switch back to a variant with a SKU
11. Verify SKU row becomes visible again

#### Expected Results:
- [ ] SKU row is visible when variant has SKU
- [ ] SKU value displays correct code for "Brass / Medium" (LAMP-BR-MD)
- [ ] SKU value updates to "LAMP-BK-LG" for "Black / Large"
- [ ] SKU row is hidden when variant has no SKU
- [ ] SKU row becomes visible again when switching to variant with SKU
- [ ] No layout shift or visual glitches during updates

#### Notes:
```
Initial SKU: _____________
Brass/Medium SKU: _____________
Black/Large SKU: _____________
Variant without SKU behavior: _____________
```

---

## Cross-Browser Testing

After completing all tests above, repeat the entire checklist in:

- [ ] **Chrome/Edge** (Desktop)
- [ ] **Safari** (Desktop)
- [ ] **Firefox** (Desktop)
- [ ] **Safari** (iOS/iPhone)
- [ ] **Chrome** (Android)

---

## Edge Cases & Additional Tests

### Test 6: Multiple Option Types (Select + Swatch)

If your product uses both dropdown selects and swatch pickers:

1. Configure one option as swatches (e.g., "Finish")
2. Keep another option as dropdown (e.g., "Size")
3. Test variant selection by:
   - [ ] Clicking swatch + changing dropdown
   - [ ] Changing dropdown + clicking different swatch
   - [ ] Verify both input types trigger variant updates correctly

### Test 7: Single-Option Products

1. Test with a product that has only ONE option (e.g., "Color" with 3 values)
2. Verify:
   - [ ] Variant selection works with single option
   - [ ] Price updates correctly
   - [ ] Availability logic works

### Test 8: Default Variant Products

1. Test with a product that has **no variants** (default variant only)
2. Verify:
   - [ ] Hidden input has correct default variant ID
   - [ ] No option selectors are rendered
   - [ ] Add-to-cart works correctly
   - [ ] No JavaScript errors

### Test 9: Rapid Option Changes

1. Quickly change options multiple times in succession
2. Verify:
   - [ ] UI updates smoothly without race conditions
   - [ ] Final state matches last selected options
   - [ ] No flickering or incorrect temporary states

### Test 10: Page Load State

1. Refresh the page multiple times
2. Verify:
   - [ ] Initial variant is correctly selected (first available variant)
   - [ ] Initial price matches selected variant
   - [ ] Initial SKU (if shown) matches selected variant
   - [ ] If initial variant is unavailable, button is disabled from page load

---

## Accessibility Testing

### Keyboard Navigation

- [ ] All option selects are keyboard accessible (Tab key)
- [ ] All swatch radio buttons are keyboard accessible
- [ ] Swatch selections work with arrow keys
- [ ] Add-to-cart button can be focused and activated with Enter/Space
- [ ] Focus indicators are visible

### Screen Reader Testing

- [ ] Price updates announce to screen readers (`aria-live="polite"`)
- [ ] Availability message announces to screen readers (`aria-live="polite"`)
- [ ] Option labels are properly associated with inputs
- [ ] Disabled button state is announced

---

## Performance Testing

- [ ] Variant updates happen within 100ms (no noticeable lag)
- [ ] No console errors or warnings
- [ ] No memory leaks after multiple option changes (check DevTools Performance tab)

---

## Sign-Off

### Tested By:
- **Name:** _______________________
- **Date:** _______________________
- **Environment:** _______________________
  - Shopify theme dev server
  - Staging store: _______________________
  - Production store: _______________________

### Test Results:
- [ ] ✅ All tests passed
- [ ] ⚠️ Some tests failed (see notes below)
- [ ] ❌ Critical failures blocking deployment

### Issues Found:
```
Issue #1:
Description: 
Steps to reproduce:
Severity: [Critical / High / Medium / Low]

Issue #2:
Description:
Steps to reproduce:
Severity: [Critical / High / Medium / Low]
```

---

## Debugging Tips

If tests fail, check:

1. **Console errors:** Open DevTools → Console tab
2. **Network errors:** Check if product JSON loads correctly
3. **Liquid template:** Verify `data-section-id` matches script's `data-product-json`
4. **Product data:** Verify product has `data-option-position` attributes on all option inputs
5. **Hidden input:** Verify it has `data-variant-id-input` attribute
6. **Price element:** Verify it has `data-product-price` attribute
7. **Button element:** Verify it has `data-product-atc` attribute

### Common Issues:

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Price doesn't update | Missing `data-product-price` attribute | Add to price element in `product-detail.liquid` |
| Button stays enabled | Missing `data-product-atc` attribute | Add to button in variant_picker block |
| Variant ID doesn't change | Missing `data-variant-id-input` attribute | Add to hidden input |
| SKU doesn't update | Missing `data-product-sku` attributes | Add to meta block elements |
| No variant matching | Product JSON not embedded | Check `<script data-product-json>` exists |

---

## Automation Opportunities

While this is a manual checklist, consider adding automated tests for:

- Unit tests for `findMatchingVariant()` function (Jest + JSDOM)
- End-to-end tests for full user flows (Playwright/Cypress)
- Visual regression tests for UI consistency (Percy/Chromatic)

See project documentation for future automation plans.
