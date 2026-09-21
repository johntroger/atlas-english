# ADR-011: Use a deterministic engine and no runtime AI

> **Status:** Accepted  
> **Date:** 2026-09-19

## Context

The learner has decided that the game should not depend on Gemini or any other runtime AI. The product must remain private, predictable, offline-capable, inexpensive to operate, and explainable. It still needs adaptive practice, detailed closed-answer feedback, Writing support, and useful pronunciation practice.

## Decision

Use versioned deterministic algorithms for answer evaluation, mistake classification, mastery, review scheduling, Daily Quest selection, Writing mechanics, and local pronunciation signal analysis.

Do not use runtime generative AI, browser speech recognition, hosted transcription, or external acoustic scoring. Do not generate exercises during learner play. Full Writing judgment and complete Speaking evaluation remain external assessment activities.

The authoritative contract is [`ALGORITHMIC-FEEDBACK.md`](../ALGORITHMIC-FEEDBACK.md).

This ADR supersedes the Proposed [`ADR-010`](ADR-010-runtime-gemini-feedback.md). [`ADR-007`](ADR-007-no-runtime-generative-ai.md) remains unchanged as historical decision context.

## Consequences

- No AI credentials, provider endpoint, quota, prompt, model, or token-cost controls are needed.
- Core learning and feedback can operate offline and produce reproducible results.
- Privacy and operational complexity are reduced.
- The game cannot responsibly provide open-ended semantic Writing feedback, automatic transcript alignment, phoneme scoring, accent judgment, or AI pronunciation coaching.
- Content quality, rule authoring, fixtures, calibration, and external IELTS review become more important.
- A future proposal to add any runtime AI or speech model requires a new superseding ADR and explicit user approval.

## Alternatives considered

- Bounded Gemini feedback: rejected by the learner in favor of full algorithmic control.
- Browser speech recognition as an optional enhancement: rejected because it may use an external recognition service and would weaken the no-AI boundary.
- Dedicated pronunciation scoring provider: rejected for MVP because it adds external processing and unverifiable scoring claims.
