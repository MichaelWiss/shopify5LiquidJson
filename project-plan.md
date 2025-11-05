# Shopify Theme Scaffold Project Plan

## 1. Project Overview
- **Project Name:** In Common With-Inspired Shopify Theme Scaffold
- **Goal:** Transform the ChatGPT-derived design system into a production-ready Shopify Online Store 2.0 theme scaffold, ready for bespoke styling and content rollout.
- **Primary Stakeholder:** Michael Wiss / Studio team
- **Technical Lead:** Codex assistant (handover to internal dev once scaffold ready)

## 2. Phase Breakdown

### Phase 0 — Preparation (Complete)
- Decode ChatGPT conversation for system requirements.
- Stand up initial Liquid scaffold (layout, templates, sections, snippets, assets).
- Produce requirements and project plan documentation.

### Phase 1 — Design System Integration (Week 1)
**Objectives**
- Compile SCSS tokens, resets, and base styles into `assets/theme.css` using a build step (e.g., Shopify CLI or custom bundler).
- Extend CSS to cover layout classes referenced in sections (grid templates, typography roles, spacing stacks, animations).
- Establish naming conventions and comments for mixins / utilities.


### Phase 1A — Demo CSS Port (In Progress)
**Objective**
- Match the demo HTML/CSS with pixel-perfect fidelity for core sections (header, homepage hero, editorial blocks, PDP, footer).

**Key Tasks Completed**
- Replaced navigation markup with demo structure; replicated typography (11px sans, 0.03em tracking) and spacing.
- Ported demo colors/gradients for hero, featured collections, image-with-text, editorial grid, newsletter, and footer.
- Rebuilt PDP layout CSS (sticky sidebar, selects, swatches, related products) to match demo visuals.
- Recompiled `assets/theme.css` after each port to keep Shopify bundle current.

**Open Items**
- Document demo-to-theme mapping for future references.

### Demo CSS Audit (Step 1)
**Global tokens**
- Colors: `--cream #F5F1E8`, `--cream-dark #E8E3D8`, `--warm-white #FEFDFB`, `--taupe #8B7E6A`, `--brown-light #B89968`, `--brown-medium #8B6B47`, `--brown-dark #4A3426`, `--burgundy #5C1F1F`, `--rust-red #8B3A2F`, `--terracotta #A0584F`, `--rust #8B4513`, `--ochre #C4932C`, `--olive #7A7247`, `--green-moss #7A8450`, `--sage-green #A4B08C`, `--text-primary #2D2820`, `--text-secondary #5A534A`, `--border #D4CEC0`.
- Fonts: `--font-primary 'Times New Roman', Georgia, serif`; `--font-secondary -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- Spacing unit: `--space-unit 8px`; calc multipliers span 1–12 units for paddings/margins.
- Viewport breakpoints: 640px (newsletter form row), 768px (nav/grid 3-up), 1024px (hero split, image-with-text, product grid), 1400px max-width rails.
- Base reset: `*` margin/padding reset with `box-sizing: border-box`; body set to sans font, 13px/1.6, background `--warm-white`, antialiasing.

**Shared utilities / recurring patterns**
- Header elements: `.site-header`, `.header-container|top`, `.header-nav`, `.header-icons`, `.header-icon`, `.site-logo`, `.cart-count`.
- CTAs and links: `.hero-link`, `.image-text-link`, `.image-text-cta`, `.btn`, `.btn-secondary`, `.newsletter-submit`.
- Form controls: `.newsletter-form`, `.newsletter-input`, `.form-select`, `.color-dots`, `.color-dot.selected::after`, `.option-row`, `.option-label`.
- Layout helpers: `.reverse` (image-with-text), `.hero-split` grid, `.hero-content`, `.hero-image`, `.hero-text`.
- Typography helpers: `.intro-eyebrow`, `.intro-heading`, `.intro-text`, `.image-text-eyebrow`, `.image-text-heading`, `.image-text-body`, `.editorial-caption`.
- Cards/grids: `.collections-grid`, `.collection-card`, `.collection-image(-inner)`, `.product-card(-image|-image-inner|-title|-designer)`, `.editorial-grid`, `.editorial-item.large`.

**Elegance guardrails from reference**
- Typography: serif headlines set at light weight (300–400), sans body at 13px with tight tracking; navigation sits at 11px, 0.03em letter-spacing, weight 300. Eyebrow labels use uppercase/small caps at 0.08em letter-spacing.
- Palette: warm white canvas, cream surfaces, burgundy header/footer, ochre/terracotta accents; gradients acceptable but must stay within token palette.
- Rhythm: modules alternate single-column and asymmetrical grids with wide gutters (min 24px) and vertical spacing of ≥3 space units.
- Ornamentation: hairline borders (`var(--border)`), figure captions prefixed with “Fig.”, inline arrow SVGs for CTAs, subtle hover states (opacity or gentle scale).
- Media hierarchy: hero imagery full-bleed, subsequent imagery balanced between portrait 4:5 and square ratios; editorial grid uses span toggles (half/full) to echo demo cadence.
- Whitespace: section paddings of 12 space units on larger viewports, capped inner width of 1400px, and max copy width ~720px for supporting text blocks.

**Homepage component selectors**
- Header (`header.liquid`): `.site-header`, `.header-container`, `.site-logo`, `.header-nav`, `.header-icons`, `.header-icon`.
- Hero split (`hero-split.liquid`): `.hero-split`, `.hero-content`, `.hero-text`, `.hero-heading`, `.hero-subtext`, `.hero-link`, `.hero-image`.
- Intro text (`intro-text.liquid`): `.intro-section`, `.intro-container`, `.intro-eyebrow`, `.intro-heading`, `.intro-text`.
- Featured collections (`featured-collections.liquid`): `.collections-section`, `.collections-container`, `.collections-grid`, `.collection-card`, `.collection-image`, `.collection-image-inner`, `.collection-title`.
- Image with text (x2) (`image-with-text.liquid`): `.image-text-section`, `.image-text-container`, `.image-text-media`, `.image-text-media-inner`, `.image-text-content`, `.image-text-eyebrow`, `.image-text-heading`, `.image-text-body`, `.image-text-link`, `.image-text-container.reverse`.
- Editorial grid (`editorial-grid.liquid`): `.editorial-section`, `.editorial-container`, `.editorial-grid`, `.editorial-item`, `.editorial-item.large`, `.editorial-image`, `.editorial-caption`.
- Newsletter (`newsletter.liquid`): `.newsletter-section`, `.newsletter-container`, `.newsletter-heading`, `.newsletter-text`, `.newsletter-form`, `.newsletter-input`, `.newsletter-submit`.
- Footer (`footer.liquid`): `.site-footer`, `.footer-grid`, `.footer-column`, `.footer-links`, `.footer-bottom`.

**Product template component selectors**
- Header/breadcrumbs: `.site-header`, `.header-top`, `.header-nav`, `.header-icons`, `.cart-count`, `.breadcrumbs`, `.breadcrumbs-list`, `.breadcrumbs-list .current`.
- Hero split: `.hero-split`, `.hero-content`, `.hero-heading`, `.hero-subtext`, `.hero-image`.
- Product detail (`product-detail.liquid`): `.product-detail`, `.product-sidebar`, `.product-title`, `.product-price`, `.product-option`, `.option-label`, `.option-row`, `.option-row-label`, `.option-row-value`, `.form-select`, `.color-dots`, `.color-dot`, `.product-description`, `.btn`, `.btn-secondary`, `.product-images`, `.product-image`, `.image-caption`.
- Intro text reprise: `.intro-section`, `.intro-container`, `.intro-eyebrow`, `.intro-heading`, `.intro-text`.
- Specifications: `.specs-section`, `.specs-container`, `.specs-title`, `.specs-table`, `.spec-row`, `.spec-label`, `.spec-value`.
- Finish swatches: `.finishes-section`, `.finishes-container`, `.finish-group`, `.finish-header`, `.finish-title`, `.finish-price`, `.finish-grid`, `.finish-swatch`, `.finish-box`, `.finish-sample`, `.finish-label`.
- Related products: `.related-section`, `.related-container`, `.related-title`, `.related-grid`, `.product-card`, `.product-card-image`, `.product-card-image-inner`, `.product-card-title`, `.product-card-designer`.
- Footer: `.site-footer`, `.footer-grid`, `.footer-column`, `.footer-links`, `.footer-bottom`.
**Key Tasks**
1. Configure tooling (Shopify CLI, npm scripts, or alternative) for Sass compilation and asset watch.
2. Map `_tokens.scss` variables into CSS custom properties and section-specific classes.
3. Implement responsive breakpoints per conversation (portrait anchors, 3-up editorial grid, etc.).
4. Document token usage guidelines.

**Deliverables**
- Updated `theme.css` reflecting the full design system.
- README update with build instructions.

### Phase 2 — Functional Hardening (Week 2)
**Objectives**
- Ensure forms, variant selectors, and pagination behave as expected.
- Address risks noted in requirements review (variant ID syncing, quantity field default, newsletter integration).

**Key Tasks**
1. Incorporate Shopify’s recommended `product-form.js` pattern or custom script to sync variant selection and hidden `id` input.
2. Fix quantity default to `1` and validate numeric boundaries.
3. Test customer form submission flow; add success/error states.
4. Add basic motion layer per conversation (fade-up classes with intersection observer or CSS animations).
5. Run `shopify theme check` / lint routines and resolve issues.

**Deliverables**
- Updated Liquid/JS assets with working product form logic.
- Theme check report with zero blockers.

### Phase 3 — Content & Merchandising Setup (Week 3)
**Objectives**
- Populate default content blocks with curated copy/images for demo purposes.
- Create additional templates if needed (blog, article, search) to support merchandising.

**Key Tasks**
1. Ingest placeholder imagery and update default settings to match art direction.
2. Build optional sections requested by stakeholders (e.g., editorial text stacks, quote blocks).
3. Configure navigation menus, metaobjects, and dynamic sources for CMS-driven content.
4. Review with merchandising team; gather feedback.

**Deliverables**
- Theme demo store with representative homepage, product, collection content.
- Feedback log and change requests.

### Phase 4 — QA & Launch Prep (Week 4)
**Objectives**
- Validate across browsers/devices; ensure accessibility baseline.
- Package theme for deployment or duplication across client stores.

**Key Tasks**
1. Cross-browser QA (Chrome, Safari, Firefox, iOS Safari, Android Chrome).
2. Accessibility sweep (color contrast, keyboard nav, ARIA for forms/nav).
3. Performance audit (Lighthouse, Shopify theme analyzer).
4. Prepare release notes, version tags, and changelog.

**Deliverables**
- QA report with resolved issues.
- Theme zip ready for upload / Git release tag v1.0.0.

## 3. Workstreams & Responsibilities
- **Design System / CSS:** Front-end engineer (Codex ➔ internal dev).
- **Liquid & JS:** Front-end engineer.
- **Content Strategy:** Merchandising/creative team supplies copy and imagery.
- **QA:** Shared between engineering and QA specialist.

## 4. Tooling & Environment
- Shopify CLI / Theme Kit for local dev & previews.
- Node-based build pipeline (e.g., Vite, Gulp) or Shopify GitHub integration.
- Version control via Git (recommend dedicated repo).
- Collaboration: Notion or Google Docs for documentation, Linear/Jira for issue tracking.

## 5. Risk Mitigation
- **Variant logic bugs:** Adopt Shopify reference patterns early, add automated tests with Playwright for add-to-cart.
- **Design drift:** Maintain token-driven sass architecture; schedule design reviews each phase.
- **Timeline slip:** Timebox each phase to one week, with mid-week check-ins.
- **Content gaps:** Engage creative team in Phase 3 kickoff to secure imagery/copy.

## 6. Milestones
| Milestone | Target | Exit Criteria |
|-----------|--------|---------------|
| M1: Design System Integrated | End of Week 1 | Compiled CSS + README updates |
| M2: Functional Hardening Complete | End of Week 2 | Variant form, newsletter, linting ✅ |
| M3: Content Pass & Optional Sections | End of Week 3 | Demo store seeded, feedback collected |
| M4: Launch Prep | End of Week 4 | QA sign-off, theme package ready |

## 7. Communication Plan
- Weekly stand-up or async status post summarising progress/blockers.
- Shared Kanban board for task tracking.
- Review meetings at the end of each phase for sign-off.

## 8. Next Immediate Actions
1. Configure Sass build pipeline to merge `_tokens.scss`, `_reset.scss`, `_base.scss` into `assets/theme.css`.
2. Address product variant form and quantity issues identified in scaffold review.
3. Draft README with setup instructions referencing these documents.
