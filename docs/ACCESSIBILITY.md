# Accessibility specification

> **Status:** DRAFT — target WCAG 2.2 AA for core flows

## Structure and navigation

- One descriptive page heading and logical heading order.
- Landmarks and skip-to-content navigation.
- Predictable focus order.
- Route changes move focus to an appropriate heading or status.
- Exercise progress is announced without repeatedly interrupting the learner.

## Keyboard and touch

- Every non-recording exercise can be completed by keyboard.
- Reorder exercises provide button/keyboard alternatives to drag-and-drop.
- Visible focus is never removed without an equivalent replacement.
- Touch targets are at least 24 by 24 CSS pixels; primary mobile controls target 44–48 CSS pixels.
- Controls used repeatedly in a question sequence and destructive/commit actions target at least 44 by 44 CSS pixels; exceptions require an equivalent target or documented WCAG exception.
- Sticky headers, bottom actions, banners and the virtual keyboard must not obscure the focused element or its error/help text.
- No action depends only on hover, swipe, or complex gesture.
- Reorder activities provide tap/button and keyboard alternatives to drag.

## Visual presentation

- Text and essential controls meet AA contrast.
- Correct/incorrect states include text or icon, not color alone.
- Layout remains usable at 200% zoom and 320 CSS pixels.
- Content reflows without two-dimensional scrolling except genuinely tabular material.
- Reduced-motion preference disables nonessential animation.
- Contour-map state is conveyed through label, icon, and structure in addition to color.

## Forms and feedback

- Every input has a programmatic label.
- Errors identify the field, cause, and correction.
- Async submit/save/retry status is announced once with non-interruptive status semantics; critical failures use an appropriate alert and move focus only when recovery requires it.
- Instructions appear before the task.
- Feedback uses an appropriate live region and does not steal focus unnecessarily.
- Timed activities provide control and never auto-submit unexpectedly.

## Audio and speech

- Instructional audio includes transcript or equivalent text.
- Recording state is visible and announced.
- Microphone permission is requested only after an explicit action.
- Local pronunciation heuristics are presented as approximate and include a non-automated self-review path.
- Pronunciation tasks always offer a non-recognition fallback.
- Instructional and feedback audio never auto-plays.

## Language learning specifics

- Page and text language attributes distinguish Vietnamese explanation from English target text.
- Mixed-language buttons/labels are avoided; English passages inside Vietnamese UI use language-of-parts markup so pronunciation by assistive technology is not silently wrong.
- Terms and Privacy render as authoritative Vietnamese (`lang="vi"`); product names or unavoidable English terms receive appropriate language markup without implying an English policy version exists.
- Screen-reader labels do not reveal the correct option.
- Letter-by-letter spelling content provides a mode that remains understandable with assistive technology.
- IPA, stress marks, and special symbols include plain-language support where needed.

## Verification

- automated accessibility checks in CI for representative screens;
- keyboard-only walkthrough;
- screen-reader smoke test on desktop and mobile where practical;
- 200% zoom and narrow viewport test;
- reduced-motion and high-contrast review;
- manual review of every exercise interaction pattern.

Accessibility defects that block learning or hide correctness are release blockers.
