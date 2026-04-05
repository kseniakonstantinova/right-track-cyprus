# Agent 5 Brief: Fix Event Rich Result Warnings

## Role
You are responsible only for cleaning up `Event` structured data so Google Search Console stops flagging avoidable rich result warnings.

This is a schema-quality task, not a full content rewrite task.

## Why This Exists
Google Search Console is reporting `Events` enhancement warnings such as:
- missing `image`
- missing `performer`
- missing `endDate`
- missing `offers`
- missing `description`
- missing `organizer`
- missing `url` in nested objects
- missing `validFrom` / `priceCurrency` in offers

These are not indexing failures.
They mean Google sees valid event markup but considers it incomplete for richer event presentation.

## File Ownership
You may edit only:
- `pages/community.html`
- `pages/community-el.html`
- `pages/padel-camp.html`
- `pages/padel-camp-el.html`

You must not edit:
- `pages/seminar-muay-thai.html`
- `pages/seminar-muay-thai-el.html`
- `index.html`
- `index-el.html`
- any blog articles
- docs

## Core Goal
Make event schema complete, internally consistent, and aligned with visible content for the pages that genuinely still function as event pages.

## Important Scope Decision
- `padel-camp` is still an active event page, so rich event schema should be improved
- `community` contains event listings, so listed event objects should be improved where they are still truthful
- do not convert event pages into article/resource pages in this task
- do not change page intent

## Required Work

### 1. Review and complete event schema fields
For each event object, ensure the following exist when supported by visible content:
- `name`
- `description`
- `startDate`
- `endDate`
- `eventStatus`
- `eventAttendanceMode`
- `location`
- `organizer` with `name` and `url`
- `performer` where a person or organization is clearly presented
- `image`
- `url`
- `offers` with:
  - `url`
  - `price`
  - `priceCurrency`
  - `availability`
  - `validFrom` when appropriate

### 2. Make nested objects consistent
If `organizer`, `performer`, or `offers` already exist:
- keep naming consistent with the visible page
- add missing URLs where appropriate
- do not invent data not supported by the page

### 3. Preserve truthfulness
- if an event is completed, keep `EventCompleted`
- if an event is scheduled, keep `EventScheduled`
- do not claim availability or pricing that the page does not support
- do not add fake performer details just to satisfy rich result recommendations

## Current Clues
Likely pages behind the GSC warnings:
- `pages/community.html`
- `pages/community-el.html`
- `pages/padel-camp.html`
- `pages/padel-camp-el.html`

`seminar-muay-thai` should not be touched here because it already behaves more like a completed resource/article page.

## Constraints
- do not change URLs
- do not add or remove pages
- do not change visible business facts unless they are clearly wrong
- do not add schema fields unsupported by visible content
- keep EN and EL parity where equivalent

## Acceptance Criteria
Your work is done when:
- all owned event pages have richer, internally consistent event schema
- nested `organizer` and `offers` objects include the obvious missing fields
- completed vs scheduled event states remain accurate
- EN and EL versions remain aligned

## Suggested Final Report
When done, report:
- which pages were updated
- which warning categories were resolved by the edits
- any warnings that should be ignored because the page intent does not justify forcing those fields
