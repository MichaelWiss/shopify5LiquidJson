# Component Library Documentation

Complete reference for all sections, snippets, and reusable components in the Refinements Shopify theme.

## Table of Contents

- [Sections](#sections)
  - [Layout Sections](#layout-sections)
  - [Homepage Sections](#homepage-sections)
  - [Product Sections](#product-sections)
  - [Content Sections](#content-sections)
  - [Template Sections](#template-sections)
- [Snippets](#snippets)
- [Usage Guidelines](#usage-guidelines)

---

## Sections

### Layout Sections

#### header.liquid
**Purpose:** Global site header with navigation, logo, and cart icon  
**Templates:** All templates  
**Schema Settings:**
- `logo_text` (text) - Store name/logo text
- `navigation_menu` (link_list) - Main navigation menu
- `color_mode` (select) - Static or dynamic header colors
  - `static` - Fixed burgundy background
  - `dynamic` - Transparent with color transitions on scroll

**Usage:**
```liquid
{% section 'header' %}
```

**Features:**
- Fixed position with scroll detection
- Dynamic color switching based on hero section
- Responsive navigation (desktop/mobile)
- Cart count badge with accessibility
- Scroll fade effects

---

#### footer.liquid
**Purpose:** Global site footer with links, newsletter, and social media  
**Templates:** All templates  
**Schema Settings:**
- `footer_menu` (link_list) - Footer navigation links
- `show_newsletter` (checkbox) - Display newsletter signup
- `copyright_text` (text) - Copyright notice
- `social_links` (blocks) - Social media URLs

**Usage:**
```liquid
{% section 'footer' %}
```

---

#### cart-drawer.liquid
**Purpose:** Slide-out cart overlay with line items and checkout button  
**Templates:** All templates (global section)  
**Schema Settings:** None (uses global cart object)

**Usage:**
```liquid
{% section 'cart-drawer' %}
```

**Features:**
- AJAX cart updates without page reload
- Focus trap for accessibility (WCAG 2.1)
- Keyboard navigation (Tab, Escape)
- Quantity controls (increase/decrease/remove)
- Section Rendering API for real-time updates

---

### Homepage Sections

#### hero-full-bleed.liquid
**Purpose:** Full-screen hero image with optional text overlay  
**Templates:** `index.json`, `page.json`  
**Schema Settings:**
- `image` (image_picker) - Hero background image
- `mobile_image` (image_picker) - Optional mobile variant
- `heading` (text) - Hero headline
- `subheading` (textarea) - Supporting text
- `button_label` (text) - CTA button text
- `button_link` (url) - CTA button URL
- `height` (select) - `full` (100vh), `large` (80vh), `medium` (60vh)
- `overlay_opacity` (range, 0-100) - Image overlay darkness

**Usage Example:**
```json
{
  "type": "hero-full-bleed",
  "settings": {
    "image": "shopify://shop_images/hero.jpg",
    "heading": "Refined Spaces",
    "height": "full",
    "overlay_opacity": 20
  }
}
```

**CSS Classes:**
- `.hero` - Container
- `.hero-image` - Background image
- `.hero-overlay` - Gradient overlay
- `.hero-title` - Heading text

---

#### hero-split.liquid
**Purpose:** Two-column hero with image and content side-by-side  
**Templates:** `index.json`, `page.json`  
**Schema Settings:**
- `image` (image_picker) - Hero image
- `heading` (text) - Main headline
- `content` (richtext) - Body content
- `button_label` (text) - CTA button text
- `button_link` (url) - CTA button URL
- `image_position` (select) - `left` or `right`
- `vertical_alignment` (select) - `top`, `center`, `bottom`

**Usage Example:**
```json
{
  "type": "hero-split",
  "settings": {
    "image": "shopify://shop_images/split-hero.jpg",
    "heading": "Crafted for Living",
    "image_position": "right",
    "vertical_alignment": "center"
  }
}
```

**Responsive Behavior:**
- Desktop: 50/50 split
- Tablet: Stacked, image first
- Mobile: Stacked, content first (image_position flips)

---

#### editorial-grid.liquid
**Purpose:** Masonry-style image grid with figure captions  
**Templates:** `index.json`, `page.json`, `collection.json`  
**Schema Settings:**
- `heading` (text) - Section heading
- `subheading` (text) - Section subheading
- `layout` (select) - `3-col`, `2-col`, `4-col`
- `items` (blocks) - Editorial items with:
  - `image` (image_picker)
  - `caption` (text) - Figure caption (prefixed with "Fig.")
  - `link` (url) - Optional click-through link

**Usage Example:**
```json
{
  "type": "editorial-grid",
  "blocks": [
    {
      "type": "item",
      "settings": {
        "image": "shopify://shop_images/fig-01.jpg",
        "caption": "The Studio Series"
      }
    }
  ],
  "settings": {
    "heading": "Recent Work",
    "layout": "3-col"
  }
}
```

**CSS Classes:**
- `.editorial-grid` - Grid container
- `.editorial-item` - Individual item
- `.editorial-caption` - Figure caption

---

#### featured-collections.liquid
**Purpose:** Display collection tiles in a grid  
**Templates:** `index.json`, `404.json`, `search.json`  
**Schema Settings:**
- `heading` (text) - Section heading
- `subheading` (text) - Section subheading
- `collections` (blocks) - Collection items (max 6):
  - `collection` (collection) - Collection reference
  - `image_override` (image_picker) - Optional custom image

**Usage Example:**
```json
{
  "type": "featured-collections",
  "blocks": [
    {
      "type": "collection",
      "settings": {
        "collection": "furniture"
      }
    }
  ],
  "settings": {
    "heading": "Browse by Category"
  }
}
```

**Responsive Behavior:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

---

#### split-feature.liquid
**Purpose:** Alternating image/text layout with multiple blocks  
**Templates:** `index.json`, `page.json`  
**Schema Settings:**
- `features` (blocks) - Feature items:
  - `image` (image_picker)
  - `heading` (text)
  - `content` (richtext)
  - `button_label` (text)
  - `button_link` (url)
  - `image_position` (select) - `left` or `right`

**Usage Example:**
```json
{
  "type": "split-feature",
  "blocks": [
    {
      "type": "feature",
      "settings": {
        "image": "shopify://shop_images/feature-01.jpg",
        "heading": "Designed in Brooklyn",
        "image_position": "left"
      }
    }
  ]
}
```

**Responsive Behavior:**
- Alternates left/right on desktop
- Stacks on mobile (image first)

---

#### intro-text.liquid
**Purpose:** Centered text block for introductions and section headers  
**Templates:** All templates  
**Schema Settings:**
- `heading` (text) - Main heading
- `subheading` (textarea) - Supporting text
- `text_size` (select) - `small`, `medium`, `large`
- `text_alignment` (select) - `left`, `center`, `right`

**Usage Example:**
```json
{
  "type": "intro-text",
  "settings": {
    "heading": "Our Philosophy",
    "subheading": "Every piece tells a story",
    "text_size": "large",
    "text_alignment": "center"
  }
}
```

**CSS Classes:**
- `.intro-text` - Container
- `.intro-heading` - Heading
- `.intro-subheading` - Subheading text

---

#### intro-marquee.liquid
**Purpose:** Horizontal scrolling text marquee  
**Templates:** `index.json`, `page.json`  
**Schema Settings:**
- `text` (text) - Marquee text content
- `speed` (select) - `slow`, `medium`, `fast`
- `direction` (select) - `left`, `right`

**Usage Example:**
```json
{
  "type": "intro-marquee",
  "settings": {
    "text": "New Arrivals • Limited Edition • Shop Now",
    "speed": "medium",
    "direction": "left"
  }
}
```

---

#### newsletter.liquid
**Purpose:** Customer email signup form  
**Templates:** `index.json`, `blog.json`, `article.json`  
**Schema Settings:**
- `heading` (text) - Form heading
- `subheading` (text) - Form description
- `button_label` (text) - Submit button text
- `success_message` (text) - Success confirmation text

**Usage Example:**
```json
{
  "type": "newsletter",
  "settings": {
    "heading": "Stay in the studio loop",
    "subheading": "Product launches and creative updates",
    "button_label": "Subscribe"
  }
}
```

**Features:**
- AJAX form submission with loading states
- Success/error message display
- Email validation
- Shopify Customer API integration

---

### Product Sections

#### product-detail.liquid
**Purpose:** Complete product detail page with gallery, info, and add-to-cart  
**Templates:** `product.json`  
**Schema Settings:**
- `show_breadcrumbs` (checkbox) - Display breadcrumb navigation
- `show_vendor` (checkbox) - Display product vendor
- `show_sku` (checkbox) - Display SKU when available
- `gallery_layout` (select) - `grid`, `slider`, `stacked`
- `thumbnail_position` (select) - `left`, `bottom`, `right`
- `enable_zoom` (checkbox) - Click-to-zoom images
- `summary_rows` (blocks) - Product detail rows:
  - `label` (text) - Row label (e.g., "Dimensions")
  - `value` (text) - Row value (e.g., "24\" × 36\"")

**Usage Example:**
```json
{
  "type": "product-detail",
  "blocks": [
    {
      "type": "summary_row",
      "settings": {
        "label": "Material",
        "value": "Solid Walnut"
      }
    }
  ],
  "settings": {
    "gallery_layout": "grid",
    "show_sku": true
  }
}
```

**Features:**
- Multi-variant support (dropdowns + radio buttons)
- Dynamic price updates
- Real-time availability checking
- SKU display
- AJAX add-to-cart
- Form loading states
- Sold-out state handling

---

#### product-split-layout.liquid
**Purpose:** Alternative product layout with side-by-side image/info  
**Templates:** `product.json` (alternate)  
**Schema Settings:**
- Similar to `product-detail.liquid` but with fixed 50/50 layout

---

#### finish-swatches.liquid
**Purpose:** Material/finish selector grid with radio buttons  
**Templates:** Used within `product-detail.liquid` via blocks  
**Schema Settings:**
- `swatches` (blocks) - Swatch options:
  - `label` (text) - Finish name
  - `color` (color) - Swatch color
  - `image` (image_picker) - Optional swatch image

**Usage Example:**
```json
{
  "type": "finish-swatches",
  "blocks": [
    {
      "type": "swatch",
      "settings": {
        "label": "Walnut",
        "color": "#3D2817"
      }
    }
  ]
}
```

---

#### related-products.liquid
**Purpose:** Product recommendations below product detail  
**Templates:** `product.json`  
**Schema Settings:**
- `heading` (text) - Section heading
- `product_count` (range, 2-6) - Number of products to show
- `recommendation_type` (select) - `related`, `complementary`, `recently_viewed`

**Usage Example:**
```json
{
  "type": "related-products",
  "settings": {
    "heading": "Complete the Look",
    "product_count": 4,
    "recommendation_type": "complementary"
  }
}
```

**Features:**
- Uses Shopify Recommendations API
- Fallback to same collection if no recommendations
- Responsive grid (4 → 2 → 1 columns)

---

### Content Sections

#### text-columns.liquid
**Purpose:** Multi-column text layout for features or benefits  
**Templates:** `page.json`, `index.json`  
**Schema Settings:**
- `columns` (blocks) - Column items (max 4):
  - `heading` (text)
  - `content` (richtext)
  - `icon` (select) - Optional icon
- `column_count` (select) - `2`, `3`, `4`

**Usage Example:**
```json
{
  "type": "text-columns",
  "blocks": [
    {
      "type": "column",
      "settings": {
        "heading": "Quality Materials",
        "content": "<p>Solid hardwoods sourced from sustainable forests</p>"
      }
    }
  ],
  "settings": {
    "column_count": "3"
  }
}
```

---

#### gallery-grid.liquid
**Purpose:** Simple image gallery grid  
**Templates:** `page.json`  
**Schema Settings:**
- `images` (blocks) - Gallery images:
  - `image` (image_picker)
  - `caption` (text) - Optional caption
- `columns` (select) - `2`, `3`, `4`
- `aspect_ratio` (select) - `square`, `portrait`, `landscape`, `auto`

**Usage Example:**
```json
{
  "type": "gallery-grid",
  "blocks": [
    {
      "type": "image",
      "settings": {
        "image": "shopify://shop_images/gallery-01.jpg"
      }
    }
  ],
  "settings": {
    "columns": "3",
    "aspect_ratio": "square"
  }
}
```

---

#### statement-banner.liquid
**Purpose:** Full-width text banner with optional background color  
**Templates:** `index.json`, `page.json`  
**Schema Settings:**
- `text` (text) - Banner text
- `text_size` (select) - `small`, `medium`, `large`
- `background_color` (color) - Banner background
- `text_color` (color) - Text color

**Usage Example:**
```json
{
  "type": "statement-banner",
  "settings": {
    "text": "Made to Order • Ships in 4-6 Weeks",
    "text_size": "medium",
    "background_color": "#F5F1E8"
  }
}
```

---

### Template Sections

#### main-blog.liquid
**Purpose:** Blog article grid with pagination  
**Templates:** `blog.json`  
**Schema Settings:**
- `show_heading` (checkbox) - Show blog title
- `posts_per_page` (range, 3-12) - Articles per page
- `show_date` (checkbox) - Show publication date
- `show_author` (checkbox) - Show article author
- `show_excerpt` (checkbox) - Show article excerpt

**Usage Example:**
```json
{
  "type": "main-blog",
  "settings": {
    "show_heading": true,
    "posts_per_page": 9,
    "show_date": true,
    "show_excerpt": true
  }
}
```

**Features:**
- Responsive grid (3 → 2 → 1 columns)
- Pagination with prev/next links
- Article images with placeholder fallback
- Excerpt truncation (120 characters)

---

#### main-article.liquid
**Purpose:** Single blog article with featured image and content  
**Templates:** `article.json`  
**Schema Settings:**
- `show_featured_image` (checkbox) - Show hero image
- `show_date` (checkbox) - Show publication date
- `show_author` (checkbox) - Show author name
- `show_tags` (checkbox) - Show article tags
- `show_share` (checkbox) - Show social share buttons

**Usage Example:**
```json
{
  "type": "main-article",
  "settings": {
    "show_featured_image": true,
    "show_date": true,
    "show_author": true,
    "show_tags": true
  }
}
```

**Features:**
- Narrow content column (720px) for readability
- Featured image hero
- Tag links
- Social share (Twitter, Facebook, Pinterest)

---

#### main-search.liquid
**Purpose:** Search results page with products and articles  
**Templates:** `search.json`  
**Schema Settings:**
- `results_per_page` (range, 8-24) - Results per page

**Usage Example:**
```json
{
  "type": "main-search",
  "settings": {
    "results_per_page": 12
  }
}
```

**Features:**
- Combined product + article results
- Empty state with search suggestions
- Pagination

---

#### main-404.liquid
**Purpose:** 404 error page  
**Templates:** `404.json`  
**Schema Settings:**
- `heading` (text) - Error heading
- `subheading` (text) - Error message
- `button_label` (text) - CTA button text

**Usage Example:**
```json
{
  "type": "main-404",
  "settings": {
    "heading": "Page not found",
    "subheading": "The page you were looking for does not exist.",
    "button_label": "Continue shopping"
  }
}
```

---

#### main-list-collections.liquid
**Purpose:** All collections grid page  
**Templates:** `list-collections.json`  
**Schema Settings:**
- `show_descriptions` (checkbox) - Show collection descriptions
- `columns` (select) - `2`, `3`, `4`

**Usage Example:**
```json
{
  "type": "main-list-collections",
  "settings": {
    "show_descriptions": true,
    "columns": "3"
  }
}
```

---

#### breadcrumbs.liquid
**Purpose:** Semantic breadcrumb navigation  
**Templates:** Used globally via `layout/theme.liquid`  
**Schema Settings:** None (auto-generates based on page hierarchy)

**Usage:**
```liquid
{% if settings.show_global_breadcrumbs %}
  {% render 'breadcrumbs-bar' %}
{% endif %}
```

**Features:**
- Schema.org BreadcrumbList markup
- Auto-generates hierarchy (Home > Collections > Furniture)
- Accessible navigation

---

## Snippets

### product-card.liquid
**Purpose:** Reusable product tile for grids  
**Parameters:**
- `product` (object) - Product object
- `show_vendor` (boolean) - Display vendor
- `image_ratio` (string) - `square`, `portrait`, `auto`

**Usage:**
```liquid
{% render 'product-card', 
  product: product,
  show_vendor: false,
  image_ratio: 'portrait' 
%}
```

**Features:**
- Lazy-loaded images
- Hover effects
- Price formatting
- Sold-out badge

---

### cart-item.liquid
**Purpose:** Cart line item with quantity controls  
**Parameters:**
- `item` (object) - Line item object
- `line_index` (number) - Line item index
- `include_aria_labels` (boolean) - Add ARIA attributes

**Usage:**
```liquid
{% for item in cart.items %}
  {% render 'cart-item', 
    item: item, 
    line_index: forloop.index,
    include_aria_labels: true 
  %}
{% endfor %}
```

---

### cart-footer.liquid
**Purpose:** Cart totals and checkout button  
**Parameters:**
- `cart` (object) - Cart object
- `context` (string) - `drawer` or `page`

**Usage:**
```liquid
{% render 'cart-footer', cart: cart, context: 'drawer' %}
```

---

### arrow-link.liquid
**Purpose:** Standardized CTA link with animated arrow  
**Parameters:**
- `text` (string) - Link text
- `url` (string) - Link URL
- `style` (string) - `primary`, `secondary`, `tertiary`

**Usage:**
```liquid
{% render 'arrow-link', 
  text: 'Shop Now',
  url: product.url,
  style: 'primary' 
%}
```

---

### product-swatch-picker.liquid
**Purpose:** Color/finish radio button selector  
**Parameters:**
- `product` (object) - Product object
- `option_name` (string) - Option name (e.g., "Finish")
- `selected_value` (string) - Currently selected value

**Usage:**
```liquid
{% render 'product-swatch-picker',
  product: product,
  option_name: 'Finish',
  selected_value: current_variant.option2 
%}
```

---

### product-gallery-item.liquid
**Purpose:** Gallery image with optional caption  
**Parameters:**
- `image` (object) - Image object
- `caption` (string) - Optional caption
- `index` (number) - Image index

**Usage:**
```liquid
{% for image in product.images %}
  {% render 'product-gallery-item',
    image: image,
    index: forloop.index 
  %}
{% endfor %}
```

---

### breadcrumbs-bar.liquid
**Purpose:** Breadcrumb navigation bar  
**Parameters:** None (auto-detects page context)

**Usage:**
```liquid
{% render 'breadcrumbs-bar' %}
```

---

### pagination.liquid
**Purpose:** Paginate collection/blog results  
**Parameters:**
- `paginate` (object) - Paginate object

**Usage:**
```liquid
{% paginate collection.products by 12 %}
  <!-- Product grid -->
  {% render 'pagination', paginate: paginate %}
{% endpaginate %}
```

---

### critical-css.liquid
**Purpose:** Inline critical CSS for above-fold content  
**Parameters:** None

**Usage:**
```liquid
{% render 'critical-css' %}
```

**Includes:**
- CSS reset
- Design tokens (spacing, typography)
- Header styles
- Hero base styles

---

### theme-style-variables.liquid
**Purpose:** Inject CSS custom properties from theme settings  
**Parameters:** None

**Usage:**
```liquid
{% render 'theme-style-variables' %}
```

**Includes:**
- Color variables from settings
- Font family selections
- Spacing overrides

---

## Usage Guidelines

### Adding New Sections

1. **Create section file** in `sections/` directory
2. **Add JSON schema** at bottom of file:
   ```liquid
   {% schema %}
   {
     "name": "Section Name",
     "settings": [ ... ],
     "presets": [
       {
         "name": "Section Name"
       }
     ]
   }
   {% endschema %}
   ```
3. **Test in theme editor** by adding to a template
4. **Document here** with schema reference and usage examples

### Section Naming Conventions

- **Layout sections:** `header`, `footer`, `cart-drawer`
- **Main sections:** `main-blog`, `main-article`, `main-search`
- **Feature sections:** `hero-split`, `split-feature`, `statement-banner`
- **Grid sections:** `editorial-grid`, `gallery-grid`, `collection-grid`

### CSS Architecture

All sections reference shared CSS classes from:
- `assets/theme.css` - Global styles, tokens, utilities
- `assets/sections-layout.css` - Header, footer, cart
- `assets/sections-homepage.css` - Homepage sections
- `assets/sections-product.css` - Product sections
- `assets/sections-collection.css` - Collection sections
- `assets/sections-content.css` - Content sections
- `assets/sections-blog.css` - Blog sections

### Performance Best Practices

1. **Lazy-load images:** Use `loading="lazy"` for below-fold images
2. **Optimize image sizes:** Use `image_url: width: 800` filter
3. **Limit blocks:** Max 6-12 blocks per section for performance
4. **Conditional CSS:** Only load section-specific CSS when needed

---

**Last Updated:** 2025-11-26  
**Theme Version:** 1.0  
**Total Sections:** 30+  
**Total Snippets:** 14
