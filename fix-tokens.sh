#!/bin/bash

# Fix theme.scss token references
sed -i '' 's/var(--color-surface)/var(--paper)/g' theme.scss
sed -i '' 's/var(--color-bg)/var(--bg)/g' theme.scss
sed -i '' 's/var(--warm-white)/var(--paper)/g' theme.scss
sed -i '' 's/var(--cream)/var(--paper)/g' theme.scss
sed -i '' 's/var(--color-muted)/var(--ink-2)/g' theme.scss
sed -i '' 's/var(--color-text)/var(--ink)/g' theme.scss
sed -i '' 's/var(--text-primary)/var(--ink)/g' theme.scss
sed -i '' 's/var(--text-secondary)/var(--ink-2)/g' theme.scss
sed -i '' 's/var(--color-border)/var(--hair)/g' theme.scss
sed -i '' 's/var(--burgundy)/var(--accent)/g' theme.scss
sed -i '' 's/var(--color-burgundy)/var(--accent)/g' theme.scss
sed -i '' 's/var(--font-primary)/var(--serif)/g' theme.scss
sed -i '' 's/var(--font-secondary)/var(--sans)/g' theme.scss

# Fix spacing variables
sed -i '' 's/var(--space-0)/var(--s1)/g' theme.scss
sed -i '' 's/var(--space-1)/var(--s1)/g' theme.scss
sed -i '' 's/var(--space-2)/var(--s2)/g' theme.scss
sed -i '' 's/var(--space-3)/var(--s3)/g' theme.scss
sed -i '' 's/var(--space-4)/var(--s4)/g' theme.scss
sed -i '' 's/var(--space-5)/var(--s5)/g' theme.scss
sed -i '' 's/var(--space-6)/var(--s6)/g' theme.scss
sed -i '' 's/var(--space-7)/var(--s6)/g' theme.scss

# Fix calc() based spacing
sed -i '' 's/calc(var(--space-unit) \* 1)/var(--s1)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 1.5)/var(--s2)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 2)/var(--s2)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 2.5)/var(--s3)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 3)/var(--s3)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 4)/var(--s4)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 5)/var(--s5)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 6)/var(--s5)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 7.5)/var(--s6)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 8)/var(--s6)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 10)/var(--s6)/g' theme.scss
sed -i '' 's/calc(var(--space-unit) \* 12)/var(--s6)/g' theme.scss

echo "Token replacement complete!"
