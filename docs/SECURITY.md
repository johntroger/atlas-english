# Security and privacy requirements

## Identity

- Owner Alpha requires an outer environment access gate restricted to the project owner. This gate is separate from product guest/account identity and must work on phone and desktop.
- Public guest play and open email registration.
- Each magic link/one-time code challenge is one-use, expires in 60 minutes, becomes invalid after 5 failures and is rate-limited. Challenge expiry does not delete the 24-hour pending account; a new challenge may be requested while that account remains valid.
- Responses do not reveal whether an email exists.
- Pending unverified accounts expire in 24h and behave as guests.
- Sessions last at most 30 days; sensitive actions require reauthentication.
- Admin/editor/reviewer roles are least-privilege; admin uses MFA and 15-minute elevated session.

## Authorization/data

- RLS on every user-owned table; server authorization is still required.
- Service role never ships to browser.
- Public content is read-only; private assessment bank/key/exposure data is server-only.
- Dev/Preview/Production use isolated projects, secrets and data.
- Attempt/consent/audit events are append-only.

## Client storage

Only current-answer recovery in `sessionStorage` (30 minutes), minimal guest state in `localStorage` with enforced TTL (24 hours) and ordinary non-sensitive cache. Guest state excludes PII, raw free-form answers, secrets, private answer keys, audio and full account history, and is cleared on expiry or successful import. The deferred BYOK design has its own release gate in ADR-014.

## Privacy

- Data minimization, retention jobs and self-service export/delete/reset.
- Public Vertical Slice account registration requires separate unchecked-by-default age/residency and Terms/Privacy confirmations. Record only versioned append-only events; do not collect date of birth, precise location or IP for eligibility proof. Minor-account support is disabled until a separately approved legal/consent design exists.
- No behavioral analytics in the Public Vertical Slice; later beta analytics requires opt-in. Session replay is always prohibited.
- Logs exclude raw answers where unnecessary, Writing content, audio, secret, full email and answer keys.
- Screenshot/text in an error report requires explicit opt-in and a warning.
- Public issue only after sanitization.

## Application controls

HTTPS, secure cookies, CSRF protection, strict input/output validation, CSP/security headers, dependency/secret scans, abuse limits, file/content size limits and safe error messages.

### Verification baseline

- Map the applicable controls to OWASP ASVS 5.0: relevant Level 1 for Owner Alpha/Public Preview and risk-selected Level 2 for authentication, personal data, admin, export/delete and backup paths. Record `not applicable` with rationale; do not claim certification.
- Every exposed table/view/function is deny-by-default at the grant layer as well as the RLS layer. Test `anon`, `authenticated`, owner, other-user and privileged roles for each allowed operation.
- Write separate policies for select/insert/update/delete where used. Updates require both visibility of the old row and validation of the new row.
- Exposed views use `security_invoker` when appropriate or have explicit revoked grants/server-only access. Authorization data never trusts user-editable JWT metadata.
- The Vertical Slice keeps release base tables server-only and gives browsers no direct INSERT/UPDATE/DELETE grants on learning, consent, import, story or reward tables. Authenticated owner reads are explicit; guest mutations use a server-bound provenance endpoint.
- Security-definer functions, if used, have a fixed safe `search_path`, schema-qualified objects, a non-login owner, revoked PUBLIC execute, minimum explicit grants and actor identity derived from trusted auth context. A service-role call still requires application authorization and environment binding.
- Idempotent mutation stores a server-computed request hash. Same key/different payload returns a conflict and never reuses a prior successful receipt.
- CI/release dependencies use a committed lockfile; third-party CI actions are pinned to immutable commit SHAs. Release evidence includes dependency inventory/SBOM, vulnerability/license and secret scans.

### Owner Alpha access

- Prefer hosting-level access protection when the selected plan supports it; verify availability before implementation rather than assuming a provider feature.
- Fallback: server-side Alpha gate with a high-entropy secret held only in environment secrets, rate-limited verification and a short-lived `Secure`, `HttpOnly`, `SameSite` session cookie.
- Never put the access secret in source, client JavaScript, URL/query string, analytics, logs or screenshots.
- The gate denies by default and has an explicit kill switch. Public guest discovery and open signup remain disabled outside the owner session.
- Internal test controls may exercise guest/signup/import states only after the owner passes the outer gate; they must not weaken normal authorization or be enabled in Public Preview.

### Public Vertical Slice limits

- Owner Alpha/Public Vertical Slice baseline while using Supabase's built-in email provider: 2 link/code requests/email/hour and 10/IP/hour; raising the email limit requires verified custom SMTP/provider capacity, abuse testing and a documented configuration change;
- verification code invalid after 5 failed entries;
- attempt submit: 30/minute per account or guest actor and 60/minute per IP;
- guest import: 3/hour per destination account;
- attempt payload: 32 KB maximum; import request payload: 256 KB maximum;
- `429` response supplies a safe retry delay, preserves the current local answer buffer and never creates a wrong/technical learning result.

Limits apply before expensive database work and use privacy-minimized identifiers; raw IP is not written into learning records.

## Content supply chain

Immutable hashes, provenance/license, author-review separation, private assessment pipeline, signed/verified release metadata where practical and rollback. Public repo never contains production assessment answers.

## Backup boundary

Database dumps are encrypted before upload to a private S3-compatible bucket with credentials separate from Supabase/GitHub. The bucket denies public access/listing and deletes backup objects after 30 days. Encryption and object-store credentials are different secrets; neither appears in repository, logs or backup filenames.

The selected Vertical Slice provider is Cloudflare R2 Standard in a dedicated private backup bucket. R2 credentials are scoped to that bucket and backup operations only. Provider server-side encryption is defense-in-depth and does not replace pre-upload encryption.

Owner Alpha backup objects use a distinct non-production project identifier/prefix and least-privilege credential scope. Restore tooling must reject an environment mismatch unless a separately approved owner-history migration is being performed; Alpha backups are never restored over Public/Production.

Backup encryption uses `age` asymmetric encryption. The automated backup job receives only the age public recipient key; it never holds decryption capability. The private identity is stored in the owner's password manager plus one offline recovery copy. The private identity is never added to GitHub/Vercel/Supabase/R2 secrets, logs or test fixtures. Key rotation creates a documented overlap/restore plan rather than rewriting historical dumps silently.

GitHub Actions is the approved daily runner. Scheduled backup executes only from the protected default branch and never for pull-request code. Use a dedicated least-privilege Supabase backup role and R2 credentials limited to put/head on the backup prefix; a separate manual restore credential provides read access. No workflow logs connection strings, object-store secrets, decrypted dumps or private identities.

## Incident and disclosure

Security reports use a private channel documented before beta. Acknowledge security/data requests within 24 hours. Incident runbook covers containment, key rotation, user notice, evidence preservation and postmortem.

## Legal gate

Public Vertical Slice accounts are limited to people self-declaring that they are at least 18 and reside in Vietnam; no DOB, precise location or guardian flow is collected. Owner Alpha does not close the legal gate. Confirmed operator/contact details, provider regions/transfers and legal review are still required before access expands beyond the owner; see `PLAN.md`, `PRIVACY-NOTICE.md` and `TERMS-OF-USE.md`.
