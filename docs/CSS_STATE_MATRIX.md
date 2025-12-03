# CSS State Matrix

> **Purpose:** Document all interactive elements and their CSS states to prevent regressions during CSS refactors and optimizations.

## Critical Rules

1. **If you hide something in critical CSS, the "show" override MUST be documented here**
2. **Test ALL states after any CSS optimization, not just initial paint**
3. **Never defer CSS for components with complex interactive states**

---

## Interactive Components

### Cart Drawer

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Hidden (default) | Page load | `critical-css.liquid` | `.cart-drawer` | `opacity: 0; visibility: hidden; transform: translateX(100%)` |
| Open | Click cart icon | `sections-layout.css` | `.cart-drawer.is-open` | `opacity: 1; visibility: visible; transform: translateX(0)` |

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Hidden (default) | Page load | `critical-css.liquid` | `.cart-overlay` | `opacity: 0; visibility: hidden` |
| Visible | Cart open | `sections-layout.css` | `.cart-overlay.is-visible` | `opacity: 1; visibility: visible` |

**Body Scroll Lock:**
| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Locked | Cart open | `sections-layout.css` | `body.cart-drawer-open` | `overflow: hidden` |

---

### Header

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Default | Page load | `sections-layout.css` | `.site-header` | `background: var(--ink); position: fixed` |
| Scrolled | Scroll > 50px | `sections-layout.css` | `.site-header.scrolled` | (add if needed) |
| Dynamic color | Hero scroll | `sections-layout.css` | `.site-header[data-color-mode="dynamic"]` | CSS custom properties via JS |

---

### Product Form

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Default | Page load | `sections-product.css` | `.product-form` | Normal display |
| Loading | Add to cart click | `sections-product.css` | `.product-form.form-loading` | `pointer-events: none; opacity: 0.6` |

---

### Cart Item Quantity

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Default | — | `theme.css` | `.cart-item__qty-btn` | Normal button |
| Hover | Mouse hover | `theme.css` | `.cart-item__qty-btn:hover` | `background: var(--ink); color: var(--paper)` |

---

### Navigation Links

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Default | — | `sections-layout.css` | `.header-nav a` | `color: inherit` |
| Hover | Mouse hover | `sections-layout.css` | `.header-nav a:hover` | `opacity: 0.7` |

---

### Product Cards

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Default | — | `sections-product.css` | `.product-card__image` | `transform: scale(1)` |
| Hover | Mouse hover | `sections-product.css` | `.product-card__image:hover` | `transform: scale(1.03)` |

---

### Arrow Links

| State | Trigger | CSS File | Selector | Key Properties |
|-------|---------|----------|----------|----------------|
| Default | — | `theme.css` | `.arrow-link` | `gap: 6px` |
| Hover | Mouse hover | `theme.css` | `.arrow-link:hover` | `gap: 10px` |

---

## CSS Loading Strategy

### Synchronous (Render-Blocking)
These files load synchronously to prevent FOUC:

| File | Reason |
|------|--------|
| `critical-css.liquid` (inline) | Above-fold styles, prevents layout shift |
| `theme.css` | Core design tokens, base styles |
| `sections-layout.css` | Header/footer on every page |
| `sections-homepage.css` | Homepage-specific (only on index) |
| `sections-showroom.css` | Showroom page (complex layout, FOUC-prone) |

### Deferred (Non-Render-Blocking)
These files use `media="print" onload="this.media='all'"`:

| File | Reason |
|------|--------|
| `sections-product.css` | Product pages only |
| `sections-collection.css` | Collection pages only |
| `sections-cart.css` | Cart page only |
| `sections-content.css` | Generic content pages |
| `sections-blog.css` | Blog/article pages |
| `sections-list-collections.css` | Collections list page |

---

## Testing Checklist

After ANY CSS change, verify:

- [ ] **Cart drawer opens and closes** (click cart icon, overlay, close button, Escape key)
- [ ] **Cart items update** (quantity +/-, remove)
- [ ] **Add to cart works** (button shows loading state, drawer opens with new item)
- [ ] **Header scroll behavior** (if dynamic color enabled)
- [ ] **No FOUC on page load** (test on slow 3G in DevTools)
- [ ] **Hover states work** (links, buttons, cards)
- [ ] **Focus states work** (keyboard navigation)
- [ ] **Mobile responsive** (no horizontal scroll, touch targets)

---

## Known Specificity Conflicts

| Conflict | Resolution |
|----------|------------|
| `critical-css.liquid` hides cart drawer | `sections-layout.css` `.cart-drawer.is-open` overrides with `opacity: 1; visibility: visible` |
| Multiple `.intro-text` definitions | Consolidated in `theme.css`, page-specific overrides in section CSS |

---

## Change Log

| Date | Change | Files Affected | Tested |
|------|--------|----------------|--------|
| 2025-12-02 | Added `opacity/visibility` to `.cart-drawer.is-open` | `sections-layout.scss` | ✅ |
| 2025-12-02 | Made showroom CSS synchronous | `layout/theme.liquid` | ✅ |
