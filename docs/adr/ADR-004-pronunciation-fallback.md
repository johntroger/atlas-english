# ADR-004: Treat speech recognition as progressive enhancement

- **Status:** Superseded by [`ADR-011`](ADR-011-no-runtime-ai-deterministic-engine.md)
- **Date:** 2026-09-17

## Context

Browser speech recognition support and offline behavior vary. Media recording is more broadly available.

## Decision

The baseline is reference audio, recording, playback, shadowing, and self-review. Recognition adds approximate transcript comparison when available.

## Alternatives

- Require Speech Recognition: excludes devices.
- Paid pronunciation API: out of scope.

## Consequences

- No official pronunciation-band claim.
- Capability differences must not block lessons.
