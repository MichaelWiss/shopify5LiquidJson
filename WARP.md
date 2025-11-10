# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### CSS Build System
```bash
# Compile SCSS to CSS (one-time build)
npm run build:css

# Watch SCSS files and recompile on changes
npm run watch:css

# Lint homepage styles against demo reference
npm run lint:homepage
```

### Shopify Theme Development
```bash
# Start local development server with live preview
shopify theme dev

# Push theme to Shopify store
shopify theme push

# Pull theme changes from Shopify
shopify theme pull
```

## Architecture Overview

### Shopify Online Store 2.0 Theme Structure

This is a custom Shopify theme implementing the "Refinements" design system—an editorial, quiet-confidence aesthetic with warm neutral palettes and modular composition.

**Key directories:**
- `layout/theme.liquid` - Base HTML wrapper, injects header/footer sections, handles breadcrumbs
- `sections/` - Modular, reusable page components with JSON schemas (hero-split, editorial-grid, product-detail, etc.)
- `templates/*.json` - JSON template files that compose sections (index, product, collection, page, cart)
- `snippets/` - Reusable markup partials (product-card, cart-item, breadcrumbs-bar, icon, navigation)
- `assets/` - Compiled CSS (`theme.css`), JavaScript (`theme.js`), and static files
- `config/settings_schema.json` - Global theme settings exposed in Shopify admin

### Design System Approach

**Token-based styling** using SCSS:
- `_tokens.scss` - CSS custom properties for colors, fonts, spacing units
- `_reset.scss` - Minimal CSS reset with box-sizing
- `_base.scss` - Base typography and layout utilities
- `theme.scss` - Main entry point that imports tokens/reset/base and section-specific styles

**Design tokens:**
- Colors: cream (#F5F1E8), warm-white (#FEFDFB), burgundy (#5C1F1F), terracotta (#A0584F), text-primary (#2D2820)
- Fonts: `--font-primary` (Times New Roman/serif), `--font-secondary` (system sans)
- Spacing: `--space-unit` base of 8px with calc multipliers (1-12 units)
- Breakpoints: 640px, 768px, 1024px, 1400px max-width

**Typography guardrails:**
- Serif headlines at 300-400 weight
- Sans body at 13px with tight tracking
- Navigation at 11px, 0.03em letter-spacing, weight 300
- Eyebrow labels uppercase at 0.08em letter-spacing

### Section Architecture Patterns

**Modular section system:**
- Each section has a Liquid schema defining configurable settings and blocks
- Sections reference shared CSS classes (e.g., `.hero-split__heading`, `.editorial-grid__item`)
- Default content reflects "Refinements" narrative (e.g., "Lighting and objects with quiet confidence")

**Key sections:**
- `header.liquid` - Burgundy fixed header with nav, cart icon
- `hero-split.liquid` - Split layout with image + content alignment toggle
- `intro-text.liquid` - Eyebrow + heading + rich text with adjustable alignment
- `featured-collections.liquid` - Up to 6 collection cards with override imagery
- `image-with-text.liquid` - Alternating layout toggle (`.reverse` class)
- `editorial-grid.liquid` - Block spans (half/full), figure captions
- `newsletter.liquid` - Customer form with success/error messaging
- `product-detail.liquid` - Gallery media, variant picker, quantity, add-to-cart
- `collection-grid.liquid` - Pagination, sorting, product cards
- `finish-swatches.liquid` - Optional image or color fallback
- `related-products.liquid` - Shopify related products API with fallback collection
- `cart-drawer.liquid` - Modal cart overlay with cart-item snippet

### Snippet Patterns

**Reusable components:**
- `product-card.liquid` - Media, title, pricing (sale-aware)
- `cart-item.liquid` - Line item with quantity controls, remove button
- `breadcrumbs-bar.liquid` - Semantic navigation breadcrumbs
- `icon.liquid` - SVG renders for cart/search with fallback
- `arrow-link.liquid` - Standardized CTA with arrow SVG and hover transition
- `product-swatch-picker.liquid` - Color/finish swatch selector
- `product-gallery-item.liquid` - Individual gallery image with caption

### JavaScript Architecture

`assets/theme.js` handles:
- Cart drawer open/close
- Cart item quantity updates via AJAX (`/cart/change.js`)
- Add-to-cart form submission with drawer auto-open
- Remove `no-js` class on page load

**Critical missing functionality:**
- Variant selection logic (hidden input `name="id"` not updated when options change)
- Product variants must be embedded as JSON in DOM and matched on option change

## Project Status & Phase

**Current phase:** Phase 1A — Demo CSS Port (In Progress)

**Goal:** Match demo HTML/CSS with pixel-perfect fidelity for core sections

**Completed tasks:**
- Replaced navigation markup with demo structure
- Ported demo colors/gradients for hero, collections, image-with-text, editorial, newsletter, footer
- Rebuilt PDP layout CSS to match demo visuals
- Created reusable snippets (cart-item, product-swatch-picker, product-gallery-item, arrow-link)

**Next milestones:**
- M1: Design System Integrated (End of Week 1)
- M2: Functional Hardening Complete (End of Week 2) - Fix variant form, newsletter integration
- M3: Content Pass & Optional Sections (End of Week 3)
- M4: Launch Prep (End of Week 4) - QA sign-off, theme package ready

## Critical Known Issues

### 🔴 BLOCKING: Variant Selection JavaScript Missing
**Files:** `sections/product-detail.liquid`, `assets/theme.js`

Product form has hidden `<input name="id" value="{{ product.selected_or_first_available_variant.id }}">` but no JavaScript updates it when users change options. Multi-variant products are broken—always adds first variant regardless of selection.

**Required solution:**
1. Embed product variants JSON in DOM: `<script type="application/json" data-product-json>{{ product | json }}</script>`
2. Add event listeners to all option selects and swatch radio inputs
3. Implement `findMatchingVariant()` function to match selected options against variants array
4. Update hidden input value, price display, availability state, and SKU on option change
5. Handle unavailable variants (disable add-to-cart, show "Sold Out")

### Other High-Priority Issues
- Cart drawer does not trap focus (WCAG 2.1 violation)
- Add-to-cart shows "Adding..." but doesn't disable form fields during submission
- No metafield integration for product details (summary rows are hardcoded)
- Newsletter form has duplicate comment tags causing invalid Liquid syntax

## Testing Approach

**No automated test framework detected.**

To test changes:
1. Run `shopify theme dev` to start local preview
2. Manually test in Shopify theme editor
3. Run `npm run lint:homepage` to verify CSS selector compliance with demo
4. Cross-browser test (Chrome, Safari, Firefox, iOS Safari)

## Important Implementation Notes

**When editing sections:**
- Maintain schema defaults that reference conversation copy from project docs
- Use placeholder_svg_tag for imagery until real assets provided
- Ensure button/CTA labels are editable via schema settings
- Follow spacing conventions: section paddings of 12 space units on large viewports

**When editing CSS:**
- All changes must be made in `theme.scss` or imported partials (`_tokens.scss`, `_reset.scss`, `_base.scss`)
- Run `npm run build:css` after changes
- Use `npm run watch:css` during active development
- Verify with `npm run lint:homepage` to avoid drift from demo reference

**Cart system:**
- Both `cart-drawer.liquid` and `cart.liquid` use `cart-item.liquid` snippet
- Cart state managed via Shopify AJAX Cart API (`/cart/change.js`, `/cart/add.js`)
- Drawer auto-opens after successful add-to-cart

**Metafields:**
- Theme currently has zero metafield support
- Product summary rows are hardcoded in template JSON
- Future work should refactor to read from `product.metafields.custom` namespace

## Elegance Guardrails (from design reference)

**Maintain these principles when adding features:**
- Typography: serif headlines at light weight, sans body at 13px with tight tracking
- Palette: warm white canvas, cream surfaces, burgundy header/footer, ochre/terracotta accents
- Rhythm: modules alternate single-column and asymmetrical grids with wide gutters (min 24px)
- Ornamentation: hairline borders (`var(--border)`), figure captions prefixed with "Fig.", inline arrow SVGs for CTAs
- Media hierarchy: hero imagery full-bleed, subsequent imagery balanced between portrait 4:5 and square ratios
- Whitespace: section paddings of 12 space units on larger viewports, capped inner width of 1400px, max copy width ~720px for supporting text blocks

## Documentation References

- `project-plan.md` - Full 4-phase project roadmap and milestones
- `requirements.md` - Functional and non-functional requirements
- `refactor.md` - Detailed technical debt and improvement backlog
- `homepage-style-checklist.md` - Complete CSS reference for demo parity
- `portableFeatures.md` - Reusable component catalog
