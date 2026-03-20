# Site QA

This is a lightweight deterministic QA layer for the current static site.

## What it checks

- missing or incorrect `title`
- missing or out-of-range meta descriptions
- canonical mismatches
- `html lang` mismatches
- missing `hreflang` links on paired pages
- broken local asset and page references
- invalid JSON-LD blocks
- duplicate DOM ids
- sitemap coverage and sitemap target existence

## Run

From the repo root:

```bash
python3 tools/site-qa/run.py
```

Check specific pages only:

```bash
python3 tools/site-qa/run.py pages/services/physiotherapy.html pages/services/physiotherapy-el.html
```

## Output

- `tools/site-qa/output/qa-report.json`
- `tools/site-qa/output/qa-report.md`

This tool is intentionally deterministic. It is meant to run before any future LLM-assisted editorial review layer.

## Sitemap policy

The QA runner does not require every HTML page to appear in `sitemap.xml`.

It skips sitemap coverage findings for:

- pages with `meta name="robots"` containing `noindex`
- page types configured as excluded from sitemap enforcement, such as `legal`

This keeps the report aligned with a deliberate SEO policy where public legal pages or internal pages may remain crawlable or accessible without being sitemap targets.
