# Visual direction — Atlas 6.5

> **Status:** REVIEWED — direction and five-flow pre-code wireframe evidence accepted; implementation verification remains pending  
> **Working direction:** Atlas 6.5  
> **Product name:** Atlas English  
> **Current campaign:** Route to 6.5

## 1. Design intent

Atlas English is the durable product name; Route to 6.5 identifies the current learner goal. The selected Atlas 6.5 visual direction supports a multi-user IELTS product while keeping each journey personal. It should feel purposeful, calm, broadly age-appropriate, and rewarding without looking childish or imitating Duolingo.

The visual story world is the grounded `Atlas Initiative`, not a fantasy universe. Maps represent real-world topic routes and investigation progress. Mystery is communicated through incomplete documents, contrasting evidence and a missing-north compass mark; it must not introduce decorative lore or fantasy vocabulary. See [`NARRATIVE-DESIGN.md`](NARRATIVE-DESIGN.md).

The product metaphor is a personal expedition from the learner's current evidence toward stronger language foundations. The memorable visual is a living contour map. Exercise screens remain quiet so the visual identity never competes with learning.

## 2. Experience principles

- **Progress has geography:** learning nodes are places on a route, not a grid of generic cards.
- **The next action is obvious:** each screen has one primary action.
- **Learning evidence outranks decoration:** mastery, delayed review, and corrected mistakes are more prominent than XP.
- **Mistakes point forward:** error states explain the cause and next practice rather than punish.
- **One expressive element:** the contour map carries the personality; other surfaces stay restrained.
- **Gameful, not childish:** Ato is a restrained story companion, not an interruptive reward mascot; no loot boxes, hearts, fake leaderboard, or constant celebration in the MVP.
- **Honest feedback:** no internal metric is presented as an official IELTS band.

## 3. Visual system

### Color tokens

| Token | Hex | Use |
|---|---|---|
| `ink-navy` | `#102A43` | primary text, dark surfaces |
| `glacier` | `#F3F7FA` | primary light background |
| `tide-blue` | `#147D92` | primary actions, active route |
| `saffron` | `#F2B84B` | earned highlights and achievements |
| `evergreen` | `#2F8F6B` | correct and demonstrated mastery |
| `coral` | `#D65F5F` | error requiring attention |

All text/background combinations require WCAG 2.2 AA contrast. Correctness and errors always include text or icon in addition to color.

### Measured contrast baseline

Ratios below use WCAG relative-luminance calculations on the declared hex tokens. They constrain intended pairings; browser/font/rendering verification remains an implementation check.

| Foreground / background | Ratio | Allowed use |
|---|---:|---|
| `ink-navy` / `glacier` | 13.59:1 | normal and large text, icons, focus |
| white / `tide-blue` | 4.80:1 | normal/large text and primary-button content |
| `tide-blue` / `glacier` | 4.45:1 | large text or non-text only; not normal body/link text |
| `ink-navy` / `saffron` | 8.18:1 | normal/large text, earned highlight label |
| `evergreen` / `glacier` | 3.70:1 | large text or non-text status accent only |
| `coral` / `glacier` | 3.44:1 | large text or non-text error accent only |
| white / `evergreen` | 3.99:1 | large text/non-text only; not normal button text |
| white / `coral` | 3.71:1 | large text/non-text only; not normal button text |

Normal-size correct/error copy therefore stays `ink-navy` on `glacier`; evergreen/coral supply an icon, border or other non-text accent plus an explicit text label. Primary buttons use white on `tide-blue`. Focus uses `ink-navy` on light surfaces and `saffron` on `ink-navy`, never an unmeasured accent-on-light pairing.

### Typography

- **Newsreader:** display headings, target English sentences, reading passages, and reflective summaries.
- **Atkinson Hyperlegible:** navigation, buttons, explanations, Vietnamese support, labels, and data.
- Fonts are self-hosted or delivered from the same trusted web origin with stable fallback.
- Newsreader is limited to display text, target sentences, and comfortable reading sizes; compact controls, dense feedback, Vietnamese UI, data, and IPA default to Atkinson Hyperlegible or a tested fallback.
- Vietnamese diacritics, IPA glyphs, numeric tables, font loading, and fallback rendering are verified before approval.
- Default body line length stays below 80 characters.
- Sentence case is used for interface copy; tracked all-caps labels are avoided.

### Shape and depth

- Contour lines and route curves belong to the map only.
- Exercise surfaces use simple planes and generous spacing.
- Border radius reflects function instead of applying one radius to everything.
- Shadows indicate a true elevated layer, such as a feedback sheet, not decoration.
- Card grids are avoided when a route, list, or continuous surface communicates structure better.

## 4. Responsive layout

### Mobile

- Primary destinations: Today, Map, Mistakes, Progress.
- Settings is reached from the profile or overflow area.
- Primary actions are positioned within comfortable thumb reach without covering content.
- Primary touch targets aim for 44–48 CSS pixels; no essential action depends on drag.
- Safe-area insets are respected in mobile Safari and other supported browsers.
- The Map provides an equivalent list view and never requires spatial navigation to access a node.

### Desktop

- Navigation moves to a left rail.
- Exercise content is centered at roughly 640–760 CSS pixels.
- An optional right panel can show the current rule, Mistake Book context, or review evidence.
- Long lines do not expand to fill a wide monitor.

### Alignment

Learning content, explanations, and navigation are left aligned. Only short celebratory summaries or a single empty state may be centered.

## 5. Today screen

```text
┌─────────────────────────────────┐
│ Chào buổi tối              17/09│
│                                 │
│ Hành trình hôm nay              │
│ 30 phút · 3 chặng chính         │
│                                 │
│ ● Chặng 1 · Ôn lỗi cũ           │
│ │                               │
│ ◉ Chặng 2 · Nền tảng trọng tâm  │
│ │                               │
│ ◆ Chặng 3 · Thử thách IELTS     │
│                                 │
│ Có thể học thêm sau khi hoàn tất │
│                                 │
│       [ Bắt đầu hành trình ]    │
│                                 │
│ Hôm nay Bản đồ  Lỗi sai  Tiến bộ│
└─────────────────────────────────┘
```

Rules:

- Default route length is 30 minutes, with 15- and 45-minute alternatives.
- The route shows expected work and time before starting.
- The overview shows at most three primary missions or checkpoints; exercise count remains secondary and appears only in details.
- Optional work is revealed after the planned route so the opening screen does not create an intimidating checklist.
- The route shows resumable checkpoints and a clear “Continue” state after interruption.
- The screen does not open with a dense analytics dashboard.
- Save/connectivity status stays quiet when healthy and becomes actionable when attention is needed.

## 6. Exercise screen

Luồng, trạng thái recovery và accessibility chi tiết của màn hình câu hỏi nằm tại WF-02 trong [`WIREFRAMES.md`](WIREFRAMES.md); phần này chỉ giữ pattern thị giác cấp cao để tránh lặp source of truth hành vi.

```text
┌─────────────────────────────────┐
│ 7/18  Grammar Pass          ⋯   │
│ ━━━━━━━━━━━━━━━                 │
│                                 │
│ Choose the correct sentence.    │
│                                 │
│ A  The number of students       │
│    have increased.              │
│                                 │
│ B  The number of students       │
│    has increased.               │
│                                 │
│             [ Kiểm tra ]        │
└─────────────────────────────────┘
```

- One task and one primary action are visible at a time.
- Progress is present but visually secondary to the question.
- Submit stays reachable on mobile without obscuring the answer.
- Reorder tasks provide tap/button and keyboard controls, not drag only.
- Leaving after submission never loses the attempt.

## 7. Feedback pattern

Luồng, biến thể kết quả, trạng thái projection/recovery và accessibility chi tiết nằm tại WF-03 trong [`WIREFRAMES.md`](WIREFRAMES.md); phần này chỉ giữ pattern thị giác và hierarchy cấp cao.

Incorrect-answer feedback appears as a contextual bottom sheet on mobile or adjacent panel on desktop:

```text
Cần sửa: subject–verb agreement

“The number” là chủ ngữ số ít, vì vậy dùng “has”.

Mẹo nhớ
The number of + plural noun + singular verb.

IELTS connection
Lỗi này thường xuất hiện khi mô tả số liệu Task 1.

[Thử một câu tương tự]  [Tiếp tục]
```

Feedback communicates:

1. the result;
2. the specific error;
3. a reusable rule;
4. one concise example when useful;
5. IELTS relevance when meaningful;
6. the next action.

The default layer shows the result, one concise Vietnamese explanation and the next action. `Xem chi tiết` expands the reusable rule, example and IELTS relevance without blocking continuation. Correct feedback is shorter unless a new rule or achievement needs explanation. Feedback never relies only on color, sound, or motion. Owner approved this layered pattern on 2026-09-20.

On mobile, the sheet must not erase the question context. It either leaves the submitted answer and target sentence visible or includes a persistent “View question” control.

## 8. Gamification

Checkpoint/safe-stop hierarchy, final reward variant, guest invitation and contour-map accessibility are authoritative in WF-04 of [`WIREFRAMES.md`](WIREFRAMES.md); the mechanics below remain product-level visual guidance.

### MVP mechanics

- **Daily Route:** the learning journey for the chosen duration.
- **Mastery landmarks:** evidence-backed progress for a learning node.
- **Weekly Expedition:** an IELTS transfer challenge.
- **Rescue Mission:** guided recovery after a recurring mistake.
- **Personal records:** mistakes corrected after a delay, reviews completed, and production improvements.
- **Expedition stamps:** achievements tied to meaningful learning behavior.
- **Flexible streak:** supports a recovery day and does not shame missed days.

Primary UI labels remain literal—Today, Weekly challenge, Practice this mistake, Achievements. The expedition vocabulary is visual flavor, not required terminology the learner must memorize.

### Excluded from MVP

- hearts or energy that stop learning;
- loot boxes or random rewards;
- public or simulated leaderboards;
- constant confetti and success animation;
- mascot interruptions;
- purchasable currency or cosmetic store;
- pronunciation or mastery scores presented as IELTS bands.

### Progress evidence presentation

Progress communicates evidence before precision:

- Primary node labels are “Đang học”, “Cần luyện lại”, “Dùng độc lập”, and “Đến hạn ôn”.
- A numeric mastery value, if shown, is secondary and expandable rather than the main headline.
- Expanded evidence shows last successful date, delayed-review result, exercise-type coverage, production/transfer evidence, and confidence limits.
- Exercise, node mastery, transfer challenge, external calibration, and official-result evidence remain visually distinct.
- Mastery, practice status, and external evidence use separate headings and are never collapsed into one progress ring or percentage.
- No percentage, contour position, color, or celebration is described as an IELTS band prediction.

## 9. Pronunciation Studio

The primary sequence is:

```text
Listen → Record → Playback → Compare → Reflect
```

The screen provides target text, reference audio, a large record control, simple waveform, A/B playback, local recording-quality metrics, and a three-item self-review.

Wording remains honest:

- “Bạn bắt đầu nói sau 1,8 giây.”
- “Bản ghi có hai khoảng dừng dài hơn ngưỡng đã hiệu chỉnh.”
- “Đây là gợi ý luyện tập, không phải điểm IELTS.”

Microphone, codec, or local-analysis failure never blocks lesson completion.

Pronunciation feedback separates evidence levels:

- **Đo được:** objective local signal result;
- **Ước lượng:** calibrated rule-based proxy with its limitation;
- **Tự đánh giá:** learner checklist or reflection;
- **Đánh giá bên ngoài:** manually entered human or approved assessment evidence.

The learner never sees a word-, phoneme-, accent-, or band-level claim derived only from signal metrics. Unsupported analysis retains listen/repeat/playback where available and guided self-review, without mastery evidence.

Technical evidence values are translated consistently: “Đo được từ bản ghi”, “Ước lượng — cần tự kiểm tra”, “Bạn tự đánh giá”, and “Đánh giá bên ngoài”. The screen asks for one retry target rather than presenting a long diagnostic checklist.

## 10. Motion, sound, and haptics

Motion is concentrated in three moments:

1. a learning node unlocks on the map;
2. feedback responds to a submitted answer;
3. the Daily Route completes.

- Nonessential animation respects reduced-motion preference.
- Instructional audio never auto-plays.
- Success sound is brief and optional.
- Incorrect answers do not use punitive sound.
- Haptics, if available, supplement rather than replace visible feedback.

## 11. Interface voice

- Use concise Vietnamese for all primary navigation, actions, permissions, privacy, sync, and recovery states.
- Preserve English for target language and exercise instructions when level-appropriate.
- Do not mix English and Vietnamese labels within one navigation level; the English names Today, Map, Mistakes, and Progress are internal references until a full English UI is intentionally selected.
- Buttons describe the result: “Bắt đầu hành trình”, “Kiểm tra”, “Thử một câu tương tự”, “Tiếp tục”.
- Errors identify the problem and recovery action without apology or blame.
- Avoid marketing slogans inside the learning flow.

## 12. MVP decisions

- Working visual direction: Atlas 6.5.
- Product name: Atlas English; Route to 6.5 is a goal-specific campaign.
- Light mode is required for the vertical slice; dark mode remains an MVP requirement after the core flow is validated.
- Ato may appear at onboarding, checkpoints and help when it communicates context or recovery; it never pops up merely to celebrate, sell or pressure continued play.
- Default Daily Route: 30 minutes; alternatives: 15 and 45 minutes.
- The contour map is the primary expressive device.
- Gamification emphasizes corrected mistakes and mastery evidence over XP.

## 13. Required design artifacts before code

Create low-fidelity responsive wireframes and state maps for these five core flows:

1. Landing → understand the value → start Guest Quick Start or choose secondary sign-in;
2. Question → read concise story context → answer/use a practice-only hint → submit or recover from interruption;
3. Feedback → understand correct/incorrect result → expand the Vietnamese explanation → continue;
4. Checkpoint/safe stop → review cluster progress → stop or continue → receive the first contextual sign-in invitation;
5. Sign-in/guest import → verify email → preview completed guest results → consent/decline → reach Home/history.

Supporting artifacts:

- mobile-first wireframes for the five flows, then desktop adaptations;
- default, loading, correct, incorrect, hint, disabled, empty and relevant error/interruption states;
- responsive behavior plus expected keyboard/focus order and accessibility notes;
- contour-map behavior only where needed to understand Landing/Checkpoint progression;
- online interruption, retrying, server unavailable, session expired, guest expiry and incompatible-content states relevant to the five flows;
- token sheet with measured contrast;
- reduced-motion behavior;
- map/list parity, pause/resume and question-context preservation;
- typography checks for Vietnamese, IPA, numerals, loading, and fallback;
- a Codex heuristic walkthrough with recorded findings.

A separate clickable/high-fidelity prototype is not required before code. After explicit Vertical Slice implementation approval, the coded Owner Alpha is the first interactive prototype and is tested by the owner on phone and desktop. Pronunciation and Writing prototype studies remain later-phase work and do not block the Vertical Slice approval gate.
