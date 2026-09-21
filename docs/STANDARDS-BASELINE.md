# Standards and evidence baseline

> Trạng thái: DRAFT — baseline bắt buộc cho Vertical Slice và các giai đoạn sau  
> Cập nhật: 2026-09-21  
> Mục đích: dùng tiêu chuẩn ngành làm tiêu chí thiết kế/kiểm chứng, không tuyên bố chứng nhận

## 1. Cách sử dụng

Atlas English áp dụng tiêu chuẩn theo rủi ro và theo giai đoạn. Một tiêu chuẩn chỉ được xem là đạt khi có bằng chứng kiểm tra gắn với phiên bản release; việc nhắc tên tiêu chuẩn trong tài liệu không phải chứng nhận tuân thủ.

Khi phiên bản nguồn bên ngoài thay đổi, dự án giữ phiên bản đã dùng cho release hiện tại, đánh giá chênh lệch rồi mới nâng baseline. Không tự động thay đổi hành vi học hoặc security control chỉ vì tài liệu bên ngoài được cập nhật.

## 2. IELTS và chất lượng học thuật

Nguồn chuẩn chính:

- [IELTS Academic test format](https://ielts.org/take-a-test/test-types/ielts-academic-test), truy cập 2026-09-21;
- [IELTS scoring in detail](https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail), truy cập 2026-09-21;
- [IELTS Writing band descriptors](https://ielts.org/cdn/ielts-guides/ielts-writing-band-descriptors.pdf), truy cập 2026-09-21;
- [IELTS Speaking band descriptors](https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf), truy cập 2026-09-21;
- [Official IELTS Academic sample questions](https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test), truy cập 2026-09-21.

Áp dụng:

- Mọi `IELTS relevance` phải trỏ tới một kỹ năng, dạng nhiệm vụ, tiêu chí công khai hoặc language function cụ thể; không dùng nhãn chung “từ IELTS”.
- Không gắn band cho item/node. Band chỉ đi qua calibration gate trong `IELTS-ASSESSMENT-FRAMEWORK.md`.
- Writing mechanics không được đại diện cho bốn tiêu chí Writing; pronunciation practice không được đại diện cho bốn tiêu chí Speaking.
- Content review kiểm tra construct, đáp án, accepted variants, distractor rationale, register, fairness/background knowledge và khả năng transfer—not chỉ ngữ pháp bề mặt.
- Official sample dùng để hiểu format, không sao chép thành nội dung game.
- Mỗi lần chuẩn bị Public Preview/Beta phải kiểm tra lại format/descriptor chính thức và ghi ngày truy cập; thay đổi bên ngoài tạo review task, không âm thầm sửa pack đã phát hành.

## 3. Khoa học học tập

Evidence tham chiếu:

- Roediger & Karpicke, [Test-enhanced learning](https://pubmed.ncbi.nlm.nih.gov/16507066/), 2006;
- Cepeda et al., [Spacing effects in learning](https://escholarship.org/uc/item/0kp5q19x), 2008.

Áp dụng có giới hạn:

- Ưu tiên retrieval practice và delayed review hơn đọc lại thụ động.
- Dùng spacing theo thuật toán versioned, nhưng không tuyên bố khoảng cách hiện tại là tối ưu cho mọi người học.
- Interleaving chỉ thêm sau khi người học đã có ví dụ/contrast đủ rõ; không trộn kỹ năng chỉ để tạo cảm giác khó.
- Học có hướng dẫn phải chuyển dần sang independent production và IELTS transfer.
- Dữ liệu Owner Alpha chỉ dùng để tìm lỗi/cải thiện trải nghiệm, không chứng minh hiệu quả học tập cho quần thể.

## 4. Game design và engagement có đạo đức

Các nguyên tắc nội bộ bắt buộc:

- **Learning-first core loop:** mục tiêu → hành động ngôn ngữ → phản hồi → reflection/review → safe stop.
- **Fail forward:** sai không gây game over, mất tài nguyên, mất truyện hoặc shame copy; hệ thống cung cấp hint/rescue/independent retry đúng hợp đồng evidence.
- **Competence, autonomy, meaning:** người chơi hiểu mục tiêu, có lựa chọn dừng/bỏ story/chọn bài khác và thấy kỹ năng được dùng trong một tình huống có ý nghĩa.
- **Không dark pattern:** không loot box, random reward, energy timer, streak punishment, countdown/FOMO, false scarcity hoặc social pressure.
- **Pacing:** một cluster chỉ có một learning objective chính và tối đa một interaction pattern mới; narrative không đưa thêm mục tiêu từ vựng ngoài curriculum.
- **Difficulty guardrail:** không tự tăng khó chỉ để kéo dài phiên; thay đổi độ khó dựa trên eligible evidence, có reason code, confidence gate và đường quay lại bài có hướng dẫn.
- **Retention quality:** đánh giá quay lại cùng learning evidence, completion, error recovery và voluntary feedback; không tối ưu time-on-app đơn lẻ.

## 5. Web UX và accessibility

Nguồn chuẩn: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) mức AA cho core flows.

Baseline:

- keyboard hoàn chỉnh, landmarks/headings đúng, `lang` cho tiếng Việt/Anh, focus không bị sticky UI che;
- text zoom 200%, reflow ở 320 CSS px, không phụ thuộc màu/chuyển động/hover/gesture;
- target đạt tối thiểu WCAG 2.2 AA 24 × 24 CSS px; control thường xuyên, tuần tự hoặc có hậu quả hướng tới 44 × 44 CSS px;
- lỗi nêu rõ nguyên nhân/cách sửa; status async được thông báo nhưng không cướp focus;
- authentication không ép cognitive-function puzzle hoặc cấm password manager/paste không có lý do;
- reduced motion, high contrast và screen-reader smoke test là release evidence, không chỉ design note.

## 6. Hiệu năng web

Nguồn chuẩn: [Core Web Vitals](https://web.dev/articles/vitals).

Ngưỡng p75 trên nhóm thiết bị/mạng mục tiêu:

- LCP ≤ 2.5 giây;
- INP ≤ 200 mili giây;
- CLS ≤ 0.1.

Ngoài ra, submit phải có trạng thái rõ ngay lập tức, không double-submit; learning UI không chờ tải asset truyện không thiết yếu; ảnh/font/audio lazy-load theo nhu cầu; không thêm third-party script không có owner, privacy purpose và performance budget.

## 7. Application security và Supabase

Nguồn chuẩn:

- [OWASP ASVS 5.0](https://owasp.org/projects/asvs/);
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security);
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html);
- [PostgreSQL `CREATE FUNCTION`](https://www.postgresql.org/docs/current/sql-createfunction.html).

Baseline dự án:

- Owner Alpha/Public Preview kiểm tra tối thiểu các control ASVS Level 1 liên quan; auth, dữ liệu cá nhân, admin, export/delete và backup áp dụng thêm control Level 2 theo threat model. Không tuyên bố “ASVS certified”.
- Mọi table/view/function trong exposed schema dùng deny-by-default grants và RLS; policy tách theo operation/role và có cả allow/deny test.
- View exposed phải dùng `security_invoker` khi phù hợp hoặc revoke quyền rõ ràng; không dựa vào RLS của table một cách mặc định.
- Grants và RLS là hai lớp độc lập: policy không thay thế `REVOKE/GRANT`; `UPDATE` phải được kiểm tra cả quyền nhìn thấy row và điều kiện row sau cập nhật.
- Function có đặc quyền phải cố định `search_path`, revoke quyền thực thi mặc định và chỉ grant cho đúng server role; mọi trường hợp `SECURITY DEFINER` cần review riêng.
- Service role/backup/admin secret chỉ server/automation, không ở browser, repo, log hoặc untrusted CI.
- Các action bên ngoài được pin immutable commit; dependency lockfile bắt buộc; release tạo dependency inventory/SBOM và chạy license/vulnerability/secret scan.

Baseline này được đối chiếu lại ngày 2026-09-21 trong P-032. Việc triển khai thật vẫn phải chứng minh bằng role/operation tests trên môi trường tách biệt sau khi Vertical Slice được phê duyệt.

## 8. Software quality và operations

- Contract/version cho schema, content, narrative, evaluator, mastery, scheduler và release handshake.
- Architecture fitness checks bảo vệ import boundaries; UI không gọi Supabase trực tiếp; domain không import framework/browser/infrastructure.
- Attempt append-only/idempotent; retry/backoff có giới hạn và jitter ở network boundary; không retry lỗi validation/authorization.
- Structured operational event có correlation/request ID không chứa PII; cùng một ID nối client error, server request và attempt idempotency mà không log raw answer.
- Migrations forward/backward-compatible trong rollout; backup success không thay restore evidence.
- Blameless incident review ghi nguyên nhân hệ thống, impact, detection gap, correction và prevention owner.

## 9. Evidence cần lưu theo release

| Lĩnh vực | Bằng chứng tối thiểu |
|---|---|
| IELTS/content | content hash, reviewer record, construct/answer/distractor/claim checklist |
| Learning | golden/replay tests, algorithm version, eligibility/no-op cases |
| Game/UX | wireframe/flow review, safe-stop/fail-forward evidence, owner Alpha findings |
| Accessibility | automated scan + keyboard + screen-reader + zoom/reflow + reduced-motion record |
| Performance | lab result và field p75 khi có đủ dữ liệu; thiếu sample phải ghi `insufficient data` |
| Security | ASVS control subset, threat/RLS allow-deny tests, secret/dependency/SBOM evidence |
| Operations | health/rollback/backup result và isolated restore record |

Release không được biến `không đủ dữ liệu` thành `đạt`.
