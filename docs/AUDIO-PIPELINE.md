# Audio content and recording pipeline

> **Status:** DRAFT

## Scope

Reference audio supports pronunciation, dictation, and shadowing. Learner recordings remain local by default and are not content assets.

## Reference-audio requirements

Each asset has:

- stable asset ID and relative path;
- transcript and language tag;
- accent metadata;
- speaker/source and license provenance;
- codec, sample rate, duration, and file size;
- content hash;
- linked exercise and content-pack version;
- reviewer and review status.

Internet-hosted audio is accepted only when its license permits the repository's intended redistribution and adaptation. Store the source URL, author, license identifier/version, access date, attribution text, and evidence of permission. Unknown or incompatible licenses are rejected; a URL alone is not provenance.

## Draft technical profile

- Primary delivery: MP3 or another format verified across the approved browser matrix.
- Optional alternate format only when it materially improves compatibility or size.
- Spoken voice is clear, natural, and free of excessive background noise.
- Loudness is normalized consistently across a pack.
- Long silence is trimmed without making speech unnatural.
- File names derive from immutable asset IDs, not display text.

Exact encoding values are chosen after a browser compatibility test.

## Production workflow

```text
script and learning objective
→ language review
→ recording or licensed generation
→ audio normalization
→ transcript verification
→ metadata and provenance
→ automated integrity checks
→ listening review
→ pack publication
```

Audio generated during content authoring must be reviewed by a human before release. Do not imitate a real person without permission.

## Automated checks

- referenced file exists;
- hash and duration match metadata;
- supported codec/container;
- transcript is non-empty;
- no unexpected clipping or silent file;
- asset ID is unique;
- license/provenance field exists;
- pack size remains within budget.

## Learner recordings

- Begin only after explicit user action.
- Display active recording state.
- Keep the clip only in the active in-memory/media session using a supported format.
- Expose playback and deletion immediately.
- Delete the clip when the exercise/session is left; do not offer save or download in the MVP.
- Never include recordings in logs, analytics, or export unless a future plan explicitly adds that option and consent.
- Keep recording, playback, signal analysis, and deletion local by default.
- Never send a learner recording to an AI, hosted transcription, or acoustic-scoring provider.
- Do not persist the clip in Supabase or application object storage.

## Automatic pronunciation analysis

The authoritative behavior is [`ALGORITHMIC-FEEDBACK.md`](ALGORITHMIC-FEEDBACK.md). The audio pipeline exposes two progressive capabilities:

1. local signal metrics: silence, clipping, duration, delayed start, pauses, and pace;
2. calibrated local delivery heuristics derived from known target length, reference timing, and energy/pause patterns.

These measurements cannot claim word recognition, final-sound detection, phoneme accuracy, accent quality, or IELTS band equivalence. Learner playback and self-review remain the source for those practice judgments.

## Fallbacks

- Unsupported MediaRecorder: provide listen, repeat, and guided self-review without a recording; this path creates no mastery evidence.
- Microphone denied: provide settings guidance and continue without recording.
- Local analyzer unsupported or uncalibrated: retain local record/playback, reference audio, and checklist without automatic error claims.
- Audio download failure: show the transcript when policy permits, offer retry/replacement, and never score the failure as wrong.
