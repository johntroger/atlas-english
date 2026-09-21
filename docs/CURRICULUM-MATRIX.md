# Curriculum matrix — MVP

> **Status:** DRAFT — node list requires learning review

## Rules

- A node is the smallest independently tracked learning objective.
- Prerequisites must form an acyclic graph.
- Every node requires at least two exercise types and a transfer task where meaningful.
- The counts below are coverage targets, not permission to generate unreviewed filler.
- `P0` marks high-priority curriculum, but it does not mean every P0 node enters the first build. The initial content wave selects 12–15 P0 nodes from provisional baseline and early evidence, with representation across foundation, transfer, and performance skills; remaining P0 nodes enter later waves.
- Every released node declares one `assessmentMode` and one or more `progressChannels` in its machine-readable learning-node record. The matrix defaults below are planning guidance; the released record is authoritative.
- `Deferred` is a planning label only, not a value in `learning-node.schema.json`. Deferred rows must not be published as machine-readable learning-node records until a later scope decision assigns an allowed priority and an approved assessment contract.

## Vertical-slice selection

The owner selected these three P0 nodes on 2026-09-20:

- `grammar.sentence.boundaries`;
- `grammar.nouns.countability`;
- `vocabulary.cause_effect`.

All three have no prerequisite in the current matrix. The owner approved `hybrid` assessment with separate `mastery` and `practice` channels for all three; only eligible independent attempts may update mastery. Their mastery completion contract is score >=85, successful eligible evidence on 3 distinct learning dates, at least 2 exercise formats and at least 1 independent review/transfer success. Item content still requires review before implementation approval.

## Assessment-mode defaults

| Node family | Default assessment mode | Progress channels | Boundary |
|---|---|---|---|
| Grammar and vocabulary with closed plus open transfer | `hybrid` | mastery, practice | Only approved closed/controlled evidence affects mastery |
| Spelling and controlled transformations | `auto_scored` or `controlled_production` | mastery | Exact answer contract required |
| Pronunciation production without a scored perception task | `self_review_only` | practice | Recording completion never implies mastery |
| Pronunciation with scored discrimination plus recording | `hybrid` | mastery, practice | Only discrimination/classification affects mastery |
| Open Writing and complete Speaking performance | `external_review_required` | practice, external | Game records practice; rubric judgment remains external |
| Listening/Reading question-control nodes | `auto_scored` or `hybrid` | mastery, practice | Unseen transfer evidence is kept distinct |

Explicit initial overrides:

- `pronunciation.final_consonants` and `pronunciation.linked_speech` remain `self_review_only` unless a validated perception task is added.
- `performance.writing.*` is `external_review_required`.
- `transfer.speaking_extension` and `performance.speaking.*` are deferred beyond the core MVP; if used later, they are self/external-review only unless a separately approved controlled-scoring contract exists.
- Performance Listening/Reading nodes may be `auto_scored` only when answers and evidence spans have unambiguous contracts.

## Grammar

| ID | Priority | Learning objective | Prerequisite | Exercise types | Transfer evidence |
|---|---|---|---|---|---|
| grammar.sva.core | P0 | Maintain subject–verb agreement in simple and expanded subjects | — | choice, correction, text | correct agreement in a topic sentence |
| grammar.articles.core | P0 | Choose zero, definite, and indefinite articles in common academic contexts | — | choice, correction, text | edit articles in a short paragraph |
| grammar.nouns.countability | P0 | Use countable/uncountable nouns and quantifiers accurately | — | choice, correction, text | repair data-description sentences |
| grammar.tense.task1 | P0 | Select tense for static, past, and changing Task 1 data | — | choice, correction, rewrite | write two accurate trend sentences |
| grammar.sentence.boundaries | P0 | Avoid fragments, run-ons, and comma splices | — | classify, correction, reorder | repair a short response |
| grammar.complex.subordination | P0 | Build controlled complex sentences with reason, contrast, and condition | sentence boundaries | reorder, rewrite, text | combine claims without run-on errors |
| grammar.reference.pronouns | P1 | Maintain clear pronoun and demonstrative reference | sentence boundaries | choice, correction | revise ambiguous paragraph links |
| grammar.relative_clauses | P1 | Use defining and non-defining relative clauses | complex subordination | choice, punctuation, rewrite | add concise definition/detail |
| grammar.passive_voice | P1 | Use passive voice where process or result is prominent | tense core | choice, rewrite | describe a process stage |
| grammar.modals.hedging | P1 | Express certainty, possibility, and cautious claims | — | choice, rewrite | hedge an academic claim |
| grammar.comparison | P1 | Form accurate comparisons and superlatives | nouns countability | choice, correction, text | compare two data categories |
| grammar.parallelism | P1 | Maintain parallel form in lists and coordinated ideas | sentence boundaries | correction, rewrite | revise thesis/support points |

## Vocabulary

| ID | Priority | Learning objective | Prerequisite | Exercise types | Transfer evidence |
|---|---|---|---|---|---|
| vocabulary.change.trends | P0 | Use verb–noun and adverb–adjective trend collocations | — | match, choice, text | describe a chart change |
| vocabulary.cause_effect | P0 | Use cause/effect collocations with correct grammar | — | match, correction, paraphrase | express a causal claim |
| vocabulary.contrast | P0 | Distinguish contrast linkers by grammar and register | — | choice, correction | link opposing ideas |
| vocabulary.education.core | P0 | Use common education-topic lexical units naturally | — | retrieval, collocation, text | short Speaking answer |
| vocabulary.environment.core | P0 | Use common environment-topic lexical units naturally | — | retrieval, collocation, text | topic sentence and support |
| vocabulary.work.core | P1 | Use employment and workplace lexical units naturally | — | retrieval, collocation, text | short Speaking answer |
| vocabulary.health.core | P1 | Use non-specialist health lexical units naturally | — | retrieval, collocation, text | discuss a general trend |
| vocabulary.technology.core | P1 | Use technology lexical units with suitable register | — | retrieval, collocation, text | balanced opinion sentence |
| vocabulary.word_families | P0 | Select noun, verb, adjective, or adverb form from syntax | grammar.sentence.boundaries | choice, transformation, text | complete an academic sentence |
| vocabulary.paraphrase | P0 | Paraphrase without changing meaning or register | two topic nodes | match, choice, rewrite | paraphrase a task statement |

## Spelling

| ID | Priority | Learning objective | Prerequisite | Exercise types | Transfer evidence |
|---|---|---|---|---|---|
| spelling.plural_endings | P0 | Record singular/plural endings accurately from audio and context | grammar.nouns.countability | dictation, correction | Listening-form completion |
| spelling.double_consonants | P0 | Apply common consonant-doubling patterns | — | missing letters, dictation | accurate target words in sentences |
| spelling.suffixes | P0 | Spell common academic suffixes and word-family changes | vocabulary.word_families | dictation, transformation | word-form completion |
| spelling.silent_letters | P1 | Spell frequent words with silent letters | — | dictation, missing letters | short dictation |
| spelling.ie_ei | P1 | Control frequent ie/ei words and exceptions | — | classify, dictation | contextual sentence |
| spelling.homophones | P0 | Distinguish common homophones through meaning | — | choice, dictation | repair contextual errors |
| spelling.numbers_dates | P0 | Record numbers, dates, names, and addresses accurately | — | dictation, text | Listening-form simulation |
| spelling.personal_blacklist | P0 | Repractice the learner’s recurring misspellings | any spelling node | adaptive dictation, correction | error-free reuse after delay |

## Pronunciation

| ID | Priority | Learning objective | Prerequisite | Exercise types | Transfer evidence |
|---|---|---|---|---|---|
| pronunciation.final_consonants | P0 | Produce audible final consonants in target words | — | listen, record, self-review | shadow a short answer |
| pronunciation.consonant_clusters | P0 | Preserve common initial/final clusters | final consonants | discriminate, record | shadow phrases accurately |
| pronunciation.word_stress | P0 | Place stress on common multi-syllable academic words | — | discriminate, record | use targets in a response |
| pronunciation.sentence_stress | P1 | Highlight content words and reduce function words | word stress | mark, shadow, self-review | deliver a two-sentence answer |
| pronunciation.th_sounds | P1 | Distinguish and produce /θ/ and /ð/ clearly enough | — | discriminate, record | target phrases in context |
| pronunciation.endings_ed_s | P0 | Produce common -ed and -s endings intelligibly | final consonants | classify, record | read and reuse target forms |
| pronunciation.linked_speech | P1 | Recognize and practice basic linking without sacrificing clarity | sentence stress | listen, shadow | short fluent response |
| pronunciation.chunking | P0 | Pause in meaningful phrase groups | — | mark, shadow, self-review | answer a Speaking Part 1 prompt |

## Transfer

| ID | Priority | Learning objective | Prerequisite | Exercise types | Transfer evidence |
|---|---|---|---|---|---|
| transfer.paraphrase.recognition | P0 | Identify meaning-preserving paraphrases | vocabulary.paraphrase | match, choice | Reading/Listening distractor set |
| transfer.word_type_prediction | P0 | Predict grammar and semantic type before gap filling | vocabulary.word_families | classify, text | Listening/Reading gap item |
| transfer.distractor_control | P0 | Explain why a plausible option contradicts the source | paraphrase recognition | choice, explanation | mini Listening/Reading item |
| transfer.topic_sentence | P0 | Produce a focused topic sentence | grammar.sentence.boundaries | evaluate, rewrite, text | paragraph opening |
| transfer.speaking_extension | Deferred | Extend a direct answer with reason and example | grammar.complex.subordination | reorder, record, self-review | Post-MVP self/external practice only |
| transfer.task1_sentence | P1 | Describe a comparison or trend accurately | tense task1, change trends | correction, text | two Task 1 sentences |

## IELTS Performance Layer

| ID | Priority | Learning objective | Prerequisite | Exercise types | Transfer evidence |
|---|---|---|---|---|---|
| performance.writing.task_response | P0 | Identify and address every required part of a Task 2 prompt | transfer.paraphrase.recognition | classify, outline, evaluate | complete position-and-reasons outline |
| performance.writing.coherence | P0 | Build a focused paragraph with a clear claim, support, and logical progression | transfer.topic_sentence | reorder, evaluate, text | one supported body paragraph |
| performance.writing.task1_overview | P0 | Select and state the main features without listing every detail | grammar.tense.task1, vocabulary.change.trends | select, evaluate, text | two-sentence overview |
| performance.speaking.fluency | Deferred | Extend an answer coherently without memorized filler | transfer.speaking_extension, pronunciation.chunking | plan, record, self-review | Post-MVP external/self-review |
| performance.speaking.part2 | Deferred | Organize a two-minute response from brief notes | performance.speaking.fluency | plan, record, self-review | Post-MVP external/self-review |
| performance.speaking.part3 | Deferred | Develop an abstract answer with claim, reason, example, and qualification | grammar.complex.subordination | plan, record, self-review | Post-MVP external/self-review |
| performance.listening.answer_prediction | P0 | Predict answer form and semantic type before listening | transfer.word_type_prediction | classify, timed gap | unseen gap-completion item |
| performance.listening.instruction_control | P0 | Respect word limits and transfer spelling accurately | spelling.numbers_dates, transfer.word_type_prediction | classify, timed gap, correction | mini unseen Listening form |
| performance.listening.recovery | P0 | Resume attention after a missed item without losing the next answer | transfer.distractor_control | timed sequence, reflection | mini unseen Listening sequence |
| performance.reading.tfng_reasoning | P0 | Distinguish contradiction, absence, and textual support | transfer.paraphrase.recognition | TFNG, evidence selection | unseen TFNG set |
| performance.reading.locating | P0 | Locate relevant evidence using anchors and paraphrase | transfer.paraphrase.recognition | locate, highlight, timed search | unseen paragraph set |
| performance.reading.paraphrase_control | P0 | Match question language to meaning-equivalent source language | transfer.paraphrase.recognition | match, explanation, timed set | unseen Reading item |
| performance.reading.time_control | P0 | Allocate time and move on without unsupported guessing loops | performance.reading.locating | timed set, reflection | unseen mini section |

## Coverage gates

For each node selected into the current content wave before private alpha:

- approve the objective and prerequisites;
- provide at least two exercise types;
- include recognition and production where applicable;
- include at least one delayed review item;
- include one transfer or contextual task;
- record source/provenance and reviewer;
- declare assessment mode and progress channels, with no self-review-to-mastery path;
- meet the minimum variation rule defined by content QA.
- provide 8–12 reviewed core exercises across at least two interaction formats before treating the node as covered;
- add controlled variants only after the core items pass semantic and usability review.

The first 12–15 nodes are selected only after the baseline. Selection favors recurring learner errors, Listening/Writing weaknesses, prerequisite leverage, and at least one transfer/performance path. The shortlist and rationale must be recorded in the content release report.

## Open learning decisions

- Whether 30–45 minutes is the final daily game allocation.
- Exact number of variants per node and exercise type.
- Which remaining P1 nodes must be promoted based on the initial Diagnostic.
- Whether accent coverage starts with British plus Australian or a broader set.
- Exact external calibration materials and reviewer for Writing/Speaking.
- Final per-node assessment-mode assignment after the initial baseline and content-design review.
