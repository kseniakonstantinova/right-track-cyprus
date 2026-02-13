# Right Track — Project File Map

**Last updated:** 13 February 2026
**Total files:** ~110 (36 HTML, 16 MD, 9 JS, 9 JSON, 2 CSS, 2 TXT, 1 XML, 38 images)

---

## Site Pages

### Homepage
| File | Language | Description |
|------|----------|-------------|
| `index.html` | EN | Homepage — services, testimonials, newsletter, booking CTA |
| `index-el.html` | EL | Greek homepage |

### Team Profiles
| File | Language | Description |
|------|----------|-------------|
| `pages/tony-profile.html` | EN | Antonis Petri — 5 diplomas, credentials, clinical expertise |
| `pages/tony-profile-el.html` | EL | Greek version |
| `pages/alice-profile.html` | EN | Alice Kazanjian — Clinical Pilates specialist |
| `pages/alice-profile-el.html` | EL | Greek version |
| `pages/charalambos-profile.html` | EN | Charalambos Gregoriou — Physio + trainer |
| `pages/charalambos-profile-el.html` | EL | Greek version |

### Booking
| File | Description |
|------|-------------|
| `pages/booking.html` | Online booking system (Firebase + Telegram) |

### Blog
| File | Language | Description |
|------|----------|-------------|
| `pages/blog.html` | EN | Blog listing with filter tabs |
| `pages/blog-el.html` | EL | Greek blog listing |

### Blog Articles (`pages/blog/`)
| File | Language | Topic |
|------|----------|-------|
| `acl-recovery-athletes-cyprus.html` | EN | ACL tears — what 90% of athletes get wrong |
| `acl-recovery-athletes-cyprus-el.html` | EL | Greek version |
| `ankle-sprain-rehabilitation-guide.html` | EN | Why your ankle sprain keeps coming back |
| `ankle-sprain-rehabilitation-guide-el.html` | EL | Greek version |
| `shoulder-impingement-treatment-guide.html` | EN | Shoulder impingement — not just an athlete's injury |
| `shoulder-impingement-treatment-guide-el.html` | EL | Greek version |
| `meniscus-tear-recovery-case-study.html` | EN | Torn meniscus to match day — footballer's case study |
| `meniscus-tear-recovery-case-study-el.html` | EL | Greek version |
| `when-to-see-physiotherapist.html` | EN | When to see a physio vs wait it out |
| `when-to-see-physiotherapist-el.html` | EL | Greek version |
| `runner-injury-prevention-exercises.html` | EN | 5 exercises every runner should do |
| `runner-injury-prevention-exercises-el.html` | EL | Greek version |
| `hamstring-injury-stretching-myth.html` | EN | Why stretching alone won't fix your hamstring |
| `hamstring-injury-stretching-myth-el.html` | EL | Greek version |
| `gesy-physiotherapy-cyprus-guide.html` | EN | GESY physiotherapy guide for Cyprus |
| `gesy-physiotherapy-cyprus-guide-el.html` | EL | Greek version |

### Legal & Other
| File | Language | Description |
|------|----------|-------------|
| `pages/privacy.html` | EN | Privacy policy |
| `pages/privacy-el.html` | EL | Greek version |
| `pages/terms.html` | EN | Terms & conditions |
| `pages/terms-el.html` | EL | Greek version |
| `pages/tools-child-development.html` | EN | Child development tools |

### Admin
| File | Description |
|------|-------------|
| `pages/manage-rtphysio-2026/index.html` | Internal management dashboard |

---

## Marketing & Strategy Documents

### Marketing Strategy (`docs/marketing/`)
| File | Description |
|------|-------------|
| `00-INDEX.md` | Table of contents for marketing docs |
| `01-AUDIT.md` | Phase 0 audit — current state, gaps, competitors |
| `02-POSITIONING.md` | Brand positioning — "The Athlete's Physio" |
| `03-CONTENT-STRATEGY.md` | Content pillars, posting schedule, SEO keywords |
| `04-PAID-ADS.md` | Paid ads strategy — €200-500/month |
| `05-KPIs.md` | Monthly milestones — Month 1, 3, 6 |
| `06-IMPLEMENTATION-LOG.md` | Technical changes log (what was built) |
| `07-GTM-PLAN.md` | Go-to-market plan — all channels (IG, FB, LinkedIn, GBP, site) |
| `08-PHOTO-VIDEO-BRIEF.md` | Photo/video shoot brief — 1 month of content |

### AI Prompts (root)
| File | Description |
|------|-------------|
| `PROMPT_MARKETING_STRATEGIST.md` | System prompt for marketing strategist AI (Russian) |
| `PROMPT_BLOG_AUDITOR.md` | System prompt for evidence-based blog article auditor |

---

## Technical Documentation

| File | Description |
|------|-------------|
| `docs/ARCHITECTURE.md` | Site architecture overview |
| `docs/firebase-data-structure.md` | Firebase Firestore data structure |
| `crm/booking-requirements.md` | Booking system requirements |
| `admin/services-credentials.md` | Service credentials and API keys |
| `assets/data/README-IMPORT.md` | Historical data import instructions |

---

## JavaScript (`assets/js/`)

### Booking System
| File | Description |
|------|-------------|
| `booking/firebase-config.js` | Firebase configuration |
| `booking/calendar.js` | Calendar component |
| `booking/time-slots.js` | Time slot management |
| `booking/booking-data.js` | Booking data layer |
| `booking/booking-app.js` | Main booking application |

### Internationalisation
| File | Description |
|------|-------------|
| `i18n.js` | Internationalisation logic |
| `translations.js` | Translation strings |

### Admin
| File | Description |
|------|-------------|
| `admin/admin-app.js` | Admin dashboard application |

### Data
| File | Description |
|------|-------------|
| `import-historical-data.js` | Historical data import script |

---

## JSON Data

### Booking Data (`assets/data/`)
| File | Description |
|------|-------------|
| `january-2026-complete.json` | January 2026 booking data (full) |
| `january-2026-complete-extended.json` | Extended January data |
| `january-2026-week2.json` | Week 2 data |
| `january-2026-week3.json` | Week 3 data |
| `january-2026-week4.json` | Week 4 data |
| `january-2026-week5-antonis.json` | Week 5 — Antonis only |

### Translations (`assets/i18n/`)
| File | Description |
|------|-------------|
| `en.json` | English translations |
| `el.json` | Greek translations |

---

## CSS (`assets/css/`)
| File | Description |
|------|-------------|
| `admin.css` | Admin dashboard styles |
| `booking.css` | Booking page styles |

> Note: Main site pages use inline `<style>` tags (no shared CSS file).

---

## Images (`assets/images/`)

### Team Photos (`team/`)
- `tony-photo.jpg` — Antonis Petri
- `alice-photo.jpg` — Alice Kazanjian
- `charalambos-photo.jpg` — Charalambos Gregoriou
- `join-team.jpg` — Join our team section image

### Credentials (`credentials/`)
**Antonis** (`credentials/antonis/`):
- `Bachelor of Science in Physiotherapy.jpeg`
- `Diploma-Orthopaedic-Manual-Therapy.jpeg`
- `Dynamic-Tape-Certification.jpeg`
- `Knee-Sports-Injuries.jpeg`
- `Exercise-Neck-Pain-Disorders.jpeg`
- `Certificate-Extra.jpeg`

**Alice** (`credentials/alice/`):
- `bsc-physiotherapy-diploma-euc-2016.jpeg`
- `functional-pilates-props-itol-2018.jpeg`
- `pilates-reformer-clinical-epimorfosis-2025.jpeg`
- `prenatal-functional-pilates-itol.jpeg`
- `infant-child-massage-wmf-2025.jpeg`
- `prenatal-massage-wmf-2025.jpeg`

**Charalambos** (`credentials/charalambos/`):
- `BSc-Physiotherapy-Diploma.pdf`

### Service Images (`services/`)
- `physiotherapy.jpg` — General physiotherapy
- `athlete-rehab.jpg` — Athlete rehabilitation
- `clinical-pilates.jpg` — Clinical Pilates
- `kids-physio.jpg` — Kids' physiotherapy
- `performance-training.jpg` — Performance training
- `homecare-physio.jpg` — Homecare physiotherapy
- `massage.jpg` — Sports massage

### Partnership Logos (`partnerships-logos/`)
- `frederick-logo-601x737.png` — Frederick University
- `lakatamia-fc.png` — Lakatamia FC Women
- `paeek-kyrenia.png` — PAEEK Kyrenia Academies
- `muya-tay.png` — Muay Thai Warriors

### Logos (`logos/`)
- `logo-new-no background.png` — Main logo (transparent)
- `Logo White.jpeg` — White logo
- `photo_2026-01-31_16.58.07-removebg-preview.png` — Alternative logo
- `cta-banner.png` — CTA banner

### Other
- `hero-team.jpg` — Hero section team photo
- `banners/pilates-launch-alice.jpg` — Pilates launch promo

---

## SEO & Config (root)
| File | Description |
|------|-------------|
| `sitemap.xml` | XML sitemap for search engines |
| `robots.txt` | Crawler instructions |
| `llms.txt` | LLM-readable site description |
| `.claude/settings.local.json` | Claude Code local settings |

---

## Architecture Notes

- **Hosting:** GitHub Pages + Cloudflare DNS
- **Backend:** Firebase Firestore + EmailJS + Telegram Bot
- **Analytics:** GA4 (`G-XQT03Q3821`) on all 14 public pages
- **Bilingual:** Every public page has an EN and EL (`-el.html`) version
- **Styling:** Inline `<style>` per page (no shared CSS for main pages). Only booking and admin have external CSS.
- **Brand colours:** Navy `#0A1628`, Orange `#FF6B35`, Off-white `#F8F9FA`
