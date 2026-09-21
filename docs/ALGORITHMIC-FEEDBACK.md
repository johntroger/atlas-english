# Deterministic learning and feedback engine

> **Status:** DRAFT specification — runtime AI is prohibited; algorithm thresholds require approval

## Authoritative scope

The MVP uses no runtime generative AI, speech-recognition service, hosted language model, or external acoustic-scoring model. Codex may assist content authoring before publication, but learner play uses only versioned content, deterministic rules, local browser signal processing, and explicitly recorded self-assessment. ADR-014 describes a deferred BYOK coach and does not change this MVP contract.

The engine may personalize selection and scheduling from the learner's own attempt history. It must not generate new exercises at runtime, infer an IELTS band, or present a heuristic as a measured language error.

Every node follows the assessment-mode and progress-channel contract in [`LEARNING-ENGINE.md`](LEARNING-ENGINE.md). The feedback engine rejects attempts that try to convert self-review or external evidence into internal mastery.

## Engine components

| Component | Deterministic inputs | Output |
|---|---|---|
| Answer evaluator | exercise contract, accepted answers, normalization rules | correctness, partial score, exact mismatch |
| Error classifier | rule IDs, mistake patterns, answer diff, exercise metadata | one or more approved mistake tags |
| Mastery engine | scored attempts across dates, formats and contexts | versioned mastery and confidence |
| Review scheduler | mastery, recency, failures, intervals | next due date and review type |
| Daily Quest Builder | due reviews, weak nodes, prerequisites, available time | reproducible daily route |
| Rescue Lesson selector | repeated mistake tags and prerequisite graph | approved explanation and exercise sequence |
| Writing mechanics assistant | local text and fixed rules | measurable mechanics observations only |
| Pronunciation signal analyzer | local audio metrics and reference timing | recording-quality and delivery observations only |

Every output records the relevant rule, algorithm, content, and schema versions. Given the same inputs and versions, the same output must be produced.

## Closed-answer feedback

Grammar, vocabulary, spelling, Listening/Reading micro-skills, and controlled transfer exercises use author-approved answer contracts. The evaluator may apply:

- Unicode and whitespace normalization;
- approved case and punctuation tolerance;
- British/American spelling variants recorded in content;
- token or sequence comparison;
- ordered and unordered answer sets where the exercise declares them;
- rule-specific partial credit;
- deterministic mistake tags linked to approved explanations.

Normalization never silently accepts a semantically different answer. Ambiguous free text is routed to self-review or external review rather than guessed by the engine.

Owner-approved normalization policy for mastery-eligible text answers:

- normalize Unicode to NFC;
- trim leading/trailing whitespace and collapse repeated internal whitespace;
- compare case-insensitively only when capitalization is not the learning objective;
- ignore punctuation only when punctuation is not the learning objective;
- accept British/American or other variants only when each variant is explicitly declared in content;
- preserve hyphen sensitivity unless the item explicitly declares accepted forms;
- never autocorrect spelling or use fuzzy/semantic matching for mastery.

The normalized learner answer and matched accepted-answer ID may be stored; the evaluator must not invent an accepted variant at runtime.

Owner-approved partial-credit policy:

- single-choice, single text answer, reorder, dictation and single error-correction contracts are binary (`0` or `1`);
- multiple-choice may use `subset_no_incorrect`: selecting a non-empty proper subset of correct options receives the declared proportional score only when no incorrect option is selected;
- selecting any incorrect option under that policy returns `0` for the item;
- multi-component exercises, when introduced by an approved schema, score each declared component independently and aggregate only by the stored scoring contract;
- partial credit is never inferred from fuzzy text similarity.

## Writing mechanics assistant

The game may calculate locally:

- word and paragraph counts;
- sentence-length distribution;
- exact or stemmed repetition from an approved local word list;
- spelling matches against approved dictionaries and personal error lists;
- presence of user-marked thesis, overview, topic sentences, or examples;
- use of a small approved connector inventory;
- rule-based checks only when their false-positive behavior is documented and tested.

These observations support revision but do not assess idea quality, Task Achievement/Response, overall coherence, natural collocation, grammatical range, or an IELTS band. Full Writing evaluation remains external under [`IELTS-ASSESSMENT-FRAMEWORK.md`](IELTS-ASSESSMENT-FRAMEWORK.md).

The Writing interface provides an approved personal dictionary and an `ignore` action for names, specialist terms, and accepted variants. Ignoring a suggestion records a local preference; it does not silently change shared content rules. Mechanics observations are shown individually and never combined into a total Writing score.

## Pronunciation signal analyzer

The baseline loop is entirely local:

```text
Reference text/audio
→ Record
→ Playback
→ Local signal measurements
→ Self-review checklist
→ Retry
```

Permitted measurements include duration, delayed start, near-silence, clipping, speech-to-silence ratio, long-pause count, and pace relative to the known target word count or reference duration. Energy-contour or rhythm proxies may be added only after device calibration and must be labeled heuristic.

The engine does not claim to recognize words, score phonemes, detect accent correctness, or assign an IELTS Pronunciation band. Final sounds, word stress, intelligibility, and pronunciation accuracy remain self-review or externally reviewed unless a future non-AI method is separately validated and approved.

## Evidence labels

- `measured`: directly calculated from an objective local signal or exact answer comparison;
- `heuristic`: rule-based proxy with a documented limitation and calibrated threshold;
- `self_report`: learner checklist or reflection;
- `external_review`: evidence entered from an identified human or approved external assessment.

Heuristic or self-reported observations never directly raise mastery. They may schedule another practice attempt; only approved scored performance changes mastery.

## Personalization rules

Personalization is selection, not generation. It uses:

- overdue reviews;
- recurring mistake tags;
- prerequisite gaps;
- recognition-to-production gaps;
- weak delayed recall;
- skill allocation from external calibration;
- recent exercise-format repetition;
- available session duration.

Tie-breaking is stable and testable. Random variation, when used to prevent memorization, must use a recorded seed and only select from approved content.

Candidate route seed:

```text
seed = learner_id + local_learning_date + route_id + algorithm_version
```

Every selected task carries an explanation code such as overdue review, recurring error, prerequisite gap, production gap, or weekly transfer. The code supports debugging and a plain-language “Why this?” explanation without exposing scoring internals.

## Calibration and versioning

Before a rule or threshold becomes learner-facing:

1. define its intended meaning and failure cost;
2. create valid, boundary, and counterexample fixtures;
3. compare its output with manual review;
4. record false positives and false negatives;
5. approve, soften, or disable the label;
6. assign an `algorithm_version` and preserve compatibility evidence.

Algorithm changes never rewrite historical attempts. Derived mastery and schedules may be rebuilt from immutable attempts with the selected version.

## Privacy and online behavior

- Closed-answer evaluation may run in domain code on client or server, but authoritative account results are committed online.
- Raw audio is session-only and cannot be saved or downloaded in the MVP.
- Writing drafts autosave to the account server; the current unsaved answer may use only the short recovery buffer defined in `STATE-AND-RECOVERY.md`.
- No learner answer, Writing, transcript, or audio is sent to an AI provider.
- The website requires Internet; loss of connection pauses new questions and never turns a technical failure into a wrong answer.

## Required tests before implementation

- answer-normalization and ambiguity fixtures;
- mistake-tag classification fixtures;
- mastery, review, and quest golden cases;
- deterministic replay with the same versions and seed;
- Writing-mechanics false-positive cases;
- personal-dictionary and ignore-flow cases for names, specialist terms, and British/American variants;
- pronunciation signal boundary cases across the approved device matrix;
- evidence-label and non-band wording checks;
- proof that no runtime AI SDK, endpoint, credential, or provider call exists in client or server bundles.

## Open decisions

- approved local spelling dictionaries and licenses;
- which Writing mechanics rules meet the false-positive threshold;
- pronunciation signal thresholds per supported device class;
- pronunciation clips are session-only; threshold calibration remains open;
- calibration sample sizes and acceptance thresholds;
- seed and tie-breaking policy for approved-content selection.
- final explanation-code catalog and learner-facing wording.
