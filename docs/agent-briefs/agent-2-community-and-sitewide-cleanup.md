# Agent 2 Brief: Community Positioning, Sitewide Relinking, and Resource Cleanup

## Role
You are responsible for all files outside the seminar pages that must be aligned with the new single-URL strategy.

Your goal is to make the site consistent with this business decision:
- the seminar page remains the only public URL for this seminar resource
- separate `/pages/resources/` Muay Thai guide pages are not needed
- community messaging must stay clear for potential partners

## File Ownership
You may edit only:
- `index.html`
- `index-el.html`
- `pages/community.html`
- `pages/community-el.html`
- `sitemap.xml`
- `pages/blog/injury-prevention-combat-sports.html`
- `pages/blog/injury-prevention-combat-sports-el.html`

You may delete only:
- `pages/resources/muay-thai-injury-prevention-guide.html`
- `pages/resources/muay-thai-injury-prevention-guide-el.html`

You must not edit:
- `pages/seminar-muay-thai.html`
- `pages/seminar-muay-thai-el.html`

If the seminar pages need something changed, mention it in your final note instead of editing them.

## Business Decision Already Made
We are going with variant 2.

That means:
- the main public page is `pages/seminar-muay-thai.html`
- the Greek equivalent is `pages/seminar-muay-thai-el.html`
- separate resource pages under `/pages/resources/` should be removed
- homepage and community entries must point to the seminar page, not to `/pages/resources/`

## Primary UX Goal
Potential partners must not get confused when visiting `Community`.

The `Community` page is meant to show:
- collaborations
- seminars
- partnerships
- external initiatives

So the Muay Thai card should read as a collaboration / seminar case with materials available, not as a random detached downloadable resource.

## Required Changes

### 1. Homepage Promo Relinking
Update homepage promo links so they point to:
- `pages/seminar-muay-thai.html`
- `pages/seminar-muay-thai-el.html`

Do not point homepage promos to `/pages/resources/...`.

Review the promo copy too:
- if current wording strongly implies a standalone resource page, adjust it so it still works when linking to the seminar page
- it can still promote the free guide, but the destination is the seminar URL

### 2. Community Page Positioning
Update the Muay Thai card on:
- `pages/community.html`
- `pages/community-el.html`

Requirements:
- keep the card understandable for potential partners
- avoid making it look like a current live event registration page
- avoid making it look like an unrelated resource detached from the collaboration

Recommended direction:
- badge like `Completed Seminar`, `Seminar Guide`, `Past Collaboration`, or equivalent in Greek
- title and description can mention the seminar and that materials are available
- use one clear primary CTA if possible

Important:
- if two CTAs both point to the same seminar URL, simplify rather than duplicating intent
- the card should communicate this is an example of community collaboration work

### 3. Blog CTA Cleanup
In both combat-sports blog articles, old CTA language still references registering for the seminar.

Rewrite these blocks so they are post-event accurate.

Desired direction:
- invite users to view the seminar guide or download the seminar materials
- keep the link target as the seminar page
- remove outdated date-sensitive booking language

### 4. Sitemap Cleanup
Update `sitemap.xml` so it no longer includes:
- `pages/resources/muay-thai-injury-prevention-guide.html`
- `pages/resources/muay-thai-injury-prevention-guide-el.html`

Keep the seminar URLs in sitemap.

Follow the local SEO rules:
- sitemap should contain clean canonical URLs only
- do not leave removed pages in sitemap

### 5. Delete Separate Resource Pages
Delete:
- `pages/resources/muay-thai-injury-prevention-guide.html`
- `pages/resources/muay-thai-injury-prevention-guide-el.html`

Only do this after all known internal references in your owned files are switched away from those URLs.

## SEO Rules You Must Follow
Source of truth: `docs/seo-guidelines.md`

Apply these explicitly:
- each important intent should have one clear URL
- do not keep indexable duplicates without reason
- hreflang should exist only for real EN/EL equivalents
- sitemap should contain only valid clean canonical URLs
- internal links should support the intended canonical page

This task is partly an SEO cleanup task and partly an information architecture task.

The result should reduce duplicate intent and improve clarity for both users and search engines.

## Community-Specific Messaging Constraints
The user explicitly cares that a potential partner should not get confused.

Use that as a decision rule:
- `Community` should feel like a partnership/collaboration showcase
- the Muay Thai entry should feel like a completed collaboration with available materials
- it should not look like a conflicting hybrid of event signup and download landing page

## Do Not Do
- do not edit the seminar pages
- do not add new pages
- do not preserve `/pages/resources/` pages
- do not leave outdated "register now" messaging in owned files
- do not create duplicate internal destinations for the same guide intent

## Acceptance Criteria
Your work is done when:
- homepage links point to seminar URLs, not `/pages/resources/`
- community cards point to seminar URLs and read clearly for potential partners
- outdated seminar signup CTAs in the blog are rewritten
- resource URLs are removed from sitemap
- the two Muay Thai resource files are deleted
- no owned file still depends on the deleted `/pages/resources/` URLs

## Suggested Final Report
When done, report:
- which links were changed
- how the community card messaging was reframed
- whether any duplicate CTAs were simplified
- confirmation that resource pages were deleted
- confirmation that sitemap cleanup is complete
