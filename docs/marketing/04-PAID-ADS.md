# Paid Advertising Strategy

**Date:** February 12, 2026
**Start:** Month 2+ (after organic baseline established)

---

## Budget Allocation (€200-500/month)

| Channel | Budget | Purpose |
|---------|--------|---------|
| Instagram/Facebook Ads | €150-300 | Boost top-performing organic Reels to local audience |
| Google Ads (Search) | €50-150 | Capture "physiotherapist near me" + sports injury keywords |
| Google Business Boosting | €0-50 | Promote GBP listing in Maps |

---

## Rules
1. **NEVER boost content that didn't perform organically first.** Only amplify winners.
2. Authentic > polished. Use best-performing Reels as ad creative.
3. €300 on one winning ad > €50 on six mediocre ones.

## Instagram/Facebook Ad Targeting
- **Location:** Nicosia + Limassol (radius)
- **Age:** 18-45
- **Interests:** sports, fitness, gym, football, running, basketball, martial arts
- **Retargeting:** Website visitors who didn't book (requires Meta Pixel)

## Google Search Ads
- **Keywords:** "physiotherapist Nicosia", "sports physio Cyprus", "ACL rehab Cyprus"
- **Ad type:** Search ads (text)
- **Landing page:** Booking page or relevant service page
- **Budget:** Start with €5/day, scale winners

---

## Meta Pixel Setup (TODO)
- Add Meta Pixel base code to `<head>` of all HTML pages
- Events to track:
  - `PageView` — all pages
  - `ViewContent` — services section
  - `InitiateBooking` — booking page opened
  - `CompleteBooking` — booking confirmed
- Use Facebook Pixel Helper Chrome extension to verify

**Status:** Not yet implemented. Needs Meta Pixel ID from Facebook Business Manager.
