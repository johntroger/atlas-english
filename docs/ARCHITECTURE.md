# Architecture

> Quyết định nền: ADR-001, ADR-003, ADR-005, ADR-006, ADR-011, ADR-013, ADR-014 và ADR-015.

## Tổng quan

Atlas English là modular monolith online-first:

```text
Browser UI
  -> Application use cases / ports
      -> Pure domain modules
      -> Supabase adapters (Auth/PostgreSQL/Storage)
      -> Content delivery adapters
      -> Observability adapters
```

Next.js/React/TypeScript phục vụ UI và application shell; Supabase là authoritative store cho tài khoản; Vercel host website. Không có microservices trong MVP.

## Module boundaries

- `domain`: attempt, mastery, review, quest, feedback, evidence, assessment policy; TypeScript thuần.
- `application`: use cases, authorization, transaction/idempotency coordination.
- `infrastructure`: Supabase, content repository, email, telemetry adapters.
- `ui`: page/components/state presentation; không gọi Supabase trực tiếp.
- `content-tooling`: validate/build/release pack; không chạy generation lúc người học làm bài.

Domain không import React, browser API, IndexedDB, Supabase hoặc framework module.

## Request paths

### Evaluation authority

- UI gửi answer payload, item/content version và idempotency key; không gửi một `correct` flag được tin cậy.
- Shared pure-domain evaluator có thể chạy ở client để phản hồi nhanh cho public practice.
- Application/server tải cùng scoring contract, xác minh answer, eligibility theo `LEARNING-CONTRACT.md` và ghi attempt/evidence.
- Client result chỉ là optimistic display; acknowledged server result là authoritative cho account history/mastery.
- Private assessment item/key/scoring luôn server-side và chỉ thuộc giai đoạn post-validation.
- Server binds actor from verified auth or a server-bound guest credential, canonicalizes the command and stores a `request_hash`; same actor/key with a different payload is a conflict, not a retry.
- In the Vertical Slice, acknowledgement is returned only after the attempt/evidence/projection transaction commits. Lost responses are recovered by replaying the exact same command/key and returning the stored acknowledgement.

### Guest practice

1. Server gửi public practice item không chứa private key.
2. Browser giữ guest ID ngẫu nhiên và trạng thái tối đa 24 giờ.
3. Attempt hoàn thành được giữ trong phạm vi guest; chỉ import vào account sau consent.

### Account practice

1. Session được xác minh.
2. Use case kiểm tra authorization/RLS và content version.
3. Attempt append-only được ghi bằng client UUID/idempotency key.
4. Evidence/mastery projection được cập nhật theo algorithm version.

### Assessment

Private item bank ở kho/storage riêng. Server chọn form/item theo exposure policy và chỉ gửi phần cần hiển thị. Answer key được giữ server-side cho đến khi policy cho phép phản hồi.

## Online interruption

- Không service worker, PWA cache, IndexedDB database, offline queue hoặc conflict merge.
- `sessionStorage` chỉ giữ current answer tối đa 30 phút. `localStorage` chỉ giữ guest state tối thiểu tối đa 24 giờ với TTL bắt buộc; không có PII, raw free-form answer, secret, audio, private answer key hoặc lịch sử tài khoản.
- Khi offline: không phát câu mới; current answer được giữ để retry; technical error không tạo wrong attempt.
- Writing autosave theo debounce lên server; một active editor, takeover rõ ràng.

## Security boundaries

- Browser là untrusted boundary.
- RLS và application authorization đều bắt buộc.
- Browser receives no direct mutation grant on learning/story/consent tables. Authenticated reads are owner-scoped; mutation runs through hardened application use cases/RPC or a rate-limited guest server endpoint.
- Dev/Preview/Production tách project/data/secret.
- Server/client logs không chứa answer key, audio, email thô không cần thiết hoặc secret.
- Admin role least privilege, MFA và elevated session 15 phút.

## AI boundary

MVP không có runtime generative AI, speech recognition hoặc external transcription. ADR-014 chỉ mô tả khả năng Gemini BYOK tương lai; không được thêm dependency, UI hoặc storage AI khi chưa phê duyệt giai đoạn.

## Reliability

- Append-only attempt + idempotency cho retry an toàn.
- Projection có thể rebuild từ evidence hợp lệ.
- Content pack immutable/versioned; rollback không sửa artifact cũ.
- Migrations backward-compatible trong rollout.
- Backup mã hóa rolling 30 ngày; isolated restore trước Public Preview, hằng tháng trong ba tháng public đầu rồi hằng quý.

## Deployment

- GitHub public source repository không chứa secret/private assessment bank.
- Vercel Preview dùng non-production data.
- Owner Alpha là online Preview nhưng nằm sau một access boundary bên ngoài product guest/auth flow. Ưu tiên hosting-level protection nếu khả dụng; fallback là server-side Alpha gate. Sau khi qua boundary, owner vẫn test được guest/account/import như người dùng bình thường.
- Alpha gate configuration/secret chỉ tồn tại trong environment secrets; không nằm trong client bundle, public repository, URL hoặc content pack. URL không được dùng như một credential.
- Owner Alpha connects only to a dedicated Supabase Preview project. A later Public/Production environment receives a new project/configuration; no connection string, auth user, session or database is promoted in place.
- Optional owner-history transfer is an explicit application-level export/import or one-time migration, never a whole-database clone. Derived mastery is recomputed from eligible imported evidence under the destination algorithm version.
- Production release có schema/content checks, health check, feature flag và auto rollback.

## Delivery boundary

Lần phê duyệt implementation đầu tiên chỉ được mở `VERTICAL-SLICE.md`. Module/interface có thể chuẩn bị cho mở rộng nhưng không tạo database/table/UI/dependency cho tính năng ngoài slice nếu chưa cần cho contract hiện tại.
