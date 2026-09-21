# P-031 validation evidence

> Run date: 2026-09-21  
> Environment: repository-local PowerShell JSON Schema and semantic checks  
> Dependency changes: none  
> Result: **PASS for the P-031 planning/content contract**

## Schema results

| Fixture group | Expected | Result |
|---|---|---|
| Grammar proof Content Pack | valid | PASS |
| Vocabulary proof Content Pack | valid | PASS |
| Prologue/three-mission Narrative Pack | valid | PASS |
| Three selected learning nodes | valid | PASS (3/3) |
| `exercise-fuzzy-answer.invalid.json` | schema reject | PASS — rejected because `fuzzyMatching` must be false |
| `narrative-pack-too-many-slots.invalid.json` | schema reject | PASS — rejected because a mission exceeds 5 slots |
| `learning-node-self-review-mastery.invalid.json` | schema reject | PASS — rejected by completion/evidence channel contract |
| Three `.semantic-invalid.json` fixtures | schema valid | PASS (3/3), then evaluated by semantic rules |

`content-pack.schema.json` references `exercise.schema.json`. For the local check, both schemas were composed in memory before validation because the built-in validator does not resolve this repository-relative `$ref` directly. No schema or fixture was rewritten for the test and no package was installed.

## Positive semantic results

- Total proof items: **12**.
- Node distribution: **4 sentence boundaries, 4 noun countability, 4 cause/effect vocabulary**.
- Exercise IDs: unique.
- Every node: at least two formats and all three required roles (`core_mastery`, `hinted_practice`, `independent_review_transfer`).
- Every hinted-practice item: `evidenceEligibility: practice`, hint flag present and practice-only consequence explicit.
- Every accepted single/multiple-choice ID: exists in the option set.
- Every normalized-text mastery item: declared variants only and fuzzy matching disabled.
- Narrative references: episode, three missions, Ato/Mira, prerequisites and selected learning nodes all resolve.
- Every mission: exactly four slots and at least one compatible item for every node/type/progress-channel contract.
- Prologue cards plus mission setup/story beats: inside the 20–60 English-word budget.
- Canonical hashes: match all three declared pack hashes.
- Rollback: explicit `deactivate` target on all three initial packs.
- Automated semantic errors: **0**.

## Negative semantic results

| Fixture | Detected failure | Result |
|---|---|---|
| `exercise-hinted-mastery.semantic-invalid.json` | `hinted_practice` combined with `mastery` | PASS — rejected semantically |
| `exercise-ambiguous.semantic-invalid.json` | two reasonable answers but only one accepted in a single-choice item | PASS — rejected by manual content-contract review |
| `narrative-pack-broken-reference.semantic-invalid.json` | missing mission, episode, character, node and prerequisite refs | PASS — 7 broken references detected |

Natural-language ambiguity cannot be proven by JSON Schema alone. The ambiguous fixture is intentionally retained as a reviewer test case; a future validator may require a human/content-review decision for this class rather than pretending it is fully automatable.

## Codex pre-review findings resolved

1. Replaced grammatically possible but less natural affirmative `much useful information` with `a great deal of useful information`.
2. Added the second valid declared correction for the `Although` fragment.
3. Constrained the `contribute to` text-input prompt by meaning and word count so `cause` is no longer an equally compliant answer.
4. Reworded the cause/effect multiple-choice instruction so it tests whether causation is presented as proven, not whether a possible contribution has already been established.
5. Corrected the selected sentence-boundaries node ID in `LEARNING-CONTRACT.md` and two `CURRICULUM-MATRIX.md` prerequisite references to the authoritative dotted form.

## Residual limitations

- This is Codex pre-review, not independent academic approval.
- The remaining 18 items of the 30-item blueprint do not exist yet.
- Schema success does not prove evaluator/browser implementation because implementation remains unauthorized.
- Product Owner story/tone approval and accessibility review remain future gates on the exact release hashes.
