# ADR-003: Use Supabase for authentication and synchronization

- **Status:** Accepted
- **Date:** 2026-09-17

## Context

Progress should follow the learner between desktop and phone.

## Decision

Use Supabase Auth and PostgreSQL as the cross-device store. Protect rows with RLS and keep gameplay functional without an active connection.

## Alternatives

- Device-only storage: simpler but weak multi-device experience.
- Custom backend: more maintenance without a current benefit.

## Consequences

- Requires environment isolation, migrations, RLS tests, and conflict rules.
- The app remains usable if Supabase is unavailable.
