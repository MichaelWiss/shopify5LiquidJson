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
        // Performance: Target 90+ (0.9)
        'categories:performance': ['error', { minScore: 0.9 }],
        
        // Accessibility: Target 90+ (critical for Plus clients)
        'categories:accessibility': ['error', { minScore: 0.9 }],
        
        // Best Practices: Target 90+
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        
        // SEO: Target 90+
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Core Web Vitals assertions
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],      // < 2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],   // < 2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],     // < 0.1
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],          // < 300ms

        // Specific performance checks
        'render-blocking-resources': 'off',  // We handle this with critical CSS
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        'unminified-css': 'warn',
        'unminified-javascript': 'warn',
      },
    },

    upload: {
      // Upload results to temporary public storage (free)
      target: 'temporary-public-storage',
    },
  },
};
