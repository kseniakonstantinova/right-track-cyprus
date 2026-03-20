# QA / Code Review Agent Plan for Right Track

## What this project needs

This repository is primarily a static multilingual website:

- root pages: `index.html`, `index-el.html`, `404.html`
- content pages under `pages/`
- service pages under `pages/services/`
- blog pages under `pages/blog/`
- shared assets under `assets/`

Because the site is static HTML and contains many English/Greek page pairs, the highest-value QA agent is not a generic "review all code" agent. It should be a layered site QA agent with a small code-review layer on top.

The main risks in this repo are:

- broken internal links and asset paths
- mismatched English/Greek page pairs
- missing or inconsistent SEO tags
- structured data drift between page content and JSON-LD
- inconsistent contact details, prices, dates, and claims
- duplicate snippets copied across many pages with silent regressions

## Recommended agent structure

Use one orchestrator and four narrow reviewers.

### 1. Inventory Agent

Responsibility:

- discover all HTML files
- classify page type: home, service, blog, profile, legal, event
- pair translated pages: `foo.html` <-> `foo-el.html`
- extract page metadata into a normalized JSON record

Output per page:

- file path
- language
- title
- meta description
- canonical
- hreflang links
- JSON-LD blocks found
- internal links
- asset references
- detected phone / email / address / price / date mentions

### 2. Page QA Agent

Responsibility:

- validate one page in isolation
- check structural and content-level rules

Checks:

- exactly one `<title>`
- meta description exists and is reasonable length
- canonical exists and matches page URL
- `html lang` matches page language
- one main `h1`
- image references exist
- CSS/JS/image relative paths resolve correctly
- no empty anchors, placeholder links, duplicate IDs
- no malformed schema JSON
- no page-specific contradictions: title says one thing, schema says another

### 3. Pair Consistency Agent

Responsibility:

- compare English and Greek equivalents

Checks:

- both pages exist
- canonicals point to themselves
- `hreflang` is reciprocal
- same page type on both sides
- same main entities: service name, clinician, event, article subject
- same factual data: phone, address, price, date, duration, location
- same conversion targets: booking link, CTA, WhatsApp / phone buttons
- schema parity where expected

Important:

This agent should not require literal translation matching. It should validate factual equivalence, not sentence-by-sentence similarity.

### 4. Site Integrity Agent

Responsibility:

- validate cross-site coherence

Checks:

- every canonical target exists
- every `hreflang` target exists
- every page in sitemap exists
- important pages are present in sitemap
- robots and sitemap are aligned
- internal links do not point to missing files
- orphan pages are reported
- shared business facts are consistent across all pages

Shared facts to track centrally:

- clinic name
- phone number
- address
- prices
- GESY wording
- clinician names and titles

### 5. Content Claims Agent

Responsibility:

- review marketing and medical-content risk

Checks:

- exaggerated medical claims
- statements that should be softened or qualified
- pricing claims that appear outdated
- event dates that may now be in the past
- copy-paste leftovers from another page
- local SEO over-optimization and duplication

This layer can use an LLM, but it should consume the structured output from the earlier agents first.

## What to review, in order

Do not start with "review the whole site with one pass". Start in layers.

### Phase 1. Deterministic checks

Run these on every commit:

- file existence
- broken links
- broken asset paths
- canonical / hreflang correctness
- missing title / description / h1
- duplicate IDs
- invalid JSON-LD
- sitemap coherence

This should be fast and non-LLM.

### Phase 2. Page-family review

Run by content family:

- home pages
- service pages
- profile pages
- blog pages
- legal pages
- campaign / event pages

This matters because each family has different rules.

Examples:

- services need Service schema, pricing consistency, clear CTA
- blogs need Article schema, publish/update dates, related links
- legal pages need no marketing claims and stable canonical handling
- event pages need date-validity checks

### Phase 3. EN/EL pair review

Run after page-family review.

This catches the highest-probability regressions in this repo:

- English page updated, Greek pair forgotten
- price changed in one language only
- schema updated in one file only
- booking CTA changed in one side only

### Phase 4. LLM-assisted editorial review

Run on changed files only unless doing a full audit.

Use the LLM for:

- clarity
- trustworthiness
- claim-risk
- CTA quality
- content contradictions

Do not use the LLM for:

- link validity
- file existence
- schema parsing
- URL resolution

## Review rubric

Each finding should have a severity and a type.

Severity:

- `critical`: broken booking flow, broken page, wrong canonical to another page, missing paired language target, invalid schema on money / medical pages
- `high`: broken internal links, wrong price/date/contact info, inconsistent EN/EL facts, wrong structured data type
- `medium`: missing metadata, weak heading structure, missing alt text on meaningful images, duplicate descriptions
- `low`: style issues, wording suggestions, CTA improvements

Type:

- `structure`
- `seo`
- `content`
- `translation-parity`
- `schema`
- `linking`
- `business-data`
- `compliance-risk`

## Practical implementation

For this repo, keep the stack minimal.

Recommended:

- Node.js script or Python script
- HTML parsing with `cheerio` (Node) or `BeautifulSoup` (Python)
- schema JSON validation with native JSON parsing
- one config file for business constants and rules
- one report output in JSON and Markdown

Suggested files:

- `tools/site-qa/config.json`
- `tools/site-qa/inventory.(js|py)`
- `tools/site-qa/check-page.(js|py)`
- `tools/site-qa/check-pairs.(js|py)`
- `tools/site-qa/check-site.(js|py)`
- `tools/site-qa/report.(js|py)`

## Suggested config model

Keep policy outside code where possible.

Example config areas:

- canonical base URL
- supported languages: `en`, `el`
- path pairing rules: `-el.html`
- required tags by page type
- required schema by page type
- shared business facts
- allowed phone numbers
- allowed booking URLs
- maximum title / description lengths

## Output format

The agent should produce:

### 1. Machine-readable report

`qa-report.json`

Each finding:

- file
- paired file if applicable
- severity
- type
- rule ID
- message
- suggested fix

### 2. Human-readable report

`qa-report.md`

Sections:

- summary counts by severity
- critical findings first
- grouped findings by page family
- EN/EL mismatch section
- sitewide business-data inconsistencies

## How to run it in practice

### On every local content change

Run:

1. changed-file page checks
2. paired-page comparison
3. sitewide link and sitemap validation if URLs changed

### Before publish

Run full site QA:

1. inventory
2. deterministic checks for all pages
3. page-family checks
4. EN/EL parity checks
5. LLM editorial review on changed or high-risk pages

### Weekly or monthly audit

Run:

- full site QA
- outdated date / campaign scan
- business facts consistency scan
- orphan page detection

## What this agent should specifically catch in this repo

Examples tailored to this site:

- service page has correct canonical, but Greek pair is missing reciprocal `hreflang`
- page content says one price, schema says another
- blog post exists in English but missing Greek equivalent
- `og:url` or canonical still points to an older slug
- event page still promotes a past event date
- root homepage updates phone or CTA, but service pages still contain old data
- profile page title updated, but JSON-LD person/profile data was not updated

## Recommended rollout

Start small. Do not try to build the full agent in one step.

### Step 1

Build deterministic HTML/site checks only.

Goal:

- reliable
- cheap
- easy to trust

### Step 2

Add EN/EL pair comparison.

Goal:

- catch the most likely content regressions in this repo

### Step 3

Add page-type-specific rules.

Goal:

- services, blog, profiles, legal, events each get proper validation

### Step 4

Add LLM review only as the final advisory layer.

Goal:

- better editorial quality without false confidence

## Final recommendation

For this website, the best QA/code review agent is:

- deterministic first
- page-type aware
- language-pair aware
- business-fact aware
- LLM-assisted only at the end

If you want, the next step should be to implement Step 1 directly in this repo:

- create a small `tools/site-qa/` runner
- scan all HTML pages
- report broken links, metadata issues, canonical/hreflang errors, and JSON-LD parse failures

