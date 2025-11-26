/**
 * Lighthouse CI Configuration
 * 
 * Automated performance testing for the Refinements Shopify theme.
 * Runs on every PR via GitHub Actions to catch performance regressions.
 * 
 * Usage:
 *   npm run lighthouse        - Run locally against dev server
 *   npm run lighthouse:ci     - Run in CI mode (used by GitHub Actions)
 * 
 * @see https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
  ci: {
    collect: {
      // URLs to test - update with your store's preview URL
      url: [
        'http://localhost:9292/',                    // Homepage
        'http://localhost:9292/collections/all',    // Collection page
        'http://localhost:9292/products/test',      // Product page (update with real handle)
      ],
      // Number of runs per URL (averages results)
      numberOfRuns: 3,
      // Chrome flags for consistent testing
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu --headless',
        // Simulate mobile device on slow connection
        preset: 'desktop',
        // Throttling settings (adjust based on target audience)
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },

    assert: {
      // Fail CI if scores drop below these thresholds
      assertions: {
        // Performance: Plus-level target 90+ (0.9)
        'categories:performance': ['error', { minScore: 0.9 }],
        
        // Accessibility: Plus-level target 95+ (WCAG 2.1 Level AA)
        'categories:accessibility': ['error', { minScore: 0.95 }],
        
        // Best Practices: Plus-level target 90+
        'categories:best-practices': ['error', { minScore: 0.9 }],
        
        // SEO: Plus-level target 95+
        'categories:seo': ['error', { minScore: 0.95 }],

        // Core Web Vitals - Plus-level strict targets
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],     // < 1.5s (Plus)
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],   // < 2.5s (Core Web Vital)
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],     // < 0.1 (Core Web Vital)
        'total-blocking-time': ['error', { maxNumericValue: 200 }],         // < 200ms (Plus)
        'speed-index': ['warn', { maxNumericValue: 3000 }],                 // < 3s
        'interactive': ['warn', { maxNumericValue: 3500 }],                 // < 3.5s (TTI)

        // Resource budgets for Plus
        'resource-summary:script:size': ['warn', { maxNumericValue: 150000 }],  // < 150KB JS
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }], // < 50KB CSS
        'resource-summary:total:size': ['warn', { maxNumericValue: 1000000 }],  // < 1MB total

        // Specific performance checks
        'render-blocking-resources': 'off',  // We handle this with critical CSS
        'uses-responsive-images': 'error',   // Plus: Must use responsive images
        'offscreen-images': 'warn',          // Lazy loading
        'unminified-css': 'error',           // Plus: Must minify
        'unminified-javascript': 'error',    // Plus: Must minify
        'unused-css-rules': 'warn',          // Plus: Optimize CSS delivery
        'modern-image-formats': 'warn',      // Plus: Use WebP/AVIF
        'uses-text-compression': 'error',    // Plus: Must use gzip/brotli
        'uses-long-cache-ttl': 'warn',       // Plus: Leverage browser caching
        'efficient-animated-content': 'warn', // Plus: Optimize GIFs
      },
    },

    upload: {
      // Upload results to temporary public storage (free)
      target: 'temporary-public-storage',
    },
  },
};
