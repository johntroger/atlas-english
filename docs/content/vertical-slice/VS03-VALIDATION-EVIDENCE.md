# VS-03 executable validation evidence

> Run date: 2026-09-22  
> Scope: Content Pack, Narrative Pack, learning-node and exercise content contracts  
> Result: **PASS**

## Implementation

- `tools/content-validator.mjs` loads the repository schemas with AJV Draft 2020-12 and exposes deterministic schema, semantic and canonical-hash checks.
- `tools/validate-content.mjs` is the fail-closed repository command behind `npm run content:validate`.
- `tests/content-validator.test.mjs` supplies positive, negative and mutation regression coverage.
- `ajv@8.20.0` and `ajv-formats@3.0.1` are exact, development-only dependencies. They do not enter the learner-facing application bundle. The initial AJV candidate was replaced before completion because the dependency audit identified a fixed moderate advisory; the final audit reports zero vulnerabilities.

## Executable results

`npm run content:validate` passes:

- 18 explicit schema expectations, including valid, schema-invalid and schema-valid/semantic-invalid artifacts;
- the full P-031 positive contract: 2 Content Packs, 12 exercises, 3 learning nodes and 3 missions;
- hinted-practice/mastery rejection;
- explicit manual-review routing for natural-language ambiguity;
- exactly seven expected failures in the broken Narrative Pack reference fixture.

The test suite adds mutation checks proving that the validator rejects:

- an accepted option ID missing from the option set;
- a duplicate exercise ID;
- a mission slot with no compatible item;
- missing required content-role coverage;
- generic checkpoint copy with no observable dossier change;
- a pack whose content changed without a matching canonical SHA-256 hash.

## Full project gate

`npm run check` passes formatting, lint, architecture boundaries, TypeScript, content validation, 31/31 tests, secret scanning and the optimized Next.js build. `npm audit --audit-level=moderate` reports zero vulnerabilities.

No browser E2E or mobile viewport test is applicable because VS-03 changes no UI. No persistence, interruption, idempotent retry, guest-expiry or server-recovery test is applicable because VS-03 creates no storage or network behavior.

## Honest limits

- JSON Schema and deterministic semantic rules cannot prove that natural-language distractors are unambiguous. Tagged ambiguity is therefore a blocking `manual_review` result, not an automated linguistic verdict.
- These checks do not replace qualified human academic approval, Product Owner story/tone approval or accessibility review on the exact release hashes.
- The proof pack still contains only the 12 first-run items; the remaining 18 items in the approved 30-item blueprint are later VS-05 work.
- Gameplay integration, server authority, persistence, authentication, Supabase and deployment remain outside VS-03.
