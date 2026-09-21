# Online submission and continuity protocol

> Tên tệp được giữ để không làm hỏng liên kết cũ. ADR-013 đã thay thế giao thức offline sync.

## Không còn trong phạm vi

Không có IndexedDB source of truth, client outbox, background sync, service worker, offline mutation queue hoặc conflict merge giữa local/cloud.

## Submit attempt

### Command contract

Client gửi `attempt_id`, `idempotency_key`, answer payload, item/node/content snapshot IDs+versions, optional narrative mission/slot snapshot, hint-use state và client timestamp chỉ để hỗ trợ UX/audit. Client không gửi hoặc server bỏ qua mọi `correct`, `score`, `evidence_eligible`, `progress_channel`, `server_outcome`, mastery, reward hoặc active-release claim.

Server canonicalize command sau khi bind trusted actor scope rồi tính `request_hash`. Answer payload phải qua typed schema và giới hạn 32 KB trước database work.

### Authoritative sequence

1. Client tạo `attempt_id` và `idempotency_key` một lần, giữ nguyên command trong current-answer buffer.
2. Edge/application layer áp request-size và rate limit, xác minh CSRF/origin khi áp dụng, rồi resolve verified account hoặc server-bound guest provenance; actor ID trong body không có authority.
3. Server kiểm session/guest expiry, environment, content/narrative audience và version compatibility.
4. Server tải exact immutable item/scoring contract theo pack+item version; không dùng đáp án/correctness do client gửi.
5. Server canonicalize trusted actor + command và tính `request_hash`.
6. Nếu actor+idempotency key đã tồn tại: cùng hash trả stored acknowledgement; khác hash trả `409 idempotency_conflict`; cả hai nhánh không ghi thêm.
7. Domain evaluator chuẩn hóa đáp án, tính deterministic outcome/partial credit và mistake tags theo version đã snapshot.
8. Application layer tính progress channel/evidence eligibility theo node/exercise contract, hint, retry, technical/content status và `LEARNING-CONTRACT.md`.
9. Bắt đầu database transaction; thử insert append-only attempt với actor/key/hash unique constraints. Nếu concurrent insert thua, đọc row thắng và áp lại rule same-hash/different-hash ở bước 6.
10. Với verified account và eligible mastery attempt, insert tối đa một evidence event rồi cập nhật mastery/review projection bằng version đã snapshot. Guest attempt chưa tạo account mastery.
11. Nếu command đồng thời đóng checkpoint/mission, mission-completion use case kiểm đủ acknowledged slots; story progress, first-completion ID, reward và unlock commit theo contract riêng trong cùng transaction command đó. Không suy completion từ client flag.
12. Commit transaction trước khi tạo acknowledgement. Bất kỳ lỗi nào trước commit rollback toàn bộ learning/story/reward mutation.
13. Server trả acknowledgement gồm attempt ID, idempotency key, stored outcome, progress channel, eligibility/reason, version snapshot, projection/story status và server timestamp; không trả private key/secret.
14. Client chỉ đánh dấu `acknowledged`, xóa answer buffer và hiển thị authoritative feedback sau receipt. Nếu response mất sau commit, retry bước 1–6 lấy lại receipt.

Vertical Slice dùng transaction trực tiếp cho attempt/evidence/projection thay vì thêm server outbox chưa cần thiết. Rebuild vẫn có thể chạy từ append-only attempts/evidence nếu projection lỗi hoặc algorithm đổi; rebuild không sửa attempt gốc.

## Kết nối lại

- Chỉ current answer còn hạn mới được retry.
- Không submit nếu session hết hạn hoặc content version bị retire.
- Technical failure được ghi riêng nếu cần, không thành wrong answer.
- Người dùng phải thấy trạng thái và có thể copy câu trả lời dài trước khi bỏ.

## Cross-device

- Thiết bị đọc account state mới nhất từ server.
- Completed attempt không merge/update; projections là server-authoritative.
- Writing draft dùng optimistic version + active editor lease/takeover.
- Không dùng last-write-wins cho submitted work hoặc consent.

## Guest import

- Consent rõ trước import.
- Chỉ acknowledged completed result, còn hạn, compatible và không trùng provenance.
- Preview không ghi dữ liệu học. Sau consent, server claim `guest_session_id_hash` cho đúng một destination account.
- Import có actor-scoped idempotency key + server `request_hash`; same key/hash trả receipt cũ, same key/different hash bị từ chối.
- Import là một transaction: receipt, eligible evidence, rebuilt projection, compatible story progress và first-completion reward cùng commit; thất bại rollback toàn bộ, không nhập một phần.
- Server recompute từ guest attempt snapshot, không tin correctness/mastery/story/reward do client gửi.

## Consistency

- Lịch sử attempt: strong enough after acknowledged submit.
- Vertical Slice mastery/review projection của một attempt được commit cùng acknowledgement. Rebuild/incident recompute có thể asynchronous và UI phải báo `Đang cập nhật` trong thời gian đó.
- Consent, deletion lock, auth và assessment exposure yêu cầu server-authoritative check.

## Compatibility

API và database migration phải hỗ trợ phiên client hiện tại và phiên ngay trước trong rollout. Khi không tương thích an toàn, yêu cầu reload trước khi tiếp tục; không tự chấm bằng rule cũ.
