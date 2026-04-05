# Agent 10 Brief: Build GESY Landing Page and Separate Intent

## Role
You are responsible for creating a dedicated GESY service-style landing page and aligning the existing GESY-related pages so each one has a distinct role.

This is a focused SEO + content architecture implementation task.

## Business Goal
Right Track already has:
- a homepage GESY section
- a detailed GESY guide article
- a GESY vs private comparison article

What is missing is a dedicated commercial/local landing page for users who are not just researching GESY, but want to know:
- can I book with you through GESY?
- how does it work at your clinic?
- what do I need to do next?

The new page should target local commercial intent around:
- GESY physiotherapy Nicosia
- GESY physiotherapist Nicosia
- physiotherapy through GESY in Nicosia

## Core Intent Separation
This separation is mandatory:

- new landing page = commercial/local intent
- existing GESY guide = informational explainer
- existing GESY vs private page = comparison/evaluation intent

Do not blur these roles.

## File Ownership
You may edit only:
- `pages/services/gesy-physiotherapy-nicosia.html`
- `pages/services/gesy-physiotherapy-nicosia-el.html`
- `pages/services/physiotherapy.html`
- `pages/services/physiotherapy-el.html`
- `pages/blog/gesy-physiotherapy-cyprus-guide.html`
- `pages/blog/gesy-physiotherapy-cyprus-guide-el.html`
- `pages/blog/gesy-vs-private-physiotherapy-prices-cyprus.html`
- `pages/blog/gesy-vs-private-physiotherapy-prices-cyprus-el.html`
- `index.html`
- `index-el.html`
- `pages/booking.html`
- `sitemap.xml` if needed

You must not edit:
- unrelated blog posts
- community pages
- seminar pages
- padel pages
- docs unless absolutely necessary

## Dependencies
Prefer to start after:
- English priority blog rewrites are complete
- Greek priority blog rewrites are complete
- homepage focus work is complete or stable

This task overlaps heavily with GESY cluster work.
If this task is used, it should replace a smaller GESY-linking-only task rather than run after it.

## Required Work

### 1. Create a new EN landing page
Create:
- `pages/services/gesy-physiotherapy-nicosia.html`

This must be a service-style page, not a blog article.

### 2. Create a new EL landing page
Create:
- `pages/services/gesy-physiotherapy-nicosia-el.html`

EN and EL must remain equivalent in role and factual claims.

### 3. Page structure
Use a service-page structure roughly like:
- Hero
- Who this is for
- How GESY physiotherapy works
- Costs and sessions
- Why choose Right Track
- Need more than GESY covers?
- FAQ
- Final CTA

### 4. Metadata and SEO
For both EN and EL pages:
- strong title
- strong meta description
- one clear H1
- canonical self-reference
- proper hreflang EN/EL pairing
- consistent Open Graph and Twitter metadata
- schema appropriate for a service-style medical/local page

### 5. CTA behavior
The new landing page must clearly lead to booking.

It should answer:
- whether the clinic accepts GESY
- how a referral works
- what the patient should do next

The main CTA should feel like a next step, not just a generic “learn more”.

### 6. Homepage updates
Update the homepage GESY section so:
- the primary path points to the new landing page
- the detailed guide remains available as a secondary informational path

Apply the same logic in EN and EL.

Important:
- the current homepage GESY cards still use older article framing such as:
  - `Everything You Need to Know`
  - `Wait Times & What's Covered`
- these labels and supporting copy should be updated to match the current page roles and newer search-intent wording
- do not leave outdated article-card messaging on `index.html` or `index-el.html`

### 7. GESY guide updates
Keep the guide article as the detailed explainer.

Add a clear bridge toward the new landing page, such as:
- “Need a GESY physiotherapist in Nicosia?”
- “Looking to book through GESY?”

The guide should not become the main commercial page.

### 8. GESY vs private updates
Keep this page as a comparison/evaluation asset.

Add a relevant next-step link to the new landing page where appropriate.

### 9. Physiotherapy service page updates
Add a short GESY-specific pathway or block on the main physiotherapy service page and link to the new landing page.

### 10. Booking page
If it fits cleanly, add a small helper block for GESY users on the booking page.
Do not bloat the booking page.

## Constraints
- do not duplicate large parts of the existing GESY guide
- do not create another article-like “everything you need to know” page
- do not create cannibalization with the existing GESY guide
- do not invent facts about coverage, co-pay, referral rules, or session limits
- only state facts already supported by current site content or already-established site messaging
- keep tone aligned with Right Track: clinical, direct, practical

## Acceptance Criteria
Your work is done when:
- a new EN GESY landing page exists
- a new EL GESY landing page exists
- the new page clearly owns the commercial/local GESY intent
- the existing guide clearly remains informational
- the comparison page clearly remains evaluative
- homepage, service page, and GESY articles now support a coherent conversion path toward booking

## Suggested Final Report
When done, report:
- which pages you created
- which existing pages you updated
- how you separated landing / guide / comparison intent
- what CTA paths now lead users toward booking
- any future GESY support pages that should be planned separately
