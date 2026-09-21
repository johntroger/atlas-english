# ADR-010: Use Gemini for bounded runtime feedback

- **Status:** Superseded by [`ADR-011`](ADR-011-no-runtime-ai-deterministic-engine.md)
- **Date:** 2026-09-17
- **Revised:** 2026-09-19

## Context

The learner wants detailed runtime feedback and has selected the Gemini API. The application remains offline-first, must protect API credentials and learner recordings, and must not present model output as an official IELTS score.

## Decision

Use Gemini only through a server-side adapter for Writing feedback and pronunciation feedback. For Speaking, Gemini assesses pronunciation only. Local signal analysis, transcript comparison, playback, and self-review remain available independently of Gemini. AI output is structured, validated, versioned, confidence-labeled, and excluded from direct mastery calculation.

Deliver the proposed scope through separate approval gates: MVP-C1 introduces text-only Writing feedback; MVP-C2 introduces audio-based pronunciation feedback only after device thresholds, consent behavior, and pronunciation calibration evidence are accepted. Approval of C1 does not authorize C2.

Runtime content generation, official band scoring, phoneme-accuracy claims, and Speaking assessment outside pronunciation are excluded.

The detailed contract is [`AI-FEEDBACK.md`](../AI-FEEDBACK.md).

## Alternatives

- No runtime AI: simpler and private, but lacks detailed personalized feedback.
- Direct browser-to-Gemini calls: rejected because the credential would be exposed and abuse controls would be weak.
- Dedicated pronunciation API: potentially better phoneme-level assessment, but introduces another provider, cost, and privacy boundary.
- Self-hosted acoustic models: greater control but disproportionate operational complexity for the personal MVP.

## Consequences

- Gemini credentials and calls remain server-side.
- AI features require network access and explicit consent for audio transmission.
- Local deterministic and self-review fallbacks remain mandatory.
- Security, privacy, cost, failure, model-version, and structured-output tests become release requirements.
- Writing can deliver value before the higher-risk audio path is enabled.
- Pronunciation remains feature-flagged off until its calibration and device criteria pass.
- ADR-007 is rejected because its no-runtime-AI direction is no longer selected.
