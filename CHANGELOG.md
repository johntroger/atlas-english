# Changelog

- Owner approved `APPROVED — VERTICAL SLICE ONLY` by explicitly requesting the start of VS-01; PLAN 2.2 now opens only the Git/repository/framework/lockfile/baseline-check foundation, while VS-02–VS-09, Supabase, Vercel/deployment and later phases remain blocked.
- Completed P-035 at specification level: converted the Vertical Slice implementation order into nine sequential `VS-01`–`VS-09` gates; every step now requires scoped coding, passing tests, a completion report and explicit owner approval before the named next step, while initial approval opens only `VS-01` and PLAN remains DRAFT.
- Completed P-034 at specification level: corrected the 60-minute auth challenge versus 24-hour pending-account boundary, separated current-answer and guest browser storage, aligned open Writing with practice-only evidence, made Public Slice measurement sources explicit, clarified spec-approved versus executable golden tests and recorded the post-approval implementation order; no code or environment was created and PLAN remains DRAFT.

All notable project changes are recorded here.

## Unreleased

- Completed owner-approved VS-09: added fail-closed Owner Alpha access-gate source code, security headers/CSP, short-lived structured-answer recovery, offline-safe submit behavior, accessibility focus/status improvements and mobile browser review. Deployment and real Alpha-secret configuration remain separately locked.

- Completed owner-approved VS-08: added account-backed checkpoints, a 24-hour signed guest completion marker, a fixed one-time `Context Restored` reward, replay-safe completion and a real safe-stop screen. Two additive Supabase migrations were applied; live guest and account paths were verified, including exactly one reward grant. VS-09 remains locked.
- Completed owner-approved VS-07: added 24-hour guest TTL enforcement, verified passwordless email sessions, separately auditable eligibility/Terms/Privacy/import consent, one-destination idempotent guest import and account history. Preview Supabase migration, email verification and an exactly-one-attempt import receipt were checked live; VS-08 and later work remain locked.
- Completed owner-approved VS-06: added server-authoritative feedback, a signed 24-hour guest binding, append-only Supabase attempts, server-computed SHA-256 request hashes and idempotent retry receipts. A real endpoint test confirmed one persisted row for an acknowledged submission plus a replay. The Vietnamese interface now uses a Windows-friendly system font and safer heading line-height; VS-07 and later work remain locked.
- Completed owner-approved VS-05: expanded the local-only mini-episode to three missions and twelve first-run items, added deterministic choice/multiple-choice/reorder/text flows, and recorded the 30-item selection contract. VS-06 and later work remain locked.
- Completed owner-approved VS-04: added one responsive, local-only four-item mission with deterministic answer feedback, controlled text/reorder/choice interactions, explicit practice-only hint behavior, keyboard-accessible hint confirmation and temporary-progress disclosure. VS-05 and later work remain locked.
- Completed owner-approved VS-03: added executable Draft 2020-12 schema validation, deterministic semantic/cross-reference checks, canonical hash verification, stable findings, explicit manual-review routing for natural-language ambiguity and regression tests for Content Packs, Narrative Packs, learning nodes and exercise contracts. VS-04 and later implementation remain locked.
- Completed VS-02 after explicit owner approval: added a framework-independent deterministic answer evaluator, auditable Learning Contract v0.1 eligibility gates, exact versioned mastery updates, technical/self-review no-op behavior, pure idempotency classification and executable golden/edge tests. VS-03 and later implementation remain blocked.
- Completed VS-01: initialized the local Git repository and minimum Next.js/TypeScript modular-monolith foundation, generated an exact npm lockfile, added immutable-SHA CI plus formatting, lint, architecture-boundary, type, unit, secret and production-build checks, verified desktop/mobile rendering, and published `main` to the public `johntroger/atlas-english` repository. Supabase and Vercel are not connected.
- Fixed the first Windows CI run's CRLF conversion failure by adding repository-level LF normalization and a regression test; a clean clone passes the full check/audit sequence and GitHub Actions CI run 2 succeeds on commit `7c721ab`.
- Completed P-033 at specification level: added the secret-safe encrypted R2 backup and isolated Supabase restore runbook with fail-closed tool pins, environment/target guards, checksums, database/domain verification queries, failure handling and redacted evidence fields; reran all fixture, semantic, link, contradiction and traceability checks; all nine pre-code P0 items now have evidence, while PLAN remains DRAFT pending explicit owner approval.
- Completed P-032 at specification level: added server request hashes for safe idempotency, one-destination guest import, one-reward uniqueness, typed constraints/index/FK and migration order, a per-operation grant/RLS test matrix, authoritative state transitions and a commit-before-acknowledgement scoring sequence; re-verified the security assumptions against official Supabase/PostgreSQL documentation; no database or implementation was created.
- Completed P-031 with a 12-item Codex-pre-reviewed first-run proof pack, provisional Prologue/three-mission Narrative Pack, three selected learning-node fixtures, structured authoring/provenance metadata, canonical hashes, explicit rollback targets and positive/negative schema plus semantic evidence; public use remains blocked pending the full 30 items and independent human review.
- Completed the post-wireframe multidisciplinary readiness review; kept PLAN in DRAFT, identified nine evidence gaps, linked each mission to an observable IELTS-driven story change, defined a 12-item pre-code proof pack and ordered the remaining closure work as P-031 through P-033.
- Completed the responsive WF-01 Landing wireframe with privacy-before-guest creation, failure/maintenance states, accessibility rules and a cleared Codex heuristic review; WF-02 Question is now the active wireframe.
- Completed the responsive WF-02 Question wireframe with practice-only hint warning, separate skip/submit paths, idempotent interruption recovery, multi-format accessibility and a cleared Codex heuristic review; WF-03 Feedback is now active.
- Completed the responsive WF-03 Feedback wireframe with layered deterministic explanations, distinct practice/partial/non-evidentiary states, question-context preservation and safe acknowledged-attempt recovery; WF-04 Checkpoint/safe stop is now active.
- Completed the responsive WF-04 Checkpoint/safe-stop wireframe with real stop/resume behavior, bounded story/learning recap, optional guest sign-in, idempotent final reward and accessible contour progress; WF-05 Sign-in/guest import is now active.
- Completed WF-05 Sign-in/guest import with separate account confirmations, generic passwordless-auth recovery and previewed transactional guest import; accepted the full five-flow pre-code wireframe set and added measured color-contrast constraints.

### Consolidated — 2026-09-20

- Rewrote the active plan as version 2.0 while keeping its status DRAFT and implementation blocked.
- Replaced offline-first/PWA/IndexedDB-primary assumptions with an online-only, Supabase-authoritative responsive website and short-lived answer recovery.
- Replaced invite-only access with public guest play and open self-service registration, including guest expiry/import consent, pending-account expiry, abuse controls and quota signup pause.
- Added ADR-013 to supersede ADR-002, ADR-009 and ADR-012 without rewriting decision history.
- Added ADR-014 for a deferred, separately approved Gemini BYOK text coach; the MVP remains deterministic and contains no runtime AI.
- Added ADR-015 to separate MIT code/CC BY-NC-SA practice content from a private assessment bank.
- Consolidated microlearning, IELTS evidence claims, pronunciation/Writing boundaries, lifecycle, privacy, accessibility, open-beta and operations requirements across active specifications.
- Removed the IndexedDB version from the progress-export schema and deprecated the offline sync-operation planning artifact.
- Recorded the unresolved age/minor-consent/legal-review decision as a Production release blocker.
- Added the Atlas English Narrative Design Bible: The Atlas Initiative, Ato and recurring characters, the `Missing Context` mystery, six IELTS-topic seasons, a detailed Campus Connections arc, bounded mission/story contracts and an MVP narrative scope.
- Extended the Narrative Design Bible to v0.2 with Campaign-based long-term progression, post-ending roles, evergreen Field Cases/Dispatch/Expeditions, immutable Narrative Packs, continuity ledgers and explicit anti-padding/non-FOMO rules.
- Applied the multidisciplinary pre-code review: PLAN 2.1 now permits only a separately approved vertical slice; added learning-evidence, vertical-slice, prototype and pre-code contracts; resolved hint/pronunciation/Writing/Speaking scope conflicts; added ADR-016, Narrative Pack schema/fixtures, server-authority boundaries and a physical slice RLS/state-machine draft.
- Closed the independent reader-review gaps: made approval sequencing non-circular, fixed the first-migration table boundary, added guest idempotency constraints and replay versions, and introduced channel-specific learning-node completion contracts with valid/invalid schema fixtures.
- Recorded owner acceptance of the Vertical Slice scope and exclusions for planning; implementation remains blocked pending the remaining P0 decisions and a separate explicit approval.
- Selected the three Vertical Slice learning nodes: sentence boundaries, noun countability, and cause/effect vocabulary.
- Approved a 30-item Vertical Slice blueprint: 10 items per node with a 6/2/2 mastery, hinted-practice and independent-review split; the first story run uses about 12 items.
- Approved hybrid assessment for all three slice nodes, with independent mastery and practice channels and no combined progress score.
- Adopted a conservative slice mastery-completion contract: score 85+, successful evidence on three dates, two exercise formats and one independent review/transfer success.
- Approved adaptive review intervals: failures return after one day, guided success after two days, independent success after four/seven days and mastered nodes after seven/fourteen/thirty days.
- Selected the versioned weighted-evidence mastery model with null-before-evidence, reduced same-day repetition value and a maximum 15-point loss from one eligible failure; numeric calibration remains pending.
- Approved cautious mastery initialization: untested nodes remain null and the first eligible calculation starts internally from 20 while the UI shows a non-numeric evidence state.
- Approved the complete mastery v0.1 numeric factors and +12/-15 per-attempt bounds, subject to golden-case verification before implementation.
- Approved conservative confidence caps for Diagnostic, missing transfer evidence and 30/60-day evidence staleness without erasing historical mastery.
- Approved deterministic text normalization with Unicode/whitespace cleanup, objective-aware case and punctuation tolerance, explicit variants only, and no fuzzy matching or autocorrection for mastery.
- Approved controlled partial credit: binary single-answer tasks, subset credit only without incorrect selections, and no fuzzy-derived mastery credit.
- Approved one optional non-revealing hint per item, with a clear practice-only warning and later independent variant instead of forced immediate repetition.
- Approved layered per-question feedback: immediate result plus one concise Vietnamese explanation, with rule/example/IELTS detail available on demand.
- Approved and arithmetically verified eight mastery v0.1 golden vectors, including exact initialization, weighted gain, bounded failure, same-day, hint, idempotency and technical-failure outcomes.
- Formally approved the Learning Evidence Contract for the Vertical Slice only; later modules and phases remain outside this approval.
- Locked the three-mission learning map so each mission has one primary objective: sentence boundaries, noun countability, then cause/effect vocabulary.
- Selected the Vertical Slice central case: two conflicting summaries of an online-learning student survey, resolved through the three approved language objectives.
- Defined the case cause as a non-villainous multi-draft merge failure, allowing future pattern-based expansion without manufacturing a recurring culprit.
- Added exactly one convergent Vertical Slice choice that changes dialogue/Notebook state without changing learning access, mastery or reward value.
- Limited the Vertical Slice active cast to Ato and Mira, deferring other character introductions to later episodes.
- Defined the fixed first-completion reward: `Context Restored` Notebook stamp, one map reveal and an independent review, with no currency, randomness, expiry or replay duplication.
- Chose guest-first onboarding: Quick Start is never auth-gated and the first contextual sign-in/import invitation appears only after the initial checkpoint.
- Chose a publicly reachable Vertical Slice Preview URL for an expected initial audience below 10 users, moving basic privacy, rate-limit, quota and kill-switch controls into the slice release gate.
- Limited Public Vertical Slice account registration to 18+ self-declaration without storing date of birth; minor accounts require a later legal/consent decision.
- Limited Vertical Slice telemetry to 30-day essential operational metadata and voluntary qualitative feedback; behavioral analytics and session replay are disabled.
- Approved Public Slice abuse controls for auth, attempt submission, guest import and payload sizes, with answer-preserving non-learning-failure handling on limit hits.
- Approved layered quota/incident degradation: pause signup/email, then import/history, retain guest core only while safe, and enter full maintenance when correctness or data integrity is uncertain.
- Selected quota thresholds of 75% warning, 90% initial degradation and 95% escalation for each database/storage/egress quota, accepting a shorter operational response window.
- Required automated encrypted daily logical backups for Supabase Free, retained outside the public repository/primary project for 30 days and verified through isolated restore tests.
- Selected a separate private S3-compatible bucket as the backup destination class, with pre-upload encryption, separate credentials, no public access and automatic 30-day deletion.
- Selected Cloudflare R2 Standard as the concrete Vertical Slice backup provider, subject to quota/pricing revalidation before implementation.
- Selected asymmetric `age` backup encryption: automation receives only the public recipient key, while the private restore identity stays in a password manager plus an offline recovery copy.
- Selected protected-branch GitHub Actions for daily backups with a least-privilege Supabase dump role, upload-only R2 automation credential and separate manual restore credential.
- Approved isolated restore drills before public release, monthly during the first three public months and quarterly thereafter, with checksum/integrity/timing evidence.
- Drafted a two-layer Public Vertical Slice privacy notice: a concise disclosure before Quick Start and a detailed page covering guest/account data, providers, retention, backups, user choices and the 18+ account boundary.
- Selected a dedicated project mailbox for privacy and support so the owner's personal email is not published; the real address must be created and tested before public release.
- Selected the owner's confirmed real name as the public data-operator identity until a future legal entity formally supersedes that role.
- Limited the intended initial Preview audience to adults residing in Vietnam without collecting precise location, using IP geoblocking or marketing internationally; geographic expansion requires a separate review.
- Required two unchecked signup confirmations for age/residency and Terms acceptance plus Privacy acknowledgement, preserved guest access on refusal, added versioned consent-event detail and drafted the Public Vertical Slice Terms of Use.
- Selected Vietnamese law and online contact/negotiation as the preferred first dispute step while preserving access to mediation, arbitration and competent courts; mandatory arbitration is excluded.
- Defined material-policy changes as email plus next-sign-in reacceptance, with export/delete-only account access on refusal and uninterrupted guest play; non-material edits require version history only.
- Set a minimum seven-calendar-day notice for planned material policy changes and limited immediate changes to documented security or legal emergencies.
- Adopted immutable date-based Terms/Privacy identifiers with separate announcement/effective timestamps, UTC audit storage and Vietnam-local display; published policy text is never overwritten.
- Selected Vietnamese as the sole authoritative Terms/Privacy language for the Vertical Slice; future translations require review, version parity and an explicit precedence statement.
- Required qualified-human independent academic review of all 30 Vertical Slice items, with objective qualification paths and item-level approval bound to immutable content hashes; author/Codex self-approval is prohibited.
- Extended the same qualified review to every learner-facing English string in the Prologue/three missions while keeping Product Owner narrative/tone approval and accessibility review as separate gates.
- Deferred specialist IELTS review from the pre-code gate to the pre-public-release gate; Codex may draft and pre-review clearly labelled provisional content for planning, implementation, fixtures and internal testing.
- Added an explicit `codex_pre_reviewed` schema state so automated or editorial pre-review cannot be confused with human academic approval.
- Replaced the proposed 3–5-person pre-code usability requirement with an owner-only online Alpha, structured issue/fix/retest dogfooding and a separate explicit decision before any other real user receives access.
- Chose online phone/desktop Owner Alpha access behind verified hosting protection or a secure server-side fallback, kept separate from product guest/auth flows; unlisted URLs are not accepted as protection.
- Isolated Owner Alpha in a dedicated Supabase Preview project and prohibited database promotion/cloning; optional owner-history carry-over is narrow, consented, validated, idempotent and rebuilds destination projections.
- Moved encrypted daily R2 backups forward to the first day Owner Alpha stores real progress, with separate Alpha scope and the existing isolated-restore requirement before Public Preview.
- Defined Alpha-only breaking-change resets as a last resort after migration/rebuild assessment, requiring verified backup, exact impact preview and separate owner confirmation for every reset.
- Added an Owner Alpha feedback runbook with P0–P3 severity, natural-language intake, privacy-safe evidence, containment and fix/retest lifecycle.
- Defined check-gated Owner Alpha auto-deploy with safe-boundary activation, P0 kill switches, answer-preserving interruption and last-known-good rollback; Public/Production approval remains separate.
- Simplified pre-code UX work to low-fidelity responsive wireframes/state maps for Landing, Question, Feedback, Checkpoint/safe stop and Sign-in/guest import; removed the separate clickable/high-fidelity prototype gate and made the coded Owner Alpha the first interactive prototype.
- Selected repository-native Markdown as the wireframe format and added an explicitly incomplete `WIREFRAMES.md` skeleton using text screen diagrams, Mermaid state maps and inline responsive/accessibility review evidence.
- Selected sequential wireframe authoring and review in flow order, starting with Landing and requiring each flow's P0/P1 findings to be resolved before advancing.
- Completed a multidisciplinary pre-code standards review; added a versioned standards baseline, fixed age/formula/analytics/restore/Ato contradictions, strengthened IELTS content quality, WCAG, ASVS/RLS and supply-chain controls, and moved legal/operator/provider completion to the pre-public-release gate.

### Added

- Project planning and technical architecture documents.
- Codex operating instructions and approval gate.
- Draft schemas for content packs, exercises, and progress export.
- Draft architecture decision records.
- Implementation-readiness specifications for quality, repository boundaries, database, recovery, curriculum, operations, accessibility, analytics, audio, threats, beta, and traceability.
- Daily game target aligned to 30–45 minutes and content delivery changed to phased gates.
- Selected the Atlas 6.5 visual direction with a contour-map identity, focused exercise layout, meaningful gamification, and responsive/accessibility rules.
- Added an IELTS Performance Layer covering Writing, Speaking, Listening, and Reading skills not captured by foundation mastery alone.
- Added an external assessment framework and a study roadmap to February 2027.
- Proposed staged MVP delivery: local learning-loop validation before Supabase cloud continuity.
- Added candidate mastery, confidence, diagnostic, and review-scheduling rules with new golden-test requirements.
- Strengthened semantic content validation, mobile pause/resume, map/list parity, feedback context, typography checks, and usability evidence.
- Selected Gemini for bounded runtime feedback: detailed Writing support and pronunciation-only Speaking feedback.
- Added local pronunciation signal checks, transcript comparison, evidence levels, explicit audio consent, and provider-independent fallback.
- Added the Gemini ADR, server-only security/cost controls, pronunciation-analysis schema, tests, traceability, and operations requirements.
- Corrected the vertical-slice flow so MVP-A validates the local learning loop before Supabase and Gemini integration.
- Revised the plan to v0.7 and introduced MVP-C for bounded Gemini feedback before an AI-enabled personal beta.
- Replaced the all-P0 Diagnostic with a 25–35 minute Screening and adaptive deep dive.
- Corrected hinted-answer mastery behavior and added explicit null initialization plus recency confidence caps.
- Limited the first content wave to 12–15 baseline-selected P0 nodes with reviewed per-node coverage gates.
- Split broad Listening/Reading performance nodes and promoted Speaking Part 2/3 practice to P0.
- Added separate AI consent, a Writing revision loop, pronunciation calibration, and stricter Gemini schema integrity.
- Simplified Today to three primary missions and focused prototype work on five high-risk mobile journeys.
- Revised the plan to v0.8: separated the technical vertical slice from MVP-A, restored the MVP-B cloud gate before MVP-C, and aligned architecture with the delivery sequence.
- Reconciled content gates around 12–15 baseline-selected nodes and coverage-first beta entry instead of a conflicting fixed item total.
- Added transcript provenance requirements to pronunciation analysis and local-by-default lifecycle recommendations for raw Writing, transcripts, and AI feedback.
- Added plain-language Progress states so internal mastery, transfer, external calibration, and official IELTS evidence remain visually distinct.
- Revised the plan to v0.9 with stage-specific approval and blocker categories while preserving the global DRAFT coding gate.
- Made external baseline evidence shorten targeted Diagnostic confirmation without granting node mastery.
- Separated the two-week product beta from a four-to-eight-week learning-validation period.
- Proposed Gemini MVP-C1 Writing before MVP-C2 pronunciation and revised the Proposed ADR-010 accordingly.
- Added six pronunciation-analysis JSON fixtures covering three valid and three intentionally invalid source/metadata cases.
- Aligned architecture and study timing with the C1/C2 gates, defined the 8–12-item golden Grammar pack, and required an exact exam planning date before phase approval.
- Verified JSON syntax, pronunciation fixture outcomes, local Markdown links, conflict markers, and stale plan references; recorded that Git initialization remains outstanding.
- Revised the plan to v1.0 and accepted ADR-011: the game now uses no Gemini, OpenAI, hosted speech recognition, transcription, or other runtime AI.
- Added the deterministic feedback contract for answer evaluation, mistake classification, mastery, scheduling, Daily Quest selection, Writing mechanics, local pronunciation signals, and self-review.
- Removed MVP-C1/C2 from the active delivery path and made deterministic feedback part of MVP-A.
- Replaced pronunciation schema/fixtures with local-signal and self-review version 2, including explicit rejection of an AI source.
- Updated architecture, product, UX, privacy, security, testing, operations, traceability, backlog, beta, and acceptance requirements for the no-AI design.
- Revised the plan to v1.1 with five assessment modes and separate mastery, practice-status, and external-evidence channels.
- Added phase-aware Daily Quest policies, a reproducible route seed, stable tie-breaking, and learner-facing reason codes.
- Added Writing personal-dictionary/ignore behavior, a required mechanics disclaimer, and a ban on total Writing scores.
- Simplified pronunciation UX to A/B playback, three self-review prompts, and one retry target.
- Extended the learning-node schema for Performance nodes, assessment modes, and progress channels with valid/invalid fixtures.
- Removed the February 2027 deadline and converted the study plan to readiness-based progression; an exam date is now optional until the learner chooses to book.
- Converted Atlas English from a single-reference-learner product to an invite-only multi-user beta for 10–30 Vietnamese IELTS learners.
- Accepted allow-listed magic-link authentication, Supabase cross-device sync, IndexedDB offline storage, isolated non-production/Beta-Production environments, and staged technical-test → academic-review → learning-beta delivery.
- Recorded public repository governance, MIT code licensing, CC BY-NC-SA 4.0 content licensing, community pull-request review, and verified audio-license provenance.
- Added metadata-only account-linked analytics with 90-day retention, minimal administration, learner-requested audited support access, self-service export/deletion, and daily-backup recovery targets.
- Added ADR-012 and accepted the core architecture ADRs explicitly selected by the owner.
- Upgraded learning-node schema to version 3, added exercise-level evidence eligibility, added Performance to exercise/content-pack skills, prohibited external-review mastery, and corrected review-schedule/external-assessment data contracts.
- Recorded the no-age/no-consent/no-legal-review combination as an unresolved privacy/legal release blocker rather than a passed control.

## 0.0.0 — 2026-09-17

- Created the initial product and technical plan.
