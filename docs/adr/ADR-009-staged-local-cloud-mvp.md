# ADR-009: Stage a technical local proof before local-core and cloud continuity

- **Status:** Accepted
- **Date:** 2026-09-17
- **Revised:** 2026-09-19

## Context

The learning loop must be validated quickly, while the multi-user beta must preserve isolated progress between phone and desktop. Building authentication, RLS, and multi-device conflict handling before validating the learning loop increases delivery risk.

## Decision

Deliver three consecutive internal milestones:

1. **Technical vertical slice:** Today, one representative Grammar node, feedback, Mistake Book, IndexedDB persistence, export/import, and offline reload.
2. **MVP-A — Local core:** expand the proven loop into the selected curriculum scope with Diagnostic Screening, Daily Quest, mastery/review, five learning areas, local export/restore, and offline PWA behavior.
3. **MVP-B — Cloud continuity:** allow-listed Supabase magic-link authentication, RLS, idempotent synchronization, two-device continuity, minimal administration, and recovery states.
4. **Technical test:** validate reliability using draft content without making a learning-validity claim.
5. **Academic review and invite-only learning beta:** independently review the beta content, then invite 10–30 learners.

The technical vertical slice is proof of architecture, not MVP-A. MVP-A is a usable local-core milestone but not the final cross-device release. Daily cross-device use begins only after MVP-B passes its acceptance criteria. There is no MVP-C AI stage; deterministic feedback belongs to the local core under ADR-011.

## Alternatives

- Build cloud sync in the first vertical path: closer to the final architecture but delays learning-loop validation.
- Remain device-only: simpler, but does not meet the intended phone-and-desktop continuity.

## Consequences

- Domain and repository boundaries must support both local-only and synchronized adapters.
- Export/import is required before cloud integration.
- Supabase remains required before the invite-only beta but is not a blocker for the first learning-loop demonstration.
- Acceptance criteria and backlog distinguish the technical slice, MVP-A, and MVP-B.
