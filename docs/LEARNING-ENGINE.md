# Learning engine specification

> **Status:** DRAFT — Vertical Slice mastery/review v0.1 approved; Diagnostic and Daily Quest details remain pending

## Separation of concerns

- Mastery measures demonstrated knowledge.
- Review scheduling determines when knowledge returns.
- Daily Quest chooses session content.
- Gamification rewards behavior but does not alter mastery.
- Writing mechanics, pronunciation heuristics, and self-review do not alter mastery directly; only approved deterministic attempt evidence and later learner performance may do so.

## Assessment modes and progress channels

Every learning node declares exactly one assessment mode:

| Mode | Meaning | May update mastery? |
|---|---|---|
| `auto_scored` | unambiguous closed-answer contract | Yes |
| `controlled_production` | constrained production with approved scoring rules | Yes |
| `self_review_only` | recording, reflection, or open practice without reliable automatic scoring | No |
| `external_review_required` | complete productive performance requiring an identified reviewer or approved external assessment | No; stored as external evidence |
| `hybrid` | contains both scored and practice-only activities | Only the explicitly scored evidence |

Progress is kept in three independent channels:

- **mastery:** derived only from eligible auto-scored or controlled-production attempts;
- **practice status:** completion, frequency, retry target, and self-review without a knowledge claim;
- **external evidence:** timed/mock or human-reviewed results with source, date, conditions, reviewer, and confidence.

A node may display more than one channel, but the values are never merged into one score. Self-review and practice completion may schedule another practice task but cannot raise mastery.

## Learning node

A learning node is the smallest independently tracked objective, for example:

```text
grammar.subject_verb_agreement.collective_nouns
vocabulary.environment.cause_effect_collocations
spelling.listening.plural_endings
pronunciation.final_consonants.t_d
transfer.paraphrase.synonym_in_context
```

Each node defines its skill, level, prerequisites, supported exercise types, IELTS relevance, common errors, and mastery/review configuration.

## Mastery inputs

- Correctness or partial score.
- Exercise difficulty.
- Recognition versus production.
- Hint count.
- Response duration.
- Time since previous exposure.
- Recent success and failure sequence.
- Context variety.

Before these inputs are used, the attempt must be eligible under the node's assessment mode and exercise contract. A score field on an ineligible self-review event is a validation error, not mastery evidence.

## Candidate mastery algorithm v0.1

This is a deterministic candidate for approval and calibration, not a validated scientific score.

Owner approved the v0.1 weighted-evidence factors on 2026-09-20: null before evidence, versioned deterministic updates, the mode/difficulty/spacing factors below, a maximum 12-point gain and a maximum 15-point loss per eligible attempt. Golden-case verification remains mandatory before implementation approval; later calibration requires an algorithm version bump.

For each attempt:

Only an attempt already accepted by [`LEARNING-CONTRACT.md`](LEARNING-CONTRACT.md) enters this formula. In MVP this means `hints_used=0`; hinted attempts are practice-only.

```text
evidence_target = 100 × correctness
evidence_weight = mode_factor × difficulty_factor × spacing_factor
alpha = min(alpha_cap, base_alpha × evidence_weight)
raw_next = current + alpha × (evidence_target - current)
bounded_next = round(clamp(raw_next, current - 15, current + 12))
next = correctness == 1 ? max(current, bounded_next) : bounded_next
```

Definitions:

| Input | Values |
|---|---|
| `correctness` | 0–1; closed tasks normally use 0 or 1 |
| `mode_factor` | recognition 0.70; controlled production 0.90; production 1.10; transfer 1.20 |
| `difficulty_factor` | easy 0.90; target 1.00; stretch 1.10 |
| `spacing_factor` | same day 0.40; 1–2 days 0.80; 3+ days 1.00 |
| correct attempt | `base_alpha=0.18`, `alpha_cap=0.35` |
| incorrect attempt | target becomes 0; `base_alpha=0.25`, `alpha_cap=0.45` |

Response duration is recorded for diagnostics and anomaly detection but does not directly raise mastery in v0.1. This avoids rewarding rushed guessing or penalizing accessibility needs.

Untested nodes have `mastery=null`, not zero. On the first eligible scored non-Diagnostic attempt, the algorithm uses internal `current=20`; the UI shows `Cần thêm bằng chứng`, not the number 20. Diagnostic may initialize a different provisional score but must retain its low-confidence label. Hinted attempts bypass this formula and leave mastery unchanged. Partial or incorrect eligible evidence remains subject to the bounded decrease. Owner approved this cautious initialization on 2026-09-20.

### Approved Vertical Slice golden vectors

| Case | Input | Expected output |
|---|---|---|
| First eligible recognition success | `current=null→20`, recognition, target difficulty, same day, correct | `24` |
| Correct after opening hint | any current, otherwise correct | mastery unchanged; practice event only |
| Delayed controlled-production success | `current=24`, controlled production, target, 1–2 days, correct | `34` |
| Delayed transfer success | `current=34`, transfer, target, 3+ days, correct | `46` because +12 cap applies |
| Independent stretch failure | `current=80`, transfer, stretch, 3+ days, incorrect | `65` because -15 cap applies |
| Same-day easy recognition success | `current=80`, recognition, easy, same day, correct | `81` |
| Duplicate idempotency retry | same actor/key/request hash | same stored acknowledgement; one attempt/evidence/reward |
| Idempotency-key misuse | same actor/key but different request hash | conflict; no new attempt/evidence/reward |
| Technical failure | network/content technical status | mastery unchanged; not wrong |

These vectors were owner-approved on 2026-09-20 and arithmetically checked against the v0.1 formula. Implementation tests must use exact values and also assert version/replay behavior.

## Draft mastery behavior

- Score range: 0–100.
- Diagnostic initializes a provisional score with low confidence.
- Production tasks carry more evidence than recognition tasks.
- Hints make the attempt practice-only and do not change mastery.
- A recent failure after mastery triggers review without erasing prior evidence.
- Scores include `algorithm_version`.

| Score | State |
|---|---|
| 0–39 | Foundation |
| 40–69 | Guided practice |
| 70–84 | Independent practice |
| 85–100 | Spaced review |

`Đã nắm vững` không chỉ dựa vào score band. Với các node Vertical Slice, trạng thái này còn yêu cầu successful eligible evidence trên ít nhất 3 ngày khác nhau, ít nhất 2 exercise formats và ít nhất 1 independent review/transfer success. Score 70–84 được trình bày là `Có thể dùng độc lập`, không phải mastered.

## Evidence requirements for mastery

- Correct performance on at least three different learning dates.
- More than one exercise type.
- At least one production or transfer task when supported.
- More than one lexical or topic context.
- Confidence of at least 0.75.

Candidate confidence:

```text
confidence = min(1, distinct_days / 3)
           × min(1, exercise_types / 2)
           × min(1, total_evidence_weight / 4)
```

If production or transfer is supported but absent, confidence is capped at 0.69. Diagnostic initialization is capped at 0.45 confidence.
If the node has no successful evidence in the previous 30 days, displayed confidence is capped at 0.69; after 60 days it is capped at 0.49 until a new delayed attempt is completed. The historical mastery score is retained so recency affects confidence and review priority rather than silently erasing evidence. Owner approved these conservative caps on 2026-09-20.

## Review Scheduler

Produces `due_at`, interval, priority, recommended next exercise type, and Rescue Lesson status.

Owner approved the adaptive review policy for the Vertical Slice on 2026-09-20.

Candidate interval sequence:

| State/result | Next interval |
|---|---|
| New or failed Foundation item | later in the session when useful, then 1 day |
| Guided-practice success | 2 days |
| Independent-practice success | 4 days, then 7 days |
| Spaced-review success | 7, 14, then 30 days |
| Any independent failure | 1 day and evaluate Rescue Lesson |
| Success after rescue | half of the last successful interval, minimum 2 days |

Overdue items gain priority but do not receive extra mastery credit solely for being overdue.

## Daily Quest Builder

Inputs include available minutes, due reviews, weak nodes, unlocked nodes, weekly allocation, recent exercise distribution, and available content.

Default allocation is 60% review, 25% new, and 15% stretch, but it is a policy input rather than a permanent constant:

| Situation | Adjustment |
|---|---|
| Foundation-building phase | default may shift toward 50% review, 35% new, 15% stretch |
| Heavy overdue queue | review may rise to 75%; new content is reduced first |
| Exam-readiness phase after a test is booked | reduce new nodes; increase recurring-error and transfer work |
| 15-minute route | overdue review plus one production/transfer task where available |
| Recovery/light day | omit stretch work and protect due essentials |

Constraints:

- Avoid excessive exercise-pattern repetition.
- Respect prerequisites.
- Prioritize overdue reviews and Rescue Lessons.
- Provide a usable quest if one category is unavailable.
- Never satisfy a mastery quota with self-review-only activity.
- Include practice-only or external-review reminders without presenting them as scored mastery work.

Deterministic selection contract:

```text
eligible content
→ priority score
→ stable tie-break
→ seeded approved-content variation
→ route plus explanation codes
```

Candidate seed:

```text
seed = learner_id + local_learning_date + route_id + algorithm_version
```

The selected seed is stored with the session so reload/resume does not change pending tasks. Each selected item records a reason such as `OVERDUE_REVIEW`, `RECURRING_ERROR`, `PREREQUISITE_GAP`, `PRODUCTION_GAP`, or `WEEKLY_TRANSFER`.

## Rescue Lesson

Triggered by repeated failure on a mastered node, the same mistake across contexts, or a prerequisite explaining a higher-level failure.

```text
Short explanation
→ worked example
→ guided question
→ independent question
→ IELTS transfer question when applicable
```

## Diagnostic

Diagnostic is optional and split into independent modules of about five minutes. A learner with a recent external score may skip it entirely. Without external evidence, the learner may complete only the modules they choose; uncertain families are resolved gradually during normal practice.

Rules:

- Each module samples a skill family rather than every P0 node.
- Approved baseline evidence pre-fills priorities and coverage metadata but does not fabricate node mastery.
- The Diagnostic does not repeat a skill family already supported by sufficient, recent baseline evidence unless confirmation is needed.
- The learner sees what is already known, what remains uncertain, each five-minute estimate, and a safe stop before starting.
- Separates recognition and production evidence.
- Does not present mastery as an official IELTS band.
- Records confidence and coverage.
- Produces an initial review queue and weekly allocation.
- The adaptive deep dive samples at least two recognition items and one production/transfer item for each included target node when content allows.
- The learner can stop after any module; unresolved nodes remain unknown and are scheduled for later evidence collection.
- Calculates a provisional score with confidence capped at 0.45.
- Defers untested nodes rather than assigning zero.
- Exports observed errors to the baseline protocol in [`IELTS-ASSESSMENT-FRAMEWORK.md`](IELTS-ASSESSMENT-FRAMEWORK.md).

## Golden examples required before implementation

- [ ] First correct answer on a new node.
- [ ] Correct answer with a hint.
- [ ] Fast incorrect answer.
- [ ] Mastered node failed after seven days.
- [ ] Repeated mistake across three contexts.
- [ ] Diagnostic with sparse evidence.
- [ ] Node with unmet prerequisite.
- [ ] Quest with insufficient pronunciation content.
- [ ] Correct same-day repetition receives reduced evidence.
- [ ] Production success after a delay carries more evidence than recognition.
- [ ] One failure cannot reduce mastery by more than 15 points.
- [ ] Diagnostic leaves untested nodes unknown rather than failed.
- [ ] Confidence remains below 0.70 without production/transfer evidence.
- [ ] A fully correct hinted answer leaves mastery unchanged and schedules an independent variant where appropriate.
- [ ] First evidence initializes from the approved starting value while an untested node remains `null`.
- [ ] Confidence caps apply after 30 and 60 days without successful evidence.
- [ ] Every Diagnostic module stays close to five minutes and can be skipped/stopped independently.
- [ ] A recent external score can skip Diagnostic entirely without assigning mastery.
- [ ] Baseline evidence can set priorities without directly assigning high-confidence node mastery.
- [ ] A self-review-only pronunciation or Speaking event updates practice status but never mastery.
- [ ] An external Writing/Speaking result remains external evidence and does not overwrite internal mastery.
- [ ] A hybrid node updates mastery only from its approved scored component.
- [ ] A 15-minute route contains due essentials and one production/transfer task when available.
- [ ] A heavy overdue queue can raise review allocation without starving recovery rules.
- [ ] The same inputs, algorithm version, and stored seed reproduce the same pending route after reload.
- [ ] Every selected quest item exposes a valid explanation code.
