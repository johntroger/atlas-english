# Architecture Decision Records

ADRs preserve why important decisions were made.

Newer ADRs take precedence when they explicitly supersede an older decision. ADR-013 supersedes ADR-002, ADR-009 and ADR-012. ADR-011 still governs the MVP AI boundary; ADR-014 only defines a deferred future option.

## Status values

- `Proposed` — awaiting review.
- `Accepted` — binding until superseded.
- `Rejected` — considered and not selected.
- `Superseded` — replaced by a newer ADR.

## Index

| ADR | Decision | Status |
|---|---|---|
| [ADR-001](ADR-001-modular-monolith.md) | Modular monolith | Accepted |
| [ADR-002](ADR-002-offline-first.md) | Offline-first with IndexedDB | Superseded by ADR-013 |
| [ADR-003](ADR-003-supabase-sync.md) | Supabase for cross-device sync | Accepted |
| [ADR-004](ADR-004-pronunciation-fallback.md) | Progressive pronunciation capability with optional recognition | Superseded by ADR-011 |
| [ADR-005](ADR-005-versioned-content-packs.md) | Repository-based versioned content | Accepted |
| [ADR-006](ADR-006-environment-isolation.md) | Isolated non-production and Beta/Production | Accepted |
| [ADR-007](ADR-007-no-runtime-generative-ai.md) | No runtime generative-AI API | Rejected |
| [ADR-008](ADR-008-mastery-not-band.md) | Mastery is not IELTS band | Accepted |
| [ADR-009](ADR-009-staged-local-cloud-mvp.md) | Local learning slice before cloud continuity | Superseded by ADR-013 |
| [ADR-010](ADR-010-runtime-gemini-feedback.md) | Bounded Gemini runtime feedback | Superseded by ADR-011 |
| [ADR-011](ADR-011-no-runtime-ai-deterministic-engine.md) | Deterministic engine with no runtime AI | Accepted |
| [ADR-012](ADR-012-invite-only-multi-user-beta.md) | Invite-only multi-user service and staged learning beta | Superseded by ADR-013 |
| [ADR-013](ADR-013-online-public-guest-registration.md) | Online-only, public guest and open registration | Accepted |
| [ADR-014](ADR-014-deferred-gemini-byok-ai-coach.md) | Deferred Gemini BYOK AI Coach boundary | Accepted — deferred |
| [ADR-015](ADR-015-public-practice-private-assessment-bank.md) | Public practice and private assessment bank | Accepted |
| [ADR-016](ADR-016-pre-code-scope-and-learning-boundaries.md) | Vertical-slice-only first approval and learning-evidence boundaries | Accepted |

Never rewrite the historical rationale of an accepted ADR. Add a superseding ADR instead.
