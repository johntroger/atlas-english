# Threat model

## Assets

Accounts/sessions, learning history and Writing text, consent/deletion records, private assessment bank/keys, admin capability, content/release integrity and future BYOK credentials (not in MVP).

## Trust boundaries

Browser ↔ Vercel/server; server ↔ Supabase; public repo ↔ private assessment repo; content contributor ↔ reviewer/release; production ↔ non-production; future browser ↔ Gemini (deferred).

## Main abuse paths and mitigations

| Threat | Mitigation |
|---|---|
| Email enumeration/code brute force | generic response, rate limit, one-use code, 5-failure invalidation |
| Guest ID takeover/escalation | random opaque ID, short expiry, no account authority, server validation |
| Cross-account read/write | RLS tests, application authorization, service-role isolation |
| Duplicate submit/XP farming | actor-scoped idempotency, append-only attempt, reward diminishing |
| Private answer leakage | separate repo/storage, server selection, minimal payload, no client bundle/log/export |
| Content supply-chain compromise | hashes, provenance, dual review, staged release, rollback |
| Writing/PII leakage | minimization, redacted logs, consented reports, retention/deletion |
| Audio leakage | session-only memory, no upload/log/export, deletion on exit |
| Admin compromise | MFA, least privilege, 15-minute elevation, immutable audit |
| Quota/DoS | rate limits, circuit breaker, signup pause, feature flags |
| Stale client during release | compatibility window, reload gate, idempotent server contract |
| Misleading learning claim | calibration/evidence gates, wording tests, reviewer approval |

## Deferred AI threats

Gemini BYOK is absent from MVP. Before activation: threat-model browser key theft, extension/XSS exposure, prompt injection, unintended data transfer, model drift, provider terms/outage and cost abuse. Failure to meet direct-browser/key-isolation constraints cancels the feature rather than moving the key through the server.

## Residual high risks

Legal/minor consent unresolved; open signup increases abuse/cost; no automated operator alert/budget monitoring; local browser audio heuristics vary by device; assessment security requires strict private pipeline.
