# CSS Bundle Implementation Plan

## Section-to-Template Mapping

### sections-layout.scss → sections-layout.css
**Loaded on ALL pages via layout/theme.liquid**
- header
- footer
- cart-drawer
- breadcrumbs

### sections-homepage.scss → sections-homepage.css
**Loaded only on index template**
- hero-full-bleed
- intro-marquee
- feature-overlay
- split-feature
- statement-banner
- gallery-grid
- product-split-feature
- product-split-layout
- quarters-spotlight
- studio-carousel
- newsletter
- text-columns

### sections-product.scss → sections-product.css
**Loaded only on product template**
- product-detail
- finish-swatches
- related-products
- specs-table
- intro-text

### sections-collection.scss → sections-collection.css
**Loaded only on collection template**
- collection-grid

### sections-cart.scss → sections-cart.css
**Loaded only on cart template**
- cart (main cart page, not cart-drawer)

### sections-content.scss → sections-content.css
**Loaded only on page template + fallback**
- intro-text
- editorial-grid
- Any other utility sections

### sections-showroom.scss → sections-showroom.css
**Loaded only on page.showrooms template**
- showroom section

## Implementation Steps
1. Create bundle SCSS files
2. Extract CSS from theme.scss
3. Update package.json
4. Compile bundles
5. Test each template

## Layout & Spacing Guidelines
- Use `.main-content` around `{{ content_for_layout }}` to establish page-level vertical rhythm.
- For inner width control, prefer `.section-container` or `@include container-rails()` over manual `max-width`/`margin`.
- For vertical spacing, use `@include section-padding($top, $bottom)` with `$s*` tokens, not hardcoded pixel values.
- Tokens and rails are defined in `_tokens.scss`; mixins live in `_mixins.scss`.
- Full-bleed sections: apply rails to text blocks only; allow media wrappers to span edge-to-edge.
