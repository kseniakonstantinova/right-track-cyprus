# Agent 1 Brief: Transform `seminar-muay-thai` Into Resource/Guide Pages

## Role
You are responsible only for transforming the existing seminar pages into completed seminar resource pages.

Your write scope is intentionally limited so you can work in parallel with another agent.

## File Ownership
You may edit only:
- `pages/seminar-muay-thai.html`
- `pages/seminar-muay-thai-el.html`

You must not edit:
- `index.html`
- `index-el.html`
- `pages/community.html`
- `pages/community-el.html`
- `sitemap.xml`
- anything under `pages/resources/`
- blog files

If you discover a change is needed outside your ownership, document it in your final note instead of editing it.

## Business Decision Already Made
We are going with variant 2.

That means:
- keep the URL `pages/seminar-muay-thai.html`
- keep the URL `pages/seminar-muay-thai-el.html`
- convert both pages from event pages into resource/guide pages
- the seminar already happened on April 4, 2026
- the page should now function as the main home for the seminar materials / guide
- PDF download is the primary CTA
- program/modules, speakers, and offer can stay as supporting content
- event registration intent must be removed from the page

## Core UX Goal
When a user lands on the seminar page, they should immediately understand:
- this is now a guide / resource page
- the seminar already took place
- they can download the presentation PDF
- the content still shows the seminar credibility, speakers, and what was covered

The page should not feel like an outdated event registration landing page with a download block bolted on.

## Required Content Direction

### Head / SEO
Rewrite the EN and EL metadata so the primary intent is:
- injury prevention guide
- seminar materials / downloadable presentation
- combat sports / Muay Thai / fighters

Update:
- `<title>`
- `<meta name="description">`
- Open Graph title/description
- Twitter title/description

Keep:
- canonical self-referencing to the seminar URLs
- hreflang EN/EL pairing
- `index, follow`

### Structured Data
Current schema is event-led. That no longer matches the desired primary page intent.

Refactor structured data so it reflects a resource-oriented page while remaining truthful to the visible content.

Use the local SEO rules from `docs/seo-guidelines.md`:
- schema must reflect real visible content
- for internal SEO pages, `BreadcrumbList` is standard
- do not add schema that the visible page content does not support

Recommended approach:
- use a page/resource schema that matches the guide intent
- include `BreadcrumbList`
- if you mention the seminar event in schema, it should be secondary context, not the primary page identity

Do not keep an event registration-focused schema as the main schema for this page.

## Required Visual / Content Changes

### Hero
Hero must be rewritten as a guide/resource hero.

Requirements:
- H1 should be guide-focused, not event-focused
- subtitle should explain this is the seminar presentation / guide
- primary CTA should be download-focused
- remove event-detail prominence from hero:
  - no date block as a primary hero element
  - no location block as a primary hero element
  - no duration block as a primary hero element
  - no price / registration messaging

Allowed:
- a short line such as "Based on our seminar at Muay Thai Warriors on April 4, 2026"
- a small badge mentioning the collaboration

### Download Block
The PDF download area must become the main conversion block.

Requirements:
- strong, visible download CTA
- clear label that this is the full presentation / guide
- keep no-signup / free messaging if already present
- copy should work even if the EN PDF is not yet uploaded; avoid misleading claims

### Program / Modules
Keep the educational content blocks, but frame them as:
- what is covered in the guide
- what the seminar presentation includes

Avoid framing them as an upcoming live session agenda.

### Speakers
Keep speakers. They add trust and partnership context.

Adjust section copy if needed so it reads as:
- guide authors / seminar speakers
- expert contributors to the presentation

### Offer
Keep the offer only if it still makes sense post-event.

If it feels too tied to live attendees only, soften or reframe the copy so it does not clash with the new page intent.

Do not introduce new commercial claims that are not already visible on the page.

## Cleanup Requirements
Remove or neutralize all stale event-registration logic from these pages.

Important:
- there is leftover registration-related JavaScript in the seminar pages from the old event flow
- the page should not depend on old registration form logic anymore
- remove dead code related to seminar registration if it is no longer used by visible content

Also remove or rewrite outdated text such as:
- register now
- reserve your spot
- pay at door
- event price as a primary value point

## SEO Rules You Must Follow
Source of truth: `docs/seo-guidelines.md`

Apply these explicitly:
- one page, one clear intent
- one `h1`
- logical `h2-h3` structure
- page must include `<main>`
- content language must match page `lang`
- canonical must be the final self URL
- hreflang only between real EN/EL equivalents
- social metadata locale must match the page language
- schema must reflect visible content

Because the business decision is variant 2, do not create or preserve a separate SEO landing page under `/pages/resources/` from inside these files.

## Do Not Do
- do not change URL paths
- do not add new pages
- do not edit `community` or homepage files
- do not edit sitemap
- do not delete files
- do not introduce a second competing intent on the page
- do not keep hero copy that still reads like an event signup page

## Acceptance Criteria
Your work is done when:
- both seminar pages clearly read as guide/resource pages
- the primary CTA is PDF download
- metadata supports the guide intent
- schema no longer misclassifies the page as primarily an event registration page
- the hero no longer highlights date/location/price as primary content
- stale seminar registration JS is removed if unused
- EN and EL pages remain equivalent in structure and intent

## Suggested Final Report
When done, report:
- what changed in EN
- what changed in EL
- whether any stale registration code was removed
- any follow-up needed outside your file ownership
