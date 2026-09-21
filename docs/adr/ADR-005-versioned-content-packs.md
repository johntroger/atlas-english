# ADR-005: Store learning content as versioned repository artifacts

- **Status:** Accepted
- **Date:** 2026-09-17

## Context

Runtime AI generation is excluded. Content must be reviewable, reproducible, cacheable, and deployable.

## Decision

Store immutable content packs and schemas in Git. Validate them in CI and deliver them as static assets.

## Alternatives

- Store all content in Supabase: easier live edits but weaker review discipline.
- Generate at runtime: incompatible with cost and reliability requirements.

## Consequences

- Content changes use pull requests and deployments.
- Packs need compatibility metadata, hashes, activation rules, and rollback.
