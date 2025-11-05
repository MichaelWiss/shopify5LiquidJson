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
