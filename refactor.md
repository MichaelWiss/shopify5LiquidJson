# Refactor Plan

## 1. Unify Cart UI and Logic
- Consolidate the markup in `sections/cart.liquid` and `snippets/cart-drawer.liquid` into a single reusable snippet so both the cart page and drawer stay in sync.
- Remove the inline script inside `sections/cart.liquid` and ensure `assets/theme.js` exposes one cart controller (open/close, quantity, remove) that both contexts reuse.
- Update `theme.js` to detect whether it should refresh the drawer, the cart page, or both, instead of maintaining two separate `updateCartItem` flows.

## 2. Consolidate Newsletter Sections
- Extract the shared Shopify customer form markup (hidden tag, label, email field, success/error messaging) into `snippets/newsletter-form.liquid`.
- Refactor `sections/newsletter.liquid` and `sections/newsletter-simple.liquid` to render the snippet and restrict themselves to layout and styling, or merge them with a “layout style” select.
- Align CSS so both visual treatments use the same structural classes, reducing drift.

## 3. Align Templates with Requirements
- Update `templates/index.json` to follow the required section order (hero split → intro text → featured collections → image-with-text → editorial grid → newsletter).
- Revisit `templates/page.json`, `templates/collection.json`, and `templates/product.json` to confirm they reference the sections promised in `requirements.md`, adjusting block defaults where necessary.

## 4. Modularize Product Detail Rendering
- Break `sections/product-detail.liquid` into smaller snippets (e.g., summary rows, swatch picker, gallery item) to avoid the current monolithic structure.
- Replace the initial `{% capture %}` for summary rows with per-block renders so output order stays intuitive.
- Store swatch color/value pairs in structured settings (arrays/metafields) to eliminate repeated string splitting inside Liquid loops.

## 5. Standardize Arrow CTA Links
- Use `snippets/arrow-link.liquid` everywhere the arrow CTA appears (`hero-split`, `image-with-text`, `split-feature`, `collection-grid`, etc.) instead of duplicating the SVG markup inline.
- Extend the snippet with optional modifier parameters if alternate styles are required, keeping the SVG, aria labels, and transitions centralized.

## 6. Harden Homepage Style Linting
- Improve `scripts/check-homepage-styles.js` so it can parse multi-line and grouped selectors (simple tokenizer or a lightweight CSS parser) to avoid false positives as the stylesheet grows.
- Consider limiting the lint to a curated selector allowlist rather than scraping every line from the demo CSS.
