# Release and recovery runbook

> **Status:** DRAFT

## Environments

- Local/Development.
- Vercel Preview with non-production data.
- Vercel Production with Production Supabase.

Owner Alpha dùng một môi trường online không công khai với quyền truy cập giới hạn cho chủ dự án. Open signup/public guest discovery được tắt tại môi trường này, nhưng owner có thể dùng test controls để đi qua guest/account/import flows. Nếu hosting-level protection không khả dụng, phải dùng app-level allowlist/feature flags đã kiểm thử; URL khó đoán không được coi là access control.

Owner Alpha uses its own Supabase Preview project. Public/Production creates or selects a separate project and never promotes the Alpha database in place. Owner history stays in Preview by default.

### Optional Owner Alpha history transfer

1. Receive explicit owner request; otherwise start clean.
2. Export a preview manifest with record categories/counts, content/algorithm versions and checksum; exclude secrets, sessions, pending/guest state, test controls and operational logs.
3. Validate compatibility and show accepted/rejected categories before consent.
4. Create/verify destination restore point.
5. Import with new identity mapping and an idempotent migration receipt; preserve source provenance.
6. Rebuild mastery/review projections at destination rather than copying Alpha projections.
7. Verify counts/checksum/critical journeys; rollback through the recorded recovery path on failure.

## Normal release

1. Confirm acceptance criteria.
2. Run required checks.
3. Review database and content migrations.
4. Validate Vercel Preview.
5. Perform relevant device checks.
6. Verify algorithm, rule, threshold, content, and schema versions plus deterministic replay when affected.
7. If Terms/Privacy changes, create a new immutable `terms-YYYY-MM-DD-vN` or `privacy-YYYY-MM-DD-vN` release; never overwrite a published version. Classify it as editorial, planned material or security/legal emergency. Planned material changes require `announced_at` at least seven calendar days before `effective_at`; emergency classification requires documented reason, scope and approver. Store timestamps in UTC and render them to users in `Asia/Ho_Chi_Minh`.
8. Obtain explicit approval for Production.
9. Verify signup/quota switches, health checks and automatic rollback thresholds.
10. Release to all users; require automatic reload before an incompatible client can continue.
11. Confirm deployment, backward-compatible data/content contracts and critical journeys.
12. Update `STATUS.md` and `CHANGELOG.md`.

## Owner Alpha automatic delivery

- Only an approved Alpha release source may auto-deploy to the owner-restricted environment; pull-request/untrusted code never receives environment secrets or deployment authority.
- Required type, relevant unit, schema/fixture, secret-scan and critical smoke checks must pass before deployment. A failed check leaves the last known-good Alpha active.
- The client/server expose compatible build/contract versions. A newly available build sets `update_pending`; it does not reload while an item is being answered or submitted.
- Normal update boundary is the next acknowledged answer, checkpoint or explicit safe stop. Preserve only the permitted short-lived answer buffer; after reload, verify content/session compatibility before continuing.
- A P0 kill switch may immediately block the affected submit/feature. If correctness or data integrity is uncertain, do not accept another attempt; retain the current answer when safe and show maintenance/retry guidance.
- Post-deploy health failure rolls Alpha back to the last known-good compatible build. Public Preview and Production never inherit Alpha auto-release authority and require their own explicit approval.

## Database migration rules

- Commit migration files.
- Test against Development/Test first.
- Destructive migrations require backup and recovery instructions.
- Define deployment order for backward compatibility.
- Do not use undocumented dashboard-only schema changes.

## Content release

1. Validate schema and references.
2. Confirm independent academic review coverage and license/provenance.
3. Preview with the existing app version.
4. Confirm app compatibility and hash.
5. Publish without mutating older versions.
6. Monitor fetch/activation and scoring failures.

## Rollback

### Application regression

Restore the previous Vercel deployment and verify database/content compatibility.

### Bad content pack

Deactivate the bad version, reactivate the last known-good version, and preserve affected attempts for repair.

### Migration failure

Stop rollout and execute the documented recovery path. Do not improvise destructive Production rollback.

For Owner Alpha only, a breaking-change reset may be proposed after migration/rebuild alternatives are documented. Freeze writes, verify encrypted backup/checksum, produce an exact impact manifest and obtain separate owner confirmation before execution. Record the reset receipt and run critical smoke tests afterward. Never infer this authority for Public/Production.

### Stale client

Keep the server contract backward-compatible during rollout. If a client cannot continue safely, preserve the current answer where possible and require reload before another submission.

### Online submission failure

Preserve only the short-lived current answer, repair the service, and retry the exact same command with the same idempotency key. Never turn the failure into a wrong attempt; a changed command requires a new key after explicit recovery.

### Algorithmic-feedback regression

Disable the affected rule or heuristic without disabling the lesson, restore the last approved rule/threshold/schema combination, rebuild derived state only through the documented recovery path, and verify deterministic replay against golden fixtures.

## Backup, restore and user export

Exact secret-safe command templates, target guards, integrity queries, failure behavior and evidence fields are authoritative in [`BACKUP-RESTORE-RUNBOOK.md`](BACKUP-RESTORE-RUNBOOK.md). This section defines policy and cadence; it must not be used as a substitute for that executable procedure.

- Production uses encrypted daily backups rolling 30 days; run a quarterly restore drill.
- Owner Alpha begins encrypted daily logical backups as soon as the owner account stores real progress. Alpha uses its own project identifier and object-prefix scope; backup objects, credentials and restore targets are never shared implicitly with Public/Production.
- Public Vertical Slice on Supabase Free also requires an automated encrypted logical database dump every day, stored outside both the public GitHub repository and the primary Supabase project for 30 days. A job success message alone is insufficient; restoration is tested in an isolated non-production target before release and at the documented drill cadence.
- The approved backup destination class is a private S3-compatible object-storage bucket under separate credentials. Upload occurs only after client-side/job-side encryption; bucket lifecycle deletes objects after 30 days; public access and anonymous listing are disabled.
- Concrete Vertical Slice provider: Cloudflare R2 Standard. Use a dedicated private bucket only for encrypted database backups, not runtime game assets. The owner selected R2 on 2026-09-20 after checking its official 10 GB-month free allowance and S3-compatible access; pricing/quota must be rechecked before implementation.
- Encrypt every dump with an `age` public recipient key before upload. Restore requires the private identity held in the owner's password manager or offline recovery copy; the automated job never receives it. Restore drills verify both private-key custody and data integrity without exposing the key in command output.
- Daily automation runs in GitHub Actions from the protected default branch. Repository workflow is public, but the Supabase backup-role connection and scoped R2 upload credentials live only in GitHub Actions secrets. The scheduled job has database read access required for logical dump, R2 put/head access for the backup prefix, and no decrypt permission. Bucket lifecycle, not the runner, performs 30-day deletion. Manual restore uses a separate read credential and never runs on untrusted pull-request code.
- Supabase Storage objects, if introduced later, require a separate object-backup process because a database dump contains metadata rather than object bytes.
- Vertical Slice restore cadence: Alpha records daily backup health from the first real-progress day; one successful isolated restore is required before public release; monthly drills during the first three public months; quarterly thereafter if no unresolved restore blocker remains. Record source environment/project, backup object date/hash, decrypt result, schema/data integrity checks, elapsed time, reviewer and remediation without exposing secrets or learner content.
- Restore to an isolated environment first and verify integrity/ownership/version before cutover.
- User export is a ZIP with readable summary, CSV and JSON; its link expires after 24 hours.
- User export is not a blind import/overwrite mechanism.
- Owner Alpha transfer is a separately authorized narrow migration; it never turns the general user export into a blind restore tool.

## Incident record

Record duration, affected version, impact, root cause, recovery action, and the follow-up guardrail.

Operational indicators, alerts, privacy-safe telemetry, RPO/RTO, restore drills, and the incident process are defined in [`OBSERVABILITY-OPERATIONS.md`](OBSERVABILITY-OPERATIONS.md).
