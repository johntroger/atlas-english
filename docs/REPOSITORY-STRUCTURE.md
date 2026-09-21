# Repository structure

## Public application repository

```text
app/ or src/
  domain/              # pure learning rules
  application/         # use cases and ports
  infrastructure/      # Supabase/content/telemetry adapters
  ui/                  # routes and components
content/
  practice/            # public reviewed packs
  schemas/
tools/
tests/
docs/
supabase/migrations/
```

Actual framework folders are selected only after `PLAN.md` approval. This document is a contract, not permission to scaffold.

## Private assessment repository/storage

Contains production assessment items, keys, form blueprints, calibration/exposure data and restricted release tooling. Public repo may contain only interfaces, synthetic fixtures and security tests.

## Dependency rules

- Domain imports no React/Next/browser/Supabase package.
- UI calls application use cases, not Supabase directly.
- Infrastructure implements ports and cannot define learning policy.
- Content tooling cannot publish without schema/license/review gates.
- No PWA/service-worker/offline-database modules.
- No runtime AI/speech/transcription dependency in MVP.
- Lockfile is committed and frozen in CI; dependency additions require purpose, owner, license and browser/server boundary review.
- Third-party CI actions are pinned to immutable commit SHAs, not floating tags. Release produces a dependency inventory/SBOM and records accepted vulnerability/license exceptions with expiry/owner.
- Architecture fitness tests reject UI→Supabase direct imports and domain→framework/browser/infrastructure imports.

## Version axes

Track application, database schema, content schema, content pack, learning algorithm, scheduler, feedback rules, pronunciation thresholds, evidence schema and assessment form/calibration separately. No IndexedDB schema axis.

## Configuration

Secrets only in environment secret stores. Provide `.env.example` with names/no values after implementation approval. Preview/test never point to Production.

## CI

Format/lint/typecheck/tests; schema/fixture/content checks; migration/RLS tests; dependency/license/secret scan; accessibility/browser smoke; private-bank leakage scan; docs link/stale-decision check; deploy preview; release gate/rollback evidence.
