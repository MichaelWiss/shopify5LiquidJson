# Collection Filter & View Toggle Implementation

## Summary

Implemented functional filtering and view size toggle for `collection-grid.liquid` using demo styling with Shopify native filter integration.

## Changes Made

### 1. `sections/collection-grid.liquid`

**Replaced lines 69-91** with:

- **New header structure** with title + count display matching demo (42px serif title, 22px superscript count)
- **Filter toggle button** with aria attributes and icon that switches between `+` and `—`
- **View size buttons** (S/M/L) with `data-view` attributes
- **Collapsible filter drawer** using `collection.filters` API
- **Filter groups** for list filters (tags, vendor, etc.) and price range
- **Active filter indicators** with remove buttons (× symbol)
- **"Clear all filters" link** to reset collection

### 2. `assets/theme.js`

**Added lines 278-312:**

```js
// Filter toggle - Expands/collapses drawer, updates aria attributes
const filterToggle = document.getElementById('collectionFilterToggle');
const filterPanel = document.getElementById('collectionFilters');

// View size toggle - Updates grid data-view attribute (small/medium/large)
const viewButtons = document.querySelectorAll('.collection-page__view-btn');
const productGrid = document.querySelector('.collection-page__grid[data-view]');
```

### 3. `theme.scss`

**Replaced lines 1850-1920** with complete redesign:

#### Header Styling
- Border changed from `border-top` to `border-bottom` matching demo
- Title size increased to `42px` from `32px`
- Added `.collection-page__title-count` superscript styling
- New `.collection-page__header-row` flex container
- `.collection-page__controls` with 60px gap (7.5 space units)

#### Filter Toggle
- Button reset styles with hover transitions
- Icon weight `300` for lightweight appearance
- Color: `var(--text-primary)` with `#666` hover

#### View Toggle
- Redesigned with separate `.collection-page__view-label` and `.collection-page__view-buttons`
- Buttons styled at `18px` font size
- Active state: primary color + underline
- Inactive state: `#999` gray

#### Filter Drawer
- Collapsible panel with `max-height` animation (0 → 500px)
- Grid layout: `repeat(auto-fit, minmax(200px, 1fr))`
- Gap: 80px (10 space units) between filter groups
- Transitions: `400ms` max-height, `300ms` opacity
- Filter labels: `16px`, `#999` color
- Filter links: primary color with hover, active state `font-weight: 500`

#### Grid View Sizes
```scss
// Mobile: 1 column always
// Tablet (768px+):
[data-view="small"] → 4 columns
[data-view="medium"] → 3 columns  
[data-view="large"] → 2 columns

// Desktop (1024px+):
[data-view="small"] → 5 columns
[data-view="medium"] → 4 columns
[data-view="large"] → 3 columns
```

## Design System Adherence

✅ **Typography**: Matches demo (42px serif titles, 16px filter text, 18px view buttons)  
✅ **Spacing**: Uses space-unit system (8px base)  
✅ **Colors**: `var(--text-primary)`, `#999` secondary, `#666` hover  
✅ **Transitions**: Smooth 200-400ms easing  
✅ **Border style**: 1px solid primary matching header  

## Shopify Native Integration

### Filter API Usage
```liquid
{% for filter in collection.filters %}
  {% case filter.type %}
    {% when 'list' %}
      <!-- Tag-based filters, vendor, type, etc. -->
      {% for value in filter.values %}
        <a href="{{ value.url_to_add }}">{{ value.label }}</a>
      {% endfor %}
    
    {% when 'price_range' %}
      <!-- Min/max price inputs -->
      <input name="filter.v.price.gte">
      <input name="filter.v.price.lte">
  {% endcase %}
{% endfor %}
```

**Filter links use Shopify's URL parameters:**
- `?filter.v.option.finish=brass` for tag filters
- `?filter.v.price.gte=100&filter.v.price.lte=500` for price range
- Clicking active filters navigates to `{{ value.url_to_remove }}`

## Testing Requirements

### Manual Testing Checklist

1. **Filter Toggle**
   - [ ] Click "Filter" button to expand drawer
   - [ ] Icon changes from `+` to `—`
   - [ ] Drawer animates smoothly (400ms)
   - [ ] Click again to collapse
   - [ ] `aria-expanded` toggles correctly

2. **View Sizes**
   - [ ] Click S/M/L buttons
   - [ ] Active state shows underline
   - [ ] Grid columns change (use browser inspector)
   - [ ] Responsive: test on mobile, tablet, desktop

3. **Filtering**
   - [ ] Add tags to products (e.g., "metal", "glass", "wood")
   - [ ] Enable filters in collection settings (Admin → Products → Collections → [Collection] → Product availability)
   - [ ] Click filter links to add filters
   - [ ] Active filters show with × button
   - [ ] Click "Clear all filters" to reset
   - [ ] URL parameters update correctly

4. **Accessibility**
   - [ ] Keyboard navigation works (Tab through buttons)
   - [ ] Screen reader announces filter state
   - [ ] Focus visible on all interactive elements

### Test Commands

```bash
# Start local development server
shopify theme dev

# Watch for CSS changes during testing
npm run watch:css

# Rebuild CSS after changes
npm run build:css
```

## Known Limitations

1. **No AJAX filtering** - Filters trigger page navigation (standard Shopify behavior)
2. **Filter panel height** - Fixed `max-height: 500px` may need adjustment for many filters
3. **No sort dropdown** - `enable_sorting` setting exists but not implemented
4. **Sidebar unchanged** - Left sidebar navigation styling not updated

## Future Enhancements

- AJAX filtering using Storefront API for no page reload
- Sort dropdown integration
- Active filter badges above product grid
- Product count per filter option
- Filter collapse/expand per group
- Remember view size preference in localStorage

## Files Modified

- `sections/collection-grid.liquid` (lines 69-151)
- `assets/theme.js` (lines 278-312)
- `theme.scss` (lines 1850-2096)
- `assets/theme.css` (auto-generated from SCSS)
