# Agent 12 Brief: Build Physiotherapist Vacancy Landing and Careers Intent

## Role
You are responsible for creating a dedicated hiring landing page for an open Physiotherapist role at Right Track and aligning the current homepage `Join Team` section so the site has a clear recruitment conversion path.

This is a focused content architecture + conversion page task.

You must follow:
- [Site Design and Content Guide](/Users/user/Right%20Track/docs/site-design-and-content-guide.md)
- [SEO Guidelines](/Users/user/Right%20Track/docs/seo-guidelines.md)

The brand/content guide governs tone, visual direction, CTA hierarchy, and page-family behavior.
The SEO guide governs indexation, metadata, canonical rules, hreflang, URL format, and page intent separation.

## Business Goal
Right Track currently has a general `Join Team` section on the homepage, but it is too broad for the current hiring goal.

The immediate hiring goal is to recruit a Physiotherapist.

This role must be framed carefully:
- Right Track's current revenue reality includes elderly, neurological, general rehab, and homecare work
- Right Track's brand direction is sports rehab, performance, and return-to-play
- the clinic does **not** want a sports-only candidate who resists homecare or elderly/neuro work
- the clinic does **not** want a generic low-ambition candidate who weakens long-term brand direction

The page must position the opening as a **bridge role**:
- a clinician who can work across clinic + homecare
- a clinician who is comfortable with elderly/neuro/general cases
- a clinician who wants to grow into a sports/performance environment over time

The page must sell:
- reality
- responsibility
- growth
- systems
- long-term brand-building

Do not sell this as a vague "dream sports job."

## Core Intent Separation
This separation is mandatory:

- homepage `Join Team` block = short careers teaser / trust-building entry point
- new vacancy landing page = primary conversion page for this open physiotherapist role
- future careers hub = optional later step, not required for this task unless clearly needed

Do not leave the homepage as the main hiring destination for this role.

## Strategic Messaging Requirements
The vacancy landing page must clearly communicate:

1. This is a real clinic role with mixed patient populations
- in-clinic rehab
- sports / MSK / post-op
- homecare visits
- elderly and neurological patients

2. This is also a growth opportunity
- Right Track is building toward a stronger sports/performance identity
- the right hire can grow into that direction

3. Right Track is investing in brand infrastructure around clinicians
- this is not only a staffing hire
- the clinic is actively investing in growth and visibility
- recent hires already made:
  - Social Media Manager
  - Marketing Manager
  - UI Developer

This should be presented as evidence that Right Track is serious about building the clinic and supporting clinician visibility.

Do not overpromise fame, influence, or personal branding outcomes.
Frame it instead as:
- professional visibility
- opportunity to contribute to expert-led content
- chance to grow into a recognised expert within the clinic brand

## File Ownership
You may edit only:
- `index.html`
- `index-el.html`
- one new EN vacancy page
- one new EL vacancy page if an EL equivalent is implemented
- shared CSS/JS only if necessary for this landing page pattern
- `sitemap.xml` if needed

Preferred new URLs:
- `pages/physiotherapist-job-nicosia.html`
- `pages/physiotherapist-job-nicosia-el.html`

If you choose a different slug, it must still follow the SEO guide and clearly express job/vacancy intent.

You must not edit:
- unrelated service pages
- unrelated blog posts
- partnership pages
- seminar pages
- booking flow unless absolutely required for navigation
- docs other than this brief unless explicitly required

## Required Work

### 1. Create a dedicated EN vacancy landing page
Create one indexable English page for the open Physiotherapist role.

This page must be a hiring/conversion landing page, not a blog article and not a generic about-us page.

### 2. Create an EL vacancy page only if it can be done properly
If a Greek version is created, it must be a true language pair and not a partial mirror.

If there is not enough time or content confidence for a proper EL equivalent, keep the work EN-only and do not create a fake hreflang pair.

This rule is controlled by the SEO guide.

### 3. Replace the homepage `Join Team` block's role
Update the current homepage `Join Team` section so it functions as a teaser and routing layer.

It should:
- mention the open physiotherapist role
- briefly explain the kind of clinician Right Track is looking for
- route users to the dedicated vacancy page
- avoid acting as the main long-form application page

The current short generic application form on the homepage should not remain the main path for this hiring campaign.

### 4. Build the vacancy page around the correct narrative
The page must make the bridge-role framing obvious.

Recommended structure:
- Hero
- Why this role exists
- What you'll actually do
- Who this role is for
- Who this role is not for
- What you'll gain
- How Right Track is investing in growth
- Application / screening form
- FAQ
- Final CTA

### 5. Include brand-growth proof
Add a section that shows Right Track is building infrastructure around clinicians.

This section should include the idea that recent hires have already been made in:
- social media
- marketing
- UI / digital

The point is not to list vacancies for their own sake.
The point is to demonstrate:
- commitment to growth
- commitment to visibility
- commitment to building a serious clinic brand

This section should make the candidate feel:
- the clinic is growing
- the clinic invests beyond treatment rooms
- the right clinician will not be invisible

### 6. Add a practical qualification form
The application form should not be only:
- name
- email
- phone
- message

It must help pre-screen for fit.

The form should include a practical mix of:
- contact fields
- work-eligibility basics
- short qualification questions

Recommended fields:
- full name
- email
- phone / WhatsApp
- current location
- licensed or eligible to practise in Cyprus
- years of experience
- open to homecare visits
- own transport / driver's licence if relevant
- earliest start date
- CV upload or link

Recommended short-answer pre-screen questions:
- Why does this role interest you?
- How do you feel about homecare visits for elderly or neurological patients?
- What does a good physiotherapy session look like to you?
- What do you do if a patient is not improving after 3 to 4 sessions?
- What are you currently doing to improve as a physiotherapist?

Do not overload the page with a full interview.
The website form should be a pre-screen, not a 12-question interrogation.

### 7. Add clear self-selection filters
The page should intentionally repel poor-fit candidates.

Include a short visible section such as:
- This role is not for you if...

This should filter out candidates who:
- want sports-only patients
- want to avoid homecare
- prefer passive treatment mindsets
- want low-responsibility work

This is a strategic requirement, not optional copy.

### 8. Keep CTA language strong
Do not use weak CTA copy such as:
- Submit
- Enquire
- Contact us

Use action-oriented hiring CTAs such as:
- Apply for This Role
- See If This Role Fits You
- Start Your Application

CTA copy must align with the brand/content guide.

### 9. Metadata and SEO
For each vacancy page you create:
- one clear primary intent
- one H1
- strong title
- strong meta description
- self-referencing canonical
- proper hreflang only if there is a true EN/EL pair
- Open Graph and Twitter metadata aligned with the page
- inclusion in sitemap if indexable

Treat this as a valid indexable page type only if the page has enough standalone value and clarity of purpose.
If implemented as an evergreen-ish active vacancy page, it should follow the SEO guide for a campaign/promo-style conversion page.

### 10. Analytics behavior
If the page contains a form or apply CTA, add or update tracking where appropriate.

Recommended event split:
- `view_job_page`
- `start_application`
- `submit_application`

Do not leave all hiring intent collapsed into one vague homepage event if the new landing page becomes the main path.

### 11. Internal linking and direct-share readiness
The vacancy page must work as a standalone URL that can be:
- sent directly in WhatsApp / Instagram / LinkedIn / email outreach
- used in paid campaigns
- used in recruiter outreach or manual DM

This means the page must **not** rely on the homepage for context in order to make sense.

The homepage CTA is only one discovery path, not the only valid access path.

The page must not be an orphan.
At minimum, support it with internal links from:
- homepage `Join Team` teaser
- footer
- team-related section or equivalent trust-building area

Recommended implementation:
- keep the homepage `Join Team` block linking to the vacancy landing page
- add a small footer link such as `We're Hiring` / `Physiotherapist Role`
- add one secondary contextual link from the team section or adjacent clinician-trust section

Do not overdo this.
Do not add job links into every service page or every blog article.
Use a small number of strong, intentional internal links.

### 12. Homepage role after the vacancy page exists
The homepage should not try to repeat the full vacancy page.

Its job is:
- to signal growth
- to qualify interest
- to route high-intent users to the dedicated vacancy page

The homepage `Join Team` block should therefore remain:
- short
- role-specific
- brand-aligned
- CTA-led

It should not contain:
- a full long-form application form
- duplicated FAQ
- duplicated full role description

### 13. Specific SEO/content improvements required before sign-off
Even if the vacancy page exists, the implementation is not complete until the following are checked and corrected where needed.

#### 13.1 H1 alignment with primary intent
The vacancy page H1 must align closely with the page's main SEO intent.

Recommended pattern:
- EN: `Physiotherapist Job in <span>Nicosia</span>`
- EL: `Θέση <span>Φυσιοθεραπευτή</span> στη Λευκωσία`

The growth/sports-performance narrative should move into the subtitle, not replace the main H1 intent.

Reason:
- title, slug, canonical, and visible H1 should reinforce the same primary page intent
- this reduces ambiguity for both users and search engines

#### 13.2 Remove dead homepage hiring-form tracking
If the homepage no longer contains the old join-team form, remove any dead analytics code targeting that removed form.

Do not leave:
- stale selectors
- event hooks for non-existent forms
- old conversion events that no longer represent the real hiring funnel

#### 13.3 Be careful with query-parameter booking links
If homepage CTAs now point to booking URLs with query parameters, confirm that:
- the canonical booking page remains the clean URL
- query URLs are not being treated as separate indexable URLs
- the use of query parameters is justified by UX, not accidental drift

If query parameters are not essential, prefer the clean canonical booking URL in major internal links.

#### 13.4 Validate asset availability
If the vacancy page uses:
- videos
- posters
- PDF downloads
- any new media assets

confirm that all referenced assets:
- exist in the repo
- are deployed
- do not 404 on the live site

Broken media on a primary conversion page is unacceptable.

#### 13.5 Keep schema conservative and factual
If `JobPosting`, `FAQPage`, or any other structured data is used:
- it must reflect visible content
- it must not overstate uncertain operational details
- it must not include claims the business cannot confidently support

Be especially careful with:
- licensing implications
- GESY-related claims
- transport requirements
- hiring-process promises

## Internal Link Copy Suggestions
Use these as direction, not mandatory exact copy.

### Homepage `Join Team` CTA
- EN: `See Full Role & Apply`
- EL: `Δείτε τον Ρόλο & Κάντε Αίτηση`

### Footer link
- EN: `We're Hiring`
- EN alt: `Physiotherapist Role`
- EL: `Προσλαμβάνουμε`
- EL alt: `Θέση Φυσιοθεραπευτή`

### Team-section contextual link
- EN: `Interested in joining the team? View the open physiotherapist role.`
- EL: `Σας ενδιαφέρει να ενταχθείτε στην ομάδα; Δείτε τη διαθέσιμη θέση φυσιοθεραπευτή.`

### Small trust-section link
- EN: `We're growing our clinical team.`
- EL: `Αναπτύσσουμε την κλινική μας ομάδα.`

## Content Constraints
- do not present the role as sports-only
- do not hide homecare, elderly, or neurological work
- do not position this as a generic low-signal "join our team" page
- do not overuse corporate HR language
- do not sound like a hospital, wellness spa, or generic recruiter
- do not claim specific compensation, benefits, schedule, or growth details unless provided by the business
- do not invent team size, mentorship structure, or guaranteed career outcomes
- do not create a fake Greek language pair just for SEO completeness

## Tone Requirements
The tone must align with Right Track:
- clinical
- direct
- athletic where appropriate
- outcome-oriented
- serious about standards

For this page specifically, add:
- honesty about workload reality
- ambition about long-term direction
- confidence without hype

The target candidate should feel:
- this role is demanding
- this role is real
- this clinic is building something serious
- this could be a strong career move for the right person

## Acceptance Criteria
Your work is done when:
- a dedicated vacancy landing page exists for the open Physiotherapist role
- the page clearly owns the main hiring conversion intent
- the homepage `Join Team` section no longer carries the full burden of the hiring funnel
- the page clearly explains the bridge-role reality: clinic + homecare now, sports/performance growth over time
- the page includes strong self-selection and pre-screening logic
- the page includes a credible brand-growth section referencing recent investment in marketing/digital capability
- the vacancy page can be sent as a direct standalone URL without needing homepage context
- the page is supported by a small but intentional internal linking structure
- H1, title, slug, canonical, and page purpose are aligned
- no dead analytics code remains from the removed homepage form flow
- media assets referenced by the vacancy page are confirmed live and non-broken
- metadata, canonical, hreflang logic, and sitemap treatment follow the SEO guide
- CTA language and messaging align with the brand/content guide

## Suggested Final Report
When done, report:
- which vacancy page(s) you created
- what you changed on the homepage
- which internal links now support the vacancy page
- how you positioned the bridge-role narrative
- how the form pre-screens candidate fit
- how you communicated Right Track's investment in clinician visibility and brand growth
- which SEO cleanups were required to make the page production-ready
- any recommended next-step work, such as a future careers hub or thank-you page
