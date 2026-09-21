# Codex project instructions

## Project status gate

1. Read `PLAN.md` and `docs/STATUS.md` before taking project action.
2. If `PLAN.md` is not marked with an explicit approval scope, do not create application code, install dependencies, initialize frameworks, create databases, deploy, or publish. The first allowed state is `APPROVED — VERTICAL SLICE ONLY`, which authorizes only the scope in `docs/VERTICAL-SLICE.md`.
3. While the plan is not approved, documentation, schemas, ADRs, curriculum planning, and review work are allowed.
4. Production deployment always requires an explicit user request, even after plan approval.
5. Approval for one phase never authorizes a later phase; beta MVP and Production require separate explicit approval.
6. After `APPROVED — VERTICAL SLICE ONLY`, implementation is still sequential. Follow `VS-01` through `VS-09` in `docs/VERTICAL-SLICE.md`; initial approval opens only `VS-01`.
7. Do not begin, prepare implementation for, or combine a later VS step until the current step is complete, its required checks pass, a completion report is presented, and the user explicitly approves the named next step.
8. If a check fails or acceptance is incomplete, fix and retest within the current step. Stop after every step report and ask before advancing.

## Sources of truth

- Product scope and approval: `PLAN.md`.
- Current project state: `docs/STATUS.md`.
- Product behavior: `docs/PRODUCT.md`.
- Architecture and boundaries: `docs/ARCHITECTURE.md`.
- Accepted technical decisions: `docs/adr/`.
- Data model: `docs/DATA-MODEL.md`.
- Sync behavior: `docs/SYNC-PROTOCOL.md`.
- Learning algorithms: `docs/LEARNING-ENGINE.md`.
- Learning evidence eligibility: `docs/LEARNING-CONTRACT.md`.
- Curriculum: `docs/CURRICULUM.md` and `docs/CURRICULUM-MATRIX.md`.
- IELTS progress evidence: `docs/IELTS-ASSESSMENT-FRAMEWORK.md`.
- Study allocation and exam phases: `docs/STUDY-ROADMAP.md`.
- Content formats and lifecycle: `docs/CONTENT-SYSTEM.md` and `docs/schemas/`.
- Content-writing rules: `docs/CONTENT-AUTHORING-GUIDE.md`.
- Deterministic feedback, personalization, and pronunciation analysis: `docs/ALGORITHMIC-FEEDBACK.md`.
- UX states: `docs/UX-FLOWS.md`.
- Visual system and interaction direction: `docs/VISUAL-DIRECTION.md`.
- Security requirements: `docs/SECURITY.md`.
- User-facing privacy disclosure: `docs/PRIVACY-NOTICE.md`.
- User-facing terms of use: `docs/TERMS-OF-USE.md`.
- Test requirements: `docs/TESTING.md`.
- Active work and acceptance criteria: `docs/BACKLOG.md`.
- First implementation boundary and approval: `docs/VERTICAL-SLICE.md` and `docs/PRE-CODE-CHECKLIST.md`.
- Owner Alpha feedback severity and lifecycle: `docs/ALPHA-FEEDBACK.md`.
- Release and recovery: `docs/RELEASE-RUNBOOK.md`; exact backup/isolated-restore procedure: `docs/BACKUP-RESTORE-RUNBOOK.md`.
- Implementation contracts: `docs/DATABASE-SPEC.md`, `docs/STATE-AND-RECOVERY.md`, and `docs/REPOSITORY-STRUCTURE.md`.
- Acceptance and quality: `docs/ACCEPTANCE-CRITERIA.md`, `docs/QUALITY-ATTRIBUTES.md`, and `docs/TRACEABILITY.md`.
- Operations: `docs/OBSERVABILITY-OPERATIONS.md` and `docs/BETA-TEST-PLAN.md`.

Do not duplicate an authoritative decision in several files. Link to the source of truth instead.

## Change protocol

1. Work on one backlog item at a time.
2. Confirm the item meets the Definition of Ready in `docs/BACKLOG.md`.
3. Record architectural changes as an ADR before implementation.
4. Update documentation in the same change as the behavior it describes.
5. Update `docs/STATUS.md` after every completed project task.
6. Add user-visible changes to `CHANGELOG.md`.

## Architecture constraints after approval

- Use a modular monolith, not microservices.
- Domain logic must not import React, browser APIs, IndexedDB, Supabase, or framework modules.
- UI components must not call Supabase directly.
- Attempts are append-only events with client-generated UUIDs.
- The product is an online-only responsive website; Supabase is the authoritative account store.
- Do not add PWA installation, service workers, offline learning, IndexedDB primary storage, sync outboxes, or offline conflict merging.
- Browser storage is limited to a short-lived current-answer recovery buffer and 24-hour guest state as specified in ADR-013.
- Public guest play and open self-service registration are required; long-term progress requires a verified account.
- Runtime AI, hosted speech recognition, external transcription, and runtime content generation are prohibited in the MVP.
- Future Gemini BYOK work is governed by ADR-014 and requires a separate explicit implementation approval.
- Automated feedback and personalization must follow the deterministic, versioned contract in `docs/ALGORITHMIC-FEEDBACK.md`.
- Hosted/browser speech recognition is outside the approved product scope.
- User audio remains local by default.
- Content packs are immutable, versioned, schema-validated artifacts.
- Narrative packs are immutable, versioned and schema-validated; runtime story generation or copy rewriting is prohibited.
- Hinted attempts, pronunciation recordings/self-review and open Writing submissions do not update mastery.
- Core MVP Speaking scope is pronunciation only; fluency/Part 2/Part 3 are deferred.
- Public practice content and the private assessment bank must remain separated according to ADR-015.

## Safety and repository rules

- Never commit secrets, `.env` values, access tokens, or production credentials.
- Never point Preview or tests at Production data.
- Never rewrite or delete user data without an explicit migration and recovery plan.
- Never modify accepted ADR history; create a superseding ADR.
- Preserve user changes unrelated to the active task.
- Use migrations for database changes; do not make undocumented dashboard-only schema changes.

## Required checks after implementation begins

- Type checking.
- Relevant unit tests.
- Content-schema validation.
- Relevant end-to-end tests.
- Secret scan or equivalent repository check.
- Documentation and status update.
- Mobile viewport review for user-facing changes.
- Online interruption, idempotent retry, guest expiry, and server recovery review for changes affecting persistence.

## Completion report

Every completed implementation task must report what changed, which acceptance criteria were met, which checks ran, migration or compatibility impact, and remaining risks.

For `VS-01`–`VS-09`, the completion report must also name the proposed next step and request explicit user approval. Do not infer that approval from an earlier phase approval or from unrelated use of “continue.”
