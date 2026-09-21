# ADR-007: Do not use runtime generative-AI APIs

- **Status:** Rejected
- **Date:** 2026-09-17

## Context

The learner chose not to use OpenAI API billing or another runtime generative-AI service.

## Decision

Gameplay, scoring, explanations, and content selection are deterministic. Codex may generate development content, but published content is validated and stored before runtime.

## Alternatives

- OpenAI API or another model API: rejected for the current version.

## Consequences

- Personalized updates use exported mistake reports and new content releases.
- Free-form Writing and Speaking lack real-time generative feedback.

## Resolution

The learner later selected bounded Gemini runtime feedback. See [`ADR-010`](ADR-010-runtime-gemini-feedback.md).
