# Vertical slice specification

> Trạng thái: DRAFT — chưa được phép triển khai  
> Chỉ bắt đầu sau khi PLAN ghi `APPROVED — VERTICAL SLICE ONLY`

## Mục tiêu

Chứng minh một vòng học online hoàn chỉnh, có truyện nhưng vẫn phục vụ IELTS, trên mobile và desktop. Sau implementation approval riêng, slice đi qua Owner Alpha chỉ có chủ dự án trước. Public Preview cho người dùng khác là lần phát hành riêng, dự kiến dưới 10 người dùng ban đầu và chưa quảng bá như public beta. Đây không phải MVP đầy đủ hoặc Production.

Trước khi xin quyền code, chỉ cần hoàn tất các low-fidelity responsive wireframe/state map được quy định trong [PROTOTYPE-PLAN.md](PROTOTYPE-PLAN.md) và lưu trong [WIREFRAMES.md](WIREFRAMES.md); không cần prototype clickable/high-fidelity riêng. Sau khi được phê duyệt triển khai, chính Owner Alpha của slice này là prototype tương tác đầu tiên.

## Luồng

```text
Landing
→ Guest Quick Start
→ Prologue ngắn
→ mini-episode 3 mission
→ mỗi mission 3–5 câu / một objective chính
→ deterministic feedback
→ checkpoint
→ một independent review variant
→ first contextual optional email sign-in invitation
→ consented guest import
→ account history
```

## Nội dung

- Ba node đã chọn: `grammar.sentence.boundaries`, `grammar.nouns.countability` và `vocabulary.cause_effect`; cả ba hiện không có prerequisite.
- Mission mapping là one-primary-objective: Mission 1 → sentence boundaries; Mission 2 → noun countability/quantifier accuracy; Mission 3 → cause/effect vocabulary and claim strength. Không trộn ba mục tiêu chính trong cùng mission.
- Central case: hai bản tóm tắt của cùng khảo sát sinh viên về học online không khớp nhau; người chơi lần lượt sửa cấu trúc câu, phạm vi lượng từ và kết luận nhân quả quá mạnh để phục hồi ngữ cảnh.
- Cause: lỗi hợp nhất nhiều bản nháp làm mất context markers; không có villain hoặc nhân vật bị biến thành nguồn gây lỗi lặp lại.
- Choice: đúng một lựa chọn nhỏ lưu Notebook flag và đổi dialogue; nhánh hội tụ trước ending, không khóa bài học hoặc thay đổi mastery/reward.
- Cast: chỉ Ato và Mira là active characters; không giới thiệu thêm nhân vật trong mini-episode.
- Reward: first completion grants a fixed `Context Restored` Notebook stamp, one map reveal and the independent review; no currency, randomness, expiry or duplicate replay grant.
- 30 core item được soạn theo blueprint, chia đều 10 item/node. Trong implementation chúng có thể ở trạng thái draft/Codex pre-reviewed để dùng nội bộ; trước Public Preview cho người dùng thật, một qualified human reviewer độc lập phải duyệt 100% theo `CONTENT-SYSTEM.md`. Author/Codex không được tự academic-approve. Mỗi node có 6 independent mastery-eligible items, 2 hinted practice-only items và 2 independent review/transfer items; ít nhất hai interaction formats/node.
- First-run story lấy khoảng 4 item/mission, tổng khoảng 12 item qua ba chặng. Item còn lại dành cho variant selection, independent review và replay để tránh lặp sớm.
- Một Narrative Pack gồm Prologue + mini-episode 3 mission.
- Một lỗi sai có targeted hint, explanation, independent variant và delayed review fixture.
- Không pronunciation production trong critical path; có thể làm technical spike riêng.

## Trong phạm vi

Responsive shell, guest 24h, verified account flow tối thiểu, append-only/idempotent attempt, deterministic evaluator, evidence/mastery projection tối thiểu, checkpoint/safe stop, content+narrative schema validation, online interruption buffer và basic accessibility.

Quick Start is never gated by authentication. Sign-in is secondary on Landing and first promoted after the initial checkpoint; declining keeps the learner in guest play.

Before a publicly reachable Preview is released to any non-owner user, it must have a short privacy notice, auth/attempt/import rate limits, request-size limits, provider quota monitoring, signup/nonessential-feature kill switches and completed human academic review. Before those gates pass, deployments must remain owner-restricted/internal. Public reachability does not authorize Production data, marketing or a public-beta claim.

Owner Alpha may use draft/Codex-pre-reviewed content and does not require external usability participants or specialist review. Access must be limited to the owner, while feature flags or equivalent controls still let the owner test guest/signup/import states safely. Owner Alpha never promotes itself to Public Preview; the owner must explicitly approve that transition after reviewing remaining release blockers.

## Ngoài phạm vi

Full Season 1; spelling/pronunciation/Writing modules hoàn chỉnh; calibrated assessment/band; production private bank; Campaign 2+; Atlas Dispatch/Character Cases; advanced analytics; inactivity/delete/export automation đầy đủ; AI; Production deployment.

Các privacy/security contract vẫn phải được tôn trọng. Ngoài phạm vi ở đây có nghĩa là chưa triển khai trong slice, không phải miễn trừ cho public beta.

## Acceptance

- Guest hoàn thành ba mission và checkpoint trên phone/desktop.
- First-run ba mission không vượt quá khoảng 12 item; mỗi checkpoint xuất hiện sau tối đa 5 item.
- Story skip vẫn đủ context làm bài.
- Hint không đổi mastery; review independent variant xử lý đúng.
- Retry cùng actor/key/request hash không nhân đôi attempt/reward/evidence; key reuse với payload khác bị từ chối.
- Sign-in import cần consent và không nhập partial attempt.
- Server không tin client correctness/eligibility một cách mù quáng.
- Không secret/private key/audio/PII trong bundle/log.
- Keyboard, focus, contrast và reduced-motion flow đạt yêu cầu.
- Content/narrative packs immutable/versioned và rollback được trong test.
- Cả 30 item có independent academic approval gắn đúng content hash; bất kỳ thay đổi học thuật sau duyệt đều vô hiệu approval cũ.
- Toàn bộ learner-facing English của Prologue/ba mission có approval của cùng qualified reviewer gắn đúng Narrative Pack hash; Product Owner approval về story/tone và accessibility review được ghi riêng.

## Exit decision

Sau Owner Alpha, Product Owner chọn: tiếp tục sửa, chuẩn bị Public Preview, hoặc dừng. Public Preview và Beta MVP đều cần gate/phê duyệt riêng; việc chủ dự án dùng được không được coi là bằng chứng usability đại diện hoặc tự động phê duyệt giai đoạn sau.

## Trình tự triển khai sau khi được phê duyệt

Thứ tự này chỉ có hiệu lực sau khi `PLAN.md` ghi `APPROVED — VERTICAL SLICE ONLY`; nó không tự cấp quyền code:

1. `VS-01` — Khởi tạo Git/GitHub, framework tối thiểu, lockfile và kiểm tra dependency/secret cơ bản.
2. `VS-02` — Xây domain evaluator thuần cùng executable golden tests cho Learning Contract v0.1.
3. `VS-03` — Xây validator cho Content Pack, Narrative Pack và learning-node fixtures.
4. `VS-04` — Hoàn thành một mission bốn item chạy xuyên suốt trên mobile/desktop bằng dữ liệu tạm thời.
5. `VS-05` — Mở rộng thành ba mission/khoảng 12 first-run item và toàn bộ 30-item selection contract.
6. `VS-06` — Thêm server acknowledgement, append-only attempt, request hash, idempotent retry và persistence.
7. `VS-07` — Thêm guest TTL, account verification, explicit guest-import consent và account history.
8. `VS-08` — Thêm checkpoint, story reward, replay/no-duplicate grant và safe-boundary update behavior.
9. `VS-09` — Hoàn thiện accessibility, responsive review, interruption/recovery, security checks và owner-restricted Alpha release gate.

### Cổng bắt buộc giữa các bước

- `APPROVED — VERTICAL SLICE ONLY` chỉ cho phép bắt đầu `VS-01`; không mở trước toàn bộ chín bước.
- Trước khi code một bước, Codex phải nêu phạm vi, file dự kiến tác động, acceptance criteria và test plan của chính bước đó.
- Sau khi code, Codex phải chạy các kiểm tra liên quan trong `TESTING.md`, sửa mọi lỗi trong cùng bước và chạy lại cho đến khi đạt hoặc báo blocker trung thực.
- Báo cáo kết thúc bước phải gồm: thay đổi, acceptance criteria đạt/chưa đạt, checks đã chạy và kết quả, migration/compatibility impact, rủi ro còn lại, cùng đề xuất chính xác cho bước kế tiếp.
- Sau báo cáo, Codex phải dừng và hỏi chủ dự án có cho phép mở đúng bước kế tiếp hay không. Chỉ một câu trả lời đồng ý rõ ràng cho bước được nêu mới mở bước đó; im lặng, yêu cầu sửa, câu hỏi hoặc “tiếp tục” không gắn với báo cáo bước không được suy diễn thành quyền mở rộng.
- Nếu bất kỳ check bắt buộc nào fail, acceptance criterion chưa đạt hoặc chủ dự án chưa đồng ý, bước kế tiếp vẫn khóa. Chỉ được sửa/retest bước hiện tại hoặc làm công việc tài liệu được phép.
- Không code song song hai bước, không chia nhỏ để lách gate, không chuẩn bị trước implementation của bước chưa mở và không đưa phạm vi Beta/Public/Production vào một approval của Vertical Slice.

Mỗi bước chỉ mở khi cổng trên đạt; không kéo Writing, Pronunciation, private assessment bank, AI hoặc broader analytics vào Vertical Slice.
