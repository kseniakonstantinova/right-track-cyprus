# Repeated Blocks And Shared Data

## What is repeated today

These blocks are repeated manually across many HTML pages:

- Google Analytics / GA4 snippet with `G-XQT03Q3821`
- canonical and `hreflang` links
- Open Graph tags
- Twitter card tags
- JSON-LD blocks
- cookie consent stylesheet include
- footer contact details
- CTA phone / booking links
- clinic trust line in footer

## Shared business data already embedded in many files

These values should be treated as controlled data, not free text:

- site URL: `https://righttrackphysio.com.cy`
- phone: `+35799126824` and formatted variant `+357 99 126 824`
- primary email: `antonis@righttrackphysio.com.cy`
- Pilates email: `pilates@righttrackphysio.com.cy`
- address EN: `Tseriou 32, Strovolos, 2042 Nicosia, Cyprus`
- address EL: `Τσερίου 32, Στρόβολος 2042, Λευκωσία, Κύπρος`
- GA4 id: `G-XQT03Q3821`
- cookie stylesheet path: `assets/css/cookie-consent.css`

## Repeated structural patterns

### Home pages

- organization schema
- website schema
- FAQ schema
- hero CTA
- shared contact/footer block

### Service pages

- service schema
- FAQ schema
- breadcrumb schema
- service hero layout
- repeated location / parking FAQ copy
- shared footer

### Blog article pages

- article metadata
- article schema
- related article blocks
- shared footer

### Profile pages

- person/profile schema
- clinician bio layout
- contact block
- shared footer

### Legal pages

- legal content wrapper
- simpler metadata footprint
- shared footer

## What should become a single source of truth later

Not in this stage, but this should eventually move into central data files:

- clinic identity
- addresses
- phone numbers
- emails
- analytics ids
- social sharing defaults
- booking URLs
- footer trust lines
- clinician roster
- price points

## Why this matters

As long as these values are duplicated by hand, the main failure mode is silent drift:

- one page gets updated and its pair does not
- schema keeps old values after visible content changes
- footer or CTA data becomes inconsistent
- canonical / `hreflang` values go stale on cloned pages

The new deterministic QA layer is designed to reduce exactly that risk while the current static architecture remains in place.
