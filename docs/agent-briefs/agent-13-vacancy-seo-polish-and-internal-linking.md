# Agent 13 Brief: Vacancy SEO Polish and Internal Linking Cleanup

## Role
You are responsible for polishing the published Physiotherapist vacancy implementation so it is technically cleaner, better aligned with Right Track's SEO rules, and more robust as a standalone landing page.

This is a focused cleanup and alignment task, not a full redesign.

You must follow:
- [Site Design and Content Guide](/Users/user/Right%20Track/docs/site-design-and-content-guide.md)
- [SEO Guidelines](/Users/user/Right%20Track/docs/seo-guidelines.md)
- [Agent 12 Brief: Vacancy Landing and Careers Intent](/Users/user/Right%20Track/docs/agent-briefs/agent-12-physio-vacancy-landing-and-careers-intent.md)

## Business Goal
The vacancy landing page already exists.
This task is to make sure the implementation is:
- technically clean
- internally well-linked
- aligned with search intent
- safe to share directly
- free of obvious SEO hygiene issues

The page should work both as:
- a direct outreach URL
- a site-supported internal landing page

## Scope
This task is intentionally narrow.

Do not rebuild the page architecture from scratch.
Do not change the core business narrative.
Do not introduce unrelated design experiments.

## File Ownership
You may edit only:
- `index.html`
- `index-el.html`
- `pages/physiotherapist-job-nicosia.html`
- `pages/physiotherapist-job-nicosia-el.html`
- `sitemap.xml` if needed
- shared CSS/JS only if truly necessary for cleanup

You must not edit:
- unrelated service pages
- unrelated blog articles
- booking flow logic unless required for a link-cleanup reason
- docs other than this task if not needed

## Required Work

### 1. Align the vacancy H1 with primary intent
Make sure the vacancy page H1 reflects the page's primary job-search intent more directly.

Recommended direction:
- EN: `Physiotherapist Job in <span>Nicosia</span>`
- EL: `Θέση <span>Φυσιοθεραπευτή</span> στη Λευκωσία`

The sports/performance growth message should remain visible, but in subtitle/supporting copy rather than replacing the main H1 intent.

### 2. Remove dead homepage hiring analytics
If the homepage no longer uses the old generic `Join Team` form:
- remove stale selectors
- remove dead event listeners
- remove tracking tied to non-existent form markup

Do not leave analytics code that targets elements no longer present in the DOM.

### 3. Improve internal linking intentionally
Support the vacancy page with a small, deliberate internal link structure.

Required:
- homepage `Join Team` teaser must link to the vacancy page
- add a footer-level hiring link
- add one contextual link from a team/trust-related section if cleanly possible

Do not:
- add vacancy links everywhere
- clutter service pages or blog articles

### 4. Confirm the vacancy page is standalone-readable
Review the page as if it will be shared directly in:
- WhatsApp
- Instagram DMs
- LinkedIn messages
- email outreach

The page must make sense without needing homepage context first.

If needed, tighten:
- hero framing
- subtitle clarity
- CTA wording
- trust/context blocks

### 5. Review query-parameter booking links on the homepage
Check whether the homepage GESY CTA should point to:
- a query-parameter booking URL
- or the clean canonical booking URL

If the query parameter is not essential for a real UX reason, prefer the cleaner canonical destination in primary internal links.

Do not create indexable duplicate URL patterns.

### 6. Validate media and asset references
Check that all vacancy-page assets are valid and intentional.

Especially verify:
- video files
- poster images
- any new downloads referenced from homepage or vacancy-related sections

If any referenced asset is missing, broken, or not safely deployable:
- fix the path
- replace the asset
- or remove the dependency

### 7. Keep structured data conservative
Review `JobPosting`, `FAQPage`, and any other schema used on the vacancy page.

Ensure:
- it matches visible content
- it does not overstate uncertain claims
- it does not include operational statements the clinic may not want to lock in

Be careful with:
- licensing claims
- GESY-related statements
- transport requirements
- hiring-process promises

### 8. Preserve intent separation
Do not blur these roles:
- homepage = teaser / routing
- vacancy page = hiring conversion page

The homepage should not become a second full vacancy page.

## Acceptance Criteria
Your work is done when:
- the vacancy page H1 aligns more closely with the page's main search intent
- homepage dead hiring-form analytics are removed
- the vacancy page is supported by a small but clear internal linking structure
- the page reads well as a direct-share landing page
- asset references used by the vacancy flow are valid and non-broken
- structured data is conservative and aligned with visible content
- homepage and vacancy page roles remain clearly separated

## Suggested Final Report
When done, report:
- what you changed in the vacancy page H1/subtitle logic
- what dead tracking you removed
- which internal links now support the vacancy page
- whether you kept or changed the booking CTA destination pattern
- what asset or schema issues you found and how you handled them
