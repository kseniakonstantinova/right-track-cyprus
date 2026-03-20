# Site Architecture V2 Outline

This is deferred work. The current static site remains the source of truth for now.

## Goal

Keep the site statically deployed, but stop managing it as dozens of hand-maintained monolithic HTML files.

## Recommended target

Use a static site generator with templates and structured content.

Good options:

- Astro
- Eleventy

## Proposed content model

- `content/services/*.en.md`
- `content/services/*.el.md`
- `content/blog/*.en.md`
- `content/blog/*.el.md`
- `content/profiles/*.en.md`
- `content/profiles/*.el.md`
- `data/site.json`
- `data/team.json`
- `data/pricing.json`

## Proposed rendering model

- `layouts/base.*`
- `layouts/service.*`
- `layouts/blog.*`
- `layouts/profile.*`
- `components/SeoHead.*`
- `components/Footer.*`
- `components/Breadcrumbs.*`
- `components/Schema.*`

## Proposed URL model

Instead of file-suffix localization:

- `/services/physiotherapy/`
- `/el/services/physiotherapy/`
- `/blog/...`
- `/el/blog/...`

## Migration order

1. Keep current static site live.
2. Maintain deterministic QA around the current site.
3. Migrate service pages first.
4. Migrate blog pages second.
5. Migrate profiles and legal pages.
6. Migrate homepages last.

## Success criteria

- one source of truth for shared business data
- one layout per page family
- localized content split from page structure
- generated SEO tags and structured data
- QA enforced before publish
