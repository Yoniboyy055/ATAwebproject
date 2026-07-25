# ATA WP-02 Flagship Skeleton Implementation Report v0.1

## Subject and job

The subject is ATA’s working flagship candidate for diaspora/homecoming travelers. The page’s single job is to prove a trustworthy request journey without publishing unverified tour facts.

## Design plan

- Palette: highland ink `#102f30`, Red Sea teal `#0b3b3c`, mineral paper `#f3efe4`, verification clay `#a43f2c`, muted sand `#d8d0bd`.
- Type: disciplined system sans with a heavy compressed-feeling display treatment and monospace evidence labels; no external font dependency added.
- Layout: a split hero transitions into a verification ledger and request panel.
- Signature: the “verification ledger” visibly shows why missing facts are hidden rather than filling the page with placeholders.

This avoids generic travel-card grids, fake metrics, gradients, ratings, prices, and stock photography.

## Implementation

- `/tours/flagship-preview`: non-indexed, feature-gated preview.
- `components/ata/FlagshipRequestForm.tsx`: five request types, consent, honeypot, safe receipt.
- `/api/ata/requests`: test-only endpoint.
- `lib/ata/*`: domain, flags, roles, preview record, and test adapter.

## Responsive behavior

The layout is single-column by default and switches to a split hero/content grid at large breakpoints. Form fields become two columns at `sm` while maintaining 48-pixel mobile controls from the shared CSS. Focus-visible styling and reduced-motion global behavior remain available.

## Verification

The page returned HTTP 200 in explicit local test mode. Its production build route size is 1.87 kB with 89.2 kB first-load JS. Automated browser screenshots were attempted but not produced because the browser-control surface was unavailable; no screenshot artifact is claimed.

