# Shopify Theme Scaffold Requirements

## 1. Overview
- Deliver a custom Shopify Online Store 2.0 theme modeled on the "In Common With" style system described in the shared ChatGPT conversation.
- Provide a reusable foundation for future client projects, emphasising editorial composition, quiet typography, and modular sections.
- Support Shopify section-based customization so merchants can rearrange homepage and template content without code changes.

## 2. Objectives & Success Criteria
- Achieve parity with the section lineup defined in the conversation (hero split, intro text, featured collections, alternating image/text, editorial grid, newsletter, footer, product detail, collection grid, swatches, related products, breadcrumbs).
- Ensure all default templates (home, page, collection, product) render using the new sections and are editable from the theme editor.
- Expose design tokens so typography, spacing, and color can be managed centrally and extended.
- Ship a scaffold that compiles without runtime errors and passes Shopify theme check (future step).

## 3. Functional Requirements
### 3.1 Layout & Global
- `layout/theme.liquid` must include:
  - Head metadata (title, description, canonical) with Shopify liquid variables.
  - References to compiled CSS (`theme.css`) and JS (`theme.js`).
  - `content_for_header` and `content_for_footer` placeholders.
  - Header and footer sections injected via `{% section %}`.
- Add body class reflecting the active template for downstream styling.

### 3.2 Templates
- `templates/index.json` arranges sections in the order: hero, intro, featured collections, image-with-text, editorial grid, newsletter.
- `templates/page.json` uses intro text for simple content pages.
- `templates/collection.json` wires collection banner + product grid.
- `templates/product.json` uses breadcrumbs, product detail, finish swatches, and related products.

### 3.3 Sections
- Each section must:
  - Render markup consistent with the conversation’s layout guidance.
  - Include a schema describing configurable settings and default copy.
  - Reference shared class names for styling (e.g., `hero-split__heading`, `editorial-grid__item`).
- Specific behaviours:
  - **Header:** navigational list, cart count badge, icon renders.
  - **Hero Split:** image + content alignment toggle, CTA support.
  - **Intro Text:** eyebrow, heading, rich text, adjustable alignment.
  - **Featured Collections:** supports up to six cards with override imagery.
  - **Image with Text:** alternating layout toggle.
  - **Editorial Grid:** block spans (half/full), captions.
  - **Newsletter:** customer form, success/error messaging.
  - **Footer:** menu + freeform blocks, credits line.
  - **Product Detail:** gallery media, variant picker, quantity, add-to-cart CTA, meta data.
  - **Collection Grid:** pagination, sorting, product cards.
  - **Finish Swatches:** optional image or color fallback.
  - **Related Products:** supports Shopify related products API with fallback collection.
  - **Breadcrumbs:** renders via navigation snippet.

### 3.4 Snippets
- `snippets/icon.liquid` renders SVGs for cart/search with fallback dot icon.
- `snippets/product-card.liquid` outputs media, title, pricing (sale-aware).
- `snippets/navigation.liquid` currently handles breadcrumbs; extensible for future navigation patterns.

### 3.5 Assets
- `assets/theme.css` contains baseline design tokens and spacing defaults; must later integrate compiled `_tokens.scss`, `_reset.scss`, `_base.scss`.
- `assets/theme.js` removes `no-js` class and ensures cart badge visibility.

## 4. Non-Functional Requirements
- **Design System:** align with conversation tokens—colors, typography, spacing—to maintain editorial tone.
- **Maintainability:** clear section/snippet naming, schema defaults referencing conversation copy.
- **Accessibility:** semantic headings, proper form labels, accessible nav/breadcrumb patterns.
- **Performance:** lazy-load imagery via Shopify filters, limit blocking scripts, future Tree-shaking considerations (safelist for Tailwind if reintroduced).
- **Extensibility:** sections accept merchant-defined content; CSS classes structured for future SCSS expansion.

## 5. Content Requirements
- Provide default copy reflecting the conversation narrative (e.g., “Lighting and objects with quiet confidence”).
- Placeholders for imagery using Shopify’s `placeholder_svg_tag` until real assets provided.
- Ensure button/CTA labels are editable.

## 6. Dependencies & Inputs
- SCSS source files: `_tokens.scss`, `_reset.scss`, `_base.scss` (to be compiled into `theme.css`).
- Shopify Online Store 2.0 runtime (assumed latest).
- ChatGPT conversation transcript for detailed styling logic and module intent.

## 7. Risks & Open Questions
- Variant form script missing; risk of incorrect variant submission.
- Design tokens not yet wired into live CSS—theme will look bare without compilation step.
- Need decision on newsletter integration (Shopify customer list vs. external ESP).
- Additional templates (blog, cart, search, customer) out of scope for initial scaffold.

## 8. Acceptance Checklist
- [ ] All required files exist under `layout/`, `templates/`, `sections/`, `snippets/`, `assets/`.
- [ ] Theme loads without Liquid errors when zipped and deployed.
- [ ] Theme editor exposes configuration options per section schema.
- [ ] Documentation (project plan) accompanies scaffold for implementation roadmap.
