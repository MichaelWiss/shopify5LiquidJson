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

### 4. Cart Drawer Focus Trap
**Severity:** 🟡 **HIGH**  
**Files:** `assets/theme.js`

**Problem:**  
Cart drawer opens as modal but doesn't trap focus. Users can tab to elements behind overlay, violating WCAG 2.1 and ARIA modal pattern.

**Solution:**
- Query all focusable elements within drawer on open
- Focus first element (close button or first cart item)
- Intercept Tab keypress and cycle focus within drawer
- On close, return focus to cart icon that triggered drawer
- Use `querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')` for focus candidates

**Estimated Impact:** ~50 lines JavaScript

---

### 5. Form Loading States
**Severity:** 🟡 **HIGH**  
**Files:** `assets/theme.js`, `sections/product-detail.liquid`

**Problem:**  
Add-to-cart shows "Adding..." but doesn't disable form fields. Users can change variant/quantity during submission, causing duplicate requests.

**Solution:**
- Add `.form-loading` class to entire form during submission
- Disable all inputs/selects during AJAX request
- Show spinner or loading animation
- Handle errors gracefully with user feedback
- Re-enable form on success/error

**Estimated Impact:** ~30 lines JavaScript, ~20 lines CSS

---

### 6. Cart Footer Snippet Extraction
**Severity:** 🟡 **HIGH**  
**Files:** `snippets/cart-drawer.liquid`, `sections/cart.liquid`

**Problem:**  
Cart footer (subtotal, P.O. button, quote button, checkout) duplicated across drawer and page contexts.

**Solution:**
- Create `snippets/cart-footer.liquid` accepting `context` parameter ('drawer' or 'page')
- Extract footer markup with conditional classes based on context
- Update both cart files to render snippet
- Ensure JavaScript cart refresh also uses new snippet structure

**Estimated Impact:** ~40 lines saved, improved maintainability

---

### 7. Documentation: README.md
**Severity:** 🟡 **HIGH**  
**Files:** Create `README.md` in project root

**Problem:**  
No setup documentation. Project has `requirements.md` and `project-plan.md` but no developer onboarding guide.

**Solution:**  
Create comprehensive README covering:
- Project overview and design philosophy
- Prerequisites (Node.js 18+, Shopify CLI, Sass)
- Installation: `npm install`
- Development workflow: `shopify theme dev`, `npm run watch:css`
- Build process: `npm run build:css`
- Deployment: `shopify theme push`
- Project structure overview
- Link to requirements.md and project-plan.md

**Estimated Impact:** ~200 lines documentation, critical for handoff

---

### 8. Version Control: .gitignore
**Severity:** 🟡 **HIGH**  
**Files:** Create `.gitignore` in project root

**Problem:**  
No .gitignore means risk of committing `node_modules/`, `.DS_Store`, editor configs.

**Solution:**  
Create .gitignore with:
```
node_modules/
.DS_Store
.shopifyignore
.env
*.log
.vscode/
.idea/
```

**Estimated Impact:** 1 minute, prevents repo bloat

---

## MEDIUM PRIORITY (Quality Improvements)

### 9. Color Swatch Focus Indicators
**Severity:** 🟡 **MEDIUM**  
**Files:** `assets/theme.css`, `snippets/product-swatch-picker.liquid`

**Problem:**  
Visually-hidden radio inputs lack visible focus indicators for keyboard navigation, failing WCAG 2.1.

**Solution:**  
Add CSS for keyboard focus:
```css
.color-dot:has(:focus-visible) {
  outline: 2px solid var(--color-text-primary);
  outline-offset: 2px;
}
```

**Estimated Impact:** ~5 lines CSS

---

### 10. Missing Templates
**Severity:** 🟡 **MEDIUM**  
**Files:** Create `templates/blog.json`, `article.json`, `search.json`, `404.json`, `password.json`

**Problem:**  
Theme falls back to Shopify defaults for blog, search, error pages. Inconsistent styling.

**Solution:**  
- Create minimal JSON templates for all standard Shopify pages
- Blog template: uses intro-text, article loop, pagination
- Article template: breadcrumbs, article content, related articles
- Search template: search form, results grid
- 404 template: error message, navigation suggestions
- Password template: store password form

**Estimated Impact:** ~150 lines JSON across 5 files

---

### 11. Settings Schema Expansion
**Severity:** 🟡 **MEDIUM**  
**Files:** `config/settings_schema.json`

**Problem:**  
Only one global setting (`show_global_breadcrumbs`). Merchants can't customize design system.

**Solution:**  
Add settings groups:
- **Colors:** Primary text, secondary text, background, surface, accent (expose token colors)
- **Typography:** Font family pickers, size scale multiplier
- **Layout:** Max content width (px), section spacing multiplier
- **Features:** Enable/disable breadcrumbs per template type
- **Cart:** Enable drawer vs. page-only mode, show/hide quote buttons

**Estimated Impact:** ~100 lines JSON schema

---

### 12. Product Gallery Minimum Views Setting
**Severity:** 🟡 **MEDIUM**  
**Files:** `sections/product-detail.liquid`

**Problem:**  
`{% assign minimum_views = 4 %}` is hardcoded. No merchant control.

**Solution:**  
Add schema setting:
```json
{
  "type": "range",
  "id": "minimum_gallery_items",
  "label": "Minimum gallery items",
  "min": 1,
  "max": 8,
  "step": 1,
  "default": 4,
  "info": "Placeholders will fill gaps if product has fewer images"
}
```

**Estimated Impact:** ~10 lines schema, 1 line Liquid update

---

### 13. Related Products Fallback Logic
**Severity:** 🟡 **MEDIUM**  
**Files:** `sections/related-products.liquid`

**Problem:**  
Fallback collection filter excludes current product but doesn't account for limit, potentially showing fewer items than requested.

**Solution:**  
Increment limit internally:
```liquid
{% assign actual_limit = limit | plus: 1 %}
{% for item in fallback_collection.products limit: actual_limit %}
  {% unless item.id == product.id %}
    ...
  {% endunless %}
{% endfor %}
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
**Severity:** 🟢 **LOW**  
**Files:** `sections/hero-split.liquid`, `image-with-text.liquid`, etc.

**Problem:**  
Some arrow-link renders don't specify `icon_size` parameter, defaulting to 14px instead of design spec 11px.

**Solution:**  
Audit all `{% render 'arrow-link' %}` calls and explicitly pass:
- `icon_size: '11'` for small CTAs (hero, image-with-text)
- `icon_size: '14'` for larger CTAs (collection cards, feature blocks)

**Estimated Impact:** ~10 line updates across 5 files

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

### 22. Cart Overlay Click Handler
**Severity:** 🟢 **LOW**  
**Files:** `assets/theme.js`

**Problem:**  
Overlay click closes drawer without checking event.target, fragile if DOM changes.

**Solution:**  
Add target check:
```javascript
cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) closeCartDrawer();
});
```

**Estimated Impact:** 1 line change

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

### Phase 1: Critical Fixes (Week 1)
- [x] Issue #1: Variant selection JavaScript ✅ COMPLETE
- [x] Issue #2: Fix newsletter-form duplicate comments ✅ COMPLETE
- [x] Issue #3: Metafield integration ✅ COMPLETE
- [ ] Issue #7: README.md
- [ ] Issue #8: .gitignore

### Phase 2: User Experience (Week 2)
- [ ] Issue #4: Focus trap in cart drawer
- [ ] Issue #5: Form loading states
- [ ] Issue #6: Cart footer snippet
- [ ] Issue #9: Swatch focus indicators
- [ ] Issue #10: Missing templates

### Phase 3: Merchant Features (Week 3)
- [ ] Issue #11: Settings schema expansion
- [ ] Issue #12: Gallery minimum views setting
- [ ] Issue #16: Translation coverage
- [ ] Issue #14: Main content wrapper decision

### Phase 4: Polish (Week 4)
- [ ] Issue #15: CSS minification
- [ ] Issue #17-28: Low priority optimizations
- [ ] Issue #29: Cleanup Demo Assets
- [ ] Final testing and QA
- [ ] Theme check validation

### Phase 5: Portable Features (Post-Launch)
- [ ] Issue #30: Architectural Features (Header, Scroll, Nav)
- [ ] Issue #31: High Value Components (Carousel, Modals, Multi-state Cards)

---

## TECHNICAL DEBT SUMMARY

**Lines of Code Impact:**
- Critical fixes: ~130 lines remaining (~130 already complete)
- High priority: ~340 lines added/refactored  
- Medium priority: ~300 lines added/refactored
- Low priority: ~100 lines polished

**Total Estimated Effort:** 2-3 weeks for remaining implementation

**Risk Mitigation:**
- ✅ Variant selection COMPLETE — was blocking, now resolved
- Focus trap and loading states are accessibility requirements
- Metafields unlock merchant autonomy
- Documentation enables team handoff
