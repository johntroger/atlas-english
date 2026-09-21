# Requirement traceability matrix

> Trạng thái: DRAFT

| ID | Requirement | Source | Verification |
|---|---|---|---|
| R-001 | Guest completes Quick Start without login | PRODUCT, ADR-013 | mobile/desktop E2E |
| R-002 | Account-only history/mastery with consented guest import | PRODUCT, DATA | lifecycle/idempotency E2E |
| R-003 | Online interruption preserves current answer without offline mode | STATE, ADR-013 | disconnect/reconnect E2E |
| R-004 | Submitted attempts are append-only and idempotent | DATABASE, SYNC | integration/concurrency tests |
| R-005 | Cross-device continuation is server-authoritative | ARCHITECTURE | two-browser E2E |
| R-006 | Mastery/review/quest deterministic and versioned | LEARNING, ALGORITHMIC | golden/replay tests |
| R-007 | XP/streak remain separate from mastery | PRODUCT, ADR-008 | domain/UI tests |
| R-008 | Pack publish/rollback without engine change | CONTENT, RELEASE | compatibility/rollback test |
| R-009 | Pronunciation has safe fallback and no false claim | AUDIO, ALGORITHMIC | device/copy/E2E tests |
| R-010 | Audio is session-only and never uploaded/exported | SECURITY, AUDIO | storage/network/log tests |
| R-011 | Writing autosave and takeover do not silently overwrite | STATE, DATABASE | concurrency E2E |
| R-012 | Export/delete/reset/retention match policy | DATA, SECURITY | lifecycle tests |
| R-013 | RLS prevents cross-user/private-bank access | DATABASE, ADR-015 | allow/deny tests |
| R-014 | Core flows meet performance/accessibility budgets | QUALITY, ACCESSIBILITY | performance/manual audit |
| R-015 | Band/readiness claims obey evidence gate | ASSESSMENT, ADR-008 | contract/copy/calibration review |
| R-016 | Diagnostic optional and external baseline does not grant mastery | ASSESSMENT, LEARNING | onboarding/golden tests |
| R-017 | UI uses short clusters/checkpoints/safe stop | PRODUCT, UX | usability/E2E |
| R-018 | Public practice and private assessment stay separated | ADR-015, CONTENT | repo/bundle/access scans |
| R-019 | No runtime AI/speech/transcription in MVP | ADR-011, ALGORITHMIC | dependency/endpoint/secret scan |
| R-020 | Future BYOK AI remains absent until separate approval | ADR-014, PLAN | scope/dependency review |
| R-021 | Open registration is abuse-controlled and pausable | ADR-013, SECURITY | auth/load/failover tests |
| R-022 | Public Slice has no product analytics; separately approved broader-beta analytics is opt-in/minimal and expires at 90 days | ANALYTICS, SECURITY, OPERATIONS | absence/payload/consent/expiry tests |
| R-023 | Content is licensed, reviewed, versioned and incident-recoverable | CONTENT | validation/reviewer/incident evidence |
| R-024 | Production legal gate stays blocked while age/consent unresolved | PLAN, SECURITY | release checklist |
| R-025 | Release has health check, rollback and restore evidence | RELEASE, OPERATIONS | rehearsal report |
| R-026 | Vietnamese UI/English learning content works responsively | PRODUCT, UX | locale/device tests |
| R-027 | First code approval is limited to the documented vertical slice | PLAN, ADR-016, VERTICAL-SLICE | scope/dependency/migration review |
| R-028 | Hints, recordings and open Writing never update mastery | LEARNING-CONTRACT, ADR-016 | eligibility golden tests |
| R-029 | Core MVP Speaking is pronunciation only | PLAN, CURRICULUM, ADR-016 | curriculum/UI/bundle review |
| R-030 | Narrative Packs are immutable, bounded and schema-valid | NARRATIVE, CONTENT | schema valid/invalid fixtures and replay test |
| R-031 | Server verifies answer and evidence eligibility | ARCHITECTURE, LEARNING-CONTRACT | tampered-client integration test |
| R-032 | Node completion and unlock use a channel-specific completion contract | CURRICULUM, CONTENT | schema fixtures and prerequisite semantic tests |
| R-033 | Attempt idempotency and replay work for both account and guest actors | DATABASE, LEARNING-CONTRACT | partial-unique and version-snapshot integration tests |
| R-034 | Industry baselines are versioned and evidenced without certification claims | STANDARDS, QUALITY, SECURITY | release evidence review |
| R-035 | RLS uses explicit grants, per-operation policies and protected views/functions | SECURITY, DATABASE, STANDARDS | grant/policy/view allow-deny tests |
| R-036 | Game engagement remains learning-first, fail-forward and free of dark patterns | STANDARDS, PRODUCT, NARRATIVE | UX/copy/state review |
| R-037 | Every Vertical Slice mission changes the shared dossier in a visible way that is caused by its single IELTS learning objective | NARRATIVE, CONTENT, LEARNING-CONTRACT | Narrative Pack fixture, checkpoint-copy and mission-state review |
| R-038 | Idempotent commands bind actor, key and server-computed request hash; key reuse with another payload cannot reuse a receipt | DATABASE, SYNC, SECURITY | sequential/concurrent same-hash and different-hash integration tests |
| R-039 | One guest history imports to at most one account and one mission reward grants at most once per user | DATABASE, STATE, SYNC | concurrent import/completion constraint and transaction tests |
| R-040 | Daily logical backups are encrypted before off-site upload and a restore is accepted only in an isolated target after checksum, database and domain-invariant verification | BACKUP-RESTORE, RELEASE, OPERATIONS | protected backup receipt and isolated-restore evidence |
| R-041 | Verification challenge expires after 60 minutes/five failures independently of the 24-hour pending account | PLAN, SECURITY, STATE | auth clock/failure/rate-limit tests |
| R-042 | Current answer and guest state use separate TTL-enforced browser stores and contain no prohibited data | PLAN, STATE, SECURITY | storage inspection/expiry/import-cleanup tests |
| R-043 | Public Slice has no analytics-event pipeline; functional aggregates exclude raw answers, do not infer guest return and suppress insufficient samples | PRODUCT, ANALYTICS, PRIVACY | data-flow/query/report-copy tests |
| R-044 | Vertical Slice implementation advances one named VS step at a time only after passing tests, a completion report and explicit owner approval for the next step | PLAN, VERTICAL-SLICE, TESTING | step report/approval audit |

Mỗi implementation requirement mới nhận ID ổn định trước khi code. Release record ghi version/environment/date/result/artifact/unresolved risk.
