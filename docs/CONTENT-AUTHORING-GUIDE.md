# Content authoring guide

> **Status:** DRAFT

## Audience and language

- Explanations use clear Vietnamese.
- Exercise prompts and target language use English unless translation is explicitly tested.
- Use neutral, natural English suitable for the stated level.
- Accept valid British and American variants where IELTS would accept them.

## Exercise requirements

Every exercise must:

- Target one primary learning node.
- State difficulty and IELTS relevance.
- Have deterministic scoring for closed tasks.
- Include an explanation that proves the answer.
- Split feedback copy into a one-sentence Vietnamese default explanation and optional detail containing the reusable rule, concise example and IELTS relevance where meaningful.
- Avoid irrelevant trick wording.
- Avoid specialist knowledge unrelated to language ability.
- Include common error tags when applicable.
- Record source references, review status, reviewer, and confidence where judgment is involved.
- Belong to a named content wave and state whether it is a core item, delayed-review item, transfer/performance item, or controlled variant.
- Avoid surface-only variants that preserve the same clue pattern or permit answer memorization.
- Provide at most one optional hint for a slice item. It may name a rule or attention target but must not reveal the answer, eliminate all meaningful choices or provide a nearly completed response.
- Pair every hint with learner-facing copy that opening it changes the current attempt to practice-only.
- State the intended construct and observable behavior; decorative story context may not introduce a second scored construct.
- Record a short rationale for the correct answer and every distractor, including the learner error represented.
- Identify whether frequency/collocation/register claims come from author judgment, a permitted corpus/reference or reviewer evidence; there is no generic “IELTS vocabulary list”.
- Pass fairness/sensitivity review for avoidable cultural, socioeconomic, disability, gender and specialist-knowledge bias.

## Cognitive-load and copy budgets

Default budgets protect the short-session promise; exceptions require a content note explaining why extra context is essential:

- mission intro/story beat: 20–60 English words per card, never a wall of text;
- ordinary prompt/instruction: preferably 8–35 words, excluding the source sentence/passage being tested;
- default Vietnamese feedback: one sentence, preferably no more than 45 words;
- detailed explanation: progressive disclosure, one rule plus one concise example before optional IELTS detail;
- one question screen: one primary action and at most one unfamiliar interaction pattern.

Passage-based transfer tasks may exceed these budgets only when chunked with persistent question context, progress and a safe stop. Short wording must not remove linguistic evidence needed for an unambiguous answer.

## Learning progression

Where the node supports it, the content set progresses through `notice/recognize → guided use → independent production → IELTS transfer → delayed retrieval`. A single item need not cover every stage, but the node set must not stop at recognition. Interleaving is introduced only after examples make the contrast learnable; difficulty is not increased merely by adding rare words or denser story copy.

## Distractors

Good distractors represent plausible learner errors, are grammatically parallel, cannot become correct under reasonable interpretation, and do not reveal the answer through formatting. Do not use random unrelated words.

## Grammar

- Provide enough context to determine the answer.
- Avoid disputes based only on style when claiming grammatical correctness.
- Tag prerequisites.

## Vocabulary

- Prefer lexical units, collocations, word families, and contextual use.
- Record register and common partners.
- Avoid rare words used only to sound academic.
- Include productive or paraphrase tasks in a completed node set.

## Spelling

- Store normalized accepted answers explicitly.
- Define rules for case, punctuation, spaces, and hyphens.
- Use Unicode NFC, trim outer whitespace and collapse repeated internal whitespace for `normalized_text`.
- Case/punctuation tolerance must be declared per item and may only ignore features that are not learning objectives.
- List every accepted British/American or equivalent form explicitly; do not rely on fuzzy matching or autocorrection for mastery.
- Distinguish spelling errors from grammar errors.
- Respect Listening word limits when applicable.

## Pronunciation

- Provide target text, reference audio, accent metadata, and transcript.
- Focus on clarity rather than accent imitation.
- Do not claim phoneme accuracy without a validated system.
- Provide a self-review fallback.

## Explanation template

1. Why the correct answer works.
2. Why the most plausible wrong answer fails.
3. A reusable rule.
4. One additional example.
5. IELTS relevance when meaningful.

## Copyright

- Do not copy commercial IELTS questions.
- Official examples may guide format but are not republished as game content.
- Record provenance of externally licensed audio or text.
- Prefer original sentences and scenarios.

## Review checklist

Vertical Slice reviewer independence, qualification and evidence follow [`CONTENT-SYSTEM.md`](CONTENT-SYSTEM.md#chuẩn-reviewer-cho-vertical-slice). The same academic reviewer also checks every learner-facing English narrative string. Completing this checklist never permits an author or Codex to self-approve an item or story string.

Before that release review, Codex may fill this checklist as a pre-review and propose revisions. Such records must say `codex_pre_reviewed`, identify unresolved judgments and never use `approved` or `academic_reviewed`.

- [ ] Natural English.
- [ ] One clear target.
- [ ] Correct level.
- [ ] Deterministic answer.
- [ ] Plausible distractors.
- [ ] Correct construct and observable behavior; no construct-irrelevant trick or background knowledge.
- [ ] Correct-answer and distractor rationales recorded.
- [ ] Frequency/collocation/register claim has a traceable basis and does not rely on a vague “IELTS word” label.
- [ ] Fairness/sensitivity review completed.
- [ ] Copy budgets met or an essential exception is documented.
- [ ] Helpful explanation.
- [ ] Valid accepted variants.
- [ ] Correct tags and references.
- [ ] No unnecessary specialist assumptions.
- [ ] No copied protected question.
- [ ] Prerequisites and references exist and do not create a cycle.
- [ ] The node set includes delayed review and transfer evidence required by its gate.
- [ ] IELTS Performance tasks target the stated rubric dimension rather than claiming a complete band score.
- [ ] The selected node has 8–12 reviewed core items across at least two interaction formats before variants are counted toward coverage.
- [ ] Controlled variants change meaningful context or retrieval demand, not only names or numbers.
- [ ] No runtime AI or algorithm has authored or published the item during learner play.
- [ ] The parent node's assessment mode and progress channels match this exercise's scoring behavior.
- [ ] Self-review copy never implies mastery, correctness, pronunciation accuracy, or IELTS band.
