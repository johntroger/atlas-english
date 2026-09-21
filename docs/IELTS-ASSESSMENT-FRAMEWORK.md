# IELTS assessment and calibration framework

> Trạng thái: DRAFT — mọi band/readiness claim cần evidence gate

## Mục đích

Atlas English luyện nền tảng và micro-skills; không tự phát hành Overall IELTS band. Nội bộ chỉ có thể hiển thị Listening/Reading band khi form timed đã được review và calibration. Writing Practice và Pronunciation Studio không phải band assessment.

## Lớp bằng chứng

| Lớp | Hiển thị band? |
|---|---|
| Kết quả câu/cluster | Không |
| Node mastery | Không |
| Weekly transfer task | Không |
| Internal LR form chưa hiệu chuẩn | Không; raw score + nhãn thử nghiệm |
| Internal LR form đã hiệu chuẩn | Có, riêng L/R, cùng uncertainty/version |
| External/official result | Có, kèm nguồn/ngày/confidence |

## Baseline

- Diagnostic tùy chọn, chia mô-đun khoảng 5 phút.
- Người dùng có external score gần đây có thể bỏ qua diagnostic hoàn toàn.
- Điểm tự khai chỉ tạo provisional baseline và ưu tiên học; không tạo mastery/readiness.
- Nếu làm baseline đầy đủ: timed Academic Listening, Academic Reading, Writing Task 1/2 và Speaking sample được reviewer phù hợp đánh giá.
- Không sao chép test content được bảo hộ vào content pack.

External score event gồm skill, score/raw score, date, source, condition, reviewer/confidence và `supersedes_id`. Sửa điểm tạo revision mới, không ghi đè lịch sử. Confidence suy giảm khi bằng chứng cũ.

## Tên gọi bắt buộc

- `Mô phỏng Listening–Reading`, không `Full IELTS`.
- `Writing Practice`, không `IELTS Writing score`.
- Pronunciation dùng ba mức, không `Speaking score`.
- Thiếu bằng chứng: `Chưa đủ bằng chứng`.

## Writing

Mechanics engine chỉ có thể quan sát spelling, repetition, length/structure signal và rule đã hiệu chuẩn. Nó không chấm Task Achievement/Response, Coherence and Cohesion, Lexical Resource toàn diện hoặc Grammatical Range and Accuracy toàn diện.

- Bản nộp đầu tiên của cùng prompt mới đóng góp mastery mechanics.
- Revision/retry là practice.
- Feedback tối đa 3 nhóm lỗi ưu tiên.
- Low-confidence observation không làm giảm mastery; người học có thể đánh dấu `Không phải lỗi`.
- Paste được phép, nhưng item có hỗ trợ bên ngoài phải gắn practice-only; assessment yêu cầu self-attestation và tắt browser assist trong khả năng kiểm soát.

## Pronunciation

Local signal chỉ phản ánh điều kiện ghi âm và delivery proxy. Không đo phoneme, accent correctness, word recognition hoặc full Speaking criteria. Recording và self-review chỉ là practice; chỉ perception/discrimination task có đáp án xác định mới có thể tạo mastery. Confidence không đủ thì không phán đoán.

## Listening/Reading

- Band chỉ từ form có blueprint, item review, calibration sample, version và conversion table được duyệt.
- Unseen material và exposure control bắt buộc.
- Practice: transcript sau câu trả lời; tốc độ 0.75–1.25 và replay theo thiết kế.
- Assessment: transcript sau submit, tốc độ 1x, replay theo form.
- Technical audio failure hủy/thay item, không tính sai.
- Learning audio không kiểm tra Listening có thể hiện transcript ngay.

## Readiness

- Mastery không chuyển thẳng thành band.
- Overall readiness chỉ khi có L/R evidence đủ mới và W/S evidence hiện hành từ nguồn phù hợp.
- Self-assessment W/S một mình không kích hoạt trạng thái ready.
- Hiển thị trend và uncertainty, không readiness percentage.
- Một mock mạnh duy nhất không đủ; dùng ít nhất hai trong ba điểm so sánh gần nhất, bao gồm một evidence set đủ rộng.
- Nếu mastery tăng mà calibration không tăng, phải xem lại content validity, transfer coverage và thuật toán.

## Cadence

- Weekly: một transfer sample ngắn, không band.
- Mỗi 4 tuần: mini-assessment unseen, raw trend; band chỉ nếu calibrated.
- Mỗi 8 tuần: broader mock/reviewed skill set.
- Tối đa khuyến nghị một full LR mock/tuần.
- Khi người dùng có ngày thi, roadmap chuyển phase; không bắt buộc deadline.

## Timed assessment integrity

- Mobile được phép nhưng khuyến nghị màn hình lớn; chỉ lưu device category, không fingerprint.
- Rời mock giữa chừng → incomplete, không readiness.
- Chỉ lưu tổng số/thời lượng focus changes; không webcam hoặc screen recording.
- Answer key/private item không có trong public repo hoặc client payload trước thời điểm cho phép.

## Cổng calibration

Trước khi hiển thị band: blueprint coverage, independent IELTS review, beta sample phù hợp, item analysis, reliability/uncertainty, conversion validation, form equivalence, exposure/retirement và wording audit đều phải đạt. Không đạt bất kỳ điều kiện nào thì giữ raw score + experimental label.
