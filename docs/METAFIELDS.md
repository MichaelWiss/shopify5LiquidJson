# Metafield Schema Documentation

Complete reference for all metafield definitions used in the Refinements Shopify theme.

## Table of Contents

- [Overview](#overview)
- [Product Metafields](#product-metafields)
- [Collection Metafields](#collection-metafields)
- [Page Metafields](#page-metafields)
- [Shop Metafields](#shop-metafields)
- [Implementation Guide](#implementation-guide)
- [Migration Notes](#migration-notes)

---

## Overview

### Metafield Namespaces

This theme uses the `custom` namespace for all merchant-editable metafields, following Shopify's recommended practices.

**Namespace Convention:**
- `custom.*` - Merchant-editable fields (shown in Shopify admin)
- `theme.*` - Theme-specific configuration (not exposed to merchants)

### Supported Types

- `single_line_text_field` - Short text (255 characters)
- `multi_line_text_field` - Long text (5000 characters)
- `rich_text_field` - HTML content with rich editor
- `number_integer` - Whole numbers
- `number_decimal` - Decimal numbers (prices, dimensions)
- `boolean` - True/false checkbox
- `file_reference` - Single file (image, PDF, etc.)
- `list.file_reference` - Multiple files
- `color` - Color picker
- `url` - External link
- `product_reference` - Single product
- `list.product_reference` - Multiple products
- `collection_reference` - Single collection
- `dimension` - Length/width/height with units
- `weight` - Weight with units
- `json` - Structured JSON data

---

## Product Metafields

### Product Details

#### custom.dimensions
**Type:** `multi_line_text_field`  
**Description:** Product dimensions (displayed in summary table)  
**Usage:** Product detail page summary rows  
**Example Value:**
```
24" W × 36" H × 12" D
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.dimensions %}
  <div class="product-summary__row">
    <span class="product-summary__label">Dimensions</span>
    <span class="product-summary__value">{{ product.metafields.custom.dimensions }}</span>
  </div>
{% endif %}
```

---

#### custom.material
**Type:** `single_line_text_field`  
**Description:** Primary material composition  
**Usage:** Product detail page summary rows  
**Example Value:**
```
Solid Walnut
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.material %}
  <div class="product-summary__row">
    <span class="product-summary__label">Material</span>
    <span class="product-summary__value">{{ product.metafields.custom.material }}</span>
  </div>
{% endif %}
```

---

#### custom.finish_options
**Type:** `multi_line_text_field`  
**Description:** Available finish options (one per line)  
**Usage:** Finish swatches section  
**Example Value:**
```
Natural Oak
Dark Walnut
Matte Black
```

**Liquid Usage:**
```liquid
{% assign finishes = product.metafields.custom.finish_options | newline_to_br | split: '<br />' %}
{% for finish in finishes %}
  <div class="finish-swatch">{{ finish }}</div>
{% endfor %}
```

---

#### custom.lead_time
**Type:** `single_line_text_field`  
**Description:** Manufacturing and shipping lead time  
**Usage:** Product detail page (below price)  
**Example Value:**
```
Ships in 4-6 weeks
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.lead_time %}
  <p class="product-lead-time">{{ product.metafields.custom.lead_time }}</p>
{% endif %}
```

---

#### custom.care_instructions
**Type:** `rich_text_field`  
**Description:** Care and maintenance instructions  
**Usage:** Product detail page (accordion or tab)  
**Example Value:**
```html
<p>Wipe clean with damp cloth. Avoid harsh chemicals.</p>
<ul>
  <li>Dust regularly with soft cloth</li>
  <li>Use coasters to prevent water rings</li>
</ul>
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.care_instructions %}
  <div class="product-care">
    <h3>Care Instructions</h3>
    {{ product.metafields.custom.care_instructions }}
  </div>
{% endif %}
```

---

#### custom.assembly_required
**Type:** `boolean`  
**Description:** Whether product requires assembly  
**Usage:** Product detail page (badge or notice)  
**Example Value:**
```
true
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.assembly_required %}
  <span class="product-badge">Assembly Required</span>
{% endif %}
```

---

#### custom.warranty_info
**Type:** `single_line_text_field`  
**Description:** Warranty duration and coverage  
**Usage:** Product detail page summary rows  
**Example Value:**
```
5-Year Limited Warranty
```

---

#### custom.made_in
**Type:** `single_line_text_field`  
**Description:** Country of manufacture  
**Usage:** Product detail page (footer or summary)  
**Example Value:**
```
Made in USA
```

---

### Product Media

#### custom.hero_image
**Type:** `file_reference`  
**Description:** Override main product image (e.g., lifestyle photo)  
**Usage:** Product detail hero section  
**Example Value:**
```
shopify://shop_images/product-hero-lifestyle.jpg
```

**Liquid Usage:**
```liquid
{% assign hero = product.metafields.custom.hero_image | default: product.featured_image %}
<img src="{{ hero | image_url: width: 1200 }}" alt="{{ product.title }}">
```

---

#### custom.lifestyle_gallery
**Type:** `list.file_reference`  
**Description:** Additional lifestyle images (supplements product images)  
**Usage:** Product detail gallery  
**Example Value:**
```json
[
  "shopify://shop_images/lifestyle-01.jpg",
  "shopify://shop_images/lifestyle-02.jpg"
]
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.lifestyle_gallery %}
  {% for image in product.metafields.custom.lifestyle_gallery.value %}
    <img src="{{ image | image_url: width: 800 }}" loading="lazy">
  {% endfor %}
{% endif %}
```

---

#### custom.video_url
**Type:** `url`  
**Description:** Product video URL (YouTube, Vimeo)  
**Usage:** Product detail page (embedded video)  
**Example Value:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.video_url %}
  <iframe src="{{ product.metafields.custom.video_url }}" frameborder="0"></iframe>
{% endif %}
```

---

### Product Relationships

#### custom.related_products
**Type:** `list.product_reference`  
**Description:** Manually curated related products (overrides auto-recommendations)  
**Usage:** Related products section  
**Example Value:**
```json
[
  "gid://shopify/Product/123",
  "gid://shopify/Product/456"
]
```

**Liquid Usage:**
```liquid
{% if product.metafields.custom.related_products %}
  {% for related in product.metafields.custom.related_products.value %}
    {% render 'product-card', product: related %}
  {% endfor %}
{% endif %}
```

---

#### custom.bundle_products
**Type:** `list.product_reference`  
**Description:** Products included in "Complete the Look" bundles  
**Usage:** Bundle recommendation feature  
**Example Value:**
```json
[
  "gid://shopify/Product/789",
  "gid://shopify/Product/101"
]
```

---

#### custom.collection_featured
**Type:** `collection_reference`  
**Description:** Featured collection for this product (shown on PDP)  
**Usage:** Product detail page ("Shop the Collection" CTA)  
**Example Value:**
```
gid://shopify/Collection/123456
```

---

### Wholesale & B2B

#### custom.wholesale_price
**Type:** `number_decimal`  
**Description:** Wholesale price (cents)  
**Usage:** B2B pricing display for tagged customers  
**Example Value:**
```
89900
```

**Liquid Usage:**
```liquid
{% if customer.tags contains 'wholesale' and product.metafields.custom.wholesale_price %}
  <span class="product-price--wholesale">
    {{ product.metafields.custom.wholesale_price | money }}
  </span>
{% endif %}
```

---

#### custom.minimum_order_quantity
**Type:** `number_integer`  
**Description:** Minimum order quantity for wholesale customers  
**Usage:** Product form (B2B)  
**Example Value:**
```
12
```

---

#### custom.volume_pricing
**Type:** `json`  
**Description:** Tiered volume pricing structure  
**Usage:** Volume discount calculator  
**Example Value:**
```json
{
  "tiers": [
    { "min": 10, "max": 49, "discount_percent": 10 },
    { "min": 50, "max": 99, "discount_percent": 15 },
    { "min": 100, "max": null, "discount_percent": 20 }
  ]
}
```

---

### Customization

#### custom.customizable
**Type:** `boolean`  
**Description:** Whether product accepts custom orders  
**Usage:** Product detail page (shows "Request Custom Quote" button)  
**Example Value:**
```
true
```

---

#### custom.custom_order_form_url
**Type:** `url`  
**Description:** Link to custom order inquiry form  
**Usage:** Product detail page (custom order CTA)  
**Example Value:**
```
https://example.com/pages/custom-orders
```

---

## Collection Metafields

### Collection Display

#### custom.description_long
**Type:** `rich_text_field`  
**Description:** Extended collection description (below products)  
**Usage:** Collection page footer  
**Example Value:**
```html
<p>Our furniture collection features...</p>
```

**Liquid Usage:**
```liquid
{% if collection.metafields.custom.description_long %}
  <div class="collection-description">
    {{ collection.metafields.custom.description_long }}
  </div>
{% endif %}
```

---

#### custom.hero_image
**Type:** `file_reference`  
**Description:** Collection hero image (overrides featured image)  
**Usage:** Collection page hero  
**Example Value:**
```
shopify://shop_images/collection-hero-furniture.jpg
```

---

#### custom.icon
**Type:** `file_reference`  
**Description:** Collection icon/logo (for navigation or tiles)  
**Usage:** Featured collections grid  
**Example Value:**
```
shopify://shop_images/icon-furniture.svg
```

---

#### custom.featured_products
**Type:** `list.product_reference`  
**Description:** Manually curated products to feature at top of collection  
**Usage:** Collection page (displays before regular products)  
**Example Value:**
```json
[
  "gid://shopify/Product/111",
  "gid://shopify/Product/222"
]
```

---

### Collection Organization

#### custom.display_order
**Type:** `number_integer`  
**Description:** Sort order for collections list  
**Usage:** List collections page sorting  
**Example Value:**
```
1
```

---

#### custom.parent_collection
**Type:** `collection_reference`  
**Description:** Parent collection for hierarchical navigation  
**Usage:** Breadcrumbs, sub-collection navigation  
**Example Value:**
```
gid://shopify/Collection/456
```

---

## Page Metafields

### Page Layout

#### custom.hide_header
**Type:** `boolean`  
**Description:** Hide global header on this page  
**Usage:** Landing pages, campaign pages  
**Example Value:**
```
true
```

**Liquid Usage:**
```liquid
{% unless page.metafields.custom.hide_header %}
  {% section 'header' %}
{% endunless %}
```

---

#### custom.hero_image
**Type:** `file_reference`  
**Description:** Page hero background image  
**Usage:** Page template hero section  
**Example Value:**
```
shopify://shop_images/page-hero-about.jpg
```

---

#### custom.cta_button_text
**Type:** `single_line_text_field`  
**Description:** Custom CTA button text  
**Usage:** Page hero or footer  
**Example Value:**
```
Shop the Collection
```

---

#### custom.cta_button_url
**Type:** `url`  
**Description:** Custom CTA button destination  
**Usage:** Page hero or footer  
**Example Value:**
```
/collections/furniture
```

---

## Shop Metafields

### Brand Information

#### custom.brand_story
**Type:** `rich_text_field`  
**Description:** Brand story (for About page)  
**Usage:** About page content  
**Example Value:**
```html
<p>Founded in Brooklyn...</p>
```

**Liquid Usage:**
```liquid
{{ shop.metafields.custom.brand_story }}
```

---

#### custom.contact_email
**Type:** `single_line_text_field`  
**Description:** Customer service email  
**Usage:** Footer, contact page  
**Example Value:**
```
hello@refinements.com
```

---

#### custom.phone_number
**Type:** `single_line_text_field`  
**Description:** Customer service phone number  
**Usage:** Header, footer, contact page  
**Example Value:**
```
+1 (555) 123-4567
```

---

### Marketing

#### custom.announcement_bar_text
**Type:** `single_line_text_field`  
**Description:** Announcement bar message  
**Usage:** Global announcement bar  
**Example Value:**
```
Free Shipping on Orders Over $500
```

---

#### custom.announcement_bar_link
**Type:** `url`  
**Description:** Announcement bar click destination  
**Usage:** Global announcement bar  
**Example Value:**
```
/pages/shipping
```

---

#### custom.promo_banner_image
**Type:** `file_reference`  
**Description:** Promotional banner image  
**Usage:** Homepage or landing pages  
**Example Value:**
```
shopify://shop_images/promo-banner.jpg
```

---

## Implementation Guide

### Creating Metafield Definitions

**Via Shopify Admin:**
1. Navigate to **Settings → Custom Data**
2. Select resource type (Products, Collections, etc.)
3. Click **Add definition**
4. Fill in:
   - **Namespace:** `custom`
   - **Key:** `dimensions` (example)
   - **Name:** Dimensions
   - **Type:** Multi-line text
   - **Validation:** (optional)

---

### JSON Definition Export

For programmatic creation via Shopify API:

```json
{
  "metafield": {
    "namespace": "custom",
    "key": "dimensions",
    "type": "multi_line_text_field",
    "name": "Product Dimensions",
    "description": "Physical dimensions of the product",
    "owner_type": "Product"
  }
}
```

---

### Liquid Access Patterns

**Basic Access:**
```liquid
{{ product.metafields.custom.dimensions }}
```

**With Default Fallback:**
```liquid
{{ product.metafields.custom.lead_time | default: 'Ships in 2-3 weeks' }}
```

**Type-Specific Access:**

**File Reference:**
```liquid
{% assign image = product.metafields.custom.hero_image %}
<img src="{{ image | image_url: width: 1200 }}" alt="{{ product.title }}">
```

**List of Products:**
```liquid
{% for related in product.metafields.custom.related_products.value %}
  {{ related.title }}
{% endfor %}
```

**JSON:**
```liquid
{% assign pricing = product.metafields.custom.volume_pricing | parse_json %}
{% for tier in pricing.tiers %}
  {{ tier.min }} - {{ tier.max }}: {{ tier.discount_percent }}% off
{% endfor %}
```

---

### GraphQL Queries

**Fetch Product with Metafields:**
```graphql
{
  product(id: "gid://shopify/Product/123") {
    title
    metafield(namespace: "custom", key: "dimensions") {
      value
    }
    related_products: metafield(namespace: "custom", key: "related_products") {
      references(first: 4) {
        edges {
          node {
            ... on Product {
              id
              title
              featuredImage {
                url
              }
            }
          }
        }
      }
    }
  }
}
```

---

## Migration Notes

### Phase 1: Definition Creation
**Status:** Not started  
**Effort:** 2-4 hours  

**Tasks:**
1. Create metafield definitions in Shopify admin
2. Document all definitions in this file
3. Update theme code to reference metafields

---

### Phase 2: Data Population
**Status:** Not started  
**Effort:** Varies by catalog size  

**Tasks:**
1. Populate product metafields (manual or CSV import)
2. Test metafield display on frontend
3. Validate JSON structures (volume pricing, etc.)

---

### Phase 3: Theme Integration
**Status:** Not started  
**Effort:** 4-6 hours  

**Tasks:**
1. Update `product-detail.liquid` to use metafields
2. Update `collection-grid.liquid` to use metafields
3. Add conditional rendering for optional metafields
4. Test with and without metafields present

---

### Current Workarounds

**Product Summary Rows:**
Currently hardcoded in `templates/product.json` blocks:
```json
{
  "type": "summary_row",
  "settings": {
    "label": "Material",
    "value": "Solid Walnut"
  }
}
```

**After Metafield Integration:**
Will read from `product.metafields.custom.material` automatically.

---

## Validation Rules

### Dimensions Format
**Pattern:** `##" W × ##" H × ##" D`  
**Example:** `24" W × 36" H × 12" D`

### Lead Time Format
**Pattern:** `Ships in #-# weeks`  
**Example:** `Ships in 4-6 weeks`

### Price Formats
**Wholesale Price:** Stored in cents (integer)  
**Example:** `89900` = $899.00

### Volume Pricing JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "tiers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "min": { "type": "integer" },
          "max": { "type": ["integer", "null"] },
          "discount_percent": { "type": "number" }
        },
        "required": ["min", "discount_percent"]
      }
    }
  }
}
```

---

## Best Practices

### Naming Conventions
- Use lowercase with underscores: `lead_time` not `leadTime`
- Be descriptive: `wholesale_price` not `ws_price`
- Group related fields: `video_url`, `video_thumbnail`

### Data Consistency
- Always provide fallback values in Liquid
- Validate JSON structures before saving
- Use consistent units (inches, pounds, USD)

### Performance
- Avoid querying metafields in loops (fetch upfront)
- Use `{% assign %}` to cache metafield values
- Limit list metafields to reasonable sizes (<20 items)

---

**Last Updated:** 2025-11-26  
**Version:** 1.0  
**Status:** Planned (not yet implemented)  
**Implementation Priority:** Phase 2 (after core features complete)
