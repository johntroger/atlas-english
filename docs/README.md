# Project documentation

This folder contains the authoritative specifications used to design, build, test, and operate the IELTS Game.

## Reading order

1. [`../PLAN.md`](../PLAN.md) — scope and approval.
2. [`STATUS.md`](STATUS.md) — current phase and next action.
3. [`PRODUCT.md`](PRODUCT.md) — user and product behavior.
4. [`ARCHITECTURE.md`](ARCHITECTURE.md) — system structure and boundaries.
5. The task-specific document listed below.

## Document map

| Area | Document |
|---|---|
| Current state | [`STATUS.md`](STATUS.md) |
| Product | [`PRODUCT.md`](PRODUCT.md) |
| Architecture | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Data | [`DATA-MODEL.md`](DATA-MODEL.md) |
| Physical database contract | [`DATABASE-SPEC.md`](DATABASE-SPEC.md) |
| Online submission and continuity | [`SYNC-PROTOCOL.md`](SYNC-PROTOCOL.md) |
| State and recovery | [`STATE-AND-RECOVERY.md`](STATE-AND-RECOVERY.md) |
| Learning algorithms | [`LEARNING-ENGINE.md`](LEARNING-ENGINE.md) |
| Learning evidence boundary | [`LEARNING-CONTRACT.md`](LEARNING-CONTRACT.md) |
| Vertical slice scope | [`VERTICAL-SLICE.md`](VERTICAL-SLICE.md) |
| Pre-code approval | [`PRE-CODE-CHECKLIST.md`](PRE-CODE-CHECKLIST.md) |
| Standards and evidence baseline | [`STANDARDS-BASELINE.md`](STANDARDS-BASELINE.md) |
| Multidisciplinary pre-code review | [`PRE-CODE-REVIEW-2026-09-21.md`](PRE-CODE-REVIEW-2026-09-21.md) |
| P-032 data trust-boundary review | [`P032-DATA-TRUST-BOUNDARY-REVIEW.md`](P032-DATA-TRUST-BOUNDARY-REVIEW.md) |
| P-033 final pre-code audit | [`P033-FINAL-PRE-CODE-AUDIT.md`](P033-FINAL-PRE-CODE-AUDIT.md) |
| P-034 final consistency corrections | [`P034-FINAL-CONSISTENCY-CORRECTIONS.md`](P034-FINAL-CONSISTENCY-CORRECTIONS.md) |
| UX prototype plan | [`PROTOTYPE-PLAN.md`](PROTOTYPE-PLAN.md) |
| Vertical Slice wireframe artifact | [`WIREFRAMES.md`](WIREFRAMES.md) |
| Owner Alpha feedback and triage | [`ALPHA-FEEDBACK.md`](ALPHA-FEEDBACK.md) |
| Curriculum framework | [`CURRICULUM.md`](CURRICULUM.md) |
| MVP curriculum nodes | [`CURRICULUM-MATRIX.md`](CURRICULUM-MATRIX.md) |
| IELTS assessment and calibration | [`IELTS-ASSESSMENT-FRAMEWORK.md`](IELTS-ASSESSMENT-FRAMEWORK.md) |
| Study roadmap to exam | [`STUDY-ROADMAP.md`](STUDY-ROADMAP.md) |
| Content lifecycle | [`CONTENT-SYSTEM.md`](CONTENT-SYSTEM.md) |
| Content authoring | [`CONTENT-AUTHORING-GUIDE.md`](CONTENT-AUTHORING-GUIDE.md) |
| Vertical Slice P-031 proof content | [`content/vertical-slice/P031-PROOF-PACK.md`](content/vertical-slice/P031-PROOF-PACK.md) |
| P-031 validation evidence | [`content/vertical-slice/P031-VALIDATION-EVIDENCE.md`](content/vertical-slice/P031-VALIDATION-EVIDENCE.md) |
| Audio pipeline | [`AUDIO-PIPELINE.md`](AUDIO-PIPELINE.md) |
| Deterministic feedback and pronunciation analysis | [`ALGORITHMIC-FEEDBACK.md`](ALGORITHMIC-FEEDBACK.md) |
| User flows | [`UX-FLOWS.md`](UX-FLOWS.md) |
| Visual direction | [`VISUAL-DIRECTION.md`](VISUAL-DIRECTION.md) |
| Narrative design and story bible | [`NARRATIVE-DESIGN.md`](NARRATIVE-DESIGN.md) |
| Accessibility | [`ACCESSIBILITY.md`](ACCESSIBILITY.md) |
| Security | [`SECURITY.md`](SECURITY.md) |
| Public Preview privacy notice | [`PRIVACY-NOTICE.md`](PRIVACY-NOTICE.md) |
| Public Preview terms of use | [`TERMS-OF-USE.md`](TERMS-OF-USE.md) |
| Threat model | [`THREAT-MODEL.md`](THREAT-MODEL.md) |
| Testing | [`TESTING.md`](TESTING.md) |
| Acceptance criteria | [`ACCEPTANCE-CRITERIA.md`](ACCEPTANCE-CRITERIA.md) |
| Quality budgets | [`QUALITY-ATTRIBUTES.md`](QUALITY-ATTRIBUTES.md) |
| Repository structure | [`REPOSITORY-STRUCTURE.md`](REPOSITORY-STRUCTURE.md) |
| Traceability | [`TRACEABILITY.md`](TRACEABILITY.md) |
| Learning analytics | [`LEARNING-ANALYTICS.md`](LEARNING-ANALYTICS.md) |
| Backlog | [`BACKLOG.md`](BACKLOG.md) |
| Releases and recovery | [`RELEASE-RUNBOOK.md`](RELEASE-RUNBOOK.md) |
| Backup and isolated restore procedure | [`BACKUP-RESTORE-RUNBOOK.md`](BACKUP-RESTORE-RUNBOOK.md) |
| Observability and operations | [`OBSERVABILITY-OPERATIONS.md`](OBSERVABILITY-OPERATIONS.md) |
| Open beta | [`BETA-TEST-PLAN.md`](BETA-TEST-PLAN.md) |
| Decisions | [`adr/README.md`](adr/README.md) |
| Machine-readable contracts | [`schemas/`](schemas/) |

`schemas/pronunciation-analysis.schema.json` defines the local, versioned pronunciation-analysis result. It contains no raw audio.

`schemas/narrative-pack.schema.json` defines immutable Campaign/Episode/Mission copy and 3–5 exercise-slot constraints. Narrative selection never generates or rewrites copy at runtime.

`schemas/sync-operation.schema.json` is retained only as a deprecated planning artifact after ADR-013; it must not be used to implement an offline client queue.

## Document status labels

- `DRAFT`: incomplete or awaiting a decision.
- `REVIEW`: ready for user review.
- `ACCEPTED`: approved source of truth.
- `SUPERSEDED`: replaced by another document or ADR.
