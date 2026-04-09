# Firebase/Admin Backend Note

## Scope

This repository is the public site workspace.

The operational Firebase backend for admin booking sync does not live here as source code.
The admin app and Cloud Functions are maintained in a separate project/repository.

## What This Means

- `gcalWebhook`
- `setupCalendarWatch`
- `onBookingCreated`
- `onBookingUpdated`
- `onBookingDeleted`
- Firebase secret management
- Cloud Functions deploy/redeploy steps

All of the items above should be documented in the separate admin/backend project, not here.

## Why This Note Exists

This site repository is still connected to the booking flow, so people may look here first.
This note exists only to prevent confusion.

## Current Backend Project Reference

Known Firebase project used for booking/admin sync:

- `righttrack-booking-167c6`

## Important Operational Reminder

For Google Calendar inbound sync, deployment of `gcalWebhook` alone is not enough.
`setupCalendarWatch` must also be executed so Google Calendar knows where to send notifications.

## Documentation Policy

Canonical runbooks for Firebase Functions, Google Calendar sync, secrets, webhook renewal, and recovery steps must live in the separate admin/backend repository.

This file should stay short and act only as a pointer/note.
