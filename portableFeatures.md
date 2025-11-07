<!-- portableFeatures.md
This file documents portable UI & architectural features (from the provided component map)
that can be ported into the `shopify5LiquidJson` theme. It includes feature descriptions,
code examples, implementation steps, estimated impact, and a prioritized roadmap.
-->

# Portable Features — Component Map Porting Guide

Generated: 2025-11-07

## **Comprehensive Feature Analysis: Portable Features from "In Common With" Site Map**

Based on the detailed component map, here are features that could be ported to your Shopify Liquid theme project, organized by priority and implementation complexity:

---

## **1. CRITICAL ARCHITECTURAL FEATURES**

### **1.1 Dynamic Header Color Switching**
**Current State:** Your theme has static header  
**Their Implementation:** `<header-color-switcher>` Vue component with `:color` prop  
**Port Strategy:**
```liquid
<!-- sections/header.liquid -->
{% if section.settings.header_color_mode == 'dynamic' %}
  <header class="site-header" data-color-mode="dynamic" style="--header-color: {{ section.settings.header_color }}">
{% else %}
  <header class="site-header">
{% endif %}
```
**JavaScript Required:**
```javascript
// Observe sections with data-header-color attribute
// Update header background/text color on scroll into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const color = entry.target.dataset.headerColor;
      document.querySelector('.site-header').style.setProperty('--header-color', color);
    }
  });
});
```
**Schema Addition:**
```json
{
  "type": "color",
  "id": "header_color",
  "label": "Dynamic header color"
}
```
**Estimated Impact:** ~80 lines JS, ~30 lines Liquid, major UX enhancement

---

### **1.2 Scroll-Aware Logo Fade**
**Current State:** Static logo visibility  
**Their Implementation:** `<scroll-watcher>` Vue component that fades logo on scroll  
**Port Strategy:**
```liid
<!-- sections/hero-full-bleed.liquid -->
<div class="hero-logo" data-scroll-fade>
  {{ section.settings.logo_svg }}
</div>
```
**JavaScript:**
```javascript
const scrollFadeElements = document.querySelectorAll('[data-scroll-fade]');
window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / window.innerHeight;
  scrollFadeElements.forEach(el => {
    el.style.opacity = Math.max(0, 1 - scrollPercent * 2);
  });
}, { passive: true });
```
**Estimated Impact:** ~20 lines JS, cinematic effect

---

### **1.3 Internal Section Navigation with Active States**
**Current State:** No internal page navigation  
**Their Implementation:** `<internal-navigation>` with `active-class="translate-x-12"`  
**Port Strategy:**
```liquid
<!-- snippets/internal-navigation.liquid -->
<nav class="internal-nav sticky" aria-label="Section navigation">
  <ul>
    {% for link in links %}
      <li>
        <a href="#{{ link.anchor }}" 
           class="internal-nav__link" 
           data-scroll-target="{{ link.anchor }}">
          {{ link.title }}
        </a>
      </li>
    {% endfor %}
  </ul>
</nav>
```
**JavaScript (Intersection Observer):**
```javascript
// Track which section is currently in view
const navLinks = document.querySelectorAll('.internal-nav__link');
const sections = document.querySelectorAll('[data-section-anchor]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('is-active', 'translate-x-12');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('is-active', 'translate-x-12');
        }
      });
    }
  });
}, { threshold: 0.5 });
```
**Estimated Impact:** ~60 lines JS, ~30 lines Liquid, excellent for long-form pages

---

## **2. HIGH PRIORITY COMPONENT FEATURES**

### **2.1 Offset Carousel Component**
**Current State:** No carousel functionality  
**Their Implementation:** `<offset-carousel>` with autoplay, slide-width control  
**Port Strategy:**
Create `sections/offset-carousel.liquid`:
```liquid
<div class="offset-carousel" 
     data-autoplay="{{ section.settings.autoplay }}"
     data-autoplay-delay="{{ section.settings.autoplay_delay }}"
     data-slide-width="{{ section.settings.slide_width }}">
  
  <div class="offset-carousel__track">
    {% for block in section.blocks %}
      <div class="offset-carousel__slide" 
           style="--slide-width: {{ section.settings.slide_width }};">
        <figure class="aspect-[{{ block.settings.aspect_ratio }}]">
          {% if block.settings.image %}
            {{ block.settings.image | image_url: width: 800 | image_tag }}
          {% endif %}
        </figure>
        <h3>{{ block.settings.title }}</h3>
        {% if block.settings.link %}
          <a href="{{ block.settings.link }}" class="cta">{{ block.settings.link_text }}</a>
        {% endif %}
      </div>
    {% endfor %}
  </div>
  
  <button class="carousel-nav carousel-nav--prev" aria-label="Previous">←</button>
  <button class="carousel-nav carousel-nav--next" aria-label="Next">→</button>
</div>
```
**JavaScript (Vanilla implementation):**
```javascript
class OffsetCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = element.querySelector('.offset-carousel__track');
    this.slides = [...element.querySelectorAll('.offset-carousel__slide')];
    this.autoplay = element.dataset.autoplay === 'true';
    this.delay = parseInt(element.dataset.autoplayDelay) || 3000;
    this.currentIndex = 0;
    
    this.init();
  }
  
  init() {
    // Navigation buttons
    this.carousel.querySelector('.carousel-nav--prev').addEventListener('click', () => this.prev());
    this.carousel.querySelector('.carousel-nav--next').addEventListener('click', () => this.next());
    
    // Autoplay
    if (this.autoplay) {
      this.startAutoplay();
      this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    // Touch/swipe support
    this.addSwipeSupport();
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updatePosition();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updatePosition();
  }
  
  updatePosition() {
    const slideWidth = this.slides[0].offsetWidth;
    this.track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
  }
  
  startAutoplay() {
    this.autoplayTimer = setInterval(() => this.next(), this.delay);
  }
  
  stopAutoplay() {
    clearInterval(this.autoplayTimer);
  }
  
  addSwipeSupport() {
    let startX, isDragging = false;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });
    
    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
      isDragging = false;
    });
  }
}

// Initialize all carousels
document.querySelectorAll('.offset-carousel').forEach(el => new OffsetCarousel(el));
```
**Schema:**
```json
{
  "name": "Offset Carousel",
  "settings": [
    {
      "type": "checkbox",
      "id": "autoplay",
      "label": "Enable autoplay",
      "default": true
    },
    {
      "type": "range",
      "id": "autoplay_delay",
      "label": "Autoplay delay (seconds)",
      "min": 2,
      "max": 10,
      "step": 1,
      "default": 3
    },
    {
      "type": "range",
      "id": "slide_width",
      "label": "Slide width (columns)",
      "min": 3,
      "max": 8,
      "step": 1,
      "default": 4
    }
  ],
  "blocks": [
    {
      "type": "slide",
      "name": "Slide",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Image"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Title"
        },
        {
          "type": "text",
          "id": "aspect_ratio",
          "label": "Aspect ratio",
          "default": "25/31",
          "info": "Format: width/height (e.g., 4/5, 16/9)"
        }
      ]
    }
  ],
  "max_blocks": 12
}
```
**Estimated Impact:** ~200 lines JS, ~80 lines Liquid, ~50 lines CSS

---

### **2.2 Product Card with Multi-State Images**
**Current State:** Single product image  
**Their Implementation:** Product data includes `images: { default, lights_on, lifestyle }`  
**Port Strategy:**
```liquid
<!-- snippets/product-card-enhanced.liquid -->
{% comment %}
  Enhanced product card with image states
  Accepts:
  - product: {Object}
  - show_quick_view: {Boolean}
  - image_state: {String} 'default', 'lights_on', 'lifestyle'
{% endcomment %}

<article class="product-card-enhanced" data-product-id="{{ product.id }}">
  <div class="product-card__images">
    {% assign default_image = product.featured_media %}
    {% assign lights_on_image = product.metafields.custom.lights_on_image %}
    {% assign lifestyle_image = product.metafields.custom.lifestyle_image %}
    
    <figure class="product-card__image-wrapper">
      <!-- Default Image -->
      <img 
        src="{{ default_image | image_url: width: 800 }}" 
        alt="{{ product.title }}"
        class="product-card__image product-card__image--default"
        loading="lazy">
      
      <!-- Lights On Image (hover state) -->
      {% if lights_on_image %}
        <img 
          src="{{ lights_on_image.value | image_url: width: 800 }}" 
          alt="{{ product.title }} - lights on"
          class="product-card__image product-card__image--lights-on"
          loading="lazy">
      {% endif %}
      
      <!-- Image State Toggle -->
      <div class="product-card__image-toggle">
        <button type="button" 
                data-image-state="default" 
                class="is-active"
                aria-label="Default view">●</button>
        {% if lights_on_image %}
          <button type="button" 
                  data-image-state="lights_on"
                  aria-label="Lights on view">●</button>
        {% endif %}
      </div>
    </figure>
  </div>
  
  <div class="product-card__content">
    <h3 class="product-card__title">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </h3>
    <p class="product-card__price">{{ product.price | money }}</p>
    
    {% if product.type %}
      <span class="product-card__type">{{ product.type }}</span>
    {% endif %}
  </div>
</article>
```
**JavaScript:**
```javascript
// Product card image state switcher
document.querySelectorAll('.product-card-enhanced').forEach(card => {
  const imageWrapper = card.querySelector('.product-card__image-wrapper');
  const toggleButtons = card.querySelectorAll('[data-image-state]');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const state = button.dataset.imageState;
      
      // Update active button
      toggleButtons.forEach(btn => btn.classList.remove('is-active'));
      button.classList.add('is-active');
      
      // Update visible image
      imageWrapper.dataset.imageState = state;
    });
  });
  
  // Auto-toggle on hover (optional)
  if (card.querySelector('.product-card__image--lights-on')) {
    card.addEventListener('mouseenter', () => {
      imageWrapper.dataset.imageState = 'lights_on';
    });
    card.addEventListener('mouseleave', () => {
      imageWrapper.dataset.imageState = 'default';
    });
  }
});
```
**CSS:**
```css
.product-card__image-wrapper {
  position: relative;
}

.product-card__image {
  transition: opacity 0.3s ease;
}

.product-card__image--lights-on {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.product-card__image-wrapper[data-image-state="lights_on"] .product-card__image--lights-on {
  opacity: 1;
}

.product-card__image-wrapper[data-image-state="lights_on"] .product-card__image--default {
  opacity: 0;
}
```
**Metafield Setup Required:**
- Namespace: `custom`
- Key: `lights_on_image` (type: file_reference)
- Key: `lifestyle_image` (type: file_reference)

**Estimated Impact:** ~100 lines total, significant product presentation upgrade

---

### **2.3 Sticky Sidebar Pattern**
**Current State:** No sticky navigation  
**Their Implementation:** `<div class="sticky top-[header+12px]">`  
**Port Strategy:**
```liquid
<!-- Pattern for any section with sidebar -->
<div class="container flex lg:flex-row">
  <!-- Sticky Sidebar -->
  <div class="section-sidebar lg:w-column">
    <div class="sticky top-[calc(var(--header-height)+12px)]">
      <h2>{{ section.settings.heading }}</h2>
    </div>
  </div>
  
  <!-- Scrolling Content -->
  <div class="section-content">
    {{ content }}
  </div>
</div>
```
**CSS Variables:**
```css
:root {
  --header-height: 80px;
}

.section-sidebar {
  position: relative;
}

.sticky {
  position: sticky;
  top: calc(var(--header-height) + 12px);
}

@media (max-width: 1023px) {
  .section-sidebar .sticky {
    position: static;
  }
}
```
**Estimated Impact:** ~20 lines CSS, reusable pattern

---

## **3. MEDIUM PRIORITY UI ENHANCEMENTS**

### **3.1 Popup Modal System**
**Current State:** No modal/popup system  
**Their Implementation:** `<popup-modals>` with delay, no overlay option  
**Port Strategy:**
Create `snippets/popup-modal.liquid`:
```liquid
{% comment %}
  Popup Modal Component
  Accepts:
  - id: {String} Unique identifier
  - delay: {Number} Delay before showing (ms)
  - position: {String} 'bottom-banner' or 'bottom-right'
  - show_overlay: {Boolean}
  - dismissible: {Boolean}
  - cookie_name: {String} For remember dismissed state
{% endcomment %}

<div class="popup-modal" 
     id="popup-{{ id }}"
     data-delay="{{ delay | default: 5000 }}"
     data-position="{{ position | default: 'bottom-right' }}"
     data-cookie="{{ cookie_name }}"
     aria-hidden="true"
     role="dialog">
  
  {% if show_overlay %}
    <div class="popup-modal__overlay"></div>
  {% endif %}
  
  <div class="popup-modal__content popup-modal__content--{{ position }}">
    {% if dismissible %}
      <button type="button" 
              class="popup-modal__close" 
              aria-label="Close">
        ✕
      </button>
    {% endif %}
    
    <div class="popup-modal__body">
      {{ content }}
    </div>
  </div>
</div>
```
**JavaScript:**
```javascript
class PopupModal {
  constructor(element) {
    this.modal = element;
    this.delay = parseInt(element.dataset.delay) || 0;
    this.cookieName = element.dataset.cookie;
    this.closeBtn = element.querySelector('.popup-modal__close');
    
    this.init();
  }
  
  init() {
    // Check if already dismissed
    if (this.cookieName && this.getCookie(this.cookieName)) {
      return;
    }
    
    // Show after delay
    setTimeout(() => this.show(), this.delay);
    
    // Close handlers
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    // Close on overlay click
    const overlay = this.modal.querySelector('.popup-modal__overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.hasAttribute('aria-hidden')) {
        this.close();
      }
    });
  }
  
  show() {
    this.modal.removeAttribute('aria-hidden');
    this.modal.classList.add('is-visible');
    
    // Animate in
    requestAnimationFrame(() => {
      this.modal.classList.add('is-active');
    });
  }
  
  close() {
    this.modal.classList.remove('is-active');
    
    // Wait for animation
    setTimeout(() => {
      this.modal.classList.remove('is-visible');
      this.modal.setAttribute('aria-hidden', 'true');
    }, 300);
    
    // Remember dismissed state
    if (this.cookieName) {
      this.setCookie(this.cookieName, 'dismissed', 30); // 30 days
    }
  }
  
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }
}

// Initialize all popups
document.querySelectorAll('.popup-modal').forEach(el => new PopupModal(el));
```
**CSS:**
```css
.popup-modal {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.popup-modal[aria-hidden="false"] {
  pointer-events: auto;
}

.popup-modal.is-active {
  opacity: 1;
}

.popup-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.popup-modal__content {
  position: fixed;
  background: white;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.popup-modal.is-active .popup-modal__content {
  transform: translateY(0);
}

/* Position variants */
.popup-modal__content--bottom-banner {
  bottom: 0;
  left: 0;
  right: 0;
}

.popup-modal__content--bottom-right {
  bottom: 24px;
  right: 24px;
  max-width: 400px;
}

.popup-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.popup-modal__close:hover {
  opacity: 1;
}
```
**Estimated Impact:** ~150 lines JS, ~80 lines CSS, highly reusable

---

### **3.2 Cookie Consent Banner**
**Current State:** No cookie consent  
**Their Implementation:** Popup modal with bottom banner position  
**Port Strategy:**
Create `sections/cookie-consent.liquid`:
```liquid
{% render 'popup-modal',
  id: 'cookie-consent',
  delay: 2000,
  position: 'bottom-banner',
  show_overlay: false,
  dismissible: false,
  cookie_name: 'cookie_consent',
  content: cookie_content
%}

{% capture cookie_content %}
  <div class="cookie-consent">
    <p class="cookie-consent__text">
      {{ section.settings.message }}
      <a href="{{ section.settings.policy_link }}" class="cookie-consent__link">
        {{ section.settings.policy_link_text }}
      </a>
    </p>
    <button type="button" 
            class="btn cookie-consent__accept"
            onclick="this.closest('.popup-modal').dispatchEvent(new Event('close'))">
      {{ section.settings.accept_text }}
    </button>
  </div>
{% endcapture %}

{% schema %}
{
  "name": "Cookie Consent",
  "settings": [
    {
      "type": "richtext",
      "id": "message",
      "label": "Message",
      "default": "<p>We use cookies to improve your experience.</p>"
    },
    {
      "type": "text",
      "id": "policy_link_text",
      "label": "Policy link text",
      "default": "Learn More"
    },
    {
      "type": "url",
      "id": "policy_link",
      "label": "Policy link"
    },
    {
      "type": "text",
      "id": "accept_text",
      "label": "Accept button text",
      "default": "Accept"
    }
  ]
}
{% endschema %}
```
**Estimated Impact:** ~40 lines Liquid, leverages popup system

---

### **3.3 Gradient Background Overlays**
**Current State:** Solid backgrounds  
**Their Implementation:** Gradient overlays with `linear-gradient fade in/out`  
**Port Strategy:**
```liquid
<!-- Add to any section schema -->
{
  "type": "header",
  "content": "Background"
},
{
  "type": "color",
  "id": "bg_color",
  "label": "Background color",
  "default": "#b3bec5"
},
{
  "type": "checkbox",
  "id": "use_gradient_overlay",
  "label": "Add gradient overlay",
  "default": false
},
{
  "type": "select",
  "id": "gradient_style",
  "label": "Gradient style",
  "options": [
    { "value": "fade-edges", "label": "Fade edges" },
    { "value": "top-fade", "label": "Top fade" },
    { "value": "bottom-fade", "label": "Bottom fade" }
  ],
  "default": "fade-edges"
}
```
**Liquid Implementation:**
```liquid
<div class="section-wrapper relative" 
     style="{% if section.settings.bg_color %}background-color: {{ section.settings.bg_color }};{% endif %}">
  
  {% if section.settings.use_gradient_overlay %}
    <div class="gradient-overlay gradient-overlay--{{ section.settings.gradient_style }}"></div>
  {% endif %}
  
  <div class="container relative z-10">
    {{ section_content }}
  </div>
</div>
```
**CSS:**
```css
.gradient-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gradient-overlay--fade-edges {
  background: linear-gradient(
    to right,
    var(--color-bg) 0%,
    transparent 10%,
    transparent 90%,
    var(--color-bg) 100%
  );
}

.gradient-overlay--top-fade {
  background: linear-gradient(
    to bottom,
    var(--color-bg) 0%,
    transparent 20%
  );
}

.gradient-overlay--bottom-fade {
  background: linear-gradient(
    to top,
    var(--color-bg) 0%,
    transparent 20%
  );
}
```
**Estimated Impact:** ~30 lines CSS, subtle visual enhancement

---

## **4. LOW PRIORITY / NICE-TO-HAVE FEATURES**

### **4.1 Collection Landing Search with JSON Data**
**Current State:** No collection URL mapping  
**Their Implementation:** `<script id="collection-landing-search-data">` with JSON URL mapping  
**Port Strategy:**
```liquid
<!-- layout/theme.liquid -->
<script id="collection-url-map" type="application/json">
{
  {% for collection in collections %}
    "{{ collection.handle }}": "{{ collection.url }}"{% unless forloop.last %},{% endunless %}
  {% endfor %}
}
</script>
```
**JavaScript:**
```javascript
// Quick collection search/autocomplete
const collectionMap = JSON.parse(
  document.getElementById('collection-url-map').textContent
);

function findCollection(query) {
  const matches = Object.keys(collectionMap).filter(handle => 
    handle.includes(query.toLowerCase())
  );
  return matches.map(handle => ({
    handle,
    url: collectionMap[handle]
  }));
}
```
**Estimated Impact:** ~20 lines, enables fast search features

---

### **4.2 Colored Indicator Dots on Product Titles**
**Current State:** Plain text titles  
**Their Implementation:** Product names include colored dots as visual indicators  
**Port Strategy:**
```liquid
<!-- snippets/product-card.liquid -->
<h3 class="product-card__title">
  {% if product.metafields.custom.color_indicator %}
    <span class="color-indicator" 
          style="background-color: {{ product.metafields.custom.color_indicator.value }};"
          aria-hidden="true"></span>
  {% endif %}
  {{ product.title }}
</h3>
```
**CSS:**
```css
.color-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}
```
**Metafield Setup:**
- Namespace: `custom`
- Key: `color_indicator`
- Type: `color`

**Estimated Impact:** ~10 lines, subtle brand detail

---

### **4.3 Aspect Ratio Utility Pattern**
**Current State:** Limited aspect ratio control  
**Their Implementation:** `aspect-[25/31]`, `aspect-[4/5]`, `aspect-[0.859]`  
**Port Strategy:**
```liquid
<!-- Add to section blocks -->
{
  "type": "text",
  "id": "aspect_ratio",
  "label": "Image aspect ratio",
  "default": "4/5",
  "info": "Format: width/height (e.g., 4/5, 16/9, 1/1)"
}
```
**CSS Generation:**
```liquid
<figure class="image-wrapper" style="aspect-ratio: {{ block.settings.aspect_ratio }};">
  {{ image_tag }}
</figure>
```
**Or use CSS classes:**
```css
.aspect-square { aspect-ratio: 1 / 1; }
.aspect-portrait { aspect-ratio: 4 / 5; }
.aspect-tall { aspect-ratio: 25 / 31; }
.aspect-landscape { aspect-ratio: 16 / 9; }
.aspect-wide { aspect-ratio: 21 / 9; }
```
**Estimated Impact:** ~15 lines CSS, flexible image control

---

### **4.4 Hover Image Scale Effect**
**Current State:** No hover effects on images  
**Their Implementation:** `<img>` with hover scale  
**CSS:**
```css
.image-hover-scale {
  overflow: hidden;
}

.image-hover-scale img {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-hover-scale:hover img,
.group:hover .image-hover-scale img {
  transform: scale(1.05);
}
```
**Liquid Pattern:**
```liquid
<figure class="image-hover-scale">
  {{ image | image_url: width: 800 | image_tag }}
</figure>
```
**Estimated Impact:** ~10 lines CSS, polished interaction

---

### **4.5 Opacity-0 Accessible Link Overlays**
**Current State:** Direct link elements  
**Their Implementation:** `<a>` with `opacity-0` overlaying entire card  
**Pattern:**
```liquid
<div class="card group relative">
  <figure class="card__image">
    {{ image }}
  </figure>
  
  <div class="card__content">
    <h3>{{ title }}</h3>
    <span class="cta" role="presentation">{{ cta_text }}</span>
  </div>
  
  <!-- Accessible overlay link -->
  <a href="{{ url }}" 
     class="card__link-overlay"
     tabindex="0">
    <span class="visually-hidden">{{ title }}</span>
  </a>
</div>
```
**CSS:**
```css
.card {
  position: relative;
}

.card__link-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  opacity: 0;
  cursor: pointer;
}

.card__link-overlay:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  opacity: 1;
}
```
**Benefits:**
- Entire card is clickable
- Maintains semantic HTML
- Keyboard accessible
- Screen reader friendly

**Estimated Impact:** ~15 lines CSS, better UX

---

## **5. ADVANCED / FUTURE CONSIDERATIONS**

### **5.1 Vue.js Component Architecture**
**Current State:** Vanilla JavaScript  
**Their Implementation:** Full Vue.js with components  
**Recommendation:** **DO NOT PORT** — Adds complexity, your Liquid/vanilla JS approach is appropriate for Shopify themes. Vue would require:
- Build pipeline (Webpack/Vite)
- ~100KB bundle size increase
- More complex maintenance
- Breaks theme editor live preview

**Alternative:** Use Web Components for complex interactions instead

---

### **5.2 Preload Strategy**
**Current State:** Basic asset loading  
**Their Implementation:** Aggressive preconnect/preload  
**Port Strategy:**
```liquid
<!-- layout/theme.liquid <head> -->
<link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
<link rel="dns-prefetch" href="https://cdn.shopify.com">

<!-- Preload critical assets -->
<link rel="preload" href="{{ 'theme.css' | asset_url }}" as="style">
<link rel="preload" href="{{ 'theme.js' | asset_url }}" as="script">

{% if settings.custom_font %}
  <link rel="preload" href="{{ settings.custom_font | font_url }}" as="font" type="font/woff2" crossorigin>
{% endif %}
```
**Estimated Impact:** ~10 lines, faster initial load

---

### **5.3 CSS Custom Property System**
**Current State:** Basic tokens  
**Their Implementation:** `:root` vars in `<style>` per section  
**Port Strategy:**
```liquid
<!-- Per-section color overrides -->
<style>
  #shopify-section-{{ section.id }} {
    --section-bg: {{ section.settings.bg_color | default: 'var(--color-bg)' }};
    --section-text: {{ section.settings.text_color | default: 'var(--color-text)' }};
    --section-accent: {{ section.settings.accent_color | default: 'var(--color-accent)' }};
  }
</style>

<div class="section" style="background: var(--section-bg); color: var(--section-text);">
  {{ content }}
</div>
```
**Benefits:**
- Per-section theming
- Dynamic color palettes
- Easy merchant customization

**Estimated Impact:** ~30 lines per section schema

---

## **6. IMPLEMENTATION PRIORITY MATRIX**

### **Phase 1: Critical (Week 1) — ~500 lines**
1. ✅ Sticky sidebar pattern
2. ✅ Aspect ratio utilities
3. ✅ Hover image effects
4. ✅ Gradient overlays
5. ✅ Preload strategy

### **Phase 2: High Value (Week 2) — ~800 lines**
6. ✅ Offset carousel component
7. ✅ Product card multi-state images
8. ✅ Popup modal system
9. ✅ Cookie consent banner
10. ✅ Internal section navigation

### **Phase 3: Polish (Week 3) — ~400 lines**
11. ✅ Scroll-aware logo fade
12. ✅ Header color switching
13. ✅ Colored indicator dots
14. ✅ Collection URL mapping
15. ✅ Opacity overlay links

### **Phase 4: Optional Enhancements**
16. ⚠️ CSS custom property system (ongoing)
17. ⚠️ Advanced animations (as needed)

---

## **TOTAL ESTIMATED IMPACT**

**Lines of Code:**
- JavaScript: ~700 lines
- Liquid: ~600 lines
- CSS: ~400 lines
- Schema: ~300 lines
**Total:** ~2,000 lines

**Time Investment:** 3-4 weeks for complete implementation

**Value Proposition:**
- Significantly enhanced user experience
- Modern interaction patterns
- Merchant-friendly customization
- Performance-conscious implementations
- Accessibility-first approach
- Reusable component library

**Risk Assessment:**
- Low complexity — all features are Shopify-native compatible
- No external dependencies (except optional Klaviyo integration)
- Graceful degradation for older browsers
- Theme editor compatible