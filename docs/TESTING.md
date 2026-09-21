# Test strategy

## Step-gated execution

Implementation tests chạy theo từng cổng `VS-01`–`VS-09` trong `VERTICAL-SLICE.md`. Một bước chỉ hoàn thành khi acceptance criteria của nó đạt và tất cả check bắt buộc liên quan đều pass. Test fail giữ bước ở trạng thái `in_progress` hoặc `blocked`; không được bỏ qua, hạ mức hoặc chuyển sang bước kế tiếp chỉ để giữ tiến độ.

Sau mỗi bước, completion report phải ghi command/check class, phạm vi, kết quả pass/fail, lỗi đã sửa, test chưa thể chạy và lý do, migration/compatibility impact, cùng residual risks. Báo cáo phải được đưa cho chủ dự án trước khi xin quyền mở đúng bước tiếp theo. Approval của bước trước không thay thế approval này.

## Test pyramid

1. Domain unit/golden tests.
2. Schema/content validation.
3. Application/database integration tests.
4. End-to-end browser tests.
5. Manual academic, accessibility and device review.

## Unit/golden

- answer normalization, variants và ambiguity;
- error classification, feedback wording và confidence gate;
- mastery/evidence/review/quest determinism theo version/seed;
- first-attempt eligibility, hint practice-only và cooldown;
- retention/date/timezone/streak rules;
- pronunciation signal boundaries và Writing mechanics false positives.
- eligibility golden cases từ `LEARNING-CONTRACT.md`, đặc biệt hint/recording/open-Writing mastery unchanged.
- exact mastery v0.1 vectors: `null→24`, `24→34`, capped `34→46`, capped failure `80→65`, same-day recognition `80→81`, plus idempotent retry and technical no-op.
- Narrative Pack 3–5 slot, one-primary-objective, convergent-choice và version snapshot fixtures.
- learning-node completion-contract fixtures: mastery/practice/external channel phải phù hợp assessment mode; prerequisite unlock dùng đúng channel, rule code, target và minimum evidence.

## Integration

- magic link/code lifecycle: one-use, challenge expiry 60 phút, vô hiệu sau 5 lần sai, xin challenge mới khi pending account còn hạn; abuse limits và pending-account expiry 24 giờ;
- current-answer `sessionStorage` TTL 30 phút và minimal-guest `localStorage` TTL 24 giờ; expiry/import cleanup, không PII/raw free-form answer/secret/audio/private key;
- RLS/cross-user/role/elevated session;
- append-only attempts và idempotent retry cho cả account scope lẫn guest-provenance scope;
- same actor/key/same payload returns the stored acknowledgement under sequential and concurrent retry; same key/different payload returns conflict with no additional attempt/evidence/reward;
- attempt snapshot giữ item/content/narrative/evaluation/scoring-contract/selection versions để replay cho cùng kết quả;
- guest import transaction/provenance;
- one guest provenance can be imported into only one destination account; concurrent imports yield one receipt and no partial evidence/story/reward state;
- last-slot concurrent mission completion grants exactly one first-completion ID and one `(user,reward)` row; replay never creates another grant;
- Writing autosave/version/lease/takeover;
- lifecycle jobs, export, reset, deletion và inactivity;
- private assessment delivery/exposure/retirement;
- backup restore và backward-compatible migration.
- Owner Alpha version handshake, safe-boundary activation, last-known-good rollback and P0 kill-switch path; no reload during `answering`/`submit_pending` and no wrong attempt on safety interruption.
- Public Vertical Slice has no separate product/learning event pipeline; aggregate account metrics use only service-required records, exclude raw answers, suppress undersized samples and never infer guest return from expired/local-only state.

## E2E

- Guest landing → Quick Start → 3–5 câu → checkpoint.
- Guest expiry và login import consent/decline.
- Account onboarding/optional diagnostic/home/learn/history.
- Mất mạng giữa câu → buffer → reconnect → one submit.
- Writing autosave, reconnect và takeover.
- Mic denied/unsupported/low confidence/valid first recording; mọi recording path giữ mastery unchanged.
- Uncalibrated vs calibrated assessment wording.
- Content incident/retire và server unavailable state.
- Alpha update becomes pending during an item, activates at checkpoint/safe stop, and preserves acknowledged progress/current-answer recovery within the approved limits.
- Export/delete/reset recovery flows.

## Security/privacy checks

- dependency/secret/license scan;
- no runtime AI/speech/transcription endpoint in MVP bundle;
- no audio, answer key or sensitive content in logs/analytics/export;
- CSRF/XSS/injection/auth enumeration/rate-limit tests;
- guest ID cannot escalate or access account/private data;
- analytics absent until opt-in and deleted/unlinked after withdrawal.
- Owner Alpha outer gate denies unauthenticated access, keeps its secret out of bundle/URL/logs, rate-limits failures, works on phone/desktop and still permits the owner to test guest/account/import without bypassing product authorization.
- Owner Alpha breaking-reset tests prove no reset can run without the exact environment/scope confirmation, a verified backup reference and impact manifest; cancelled/missing confirmation preserves all data. The Alpha override is impossible in Public/Production configuration.
- OWASP ASVS 5.0 applicable-control record; relevant Level 1 plus risk-selected Level 2 controls have test/evidence or a documented `not applicable` rationale.
- Supabase tests assert grants and RLS policies separately for every exposed operation/role; cross-user insert/update ownership changes fail; exposed views/functions cannot bypass underlying policy.
- the P-032 allow/deny matrix covers `anon`, owner, other user, expired/deleted actor, correct/incorrect operator scope and correct/wrong-environment service job for SELECT/INSERT/UPDATE/DELETE/EXECUTE as applicable.
- CI action pinning, frozen lockfile, dependency inventory/SBOM, vulnerability/license and secret scans pass or have a time-bounded owner-approved exception.

## Content/academic tests

- JSON Schema validation and fixture expectations;
- referential integrity, stable IDs, hashes, provenance/licenses;
- answer/explanation correctness and British/American acceptance;
- curriculum coverage/duplication/sensitivity review;
- assessment blueprint, calibration, form equivalence and claim audit.
- item construct, distractor rationale/option functioning, ambiguity, register/corpus basis, fairness/sensitivity and copy-budget review.
- every Vertical Slice mission fixture maps its primary construct to the declared observable dossier/Notebook change; generic completion copy, a mismatched story change or a hinted attempt presented as mastery fails validation.
- Vertical Slice release evidence covers all 30 items and every learner-facing English narrative string, binding reviewer identity/qualification path, independence declaration, decision and review timestamp to the exact Content/Narrative Pack hash; sampling is insufficient. Product Owner narrative approval and accessibility evidence are separate records.

## Device matrix

- Phone: Safari iOS, Chrome Android.
- Desktop: Chrome, Edge, Safari macOS where available.
- Two latest browser versions; narrow/wide viewport, touch/keyboard.
- Slow network, mid-answer disconnect, server error, denied mic.

## Accessibility

Keyboard-only, focus order, screen reader labels/live regions, contrast AA, zoom/font sizes, reduced motion, captions/transcripts policy, error identification and no color-only meaning.

## Release evidence

Record command/check, version, environment, result, artifact/link, reviewer and unresolved risk. Preview/test must never use Production data.

Không chạy full-suite Beta/assessment gate để hợp thức hóa việc vượt scope: vertical slice có test plan riêng và vẫn phải chứng minh server-authoritative evaluation, RLS/idempotency, narrative/content schema, mobile/accessibility và guest import.
