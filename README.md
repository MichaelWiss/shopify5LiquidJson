# Refinements — Shopify Theme

A custom Shopify Online Store 2.0 theme featuring an editorial design system with warm neutral palettes, modular composition, and quiet-confidence aesthetic.

## Overview

**Refinements** is a fully custom Shopify theme built for lighting and furniture retailers seeking an elevated, editorial presentation. The theme emphasizes:

- Token-based design system with SCSS
- Modular, block-based section architecture
- Full variant selection with dynamic pricing
- AJAX cart with accessibility features
- Responsive, mobile-first layout
- Shopify Online Store 2.0 compatibility

**Current Status:** Phase 1A complete (Demo CSS Port). Core functionality operational.

## Prerequisites

- **Node.js**: 18+ (for Sass compilation)
- **Shopify CLI**: Latest version
- **Sass**: Installed via npm (included in devDependencies)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopify5LiquidJson
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build CSS**
   ```bash
   npm run build:css
   ```

## Development Workflow

### CSS Development

The theme uses Sass for CSS compilation with a token-based design system.

```bash
# One-time build
npm run build:css

# Watch mode (recompiles on file changes)
npm run watch:css

# Lint homepage styles against demo reference
npm run lint:homepage
```

**Source files:**
- `_tokens.scss` - Design tokens (colors, fonts, spacing)
- `_reset.scss` - Minimal CSS reset
- `_base.scss` - Base typography and utilities
- `theme.scss` - Main entry point, imports all partials

**Compiled output:** `assets/theme.css`

### Shopify Development

```bash
# Start local development server with live preview
shopify theme dev

# Push theme to Shopify store
shopify theme push

# Pull theme changes from Shopify
shopify theme pull
```

**Important:** Run `npm run build:css` after SCSS changes before running `shopify theme dev`.

### Making CSS Changes

1. Edit SCSS files (`_tokens.scss`, `theme.scss`, etc.)
2. Run `npm run build:css` to compile
3. Test with `shopify theme dev`
4. Optionally run `npm run lint:homepage` to verify demo compliance

## Project Structure

```
.
├── assets/
│   ├── theme.css          # Compiled CSS (generated, do not edit directly)
│   └── theme.js           # JavaScript (cart, variants, interactions)
│
├── config/
│   └── settings_schema.json  # Global theme settings
│
├── layout/
│   └── theme.liquid       # Base HTML wrapper
│
├── locales/
│   └── en.default.json    # Translation strings
│
├── sections/              # Modular page components (26 sections)
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero-split.liquid
│   ├── product-detail.liquid
│   ├── cart-drawer.liquid
│   └── ...
│
├── snippets/              # Reusable components (14 snippets)
│   ├── product-card.liquid
│   ├── cart-item.liquid
│   ├── arrow-link.liquid
│   └── ...
│
├── templates/             # JSON template files
│   ├── index.json         # Homepage
│   ├── product.json       # Product detail page
│   ├── collection.json    # Collection page
│   └── ...
│
├── _tokens.scss           # Design system tokens
├── _reset.scss            # CSS reset
├── _base.scss             # Base styles
├── theme.scss             # Main SCSS entry point
│
└── scripts/
    └── check-homepage-styles.js  # CSS linter
```

## Architecture

### Design System

**Token-based styling** using CSS custom properties:

**Colors:**
- `--cream` (#F5F1E8) - Surface color
- `--warm-white` (#FEFDFB) - Background
- `--burgundy` (#5C1F1F) - Header/footer/accents
- `--terracotta` (#A0584F) - Accent color
- `--text-primary` (#2D2820) - Body text
- `--text-secondary` (#5A534A) - Muted text

**Typography:**
- `--font-primary` - Times New Roman (serif, for headlines)
- `--font-secondary` - System sans (for body text)
- Body: 13px with tight tracking
- Navigation: 11px, 0.03em letter-spacing, weight 300

**Spacing:**
- `--space-unit` - 8px base
- Multipliers: 1-12 units (8px to 96px)

**Breakpoints:**
- 640px (newsletter form row)
- 768px (navigation, 3-up grids)
- 1024px (hero split, image-with-text)
- 1400px (max-width rail)

### JavaScript Architecture

`assets/theme.js` (447 lines) handles:

**Cart System:**
- Modal drawer with overlay
- AJAX add-to-cart with section rendering API
- Quantity controls (increase/decrease/remove)
- Focus trap for accessibility (WCAG 2.1)
- Escape key and overlay click handling

**Product Variants:**
- Reads product JSON from DOM
- Matches selected options to find correct variant
- Updates variant ID, price, SKU, availability
- Handles sold-out states
- Works with `<select>` dropdowns and radio input swatches

**Header:**
- Scroll detection (adds `.scrolled` class)
- Cart count badge management

### Section Architecture

Sections are modular, reusable components with JSON schemas defining configurable settings and blocks.

**Key sections:**
- `header.liquid` - Fixed burgundy header with navigation
- `hero-split.liquid` - Two-column hero with alignment toggle
- `product-detail.liquid` - Complete PDP with variant picker and gallery
- `featured-collections.liquid` - Collection grid (up to 6 cards)
- `image-with-text.liquid` - Alternating image/content layout
- `editorial-grid.liquid` - Masonry grid with figure captions
- `newsletter.liquid` - Customer form with success/error states
- `cart-drawer.liquid` - Modal cart overlay
- `finish-swatches.liquid` - Material/finish selector grid
- `related-products.liquid` - Product recommendations

**All sections:**
- Reference shared CSS classes
- Include schema for theme editor customization
- Contain "Refinements" narrative default content

### Snippets

Reusable markup partials for DRY code:

- `product-card.liquid` - Product tile (image, title, price)
- `cart-item.liquid` - Cart line item (used in drawer and page)
- `arrow-link.liquid` - Standardized CTA with animated arrow
- `product-swatch-picker.liquid` - Color/finish radio buttons
- `product-gallery-item.liquid` - Gallery image with caption
- `breadcrumbs-bar.liquid` - Semantic navigation breadcrumbs
- `pagination.liquid` - Prev/next with page numbers

## Key Features

### 1. Complete Variant Selection
Multi-variant products fully supported with:
- Dynamic price updates
- SKU display
- Availability checking
- Sold-out state handling

### 2. AJAX Cart
Modern cart experience with:
- Slide-out drawer
- Instant updates
- No page reloads
- Keyboard accessible

### 3. Design System Compliance
- Token-based CSS for easy customization
- Consistent spacing and typography
- Responsive breakpoints
- Editorial aesthetic maintained throughout

### 4. Accessibility
- Focus trap in cart drawer
- ARIA attributes
- Semantic HTML
- Keyboard navigation support

## Configuration

### Global Settings

Edit global theme settings in `config/settings_schema.json`:

```json
{
  "show_global_breadcrumbs": true  // Show breadcrumbs on products, collections, pages
}
```

### Section Settings

All sections are customizable via the Shopify theme editor. Each section includes:
- Content settings (text, images, links)
- Layout options (alignment, column count)
- Style options (colors, spacing)

### Product Detail Settings

Configure in `templates/product.json`:
- Summary rows (Size, Orientation, Mounting)
- Variant picker options
- Swatch colors
- Quantity limits
- Button labels

**Note:** Summary rows are currently hardcoded in JSON. See "Known Issues" below.

## Testing

### Manual Testing

1. Run local dev server:
   ```bash
   shopify theme dev
   ```

2. Test in Shopify theme editor

3. Verify CSS compliance:
   ```bash
   npm run lint:homepage
   ```

4. Cross-browser test:
   - Chrome
   - Safari
   - Firefox
   - iOS Safari

### No Automated Tests

This theme does not currently have automated test coverage.

## Known Issues & Limitations

### 1. No Metafield Support
**Impact:** Product summary rows are hardcoded in `product.json`

**Current:** Merchants must edit JSON to change product details  
**Planned:** Refactor to read from `product.metafields.custom` namespace

### 2. CSS Duplication
**Impact:** Larger file size (~30% redundant code)

Some selectors are defined multiple times with slight variations. This doesn't affect functionality but increases file size.

**Planned:** Consolidate duplicate definitions in Phase 2.

### 3. Limited Template Coverage
**Available:** Homepage, Product, Collection, Page, Cart  
**Missing:** Blog, Article, Search, Customer account pages

## Browser Support

- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile:** iOS Safari 12+, Chrome Android
- **Not supported:** Internet Explorer

## Performance Notes

- CSS: ~3,871 lines (can be optimized)
- JavaScript: 447 lines (vanilla JS, no framework)
- Images: Use Shopify CDN with automatic optimization
- No external dependencies beyond Sass build tool

## Deployment

### To Shopify Development Store

```bash
# Build CSS first
npm run build:css

# Push to development store
shopify theme push --development
```

### To Production

```bash
# Build CSS
npm run build:css

# Push to live theme
shopify theme push --live
```

**Important:** Always build CSS before pushing to Shopify.

## Design Principles

Maintain these principles when extending the theme:

- **Typography:** Serif headlines at light weight (300-400), sans body at 13px with tight tracking
- **Palette:** Warm white canvas, cream surfaces, burgundy header/footer, ochre/terracotta accents
- **Rhythm:** Modules alternate single-column and asymmetrical grids with wide gutters (min 24px)
- **Ornamentation:** Hairline borders, figure captions prefixed with "Fig.", inline arrow SVGs for CTAs
- **Media Hierarchy:** Hero imagery full-bleed, subsequent imagery balanced between portrait 4:5 and square ratios
- **Whitespace:** Section paddings of 12 space units on large viewports, capped inner width of 1400px

## Documentation

- **`project-plan.md`** - 4-phase project roadmap and milestones
- **`requirements.md`** - Functional and non-functional requirements
- **`refactor.md`** - Technical debt and improvement backlog
- **`homepage-style-checklist.md`** - Complete CSS reference for demo parity
- **`portableFeatures.md`** - Reusable component catalog
- **`WARP.md`** - Guidance for Warp AI development environment

## Roadmap

### Phase 1A: Demo CSS Port ✅ Complete
- Navigation markup matches demo
- Demo colors/gradients ported
- PDP layout CSS rebuilt
- Reusable snippets created

### Phase 2: Functional Hardening (90% Complete)
- ✅ Variant selector logic
- ✅ Cart system
- ⏳ Metafield integration
- ⏳ Form loading states

### Phase 3: Content & Merchandising (Not Started)
- Rich default content
- Additional templates (blog, article)
- Navigation menus
- Metaobjects for CMS-driven content

### Phase 4: QA & Launch Prep (Not Started)
- Cross-browser QA
- Accessibility sweep
- Performance audit
- Theme package preparation

## Contributing

When making changes:

1. **For CSS:** Edit SCSS files, never edit `assets/theme.css` directly
2. **Build before commit:** Run `npm run build:css`
3. **Test locally:** Use `shopify theme dev`
4. **Verify lint:** Run `npm run lint:homepage` for homepage changes
5. **Follow design tokens:** Use existing CSS custom properties

## Support

For questions or issues:
- Review documentation in `/` directory
- Check `refactor.md` for known issues
- Refer to `WARP.md` for AI-assisted development guidance

## License

Proprietary theme for Refinements brand. All rights reserved.

---

**Built with:** Shopify Online Store 2.0, Sass, Vanilla JavaScript  
**Last Updated:** November 2025  
**Current Phase:** Phase 1A (Demo CSS Port Complete)
