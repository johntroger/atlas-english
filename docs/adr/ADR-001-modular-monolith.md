# ADR-001: Use a modular monolith

- **Status:** Accepted
- **Date:** 2026-09-17

## Context

The application serves a small invite-only multi-user cohort and needs clear boundaries without distributed-system overhead.

## Decision

Build one Next.js application divided into presentation, application, domain, infrastructure, and content modules.

## Alternatives

- Microservices: unnecessary operational complexity.
- Unstructured single-page codebase: learning and sync logic would be hard to test.

## Consequences

- One deployment and repository.
- Boundaries must be enforced by convention and tests.
- Extract modules only after demonstrated need.
