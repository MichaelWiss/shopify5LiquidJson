# Product Metafields Guide

This theme uses Shopify Metafields to display dynamic product information in the "Product Detail" summary rows and "Tech Specs" table.

## Setup Instructions

1. Go to **Settings > Custom data > Products** in your Shopify Admin.
2. Click **Add definition**.
3. Create the following definitions in the `custom` namespace (which is the default).

## Recommended Definitions

### 1. Product Attributes (Summary Rows)
These appear near the price/add-to-cart button.

| Name | Namespace & Key | Type | Description |
|------|----------------|------|-------------|
| **Size** | `custom.size` | Single line text | e.g., "Medium", "Large" |
| **Orientation** | `custom.orientation` | Single line text | e.g., "Vertical", "Horizontal" |
| **Mounting** | `custom.mounting` | Single line text | e.g., "Surface", "Recessed" |
| **Material** | `custom.material` | Single line text | e.g., "Brass", "Alabaster" |

### 2. Specifications (Tech Specs Table)
These appear in the specifications section.

| Name | Namespace & Key | Type | Description |
|------|----------------|------|-------------|
| **Dimensions** | `custom.dimensions` | Multi-line text | Dimensions of the product |
| **Weight** | `custom.weight` | Single line text | Product weight |
| **Bulb Type** | `custom.bulb` | Single line text | Bulb specifications |
| **Wattage** | `custom.wattage` | Single line text | Max wattage |
| **Dimming** | `custom.dimming` | Single line text | Dimming compatibility |
| **Installation**| `custom.installation`| Single line text | Installation notes (UL listed, etc.) |

## How to Use in Theme Editor

1. Navigate to the **Product** template.
2. Click on a **Detail row** block (in Product Detail) or **Specification** block (in Specs Table).
3. Enter the **Metafield key** (e.g., `size` or `dimensions`) in the settings.
   - *Note: The theme assumes the `custom` namespace automatically.*
4. Alternatively, use the **Value** field to enter static text or connect a dynamic source using the "Connect dynamic source" icon in the database symbol.
