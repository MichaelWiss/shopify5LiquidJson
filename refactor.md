# Refactor Plan — November 2025 Audit# Refactor Plan



## STATUS: Previous Items (Completed ✅)## 1. Unify Cart UI and Logic

1. ✅ **Cart System Consolidation** — Created `cart-item.liquid` snippet, unified JS logic- Consolidate the markup in `sections/cart.liquid` and `snippets/cart-drawer.liquid` into a single reusable snippet so both the cart page and drawer stay in sync.

2. ✅ **Newsletter Form DRY** — Created `newsletter-form.liquid` snippet with style variants- Remove the inline script inside `sections/cart.liquid` and ensure `assets/theme.js` exposes one cart controller (open/close, quantity, remove) that both contexts reuse.

3. ✅ **Template Alignment** — Added breadcrumbs to product.json, collection-banner to collection.json- Update `theme.js` to detect whether it should refresh the drawer, the cart page, or both, instead of maintaining two separate `updateCartItem` flows.

4. ✅ **Product Detail Modularization** — Created `product-swatch-picker.liquid` and `product-gallery-item.liquid`

5. ✅ **Arrow Link Standardization** — Enhanced `arrow-link.liquid` with parameters, replaced inline usage## 2. Consolidate Newsletter Sections

6. ✅ **CSS Linting Enhancement** — Improved `check-homepage-styles.js` to handle multi-line selectors- Extract the shared Shopify customer form markup (hidden tag, label, email field, success/error messaging) into `snippets/newsletter-form.liquid`.

- Refactor `sections/newsletter.liquid` and `sections/newsletter-simple.liquid` to render the snippet and restrict themselves to layout and styling, or merge them with a “layout style” select.

---- Align CSS so both visual treatments use the same structural classes, reducing drift.



## CRITICAL PRIORITIES (Implement Immediately)## 3. Align Templates with Requirements

- Update `templates/index.json` to follow the required section order (hero split → intro text → featured collections → image-with-text → editorial grid → newsletter).

### 1. Variant Selection JavaScript ✅ COMPLETE

**Severity:** ✅ **COMPLETE** (Previously 🔴 CRITICAL)  

**Files:** `sections/product-detail.liquid`, `assets/theme.js`

**Status:**  
Fully implemented and tested. See `VARIANT_SELECTION_TEST.md` for complete documentation.

**Implementation Details:**
- ✅ Product variants JSON embedded in DOM via `<script data-product-json>`
- ✅ Event listeners attached to all option selects and swatch radio inputs
- ✅ `findMatchingVariant()` function matches selected options against variants array
- ✅ Hidden input value, price display, SKU, and availability updated on option change
- ✅ Unavailable variants handled (button disabled, "Sold Out" text)
- ✅ Works with both SELECT dropdowns and radio input swatches
- ✅ Error handling with ErrorHandler utility

**Code Location:**
- JavaScript: `assets/theme.js` lines 361-491
- Liquid: `sections/product-detail.liquid` lines 32-77, 178-180
- Snippet: `snippets/product-swatch-picker.liquid` line 49

**Estimated Impact:** ~130 lines JavaScript (already implemented), ~10 lines Liquid (already implemented)

---

### 2. Fix Duplicate Comment Tags in newsletter-form.liquid ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🔴 CRITICAL)
**Files:** `snippets/newsletter-form.liquid`, `sections/newsletter.liquid`

**Status:**
Fixed by creating the missing `snippets/newsletter-form.liquid` file (which was referenced but didn't exist) and refactoring `sections/newsletter.liquid` to use it. This resolved both the missing file issue and the DRY requirement while ensuring no duplicate comment tags were introduced.

**Code Location:**
- Snippet: `snippets/newsletter-form.liquid`
- Usage: `sections/newsletter.liquid` lines 11-16

**Estimated Impact:** Critical fix for rendering stability + architectural improvement (DRY)

---

### 3. Metafield Integration for Product Details ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🔴 CRITICAL)
**Files:** `sections/product-detail.liquid`, `sections/specs-table.liquid`, `snippets/product-summary-row.liquid`

**Status:**
Completed. Updated schemas to accept a `metafield_key` setting which automatically reads from `product.metafields.custom`. Added logic to fallback to static values. Created `METAFIELDS.md` documentation.

**Code Location:**
- Product Detail: `sections/product-detail.liquid` (Schema)
- Specs Table: `sections/specs-table.liquid` (Schema & Logic)
- Snippet: `snippets/product-summary-row.liquid` (Logic)

**Estimated Impact:** Merchant flexibility unlocked for product attributes

---

## HIGH PRIORITY (Implement Soon)

### 4. Cart Drawer Focus Trap ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🟡 HIGH)  
**Files:** `assets/theme.js`

**Status:**  
Fully implemented. Focus trap includes Tab cycling (forward/backward), Escape key handler, return focus to trigger element, and proper ARIA attributes.

**Code Location:**
- Focus trap: `assets/theme.js` lines 87-110
- Escape handler: `assets/theme.js` lines 310-313
- Release focus: `assets/theme.js` lines 112-120
- Overlay click validation: `assets/theme.js` lines 301-306

**Estimated Impact:** ~50 lines JavaScript (already implemented)

---

### 5. Form Loading States (PARTIAL - Needs Enhancement)
**Severity:** 🟡 **HIGH**  
**Files:** `assets/theme.js`, `sections/product-detail.liquid`, `theme.scss`

**Problem:**  
Add-to-cart disables submit button but doesn't disable ALL form fields or add visual loading class. Users can still change variant/quantity during submission.

**Current State:**
- ✅ Submit button disabled (line 328)
- ✅ Button text changes to "Adding..." (line 329)
- ❌ Missing: `.form-loading` class on form element
- ❌ Missing: Disable all inputs/selects
- ❌ Missing: Loading spinner/visual indicator CSS

**Solution:**
```javascript
// Add at line 327 in theme.js:
form.classList.add('form-loading');
form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);

// Add at line 352:
form.classList.remove('form-loading');
form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
```

```scss
// Add to sections-product.scss:
.form-loading {
  opacity: 0.6;
  pointer-events: none;
}
```

**Estimated Impact:** ~30 lines JavaScript, ~20 lines CSS

---

### 6. Cart Footer Snippet Extraction ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🟡 HIGH)
**Files:** `snippets/cart-footer.liquid`

**Status:**  
Already implemented with `context` parameter accepting 'drawer' or 'page'.

**Code Location:**
- Snippet: `snippets/cart-footer.liquid` lines 1-35
- Accepts context parameter with conditional classes

**Estimated Impact:** ~40 lines (already implemented)

---

### 7. Documentation: README.md ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🟡 HIGH)
**Files:** `README.md`

**Status:**  
Comprehensive 432-line README exists covering prerequisites, installation, development workflow, build process, deployment, and project structure.

**Code Location:** `README.md`

---

### 8. Version Control: .gitignore ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🟡 HIGH)
**Files:** `.gitignore`

**Status:**  
Complete 67-line .gitignore covering node_modules, .DS_Store, editor configs, build artifacts, etc.

**Code Location:** `.gitignore`

---

## MEDIUM PRIORITY (Quality Improvements)

### 9. Color Swatch Focus Indicators
**Severity:** 🔴 **CRITICAL (Accessibility)**  
**Files:** `sections-product.scss`

**Problem:**  
Visually-hidden radio inputs lack visible focus indicators for keyboard navigation, violating WCAG 2.1 Level A.

**Solution:**  
```scss
// Add to sections-product.scss:
.color-dot:has(:focus-visible) {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

.color-dot input:focus-visible + .color-dot__inner {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}
```

**Estimated Impact:** ~5 lines CSS

---

### 10. Missing Templates
**Severity:** 🟡 **MEDIUM**  
**Files:** Create `templates/blog.json`, `article.json`, `search.json`, `404.json`

**Problem:**  
Theme falls back to Shopify defaults for blog, search, error pages. Inconsistent styling.

**Current State:**
- ✅ Exists: `cart.json`, `collection.json`, `index.json`, `list-collections.json`, `page.json`, `page.showrooms.json`, `product.json`
- ❌ Missing: `blog.json`, `article.json`, `search.json`, `404.json`

**Solution:**  
Create 4 minimal JSON templates:
- Blog template: uses intro-text, article loop, pagination
- Article template: breadcrumbs, article content, related articles
- Search template: search form, results grid
- 404 template: error message, navigation suggestions

**Estimated Impact:** ~150 lines JSON across 4 files

---

### 11. Settings Schema Expansion ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🟡 MEDIUM)
**Files:** `config/settings_schema.json`

**Status:**  
Comprehensive settings schema already implemented with:
- ✅ Global settings (breadcrumbs)
- ✅ Color system (8 customizable colors)
- ✅ Typography (heading serif, body sans font pickers)

**Code Location:** `config/settings_schema.json` lines 1-115

---

### 12. Product Gallery Minimum Views Setting ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🟡 MEDIUM)
**Files:** `sections/product-detail.liquid`

**Status:**  
Schema setting exists (lines 188-195) and is used in template logic (line 159).

**Code Location:**
- Schema: `sections/product-detail.liquid` lines 188-195
- Logic: `sections/product-detail.liquid` line 159

---

### 13. Related Products Fallback Logic
**Severity:** 🔴 **BUG FIX**  
**Files:** `sections/related-products.liquid`

**Problem:**  
Fallback collection filter (line 19) excludes current product but doesn't increment limit. Could show fewer than requested items.

**Solution:**  
```liquid
{% assign actual_limit = limit | plus: 1 %}
{% for item in fallback_collection.products limit: actual_limit %}
  {% unless item.id == product.id %}
```

**Estimated Impact:** 2 lines Liquid

---

### 14. Main Content Wrapper
**Severity:** 🟡 **MEDIUM**  
**Files:** `layout/theme.liquid`

**Problem:**  
`<main>` directly wraps `{{ content_for_layout }}` without container. Sections have inconsistent max-width/spacing.

**Solution:**  
Either:
- Add `.main-content` wrapper with consistent padding
- Or establish section-level spacing tokens and document pattern
- Audit all sections for consistent vertical rhythm

**Estimated Impact:** Design decision + ~20 lines CSS or documentation

---

## LOW PRIORITY (Polish & Optimization)

### 15. CSS Build Optimization
**Severity:** 🟢 **LOW**  
**Files:** `package.json`

**Problem:**  
Sass compilation doesn't minify CSS for production.

**Solution:**  
Add minified build script:
```json
"build:css": "sass --no-source-map --style=compressed theme.scss assets/theme.css",
"build:css:dev": "sass --no-source-map theme.scss assets/theme.css"
```

**Estimated Impact:** 1 line change, ~30% smaller CSS

---

### 16. Translation Coverage
**Severity:** 🟢 **LOW**  
**Files:** `locales/en.default.json`, all sections/snippets

**Problem:**  
Only 8 translation keys defined. Hardcoded English strings throughout ("Your Cart", "Add to cart", etc.).

**Solution:**  
- Extract all customer-facing strings to locale file
- Update all sections to use `{{ 'key' | t }}` pattern
- Add at least 30+ keys for complete coverage
- Create locale file template for other languages

**Estimated Impact:** ~50 translation keys, refactor ~20 files

---

### 17. Money Formatting Utility
**Severity:** 🟢 **LOW**  
**Files:** `assets/theme.js`

**Problem:**  
`formatMoney()` hardcodes `$` and assumes USD. Won't work for multi-currency.

**Solution:**  
Use Shopify's global `Shopify.formatMoney()` or create locale-aware formatter:
```javascript
function formatMoney(cents) {
  const format = window.Shopify?.currency?.format || '${{amount}}';
  return format.replace('{{amount}}', (cents / 100).toFixed(2));
}
```

**Estimated Impact:** ~5 lines JavaScript

---

### 18. Arrow Link Icon Size Audit
**Severity:** 🟡 **LOW**  
**Files:** `sections/hero-split.liquid`, `sections/collection-grid.liquid`, `sections/feature-overlay.liquid`

**Problem:**  
Need to verify all `{% render 'arrow-link' %}` calls specify explicit `icon_size` parameter.

**Current State:**
- ✅ `hero-split.liquid` line 21: Has `icon_size: '14'`
- ✅ `collection-grid.liquid`: Uses `arrow-link` snippet with sizing
- ✅ `feature-overlay.liquid`: Uses `arrow-link` snippet with sizing

**Solution:**  
Audit confirmed - all usages properly specify icon sizing.

**Estimated Impact:** No changes needed

---

### 19. Cart Image Dimensions
**Severity:** 🟢 **LOW**  
**Files:** `snippets/cart-item.liquid`

**Problem:**  
Width/height attributes (120x150) don't match `image_url: width: 200`, causing CLS.

**Solution:**  
Either:
- Change to `width="100" height="125"` (matching 200px image at 2x ratio)
- Or use `image_url: width: 240` for true 2x retina

**Estimated Impact:** 1 line change per cart snippet

---

### 20. Liquid Comment Style Consistency
**Severity:** 🟢 **LOW**  
**Files:** All `.liquid` files

**Problem:**  
Mix of block comments, inline comments, decorative hyphens.

**Solution:**  
Establish style guide:
- Block comments for documentation headers
- Inline comments for single-line explanations  
- No decorative hyphens
- Update existing files gradually

**Estimated Impact:** Documentation + gradual cleanup

---

### 21. Placeholder Gradient Tokens
**Severity:** 🟢 **LOW**  
**Files:** `sections/product-detail.liquid`

**Problem:**  
Hardcoded gradient strings don't reference `_tokens.scss` colors.

**Solution:**  
Move placeholder gradients to section settings or create snippet that uses token variables.

**Estimated Impact:** ~20 lines refactored

---

### 22. Cart Overlay Click Handler ✅ COMPLETE
**Severity:** ✅ **COMPLETE** (Previously 🟢 LOW)
**Files:** `assets/theme.js`

**Status:**  
Already implemented with proper target validation.

**Code Location:** `assets/theme.js` lines 301-306

**Estimated Impact:** Already complete

---

### 23. Linklists Performance
**Severity:** 🟢 **LOW**  
**Files:** `sections/header.liquid`, `footer.liquid`

**Problem:**  
Repeated `linklists[menu_handle]` lookups instead of assigning once.

**Solution:**  
```liquid
{% assign menu = linklists[menu_handle] %}
{% if menu %}
  {% for link in menu.links %}
```

**Estimated Impact:** ~5 line changes

---

### 24. Cart Count Badge Accessibility
**Severity:** 🟢 **LOW**  
**Files:** `sections/header.liquid`

**Problem:**  
Uses `hidden` attribute instead of `aria-hidden` + CSS class.

**Solution:**  
```liquid
<span class="cart-count {% if cart.item_count == 0 %}visually-hidden{% endif %}" aria-live="polite">
```

**Estimated Impact:** 1 line change

---

### 25. Newsletter Success State
**Severity:** 🟢 **LOW**  
**Files:** `snippets/newsletter-form.liquid`

**Problem:**  
After success, form shows message but keeps input visible.

**Solution:**  
Either hide entire form after success, or add "Subscribe another email" reset button.

**Estimated Impact:** ~10 lines Liquid

---

### 26. Section Schema Custom Classes
**Severity:** 🟢 **LOW**  
**Files:** Multiple section schemas

**Problem:**  
No custom CSS class input or heading tag selector for merchants.

**Solution:**  
Add to relevant schemas:
```json
{
  "type": "text",
  "id": "custom_class",
  "label": "Custom CSS class",
  "info": "Add custom classes for styling"
}
```

**Estimated Impact:** ~20 lines across multiple schemas

---

### 27. Cart Drawer Section Rendering API
**Severity:** 🟢 **LOW**  
**Files:** `assets/theme.js`

**Problem:**  
`refreshCartDrawer()` rebuilds HTML with JavaScript templates instead of fetching server-rendered content.

**Solution:**  
Use Shopify Section Rendering API:
```javascript
fetch('/?section_id=cart-drawer')
  .then(r => r.text())
  .then(html => {
    drawerContent.innerHTML = html;
  });
```

**Estimated Impact:** ~30 lines simplified, better maintainability

---

### 28. Webkit Scrollbar Styles
**Severity:** 🟢 **LOW**  
**Files:** `assets/theme.css`

**Problem:**  
Linting script detects 3 missing webkit scrollbar pseudo-selectors for `.products-scroll`.

**Solution:**  
Either add custom scrollbar styles or document as intentional omission:
```css
.products-scroll::-webkit-scrollbar { height: 8px; }
.products-scroll::-webkit-scrollbar-thumb { background: var(--color-border); }
.products-scroll::-webkit-scrollbar-track { background: transparent; }
```

**Estimated Impact:** 3 lines CSS (optional)

---

### 29. Cleanup Demo Assets
**Severity:** 🟢 **LOW**
**Files:** `assets/`

**Problem:**
Multiple demo CSS files exist (`homepage-demo-styles.css`, `homepage-demo.css`) that should be consolidated into `theme.css` or removed.

**Solution:**
Audit and remove/merge:
- `homepage-demo-styles.css`
- `homepage-demo.css`
- `sections-homepage.css`

**Estimated Impact:** Reduced file count, cleaner asset directory

---

## PORTABLE FEATURES INTEGRATION (From portableFeatures.md)

### 30. Critical Architectural Features
- [ ] **Dynamic Header Color Switching** (Logic: `assets/theme.js`, Schema: `sections/header.liquid`)
- [ ] **Scroll-Aware Logo Fade** (Logic: `assets/theme.js`)
- [ ] **Internal Section Navigation** (Snippet: `internal-navigation.liquid`)

### 31. High Value Components
- [ ] **Offset Carousel Component** (New Section: `sections/offset-carousel.liquid`)
- [ ] **Product Card Multi-State Images** (Update: `snippets/product-card.liquid`)
- [ ] **Popup Modal System** (New Snippet: `snippets/popup-modal.liquid`)
- [ ] **Cookie Consent Banner** (New Section: `sections/cookie-consent.liquid`)

---

## IMPLEMENTATION ROADMAP

### Phase 1: Critical Fixes ✅ MOSTLY COMPLETE
- [x] Issue #1: Variant selection JavaScript ✅ COMPLETE
- [x] Issue #2: Fix newsletter-form duplicate comments ✅ COMPLETE
- [x] Issue #3: Metafield integration ✅ COMPLETE
- [x] Issue #4: Cart drawer focus trap ✅ COMPLETE
- [x] Issue #6: Cart footer snippet ✅ COMPLETE
- [x] Issue #7: README.md ✅ COMPLETE
- [x] Issue #8: .gitignore ✅ COMPLETE
- [x] Issue #11: Settings schema expansion ✅ COMPLETE
- [x] Issue #12: Gallery minimum views ✅ COMPLETE
- [x] Issue #22: Overlay click handler ✅ COMPLETE

### Phase 2: Critical Remaining (Immediate Priority)
- [ ] Issue #9: Swatch focus indicators (~5 lines CSS) 🔴 CRITICAL
- [ ] Issue #5: Complete form loading states (~50 lines) 🔴 HIGH
- [ ] Issue #13: Related products bug fix (2 lines) 🔴 BUG

### Phase 3: Templates & Polish (Week 2)
- [ ] Issue #10: Missing templates (4 files, ~150 lines)
- [ ] Issue #14: Main content wrapper decision
- [ ] Issue #15-28: Low priority optimizations

### Phase 4: Optional Enhancements
- [ ] Issue #16: Translation coverage
- [ ] Issue #17: Money formatting
- [ ] Issue #19-28: Polish items

### Phase 5: Portable Features (Post-Launch)
- [ ] Issue #30: Architectural Features (Header, Scroll, Nav)
- [ ] Issue #31: High Value Components (Carousel, Modals, Multi-state Cards)

---

## TECHNICAL DEBT SUMMARY (UPDATED)

**Lines of Code Impact:**
- ✅ Critical fixes complete: ~400 lines already implemented
- 🔴 Critical remaining: ~60 lines (Issues #5, #9, #13)
- 🟡 High priority: ~150 lines (Issue #10 - templates)
- 🟢 Low priority: ~100 lines (polish & optimization)

**Total Remaining Effort:** 
- **Critical work:** 2-3 hours
- **Including templates:** 4-6 hours
- **Full polish:** 8-12 hours

**Status:**
- **Phase 1:** 10/10 complete (100%) ✅
- **Phase 2:** 0/3 complete (0%) 
- **Phase 3+:** Not started

**Risk Mitigation:**
- ✅ All blocking issues resolved
- ✅ Core functionality operational
- 🔴 Accessibility gaps remain (swatch focus)
- 🟡 Missing standard templates (blog, search, 404)
