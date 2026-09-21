# ADR-006: Isolate Development and Production data

- **Status:** Accepted
- **Date:** 2026-09-17

## Context

Preview deployments and automated tests must not modify real progress.

## Decision

Use one non-production Supabase project for Development/Preview and a separate project for Beta/Production. Vercel Preview never receives Beta/Production credentials.

## Alternatives

- Shared database with flags or schemas: cheaper but easier to misconfigure.

## Consequences

- Migrations and seed data must be reproducible.
- Environment-variable ownership and release order must be documented.
