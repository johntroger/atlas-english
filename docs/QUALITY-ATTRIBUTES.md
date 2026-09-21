# Quality attributes

## Performance targets

| Metric | Initial target |
|---|---:|
| Mobile p75 LCP on normal 4G | ≤ 2.5s |
| p75 INP | ≤ 200ms |
| p75 CLS | ≤ 0.1 |
| Answer feedback after acknowledged submit | ≤ 1.0s p95 |
| Autosave acknowledgement | ≤ 2.0s p95 after debounce |
| Checkpoint render | ≤ 500ms p95 after data ready |

Targets are measured in Preview before beta and revisited with Production telemetry.

## Reliability

- Acknowledged attempt is durable and idempotent.
- Technical failure never creates wrong evidence.
- Current answer survives a short interruption up to 30 minutes.
- Projections rebuild from immutable events.
- Content/database release has rollback and compatibility window.
- Daily encrypted backup, rolling 30 days; restore target within 24 hours; isolated restore before Public Preview, monthly for the first three public months, then quarterly.

## Availability

Beta has no contractual uptime target or automated operator alerts. It still requires health visibility, circuit breakers, feature flags, status communication and manual dashboard checks. Core guest practice is prioritized during quota pressure.

## Accessibility

WCAG 2.2 AA for core flows; full keyboard operation; screen-reader semantics; reduced motion; light/dark; 200% zoom; three in-app font sizes; no color-only state.

Frequent/sequential primary controls target at least 44 × 44 CSS pixels even though the WCAG 2.2 AA minimum is 24 × 24. Sticky controls must not obscure keyboard focus, validation errors or the active answer when the mobile keyboard is open.

## Security/privacy

RLS, least privilege, MFA/elevated admin session, environment isolation, retention enforcement, no session replay, minimized logs and no client/private answer leakage.

Security verification is risk-mapped to OWASP ASVS 5.0: relevant Level 1 controls for Owner Alpha/Public Preview plus selected Level 2 controls for auth, personal data, administration, export/delete and backups. This is a verification baseline, not a certification claim.

## Content/learning quality

100% published items schema-valid and reviewed; deterministic outputs reproducible; claims traceable to evidence; uncalibrated assessments never show band.

## Compatibility

Responsive web only. Support latest two Chrome, Edge and Safari releases. Required core: JavaScript, HTTPS and standard storage/network APIs. Microphone features progressively enhance; unsupported devices receive guided fallback without mastery evidence.

## Maintainability

Modular boundaries enforced; migrations in repo; versioned algorithm/content/schema; architecture changes via ADR; no duplicated authoritative decisions.
