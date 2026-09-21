# ADR-012: Operate Atlas English as an invite-only multi-user service

- **Status:** Accepted
- **Date:** 2026-09-19

## Context

Atlas English was initially specified around one reference learner. The owner decided to publish the application online for multiple Vietnamese IELTS Academic learners, while retaining personalized goals, evidence, Daily Quests, offline learning, and phone-to-desktop continuity.

The first cohort is intentionally small. Learning validity cannot be claimed before the content receives independent academic review, and system reliability must be tested separately from instructional quality.

## Decision

- The first learning beta contains 10–30 allow-listed accounts.
- Authentication uses Supabase email magic links; the beta has no guest mode.
- A public landing page is separated from authenticated learning routes.
- IndexedDB remains the immediate device store and Supabase remains the cross-device synchronization store.
- RLS isolates each learner. Attempts are append-only and merge by UUID.
- A minimal administration surface manages invitations, account suspension, aggregate operations, and support access.
- Individual learning metadata is available to an administrator only after a learner requests time-limited, audited support. Raw audio and free-form Writing/Speaking content remain excluded.
- Development/Preview uses a non-production Supabase project isolated from Beta/Production.
- Delivery proceeds through technical slice, MVP-A, MVP-B, technical test, academic review, invite-only learning beta, and learning validation.
- Technical test may use draft content but cannot make a learning-effectiveness claim.
- Learning beta requires human academic approval of the golden pack and beta content.

## Distribution and data decisions

- The GitHub repository is public.
- Code uses the MIT license; learning content uses CC BY-NC-SA 4.0.
- Reference audio requires verified compatible licensing and provenance.
- Learner audio remains local and is never synchronized.
- Account-linked product analytics may contain only structured metadata, never email, authentication data, audio, raw answers, or free-form learner content. Detailed events are retained for at most 90 days, then deleted or converted to non-identifying aggregates.
- The beta is free and contains no payments, public profiles, social features, or leaderboards.

## Age and privacy risk

The owner chose not to collect age, not to implement a guardian-consent flow, and not to obtain legal review before beta while allowing users of any age. This preference is recorded, but it does not satisfy the privacy/legal release gate. Technical work may proceed; release to real learners remains blocked until the applicable requirements are resolved or the audience is restricted.

## Alternatives

- Single-user personal application: rejected because the product is intended for multiple learners.
- Open self-service registration: deferred until invite-only operations and abuse controls are validated.
- Guest mode with later account merge: deferred to reduce sync and shared-device risk.
- Cloud audio storage: rejected for the approved scope.

## Consequences

- Product, architecture, data, security, analytics, operations, beta, and acceptance documents must use multi-user language.
- Cross-user RLS denial tests, invitation controls, support-access audit tests, account export/deletion, backup/restore, and second-device continuation are beta gates.
- Academic review and system testing are separate gates.
- A public repository requires secret scanning, branch protection, contribution rules, and license/provenance validation.
