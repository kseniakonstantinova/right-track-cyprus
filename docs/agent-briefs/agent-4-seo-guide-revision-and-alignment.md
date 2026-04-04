# Agent 4 Brief: Revise the SEO Guide to Match the Real Site Architecture

## Role
You are responsible for revising the internal SEO guide so it matches the current and intended structure of the Right Track website.

This is a documentation task, not a site implementation task.

You are not fixing pages directly.
You are fixing the rules document that future work should follow.

## Deliverable
Update:
- `docs/seo-guidelines.md`

You may also add a short changelog section at the top or bottom if helpful, but keep the guide clean and operational.

## File Ownership
You may edit only:
- `docs/seo-guidelines.md`

You must not edit:
- HTML pages
- CSS files
- JS files
- sitemap
- other docs unless absolutely required, and if so document rather than edit

## Required Inputs
You must use:
- the current `docs/seo-guidelines.md`
- the actual site structure in the repo
- the business decisions already made in current discussions
- the Right Track brand direction where it affects information architecture and page intent

## Background
The current SEO guide is solid as a base, but it no longer fully matches the real site.

Known gaps:
- the guide does not fully reflect all real page families now present in the site
- the site contains partnership pages, seminar/resource hybrids, and campaign/promo pages
- the Muay Thai work revealed a duplicate-intent problem between event pages and resource pages
- the site also shows inconsistent brand naming in metadata and social fields

The revised guide must become more useful for current and future implementation.

## Core Goal
Make `docs/seo-guidelines.md` accurately govern the real website instead of an earlier simpler version of it.

It should:
- preserve the strong existing principles
- close architecture gaps
- clarify decision rules for ambiguous page types
- help prevent duplicate intent and mixed-intent pages

## What You Must Review and Improve

### 1. Page Type Taxonomy
The guide currently lists page types, but it is incomplete relative to the actual site.

Revise it to account for real families such as:
- partnership / collaboration page
- seminar page
- seminar resource / post-event materials page
- campaign / promo page
- possibly research / resource page if justified

For each relevant type, clarify:
- whether it is typically indexable
- what the expected page intent is
- when it deserves its own URL

### 2. Intent Rules
Strengthen guidance around:
- one page = one primary search/user intent
- when a completed event page can evolve into a resource page
- when a separate resource URL is justified
- when keeping both event and resource URLs creates duplicate intent

This section should clearly help future decisions like the Muay Thai one.

### 3. URL and Canonical Rules
The guide already has URL rules, but improve them where needed for:
- retired pages
- replaced pages
- merged pages
- duplicate-intent cleanup
- canonical ownership after architecture decisions

### 4. Hreflang Rules
Keep the existing strength here, but ensure the guide addresses:
- page pairs that remain equivalent after content reframing
- when not to create a language pair
- what happens when one page type is retired

### 5. Indexation Rules
Clarify which of these should usually be:
- `index, follow`
- `noindex, follow`
- removed from sitemap entirely

Especially for:
- legal pages
- campaign pages
- post-event archive pages
- resource pages
- partnership pages

### 6. Social Metadata Rules
The current guide is good, but improve it to address:
- brand naming consistency
- `og:site_name` consistency
- locale consistency
- page-family-specific OG guidance where helpful

Do not just say "add OG tags".
Say what must be consistent across the site.

### 7. Structured Data Rules
This is one of the most important revisions.

The guide should explicitly help future builders choose schema for:
- partnership / collaboration pages
- seminar pages before event date
- seminar pages after event date if they become material/resource pages
- blog articles
- service pages
- profile pages
- community hub pages

Also reinforce:
- schema must match visible content
- do not keep event schema as the main schema if the page has become primarily a downloadable resource page

### 8. Internal Linking Rules
Strengthen rules for:
- hub-to-leaf linking
- supporting canonical URLs through internal links
- removing links to retired pages
- avoiding sitewide support for duplicate intent

This should directly reflect lessons from the Muay Thai case.

### 9. Sitemap Rules
Add stronger guidance for:
- only canonical active URLs in sitemap
- removing deprecated or retired pages
- handling replaced page types
- not leaving alternate experiments or retired resources in sitemap

### 10. Brand and Naming Consistency
Add a compact but explicit section about metadata naming consistency:
- site name
- business name format
- how brand naming should appear in titles and social metadata

This is not a full brand guide section.
It is an SEO consistency rule.

### 11. Decision Framework
Add a short practical section:
- how to decide whether to create a new page or reuse/transform an existing one
- how to evaluate if a page deserves a separate URL
- how to identify duplicate intent risk

This should be highly practical and concise.

## Constraints
Do not turn the guide into a giant theoretical SEO manual.

Keep:
- the useful structure already there
- the operational tone

Improve:
- relevance to the real site
- clarity on edge cases
- alignment with current architecture and brand

## Style Requirements
The revised SEO guide should be:
- practical
- implementation-ready
- specific to this site
- concise where possible

Prefer:
- flat bullets
- short rule blocks
- direct examples tied to this repo

Avoid:
- generic SEO textbook language
- bloated explanation
- recommendations that conflict with the brand/design direction

## Acceptance Criteria
Your work is done when:
- `docs/seo-guidelines.md` is updated
- it reflects the actual page families in the repo
- it gives clear rules for seminar/resource and partnership scenarios
- it reduces ambiguity around duplicate intent and URL ownership
- it is still concise enough to be used as an implementation standard

## Suggested Final Report
When done, report:
- what sections were revised
- what new page types or decision rules were added
- how the guide now handles seminar/resource duplication
- any remaining edge cases that still need business policy decisions
