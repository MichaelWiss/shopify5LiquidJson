# Git Workflow & Branching Strategy

Enterprise-level version control workflow for the Refinements Shopify theme.

## Table of Contents

- [Branch Structure](#branch-structure)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Commit Conventions](#commit-conventions)
- [Deployment Strategy](#deployment-strategy)
- [Hotfix Process](#hotfix-process)

---

## Branch Structure

### Main Branches

#### `main`
**Purpose:** Production-ready code  
**Protection Rules:**
- Requires pull request reviews (minimum 1 approval)
- Requires status checks to pass (Lighthouse CI, build tests)
- No direct commits allowed
- Linear history enforced

**Deployment:** Auto-deploys to production Shopify store (live theme)

---

#### `staging`
**Purpose:** Pre-release testing and QA  
**Protection Rules:**
- Requires pull request from feature branches
- Runs automated tests
- Allows fast-forward merges

**Deployment:** Auto-deploys to staging Shopify store

---

### Working Branches

#### Feature Branches: `feature/*`
**Naming Convention:** `feature/description-of-feature`  
**Examples:**
- `feature/cart-upsells`
- `feature/b2b-pricing`
- `feature/market-selector`

**Purpose:** New features and enhancements  
**Lifetime:** Short-lived (1-5 days)  
**Merge Target:** `staging` → `main`

---

#### Fix Branches: `fix/*`
**Naming Convention:** `fix/description-of-fix`  
**Examples:**
- `fix/cart-quantity-bug`
- `fix/mobile-nav-overlap`
- `fix/swatch-focus-indicator`

**Purpose:** Bug fixes and corrections  
**Lifetime:** Short-lived (hours to 1 day)  
**Merge Target:** `staging` → `main`

---

#### Hotfix Branches: `hotfix/*`
**Naming Convention:** `hotfix/critical-issue`  
**Examples:**
- `hotfix/checkout-button-broken`
- `hotfix/cart-drawer-crash`

**Purpose:** Critical production issues requiring immediate deployment  
**Lifetime:** Very short-lived (hours)  
**Merge Target:** Directly to `main` (then backport to `staging`)

---

#### Refactor Branches: `refactor/*`
**Naming Convention:** `refactor/description-of-refactor`  
**Examples:**
- `refactor/split-theme-js`
- `refactor/metafield-integration`

**Purpose:** Code improvements without behavior changes  
**Lifetime:** Medium-lived (2-7 days)  
**Merge Target:** `staging` → `main`

---

#### Docs Branches: `docs/*`
**Naming Convention:** `docs/description-of-docs`  
**Examples:**
- `docs/component-library`
- `docs/architecture-diagrams`

**Purpose:** Documentation updates  
**Lifetime:** Short-lived (1-3 days)  
**Merge Target:** `main` (can bypass staging for docs-only changes)

---

## Development Workflow

### Standard Feature Development

```bash
# 1. Start from latest main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/cart-upsells

# 3. Make changes and commit frequently
npm run build:css  # Build CSS if SCSS changed
git add .
git commit -m "feat(cart): add upsell recommendation logic"

# 4. Push to remote
git push -u origin feature/cart-upsells

# 5. Create Pull Request to `staging`
# Use GitHub UI or CLI: gh pr create --base staging

# 6. Address review feedback
git add .
git commit -m "refactor(cart): optimize upsell query"
git push

# 7. After approval, merge to `staging` (squash merge)
# Staging branch auto-deploys for QA testing

# 8. After QA approval, create PR from `staging` to `main`
# Main branch auto-deploys to production
```

---

### Quick Fix Workflow

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create fix branch
git checkout -b fix/mobile-nav-overlap

# 3. Make fix and test locally
shopify theme dev  # Test fix

# 4. Commit and push
git add .
git commit -m "fix(header): resolve mobile nav z-index issue"
git push -u origin fix/mobile-nav-overlap

# 5. Create PR to `staging` for testing
# After QA, merge to `main`
```

---

### Hotfix Workflow (Critical Issues Only)

```bash
# 1. Start from main (current production state)
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/checkout-button-broken

# 3. Make minimal fix
# Test thoroughly locally

# 4. Commit and push
git add .
git commit -m "hotfix(product): restore add-to-cart button click handler"
git push -u origin hotfix/checkout-button-broken

# 5. Create PR directly to `main`
# Require expedited review (15 min)

# 6. After merge to main, backport to staging
git checkout staging
git pull origin main
git push origin staging
```

---

## Pull Request Process

### PR Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Feature (new functionality)
- [ ] Fix (bug fix)
- [ ] Refactor (code improvement, no behavior change)
- [ ] Docs (documentation only)
- [ ] Hotfix (critical production issue)

## Testing Checklist
- [ ] Tested on dev store (`shopify theme dev`)
- [ ] Tested on desktop (Chrome, Safari, Firefox)
- [ ] Tested on mobile (iOS Safari, Chrome Android)
- [ ] Lighthouse score maintained (Performance 90+, Accessibility 95+)
- [ ] No console errors
- [ ] WCAG 2.1 Level AA compliance checked

## Screenshots
(Attach before/after screenshots if applicable)

## Related Issues
Closes #[issue_number]

## Deployment Notes
(Any special deployment steps or configuration changes)

## Rollback Plan
(How to revert if issues arise in production)
```

---

### PR Review Checklist

**Code Quality:**
- [ ] Code follows existing patterns and style
- [ ] No hardcoded values (use theme settings or metafields)
- [ ] Error handling present for AJAX calls
- [ ] Comments explain complex logic

**Performance:**
- [ ] Images use lazy loading where appropriate
- [ ] No unnecessary DOM queries in loops
- [ ] CSS changes don't increase bundle size significantly
- [ ] JavaScript is minified (if custom build)

**Accessibility:**
- [ ] Semantic HTML used
- [ ] ARIA attributes present where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA standards

**Shopify Best Practices:**
- [ ] Uses Liquid filters for formatting (money, date, etc.)
- [ ] Section schema follows Shopify conventions
- [ ] Translation strings use `{{ 'key' | t }}` pattern
- [ ] No direct theme.liquid edits (use sections)

**Testing:**
- [ ] Tested in Shopify theme editor
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Edge cases considered (empty cart, sold-out products, etc.)

---

## Commit Conventions

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactor (no behavior change)
- `perf` - Performance improvement
- `style` - CSS/styling changes
- `docs` - Documentation updates
- `test` - Test additions or changes
- `chore` - Build process, dependencies, tooling

### Scopes

- `cart` - Cart drawer, cart page
- `product` - Product pages, variant selection
- `collection` - Collection pages, filtering
- `header` - Site header
- `footer` - Site footer
- `checkout` - Checkout-related (pre-checkout UX)
- `homepage` - Homepage sections
- `blog` - Blog and article templates
- `search` - Search functionality
- `nav` - Navigation
- `build` - Build scripts, CI/CD

### Examples

**Good Commits:**
```bash
feat(cart): add upsell recommendations below line items

Displays 3 related products based on cart contents using product tags.
Products are fetched via AJAX to avoid page reload.

Closes #45

---

fix(product): resolve variant price not updating on swatch selection

The price display was not updating when color swatches were selected
due to missing event listener on radio inputs. Added change listener.

Closes #67

---

perf(homepage): lazy load below-fold images in editorial grid

Adds loading="lazy" to all images beyond viewport height.
Reduces initial page load by ~400KB.

---

refactor(theme.js): split monolithic file into modules

- cart-drawer.js (278 lines)
- product-form.js (146 lines)
- header.js (91 lines)
- collection-filters.js (65 lines)

Reduces initial bundle size from 536 lines to ~115 lines (header + cart).
Product form only loads on product pages.

---

docs(components): add comprehensive section documentation

Documents all 30+ sections with schema references, usage examples,
and responsive behavior notes.
```

**Bad Commits:**
```bash
# ❌ Too vague
fix: bug fix

# ❌ No scope
feat: added new feature

# ❌ Not descriptive
refactor: changes

# ❌ Multiple unrelated changes
feat(cart): add upsells, fix mobile nav, update footer links
```

---

## Deployment Strategy

### Environments

| Environment | Branch | Shopify Store | Auto-Deploy | Purpose |
|-------------|--------|---------------|-------------|---------|
| **Development** | `feature/*`, `fix/*` | Local (`shopify theme dev`) | No | Active development |
| **Staging** | `staging` | Dev Store (preview theme) | Yes | QA testing |
| **Production** | `main` | Live Store (published theme) | Yes | Customer-facing |

---

### Deployment Flow

```
feature/* → staging (PR) → QA Testing → main (PR) → Production
```

**Timing:**
- **Staging:** Continuous (every PR merge)
- **Production:** Scheduled releases (Tue/Thu 10am EST) + hotfixes as needed

**Rollback:**
- Staging: Revert commit
- Production: Use Shopify theme library to restore previous version

---

### Pre-Deployment Checklist

**Before merging to `main`:**
- [ ] All tests passing (Lighthouse CI, build)
- [ ] QA approval on staging
- [ ] No breaking changes to existing sections
- [ ] Database migrations complete (if using metafields)
- [ ] Translation strings added to `locales/en.default.json`
- [ ] README.md updated (if needed)
- [ ] Changelog entry added (if using CHANGELOG.md)

---

## Hotfix Process

### When to Use Hotfix Branch

**Hotfixes are for:**
- Critical bugs affecting checkout/cart (revenue-impacting)
- Accessibility violations (WCAG Level A failures)
- Security issues
- Site-breaking errors (JavaScript crashes, CSS breakage)

**Hotfixes are NOT for:**
- Minor visual issues
- Content updates
- Performance optimizations (unless site is unusable)

---

### Hotfix Approval Process

1. **Create hotfix branch** from `main`
2. **Make minimal fix** (smallest change to resolve issue)
3. **Test thoroughly** on local dev environment
4. **Create PR to `main`** with `[HOTFIX]` prefix in title
5. **Request expedited review** (15-30 min turnaround)
6. **Merge to `main`** (auto-deploys to production)
7. **Monitor production** for 30 minutes post-deployment
8. **Backport to `staging`** to keep branches in sync

---

### Hotfix Rollback

If hotfix causes new issues:

```bash
# Option 1: Revert commit (preferred)
git checkout main
git revert HEAD
git push origin main

# Option 2: Restore previous theme version (Shopify admin)
# Shopify Admin → Online Store → Themes → Theme Library → Publish
```

---

## Best Practices

### Do's ✅

- **Commit frequently** with descriptive messages
- **Pull from `main` daily** to avoid merge conflicts
- **Test locally** before pushing (`shopify theme dev`)
- **Build CSS** before committing (`npm run build:css`)
- **Review your own PR** before requesting reviews
- **Keep PRs focused** (single feature/fix per PR)
- **Update documentation** when adding features
- **Add ARIA labels** for accessibility

### Don'ts ❌

- **Don't commit `node_modules/`** (already in `.gitignore`)
- **Don't commit directly to `main`** (use PRs)
- **Don't force-push** to shared branches (`staging`, `main`)
- **Don't merge without review** (except docs-only changes)
- **Don't leave commented-out code** (use version control)
- **Don't include multiple features** in one PR
- **Don't skip Lighthouse tests** (performance matters)

---

## Git Commands Reference

### Daily Workflow

```bash
# Update local main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .
# OR stage specific files
git add sections/my-section.liquid assets/theme.css

# Commit
git commit -m "feat(scope): description"

# Push
git push -u origin feature/my-feature

# Update branch with latest main
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
# OR use rebase for cleaner history
git rebase main
```

### Fixing Mistakes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Amend last commit message
git commit --amend -m "New message"

# Discard local changes to a file
git checkout -- path/to/file

# Discard all local changes
git reset --hard HEAD
```

### Syncing Branches

```bash
# Pull latest from remote
git pull origin main

# Push local commits
git push origin feature/my-feature

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

---

## CI/CD Integration

### GitHub Actions Workflows

**`.github/workflows/lighthouse.yml`**
- Runs on every PR to `main` or `staging`
- Runs Lighthouse CI tests
- Fails if performance < 90, accessibility < 95

**`.github/workflows/build.yml`** (if added)
- Builds CSS from SCSS
- Validates Liquid syntax
- Checks for linting errors

---

## Team Collaboration

### Code Review Expectations

**As Author:**
- Provide context in PR description
- Respond to feedback within 24 hours
- Test changes thoroughly before requesting review
- Keep PR size manageable (<500 lines changed)

**As Reviewer:**
- Review within 24 hours (48 hours max)
- Test changes locally if possible
- Provide constructive feedback
- Approve only if confident in changes

---

## Emergency Contacts

**For production issues:**
- Escalate to: [Tech Lead]
- Rollback authority: [Engineering Manager]
- Shopify Support: [Shopify Plus Partner contact]

---

**Last Updated:** 2025-11-26  
**Version:** 1.0  
**Status:** Active
