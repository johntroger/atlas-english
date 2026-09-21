# ADR-002: Use an offline-first local store

- **Status:** Accepted
- **Date:** 2026-09-17

## Context

The learner may study on mobile with intermittent connectivity. LocalStorage is not suitable for structured progress, queues, and larger metadata.

## Decision

Use IndexedDB as the primary device-local persistence layer. Commit user actions locally before synchronization.

## Alternatives

- Online-only: makes learning fragile.
- LocalStorage: unsuitable for important structured data.

## Consequences

- Requires local migrations and an outbox.
- UI responds immediately.
- Local eviction and recovery must be handled.
