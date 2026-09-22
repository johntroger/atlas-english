# Backlog

> **Status:** DRAFT  
> No implementation item may start until `PLAN.md` carries an explicit approval scope. The first permitted state is `APPROVED — VERTICAL SLICE ONLY`, which opens only I-001/I-002 work required by `VERTICAL-SLICE.md`.

## Definition of Ready

A task needs a clear outcome, acceptance criteria, affected modules, data impact, online/interruption behavior, error states, security/privacy impact, test plan, and recovery notes.

## Planning backlog — allowed before approval

### P-001 Resolve product and technology decisions — completed historically; access/storage items superseded by P-016

- [x] Confirm Supabase in MVP.
- [x] Confirm MVP-A local learning slice and MVP-B cloud continuity; no MVP-C AI stage.
- [x] Confirm IndexedDB as local store.
- [x] Confirm allow-listed email magic-link authentication; no guest mode in beta.
- [x] Confirm Chrome/Edge desktop, Chrome Android, and Safari iPhone browser matrix.
- [x] Confirm local-only audio analysis with no AI, transcription, or acoustic provider.
- [x] Confirm non-production Development/Preview and isolated Beta/Production projects.
- [x] Confirm 12–15 nodes and approximately 100–180 core items for the first beta content set.
- [x] Confirm visual direction: Atlas 6.5.
- [x] Confirm durable product name: Atlas English and current campaign: Route to 6.5.
- [x] Confirm external-only IELTS band evidence and individualized readiness goals.
- [x] Confirm no fixed exam deadline; a booked exam date is optional and only activates the Exam Readiness phase.

### P-002 Accept architecture decisions — supersession review updated by ADR-013/014/015

- [x] Review superseded ADR chain through ADR-015.
- [x] Accept ADR-001, ADR-002, ADR-003, ADR-005, ADR-006, ADR-008, ADR-009, ADR-011, and ADR-012.
- [x] Record final alternatives in PLAN 2.0 and ADR-013/014/015.

### P-003 Finalize learning algorithms

- [x] Define and owner-approve mastery formula v0.1, including mode/difficulty/spacing factors and +12/-15 per-attempt bounds.
- [x] Verify mastery formula v0.1 arithmetically and record the eight owner-approved golden vectors; executable tests remain an implementation task.
- [x] Define and owner-approve adaptive review intervals: failure 1d, guided 2d, independent 4/7d, mastered 7/14/30d, post-rescue half interval with 2d minimum.
- [ ] Define Diagnostic scoring and confidence.
- [ ] Approve optional five-minute Diagnostic modules and skip-with-external-score rules.
- [x] Decide that every hinted answer is practice-only and leaves mastery unchanged; golden tests remain required.
- [x] Approve initial score/null-state and conservative confidence caps: Diagnostic 0.45, missing production/transfer 0.69, stale 30-day 0.69 and stale 60-day 0.49.
- [x] Approve `null` before evidence and internal `current=20` on the first eligible non-Diagnostic attempt; UI shows `Cần thêm bằng chứng`, not a numeric score.
- [x] Approve the full eight-case mastery/eligibility golden set with exact expected outputs.
- [x] Approve the slice mastery completion boundary: score >=85 plus three learning dates, two formats and one independent review/transfer success.
- [x] Check candidate algorithm v0.1 arithmetic against the approved golden vectors; empirical learning calibration remains a post-evidence activity.
- [x] Define and owner-approve the assessment/evidence contract for Vertical Slice only, including exact golden evidence; later modules require separate approval.
- [ ] Approve phase-aware Daily Quest allocation, deterministic seed, tie-break, and explanation-code catalog.

### P-004 Finalize content contracts

- [ ] Review exercise schema.
- [ ] Review content-pack schema.
- [ ] Specify a golden content pack.
- [x] Define and owner-approve controlled text normalization: Unicode NFC, whitespace normalization, objective-aware case/punctuation, explicit variants only and no fuzzy/autocorrect mastery matching.

### P-005 Complete UX specification

- [x] Define visual direction, palette, typography, layout, game feel, and interface voice.
- [x] Approve low-fidelity responsive wireframes/state maps as the only separate pre-code UX artifact; the coded Owner Alpha is the first interactive prototype.
- [x] Select repository-native Markdown (`WIREFRAMES.md`) with text layout diagrams and Mermaid state maps as the wireframe format.
- [x] Approve sequential wireframe authoring/review in flow order, starting with Landing and clearing P0/P1 before advancing.
- [x] Produce mobile and desktop wireframes for Landing, Question, Feedback, Checkpoint/safe stop and Sign-in/guest import.
- [x] Exercise states for the five pre-code flows.
- [x] Online interruption, retry, guest-expiry and server-error states for the five pre-code flows.
- [ ] Pronunciation fallback.
- [x] Accessibility acceptance criteria for the five pre-code flows.
- [x] Remove the separate clickable/high-fidelity prototype requirement for the Vertical Slice pre-code gate.
- [x] Verify token contrast pairings and specify reduced-motion behavior; browser rendering remains an implementation check.
- [x] Review map/list parity, pause/resume, and feedback context in the wireframe artifact.
- [x] Record a five-flow Codex heuristic walkthrough on the wireframes; interactive owner walkthrough occurs in coded Owner Alpha.
- [x] Map the five core journeys and their critical states before broad screen production.
- [ ] Verify that Today shows at most three primary missions and uses one consistent navigation language.
- [ ] Provide quick and detailed External Practice Log entry modes.
- [ ] Prototype separate mastery, practice-status, and external-evidence sections.
- [ ] Prototype Writing disclaimer, personal dictionary, ignore flow, and no-total-score state.
- [ ] Prototype pronunciation A/B playback, three-item self-review, and retry target.

### P-006 Finalize implementation contracts

- [ ] Approve measurable quality and performance budgets.
- [ ] Approve repository structure and dependency rules.
- [x] Draft the vertical-slice physical ERD and typed column dictionary; review/approval remains required.
- [x] Draft the vertical-slice RLS matrix and allow/deny cases; executable tests remain required.
- [x] Draft identity, attempt, story, import and release state machines; review/error taxonomy remains required.
- [ ] Complete online submission, guest import and Writing takeover sequence diagrams.

### P-007 Finalize curriculum and content quality

- [ ] Review every P0 node in the curriculum matrix.
- [ ] Resolve prerequisite and coverage gaps.
- [ ] Approve content quantity gates.
- [ ] Approve the audio pipeline and provenance rules.
- [ ] Add a golden valid pack and invalid validator fixtures.
- [ ] Add semantic validator cases for prerequisite cycles, broken references, answer ambiguity, and coverage gaps.
- [ ] Approve the IELTS Performance Layer and external assessment protocol.
- [ ] Complete and record the initial baseline.
- [ ] Approve external readiness thresholds for recommending exam registration.
- [x] Select three vertical-slice nodes: `grammar.sentence.boundaries`, `grammar.nouns.countability`, and `vocabulary.cause_effect`; later select 12–15 Beta MVP nodes from evidence.
- [ ] Provide 8–12 reviewed core exercises across at least two interaction formats for every selected node.
- [x] Approve the slice quantity blueprint: 30 items total, 10 per node, with a 6 mastery / 2 hinted-practice / 2 independent-review allocation and about 12 items in the first story run.
- [x] Defer Speaking fluency/Part 2/Part 3 and speaking extension beyond core MVP; later review Listening/Reading performance nodes.
- [x] Assign and owner-review `hybrid` mode with separate mastery/practice channels for all three selected slice nodes.

### P-008 Finalize operations and beta

- [ ] Approve operational indicators, manual monitoring cadence, backup recovery target and quota fallback; provider quota email/rate limits/emergency switches are mandatory before public beta.
- [x] Approve metadata-only account-linked analytics with 90-day retention and prohibited-payload rules.
- [ ] Resolve the age/consent privacy/legal release blocker or restrict the audience.
- [ ] Approve threat model and accessibility checks.
- [ ] Approve the open-beta entry and exit criteria after the age/consent blocker is resolved.
- [ ] Ensure every MVP requirement has traceability evidence.

### P-009 Approve plan

- [ ] Resolve blockers.
- [ ] Review the document set.
- [ ] User explicitly approves vertical-slice implementation only.
- [ ] Change `PLAN.md` status to `APPROVED — VERTICAL SLICE ONLY` without authorizing later phases.

### P-010 Formalize Gemini feedback and pronunciation analysis — superseded

- [x] Select Gemini as the runtime AI provider.
- [x] Limit Speaking AI feedback to pronunciation.
- [x] Define deterministic signal checks, transcript comparison, and optional Gemini layers.
- [x] Keep AI output outside direct mastery and official-band calculation.
- [x] Record ADR-010 and reject ADR-007.
- [x] Define server-only credential, structured-output, fallback, and no-raw-log requirements.
- [x] Close model, quota, AI consent, and AI structured-output work without implementation under ADR-011.
- [x] Add valid and intentionally invalid pronunciation schema fixtures for local, transcript, and Gemini paths.

### P-011 Integrate v0.7 multidisciplinary review findings

**Definition of Ready:** documentation-only outcome; affected sources are PLAN, architecture, AI/schema, UX, acceptance, beta, status, and changelog. No application data, runtime behavior, deployment, database, or recovery operation is changed. Verification requires JSON parsing, internal-link checks, stale-reference checks, and reader-oriented consistency review.

- [x] Separate the technical vertical slice from MVP-A local core.
- [x] Restore the required MVP-B cloud gate before MVP-C Gemini.
- [x] Reconcile content quantity gates around coverage-first 12–15-node selection.
- [x] Add transcript-alignment schema integrity requirements.
- [x] Clarify local-by-default Writing/transcript/feedback lifecycle.
- [x] Define evidence-oriented Progress presentation and prototype checks.
- [x] Update acceptance, beta, traceability, status, and changelog evidence.

### P-012 Integrate v0.8 pre-approval review findings

**Definition of Ready:** documentation/schema-fixture outcome only; no runtime, database, dependency, deployment, or user-data change. Affected sources are PLAN, learning/assessment, beta, AI/ADR, UX/testing/traceability, status, changelog, and pronunciation fixtures. Verification requires JSON parsing, schema-fixture inventory, internal-link checks, stale-reference checks, and stage-consistency review.

- [x] Add stage-specific approval control without changing the global DRAFT gate.
- [x] Categorize blockers by technical slice, MVP-A, MVP-B, MVP-C1, MVP-C2, and release.
- [x] Let external baseline shorten the in-game Diagnostic without granting mastery.
- [x] Separate two-week product beta from four-to-eight-week learning validation.
- [x] Propose MVP-C1 Writing before MVP-C2 pronunciation.
- [x] Add pronunciation schema valid/invalid fixtures.
- [x] Add exact exam date, golden pack, prototype, and learning-evidence decision gates. The exact-date gate was later superseded by the readiness-based policy.

### P-013 Replace runtime AI with deterministic algorithms

**Definition of Ready:** explicit learner decision to use no runtime AI; documentation/schema-only outcome; no application code, dependency, database, deployment, or user-data change. Affected sources are PLAN, architecture, product, algorithmic feedback, audio/UX, security/operations, testing/acceptance, ADRs, schema fixtures, traceability, status, and changelog. Verification requires JSON parsing, local-schema fixture outcomes, internal-link checks, no-current-Gemini-reference checks, and stage consistency.

- [x] Accept ADR-011 and supersede Proposed ADR-010.
- [x] Remove MVP-C1/C2 and all runtime-AI provider requirements from the active plan.
- [x] Define deterministic answer, error, mastery, scheduling, quest, Writing-mechanics, and pronunciation-signal boundaries.
- [x] Prohibit hosted speech recognition, transcription, acoustic scoring, and runtime content generation.
- [x] Replace pronunciation schema and fixtures with local-signal/self-review version 2.
- [x] Update UX, privacy, testing, operations, traceability, status, and changelog requirements.

### P-014 Integrate v1.0 multidisciplinary review findings

**Definition of Ready:** documentation/schema-fixture outcome only; no application code, dependency, database, deployment, or user-data change. Affected sources are PLAN, curriculum/schema, learning/algorithm, data contracts, UX/visual/product, acceptance/testing/traceability, backlog, status, and changelog. Verification requires JSON parsing, learning-node fixture outcomes, pronunciation fixture outcomes, internal-link checks, conflict-marker checks, and plan/status consistency.

- [x] Add assessment modes and progress channels to the learning-node contract.
- [x] Separate mastery, practice status, and external evidence in learning and data specifications.
- [x] Make Daily Quest phase-aware, reproducible from a stored seed, and explainable through reason codes.
- [x] Add Writing personal dictionary, ignore flow, disclaimer, and no-total-score requirement.
- [x] Simplify pronunciation to A/B playback, three-item self-review, and one retry target.
- [x] Add acceptance, testing, traceability, blocker, and schema-fixture coverage.

### P-015 Convert Atlas English to an invite-only multi-user product

**Definition of Ready:** explicit owner decisions recorded through sequential review; documentation/schema-only outcome; no application code, dependencies, database, deployment, or user data. Affected sources are PLAN, product/architecture, ADRs, schemas/data, security/analytics, UX, beta/acceptance/testing, repository/content/audio, traceability, status, and changelog. Verification requires JSON parsing, schema-fixture results, stale single-user/guest checks, local-link checks, and plan/status consistency.

- [x] Replace the single-learner product assumption with a 10–30-account invite-only beta cohort.
- [x] Accept allow-listed magic-link auth, Supabase sync, IndexedDB offline storage, two environment groups, and staged delivery.
- [x] Record Atlas English naming, public repository, MIT code, CC BY-NC-SA content, contribution, and audio-provenance decisions.
- [x] Record metadata-only account-linked analytics, 90-day retention, minimal admin, audited support access, data export/deletion, and daily-backup decisions.
- [x] Separate technical test, academic review, invite-only learning beta, and learning validation.
- [x] Add ADR-012 and accept the architecture ADRs explicitly selected by the owner.
- [x] Fix external/mastery channel, review-schedule key, Performance skill, schema-version, and exercise-level evidence-eligibility contracts.
- [x] Record the owner's age/consent choices as an unresolved privacy/legal release blocker.

### P-016 Consolidate final public online-product decisions

**Definition of Ready:** the owner completed the sequential decision review and explicitly asked to resume the interrupted plan update; documentation/schema/ADR-only scope; no application code, dependencies, database or deployment. Affected sources include PLAN, active product/architecture/data/UX/security/content/testing/operations specifications, ADR index, schemas, backlog, status and changelog. Verification requires JSON parsing, local-link/conflict checks, supersession consistency and stale active-decision scans.

- [x] Replace offline-first/PWA/local-primary assumptions with online-only/server-authoritative continuity.
- [x] Replace invite-only/allowlist/10–30 cohort with public guest play and open registration.
- [x] Define guest expiry/import, pending verification, auth abuse controls and quota signup pause.
- [x] Preserve deterministic MVP while recording deferred Gemini BYOK constraints in ADR-014.
- [x] Separate public practice content from the private assessment bank in ADR-015.
- [x] Add microlearning, evidence/claim, lifecycle, privacy, operational and legal blocker decisions.
- [x] Update active documentation and progress-export schema without changing application state.

### P-017 Define the IELTS-aligned narrative system

**Definition of Ready:** owner approved the grounded real-world direction with light mystery; documentation/content-design only; no application code, dependency, database or deployment. Affected sources are the narrative bible, PLAN, PRODUCT, VISUAL-DIRECTION, README, status and changelog. Verification requires link/conflict checks and review against microlearning, IELTS-claim, accessibility and no-runtime-generation constraints.

- [x] Define The Atlas Initiative, Navigator role, Ato and the recurring cast.
- [x] Define the Missing Context mystery and a non-villain resolution tied to evidence and clarity.
- [x] Outline Prologue and six IELTS-topic seasons, including detailed Season 1 episodes.
- [x] Define the 3–5-minute mission formula, five-question checkpoint limit and skip/recap behavior.
- [x] Define the story-to-learning contract and IELTS vocabulary gate.
- [x] Define choice, failure, reward, guest/account, accessibility and authoring boundaries.
- [x] Limit MVP narrative scope to Prologue, Season 1 and one preview mission; P-018 later refined it into an independent Expedition preview.
- [x] Add a complete sample mission and prototype validation questions.

### P-018 Make the narrative sustainably extensible

**Definition of Ready:** owner requested a story architecture that can grow after the first ending while retaining IELTS focus; documentation/content-design only; no application code, dependency, database or deployment. Verification requires link/conflict checks, narrative-boundary checks and an independent reader review.

- [x] Group the existing six seasons into Campaign 1 with a real ending.
- [x] Define role progression and Campaign 2–5 thematic/learning frames.
- [x] Define Field Cases, Atlas Dispatch, Expeditions, Character Cases and Personal Route.
- [x] Define non-FOMO editorial cadence and prohibit promises before reviewed content exists.
- [x] Define the immutable Narrative Pack contract and compatibility/rollback behavior.
- [x] Require World, Character, Timeline, Evidence and Topic/Language ledgers.
- [x] Add anti-padding rules and separate MVP scope from post-beta authoring.
- [x] Resolve preview naming, add evergreen fallback/replay states, reproducibility snapshots and a pre-registered post-beta go/no-go rubric.

### P-019 Apply the multidisciplinary pre-code review

**Definition of Ready:** owner explicitly requested all review recommendations be reflected in project files; documentation/schema/ADR-only scope; no application code, dependency, database, deployment or user data. Verification requires JSON parsing, Narrative Pack fixture expectations, link/conflict checks and an independent scope/contract review.

- [x] Revise PLAN to v2.1 and limit first approval to a vertical slice.
- [x] Add `VERTICAL-SLICE.md`, `LEARNING-CONTRACT.md`, `PRE-CODE-CHECKLIST.md` and `PROTOTYPE-PLAN.md`.
- [x] Resolve hint, pronunciation recording, open Writing and Speaking-scope contradictions.
- [x] Defer calibrated LR/private assessment production until after core-learning validation.
- [x] Add Narrative Pack schema plus valid and too-many-slots invalid fixtures.
- [x] Define shared evaluator/server-authority boundary.
- [x] Add slice physical table/index/RLS contract and identity/attempt/story/import/release state machines.
- [x] Require minimum provider quota controls before public beta.
- [x] Record the decisions in ADR-016 and update traceability, agents, status and changelog.

### P-020 Close Public Vertical Slice release-control decisions

**Definition of Ready:** the owner chose a publicly reachable Preview and requested sequential A/B/C decisions before coding; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires source-of-truth, link and contradiction checks.

- [x] Define abuse limits, payload limits, quota thresholds and layered kill switches.
- [x] Select daily encrypted off-site logical backups, Cloudflare R2, `age` encryption and protected-branch GitHub Actions.
- [x] Approve isolated restore-drill cadence.
- [x] Draft the two-layer Public Preview privacy notice.
- [x] Select a dedicated project mailbox for privacy/support without exposing the owner's personal email.
- [x] Select the owner's real name as the public data-operator identity until a legal entity supersedes it.
- [x] Limit the intended initial audience to adult residents of Vietnam without location collection, geoblocking or international promotion.
- [x] Specify two unchecked signup confirmations, versioned consent evidence and guest fallback; draft the Terms source document.
- [x] Select Vietnamese law and non-exclusive online negotiation as the dispute direction; prohibit mandatory arbitration in the Vertical Slice terms.
- [x] Define material-policy reacceptance, refusal-limited account behavior and non-material version-history handling.
- [x] Set a seven-calendar-day planned-policy notice period and a documented security/legal emergency exception.
- [x] Define immutable date-based policy identifiers and announcement/effective timestamp handling.
- [x] Select Vietnamese as the only authoritative policy language for the Vertical Slice and prohibit unreviewed translations.
- [x] Define the qualified-human, independent, 100%-of-items academic review gate for the 30-item Vertical Slice.
- [x] Extend that review to every learner-facing English story string while separating Product Owner narrative and accessibility approvals.
- [x] Defer specialist academic review until the pre-public-release gate while allowing clearly labelled Codex-pre-reviewed drafts for planning, implementation and internal testing.
- [x] Replace the proposed 3–5-person pre-code usability test with owner-only Alpha dogfooding, a structured Codex fix/retest loop and an explicit later expansion decision.
- [x] Select an online phone/desktop Owner Alpha behind hosting protection or a secure server-side fallback; prohibit security by unlisted URL.
- [x] Isolate Owner Alpha in a dedicated Supabase Preview project and define opt-in, narrow, idempotent owner-history transfer instead of database promotion/cloning.
- [x] Start the existing encrypted daily R2 backup design with the first real Owner Alpha progress, using a separate Alpha scope and retaining the pre-public isolated restore gate.
- [x] Define recover-first Owner Alpha breaking-change handling and require per-reset owner confirmation after verified backup and impact preview.
- [x] Define the Owner Alpha P0–P3 feedback model, natural-language intake, evidence record and fix/retest lifecycle.
- [x] Define check-gated Alpha auto-deploy, safe-boundary activation, P0 interruption behavior and separate Public/Production approval.
- [ ] Obtain the exact confirmed operator name and create/test the real project mailbox.
- [ ] Verify provider regions, cross-border disclosures and policy links.
- [x] Specify exact restore commands and evidence template. Evidence: `BACKUP-RESTORE-RUNBOOK.md` and P-033.
- [ ] Resolve the legal/privacy release review gate.

### P-021 Simplify the pre-code UX validation artifact — completed

**Definition of Ready:** the owner selected the recommended lightweight UX path; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires consistent prototype/checklist/backlog/status wording and no remaining Vertical Slice pre-code requirement for a separate clickable prototype.

- [x] Limit pre-code UX production to responsive low-fidelity wireframes and state maps for five core flows.
- [x] Select Landing, Question, Feedback, Checkpoint/safe stop and Sign-in/guest import as those five flows.
- [x] Preserve heuristic, responsive and accessibility review without requiring an external usability cohort.
- [x] Make the coded Owner Alpha the first interactive prototype.
- [x] Keep later Pronunciation and Writing prototype studies outside the Vertical Slice pre-code gate.

### P-022 Select the wireframe source format — completed

**Definition of Ready:** the owner selected option A, repository-native Markdown; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires one indexed artifact, clear completion rules and no dependency on an external design platform or binary export.

- [x] Use `docs/WIREFRAMES.md` as the only wireframe artifact source.
- [x] Use text diagrams for screen hierarchy and Mermaid for transitions/state maps.
- [x] Keep phone/desktop responsive notes, accessibility notes and heuristic findings in the same artifact.
- [x] Create the artifact skeleton without marking any of the five wireframes complete.

### P-023 Select the wireframe review sequence — completed

**Definition of Ready:** the owner selected option A, sequential authoring and review; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires an explicit order, a per-wireframe quality gate and no false claim that a wireframe itself is complete.

- [x] Use the order Landing → Question → Feedback → Checkpoint/safe stop → Sign-in/guest import.
- [x] Require phone/desktop, state and accessibility evidence for each wireframe before review.
- [x] Clear P0/P1 findings with recorded Codex rationale before opening the next wireframe; ask the owner only for material scope/cost/legal/data/claim decisions.
- [x] Mark Landing as the active design decision while all five wireframes remain incomplete.

### P-024 Multidisciplinary standards and contradiction review — completed

**Definition of Ready:** the owner requested an autonomous expert review across game design, IELTS, architecture and UI/UX; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires primary/official standards where available, contradiction scans, local-link/JSON checks and an explicit remaining-risk report.

- [x] Add a versioned standards/evidence baseline for IELTS, learning science, game ethics, WCAG, Core Web Vitals, OWASP ASVS and Supabase RLS.
- [x] Resolve stale age-policy, formula-status, analytics, restore-cadence and Ato/mascot contradictions.
- [x] Move legal/operator/provider completion from pre-code P0 to the pre-public-release gate without weakening that gate.
- [x] Add construct/corpus/fairness/cognitive-load content-quality controls and transfer-ladder guidance.
- [x] Add RLS grant/view, ASVS, CI pinning, SBOM and architecture-fitness requirements.
- [x] Replace routine owner approvals with Codex sign-off while preserving user authority over material decisions.
- [x] Publish the objective review and remaining P0 list in `PRE-CODE-REVIEW-2026-09-21.md`.

### P-025 Complete WF-01 Landing wireframe — completed

**Definition of Ready:** P-023 fixed Landing as the first wireframe; product, privacy, visual and accessibility sources exist; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires phone/desktop evidence, state and accessibility contracts, recorded heuristic findings and no unresolved P0/P1.

- [x] Use an IELTS-value-first promise without band, mock-test or guaranteed-outcome claims.
- [x] Keep Guest Quick Start primary and Sign-in secondary.
- [x] Show the short privacy notice before creating guest state.
- [x] Cover phone/desktop, optional-asset loading, signup pause, network failure and maintenance states.
- [x] Specify focus order, language semantics, 44 px targets, zoom/reflow and reduced-motion behavior.
- [x] Resolve all WF-01 P0/P1 findings and open WF-02 as the next wireframe.

### P-026 Complete WF-02 Question wireframe — completed

**Definition of Ready:** WF-01 is closed and P-023 fixes Question as the next flow; learning eligibility, recovery, visual and accessibility contracts exist; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires representative phone/desktop hierarchy, all critical attempt states, format-independent accessibility and no unresolved P0/P1.

- [x] Keep one short IELTS-aligned task and one primary action on screen.
- [x] Make the hint consequence explicit before irreversibly changing the attempt to practice-only.
- [x] Separate skip, submit, acknowledged feedback and technical-failure transitions.
- [x] Preserve the current answer for recoverable interruption and require idempotent retry without wrong evidence.
- [x] Cover choice, text and reorder accessibility without drag-, hover-, gesture- or color-only interaction.
- [x] Keep narrative context optional, bounded and subordinate to the English-learning prompt.
- [x] Resolve all WF-02 P0/P1 findings and open WF-03 as the next wireframe.

### P-027 Complete WF-03 Feedback wireframe — completed

**Definition of Ready:** WF-02 is closed and P-023 fixes Feedback as the next flow; deterministic feedback, authoring, learning and accessibility contracts exist; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires correct/incorrect/partial/practice-only treatments, question-context preservation, acknowledged-attempt recovery and no unresolved P0/P1.

- [x] Use result → relevant answer → one-sentence explanation → optional detail → next action hierarchy.
- [x] Render only reviewed deterministic feedback; do not infer or generate learner-facing explanations at runtime.
- [x] Distinguish correct, incorrect, partial, practice-only and non-evidentiary results without color-only meaning.
- [x] Preserve submitted question context and make acknowledged attempts read-only.
- [x] Keep feedback snapshot/projection retries separate from attempt submission.
- [x] Avoid band, mastery, XP, punitive-sound and continuous-celebration claims.
- [x] Resolve all WF-03 P0/P1 findings and open WF-04 as the next wireframe.

### P-028 Complete WF-04 Checkpoint/safe-stop wireframe — completed

**Definition of Ready:** WF-03 is closed and P-023 fixes Checkpoint/safe stop as the next flow; narrative, guest, reward, recovery and accessibility contracts exist; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires interim/final/replay variants, a real safe stop, contextual optional sign-in, idempotent grants and no unresolved P0/P1.

- [x] Present one story result and one useful learning takeaway after at most five questions.
- [x] Make continue and safe stop explicit without guilt, expiry pressure or hidden controls.
- [x] Keep the first guest sign-in invitation contextual, optional and separate from import consent.
- [x] Distinguish interim, first completion and replay without duplicate reward/story grants.
- [x] Preserve acknowledged attempts through summary, next-route and update failures.
- [x] Provide text/list parity for contour-map progress and accessible reward announcements.
- [x] Resolve all WF-04 P0/P1 findings and open WF-05 as the final wireframe.

### P-029 Complete WF-05 and accept the five-flow wireframe set — completed

**Definition of Ready:** WF-04 is closed and P-023 fixes Sign-in/guest import as the final flow; auth, privacy, security, import, recovery and accessibility contracts exist; documentation-only scope; no application code, dependency, database, deployment or user data. Verification requires account/create separation, generic auth responses, explicit versioned confirmations, previewed idempotent import, final cross-flow review and no unresolved P0/P1.

- [x] Keep existing-account sign-in separate from new-account eligibility/Terms/Privacy confirmation.
- [x] Preserve guest/checkpoint state and provide a guest exit throughout auth, quota and error states.
- [x] Use one-use 24-hour link/code states, five-failure invalidation, generic responses and safe rate-limit recovery.
- [x] Require server preview plus a separate import action; exclude partial, expired and incompatible guest data.
- [x] Make import transactional/idempotent with receipt, rollback and projection rebuild.
- [x] Complete responsive/accessibility/state evidence and resolve all WF-05 P0/P1 findings.
- [x] Run the cross-flow heuristic/consistency review, add measured contrast constraints and accept the five-flow pre-code artifact.

The historical 24-hour challenge choice above was corrected by P-034: the pending account remains 24 hours, while each one-use magic-link/code challenge lasts 60 minutes.

### P-030 Post-wireframe multidisciplinary readiness review — completed

**Definition of Ready:** all five pre-code wireframes are accepted; the request is a documentation-only review across game design, IELTS learning, architecture and UI/UX; no application code, dependency, database, deployment or user data. Verification requires an evidence-based scorecard, exact unresolved P0 count, no scope inflation and an ordered closure plan.

- [x] Re-score design maturity separately from implementation/evidence readiness.
- [x] Confirm that the stack, modular-monolith boundary and Vertical Slice scope do not need expansion.
- [x] Identify exactly nine unresolved P0 items: four content/narrative and five data/security/operations.
- [x] Bind every slice mission to one observable dossier change caused by its IELTS objective.
- [x] Define a 12-item first-run proof pack as a subset of—not an addition to—the approved 30-item blueprint.
- [x] Convert the remaining work into P-031 through P-033 without changing PLAN approval state.

### P-031 Build the Vertical Slice content-contract proof pack — completed

**Definition of Ready:** P-030 is complete; the three nodes, 30-item blueprint, learning contract, narrative case and schema drafts are authoritative. Scope is content/schema/fixture documentation only.

- [x] Author and Codex-pre-review the 12 first-run items across the three missions.
- [x] Complete provisional Prologue/three-mission learner-facing copy within copy budgets.
- [x] Create valid and invalid schema/evaluator/semantic fixtures required by `CONTENT-SYSTEM.md`.
- [x] Record provenance, license, immutable hashes and rollback target.
- [x] Run semantic checks and update the P0 checklist only from recorded evidence.

### P-032 Close the data trust-boundary review — completed

**Definition of Ready:** P-030 is complete and the accepted database, security, state/recovery and learning contracts are available. Scope is specification/review only; no database may be created.

- [x] Review typed tables, constraints, indexes and migration order.
- [x] Review the RLS allow/deny matrix and specify grants/views/functions tests per operation and role.
- [x] Approve guest/account/attempt/story state and recovery transitions.
- [x] Approve server scoring authority, acknowledgement and same-key idempotent retry sequence.
- [x] Record resolved trust-boundary findings; no superseding ADR is required because the review tightens existing accepted boundaries without changing stack or architecture style.

### P-033 Close recovery evidence and final pre-code audit — completed

**Definition of Ready:** P-031 and P-032 are complete. Scope is secret-safe operational documentation and final consistency review; no live environment, backup object or deployment is created.

- [x] Write exact backup and isolated-restore command templates with pinned versions and placeholders.
- [x] Define integrity/verification queries, timing fields, failure handling and an evidence template.
- [x] Run the final active-document contradiction, link, schema-fixture and traceability review.
- [x] Confirm that all nine P0 items have objective evidence and no later release gate was incorrectly pulled forward.
- [x] Present unresolved material risks in `P033-FINAL-PRE-CODE-AUDIT.md`; do not change PLAN without explicit approval.

### P-034 Final consistency corrections before implementation approval — completed

**Definition of Ready:** P-033 is complete and the owner requested another whole-project pre-code review. Scope is documentation consistency only; no application code, dependency, database, environment or deployment is created. Verification requires correction of every active-source contradiction found, a recorded implementation order and rerun of the planning checks.

- [x] Separate the 60-minute one-use verification challenge from the 24-hour pending-account lifetime and align auth states, copy, limits and tests.
- [x] Reserve `sessionStorage` for the 30-minute current answer and specify TTL-enforced minimal `localStorage` for 24-hour guest state.
- [x] Align open Writing as practice-only; only deterministic controlled mechanics may create mastery for the appropriate node.
- [x] Distinguish Public Vertical Slice functional aggregates from a prohibited analytics-event pipeline and mark unavailable/undersized measures honestly.
- [x] Clarify that golden vectors are approved at specification level while executable golden tests remain post-approval work.
- [x] Record the risk-ordered implementation sequence without expanding Vertical Slice scope.
- [x] Correct the P-020 restore checkbox and append a transparent correction to the P-033 audit rather than rewriting its historical result.
- [x] Rerun JSON/schema/semantic/link/conflict/stale-contract checks and keep PLAN in DRAFT.

### P-035 Adopt sequential code-test-report-approve gates — completed

**Definition of Ready:** the owner explicitly required stepwise implementation with mandatory testing, a summarized report and owner approval before every next step. Scope is governance documentation only; implementation remains blocked while PLAN is DRAFT.

- [x] Name the nine Vertical Slice implementation steps `VS-01`–`VS-09` without changing their technical scope.
- [x] Make initial Vertical Slice approval open only `VS-01`.
- [x] Require scope/acceptance/test plan before each step and completed checks before closure.
- [x] Keep failed or incomplete work inside the current step until fixed and retested.
- [x] Require a completion report and explicit owner approval for the named next step.
- [x] Prohibit parallel, anticipatory or bundled implementation across unopened steps.
- [x] Add the enforcement rule to project instructions and keep PLAN in DRAFT.

## Implementation backlog — step-gated; VS-05 complete; VS-06 awaits approval

### I-001 Project foundation — VS-01 complete

Begins only as `VS-01` after initial approval. Reproducible Next.js/TypeScript modular monolith foundation, lockfile, validation commands and repository safeguards; later adapters/environments remain in their named VS step.

### I-001A Pure learning evaluator — VS-02 complete

Implement only the framework-independent evaluator and executable Learning Contract v0.1 golden tests: deterministic closed-answer scoring, mastery eligibility, versioned mastery updates and pure replay/conflict classification. Schema/content validation, UI, persistence and server transactions remain deferred to their named later steps.

### I-001B Content contract validator — VS-03 complete

Executable Draft 2020-12 schema validation and deterministic semantic/cross-reference checks for the P-031 Content Packs, Narrative Pack, selected learning nodes and exercise contracts. Natural-language ambiguity is explicitly routed to manual review. UI/gameplay, persistence and server transactions remain deferred to their named later steps.

### I-001C Temporary four-item mission — VS-04 complete

One local-only mission now renders a Vietnamese interface with four short English exercises: single choice, reorder, and two controlled text corrections. It uses the VS-02 pure evaluator, explicit hinted-attempt practice-only feedback, keyboard-accessible hint confirmation, responsive layouts, and no storage/network/database behavior. Three-mission content, checkpoint/reward, persistence, authentication and deployment remain deferred to their named later steps.

### I-001D Three-mission first-run episode — VS-05 complete

The local-only episode now has three four-item missions covering sentence boundaries, countability/quantifier scope and cautious cause/effect language. A deterministic 30-item selection contract records 10 item slots per selected node (6 core, 2 hinted-practice, 2 independent-review); exactly the 12 proof-pack items are first-run. It has no checkpoint/reward, persistence, server acknowledgement, authentication or deployment behavior.

### I-002 Online vertical slice

Implement only `VERTICAL-SLICE.md`: Guest Quick Start → Prologue/mini-episode 3 mission → the three selected Grammar/Vocabulary nodes/30-item blueprint → deterministic server-verified feedback → checkpoint/review → optional sign-in/import/history. Draft/Codex-pre-reviewed content may support implementation and owner-restricted Alpha; every non-owner Public Preview remains blocked until human academic approval.

### I-003 Identity and account lifecycle

Open magic-link/code registration, pending expiry, rate limits, RLS, session/reauth, export, reset, deletion and inactivity jobs.

### I-004 Online continuity and Writing recovery

Idempotent attempt retry, 30-minute current-answer buffer, autosave, active-editor lease/takeover and cross-device continuation.

### I-005 Content platform

Versioned public practice packs, private assessment delivery, validation/review, exposure controls, incident invalidation and rollback.

### I-006 Learning modules and deterministic engine

Grammar, vocabulary, spelling, pronunciation and transfer/Writing practice with mastery/review/quest/feedback versions and golden tests.

### I-007 Responsive accessibility readiness

Phone/tablet/desktop browser matrix, WCAG AA, reduced motion, themes, font sizes and no PWA/native-app scope.

### I-008 Technical and academic gates

RLS/security/restore/release rehearsal, academic content review, calibration evidence and legal/privacy release decision.

### I-009 Open beta and learning validation

Public guest/open signup beta, quota/incident controls, followed by a separate 4–8-week or evidence-sufficient learning validation.

### I-010 Deferred AI Coach — not authorized

No implementation work. It may enter the backlog only after explicit phase approval and every ADR-014 gate is satisfied.
