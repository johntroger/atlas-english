import { evaluateAnswer, type AnswerContract, type TextAnswerContract } from "../learning/index.ts";

export type QuestionType = "choice" | "multiple_choice" | "reorder" | "text";
export type MissionResponse = string | readonly string[] | readonly number[];

type QuestionBase = Readonly<{
  id: string;
  type: QuestionType;
  prompt: string;
  context?: string;
  correction: string;
  explanationVi: string;
  detail: Readonly<{ rule: string; example: string; ielts: string }>;
  hint?: string;
}>;

export type ChoiceQuestion = QuestionBase &
  Readonly<{
    type: "choice" | "multiple_choice";
    options: readonly Readonly<{ id: string; text: string }>[];
    answerContract: AnswerContract;
  }>;

export type ReorderQuestion = QuestionBase &
  Readonly<{
    type: "reorder";
    tokens: readonly string[];
    answerContract: TextAnswerContract;
  }>;

export type TextQuestion = QuestionBase &
  Readonly<{
    type: "text";
    answerContract: TextAnswerContract;
  }>;

export type MissionQuestion = ChoiceQuestion | ReorderQuestion | TextQuestion;

export type Mission = Readonly<{
  id: "m1" | "m2" | "m3";
  titleVi: string;
  dossierLabel: string;
  setupVi: string;
  objectiveVi: string;
  transitionVi: string;
  questions: readonly MissionQuestion[];
}>;

export type SelectionRole = "core_mastery" | "hinted_practice" | "independent_review";
export type SelectionContractItem = Readonly<{
  id: string;
  missionId: Mission["id"];
  learningNodeId:
    | "grammar.sentence.boundaries"
    | "grammar.nouns.countability"
    | "vocabulary.cause_effect";
  role: SelectionRole;
  firstRun: boolean;
}>;

const detail = (rule: string, example: string, ielts: string) => ({ rule, example, ielts });

const MISSION_ONE: Mission = {
  id: "m1",
  titleVi: "Những kết nối bị vỡ",
  dossierLabel: "Hồ sơ 01 · Logic câu",
  setupVi:
    "Ato và Mira đang đối chiếu hai bản tóm tắt của cùng một khảo sát. Hãy ghép lại các mối quan hệ logic bị tách sai.",
  objectiveVi: "Khôi phục ranh giới câu giữa các phát hiện.",
  transitionVi:
    "Các câu đã kết nối đúng. Tuy nhiên, một bản tóm tắt vẫn biến đa số sinh viên thành toàn bộ nhóm khảo sát.",
  questions: [
    {
      id: "slice.m1.boundaries.001",
      type: "choice",
      prompt: "Choose the sentence with a clear boundary between the two findings.",
      context: "The survey included 120 students. Most used online resources twice a week.",
      options: [
        {
          id: "a",
          text: "The survey included 120 students most used online resources twice a week.",
        },
        {
          id: "b",
          text: "The survey included 120 students, most used online resources twice a week.",
        },
        {
          id: "c",
          text: "The survey included 120 students. Most used online resources twice a week.",
        },
      ],
      answerContract: {
        mode: "selected_options",
        acceptedAnswers: ["c"],
        partialCreditPolicy: "none",
      },
      correction: "The survey included 120 students. Most used online resources twice a week.",
      explanationVi: "Đáp án C dùng dấu chấm để tách hai mệnh đề độc lập hoàn chỉnh.",
      detail: detail(
        "Two independent clauses can be separated with a full stop.",
        "The response rate was high. The sample was still limited.",
        "Clear sentence boundaries reduce run-ons and comma splices in IELTS Writing.",
      ),
    },
    {
      id: "slice.m1.boundaries.002",
      type: "reorder",
      prompt: "Reorder the parts to make one complete sentence.",
      tokens: ["they also visited the library.", "Most students used online resources,", "but"],
      answerContract: {
        mode: "normalized_text",
        acceptedAnswers: [
          "Most students used online resources, but they also visited the library.",
        ],
        caseSensitive: false,
        punctuationSensitive: true,
        hyphenSensitive: true,
      },
      correction: "Most students used online resources, but they also visited the library.",
      explanationVi: "Liên từ “but” nối hai mệnh đề hoàn chỉnh và thể hiện sự tương phản.",
      detail: detail(
        "Use a comma before but when it joins two independent clauses.",
        "The course was online, but students met weekly.",
        "Controlled coordination helps express contrast accurately in IELTS Writing.",
      ),
    },
    {
      id: "slice.m1.boundaries.003",
      type: "text",
      prompt: "Correct the sentence by adding a suitable boundary.",
      context: "The survey covered first-year students, it did not include final-year students.",
      hint: "Hai vế đều là mệnh đề hoàn chỉnh; hãy thêm một liên từ chỉ tương phản.",
      answerContract: {
        mode: "normalized_text",
        acceptedAnswers: [
          "The survey covered first-year students, but it did not include final-year students.",
        ],
        caseSensitive: false,
        punctuationSensitive: true,
        hyphenSensitive: true,
      },
      correction:
        "The survey covered first-year students, but it did not include final-year students.",
      explanationVi:
        "Cần thêm “but” vì dấu phẩy đơn đang nối sai hai mệnh đề độc lập có ý tương phản.",
      detail: detail(
        "A comma alone cannot join two independent clauses; add a coordinating conjunction.",
        "The sample was small, but the response rate was high.",
        "This repairs a common comma splice in academic summaries.",
      ),
    },
    {
      id: "slice.m1.boundaries.004",
      type: "text",
      prompt: "Correct the fragment while keeping the meaning.",
      context: "Although the response rate was high. The sample came from one faculty.",
      answerContract: {
        mode: "normalized_text",
        acceptedAnswers: [
          "Although the response rate was high, the sample came from one faculty.",
          "The response rate was high although the sample came from one faculty.",
        ],
        caseSensitive: false,
        punctuationSensitive: true,
        hyphenSensitive: true,
      },
      correction: "Although the response rate was high, the sample came from one faculty.",
      explanationVi:
        "Mệnh đề bắt đầu bằng “Although” không đứng một mình; nó phải nối với mệnh đề chính.",
      detail: detail(
        "Although introduces a dependent clause, so it cannot stand alone.",
        "Although the course was flexible, some students preferred classes on campus.",
        "Accurate subordination supports clear concession in IELTS Writing.",
      ),
    },
  ],
};

const MISSION_TWO: Mission = {
  id: "m2",
  titleVi: "Phạm vi bị thiếu",
  dossierLabel: "Hồ sơ 02 · Nhóm khảo sát",
  setupVi:
    "Một bản tóm tắt đã nới rộng kết luận. Hãy dùng danh từ và lượng từ để đưa phạm vi về đúng với số liệu 120 sinh viên.",
  objectiveVi: "Đối chiếu lượng từ với dữ liệu khảo sát.",
  transitionVi:
    "Phạm vi đã khớp với số liệu. Còn lại một kết luận quá mạnh: bản nháp biến mối liên hệ thành nguyên nhân đã được chứng minh.",
  questions: [
    {
      id: "slice.m2.countability.001",
      type: "choice",
      prompt: "Choose the grammatically correct survey summary.",
      options: [
        { id: "a", text: "The survey collected many useful information." },
        { id: "b", text: "The survey collected a great deal of useful information." },
        { id: "c", text: "The survey collected several useful informations." },
      ],
      answerContract: {
        mode: "selected_options",
        acceptedAnswers: ["b"],
        partialCreditPolicy: "none",
      },
      correction: "The survey collected a great deal of useful information.",
      explanationVi:
        "“Information” là danh từ không đếm được; “a great deal of” phù hợp và không thêm -s.",
      detail: detail(
        "Information is uncountable in this meaning.",
        "The report provides useful information about study habits.",
        "Countability affects grammatical range and accuracy in IELTS Writing.",
      ),
    },
    {
      id: "slice.m2.countability.002",
      type: "choice",
      prompt:
        "Seventy-two of 120 students used online resources weekly. Choose the accurate summary.",
      options: [
        { id: "a", text: "All students used online resources weekly." },
        { id: "b", text: "Most students used online resources weekly." },
        { id: "c", text: "No students used online resources weekly." },
      ],
      answerContract: {
        mode: "selected_options",
        acceptedAnswers: ["b"],
        partialCreditPolicy: "none",
      },
      correction: "Most students used online resources weekly.",
      explanationVi:
        "72/120 lớn hơn một nửa nhưng không phải toàn bộ, nên “most” phù hợp còn “all” thì quá rộng.",
      detail: detail(
        "Use most for a clear majority, not the whole group.",
        "Most participants completed the survey, but not all of them did.",
        "Accurate quantifiers prevent overgeneralisation in data descriptions.",
      ),
    },
    {
      id: "slice.m2.countability.003",
      type: "text",
      prompt: "Correct the countability error.",
      context: "The report gives many advice about online study.",
      hint: "“Advice” là danh từ không đếm được; hãy đổi lượng từ và không thêm -s.",
      answerContract: {
        mode: "normalized_text",
        acceptedAnswers: [
          "The report gives much advice about online study.",
          "The report gives a lot of advice about online study.",
        ],
        caseSensitive: false,
        punctuationSensitive: true,
        hyphenSensitive: true,
      },
      correction: "The report gives much advice about online study.",
      explanationVi: "“Advice” không đếm được, nên dùng “much advice” hoặc “a lot of advice”.",
      detail: detail(
        "Advice is uncountable; use much or a lot of.",
        "The tutor gave two pieces of advice.",
        "Correct countability improves accuracy in academic recommendations.",
      ),
    },
    {
      id: "slice.m2.countability.004",
      type: "text",
      prompt: "Use all, most, or some: ___ students preferred fully online study (48 of 120).",
      answerContract: {
        mode: "normalized_text",
        acceptedAnswers: ["some"],
        caseSensitive: false,
        punctuationSensitive: false,
        hyphenSensitive: true,
      },
      correction: "some",
      explanationVi:
        "48/120 không phải toàn bộ và cũng không phải đa số, nên “some” là lựa chọn thận trọng.",
      detail: detail(
        "Some is accurate when a group is neither all nor a majority.",
        "Some respondents preferred a mixed schedule.",
        "Cautious quantification supports accurate Task 1 and Task 2 claims.",
      ),
    },
  ],
};

const MISSION_THREE: Mission = {
  id: "m3",
  titleVi: "Một kết luận quá mạnh",
  dossierLabel: "Hồ sơ 03 · Độ mạnh kết luận",
  setupVi:
    "Dữ liệu chỉ cho thấy các yếu tố xuất hiện cùng nhau. Hãy sửa ngôn ngữ nhân quả để bản tóm tắt không nói quá bằng chứng.",
  objectiveVi: "Chọn collocation nguyên nhân–kết quả phù hợp bằng chứng.",
  transitionVi:
    "Ngữ cảnh đã được khôi phục: logic câu, phạm vi và độ mạnh kết luận đều khớp dữ liệu khảo sát.",
  questions: [
    {
      id: "slice.m3.cause-effect.001",
      type: "choice",
      prompt: "The survey found a relationship, not proof of cause. Choose the accurate claim.",
      context: "Students who used flexible schedules also reported higher satisfaction.",
      options: [
        { id: "a", text: "Flexible schedules caused higher satisfaction." },
        { id: "b", text: "Flexible schedules were associated with higher satisfaction." },
        { id: "c", text: "Higher satisfaction prevented flexible schedules." },
      ],
      answerContract: {
        mode: "selected_options",
        acceptedAnswers: ["b"],
        partialCreditPolicy: "none",
      },
      correction: "Flexible schedules were associated with higher satisfaction.",
      explanationVi:
        "“Was associated with” mô tả mối liên hệ mà không khẳng định quan hệ nhân quả chưa được chứng minh.",
      detail: detail(
        "Association does not prove causation.",
        "Regular attendance was associated with stronger course completion.",
        "Careful claim strength supports accurate interpretation in Reading and Writing.",
      ),
    },
    {
      id: "slice.m3.cause-effect.002",
      type: "multiple_choice",
      prompt: "Select both claims that do not present causation as proven.",
      context:
        "The survey found that flexible access and higher satisfaction occurred together. It did not test causation.",
      options: [
        { id: "a", text: "Flexible access may contribute to higher satisfaction." },
        { id: "b", text: "Flexible access guarantees higher satisfaction." },
        { id: "c", text: "Higher satisfaction was associated with flexible access." },
        { id: "d", text: "Flexible access was the only cause of higher satisfaction." },
      ],
      answerContract: {
        mode: "selected_options",
        acceptedAnswers: ["a", "c"],
        partialCreditPolicy: "subset_no_incorrect",
      },
      correction:
        "Flexible access may contribute to higher satisfaction. Higher satisfaction was associated with flexible access.",
      explanationVi:
        "A chỉ nêu khả năng và C chỉ nêu mối liên hệ; các đáp án còn lại khẳng định nhân quả quá mức.",
      detail: detail(
        "May contribute to and associated with preserve uncertainty.",
        "Access to support may contribute to persistence, but other factors may also matter.",
        "Selecting cautious causal language supports precise academic argumentation.",
      ),
    },
    {
      id: "slice.m3.cause-effect.003",
      type: "text",
      prompt: "Rewrite the claim so it reports association rather than proven cause.",
      context: "Online study led to higher grades.",
      hint: "Dữ liệu chỉ cho thấy hai yếu tố xuất hiện cùng nhau; dùng cụm “was associated with”.",
      answerContract: {
        mode: "normalized_text",
        acceptedAnswers: ["Online study was associated with higher grades."],
        caseSensitive: false,
        punctuationSensitive: true,
        hyphenSensitive: true,
      },
      correction: "Online study was associated with higher grades.",
      explanationVi:
        "“Led to” khẳng định nguyên nhân; “was associated with” chỉ báo mối liên hệ phù hợp dữ liệu.",
      detail: detail(
        "Replace causal verbs when evidence only shows co-occurrence.",
        "Library use was associated with higher course completion.",
        "This avoids overstating evidence when paraphrasing a source.",
      ),
    },
    {
      id: "slice.m3.cause-effect.004",
      type: "text",
      prompt:
        "Use the two-word phrase meaning ‘be one factor in’: Flexibility may ___ higher satisfaction.",
      answerContract: {
        mode: "normalized_text",
        acceptedAnswers: ["contribute to"],
        caseSensitive: false,
        punctuationSensitive: false,
        hyphenSensitive: true,
      },
      correction: "contribute to",
      explanationVi:
        "Cụm “may contribute to” nêu một yếu tố có thể góp phần mà không coi đó là nguyên nhân duy nhất.",
      detail: detail(
        "Contribute to names one possible factor, not the only cause.",
        "Regular feedback may contribute to learner confidence.",
        "Cause/effect collocations with hedging support precise Task 2 claims.",
      ),
    },
  ],
};

export const FIRST_RUN_MISSIONS = [MISSION_ONE, MISSION_TWO, MISSION_THREE] as const;

export function findFirstRunQuestion(
  itemId: string,
): { mission: Mission; question: MissionQuestion } | undefined {
  for (const mission of FIRST_RUN_MISSIONS) {
    const question = mission.questions.find((candidate) => candidate.id === itemId);
    if (question) return { mission, question };
  }
  return undefined;
}

const nodeContracts = (
  missionId: Mission["id"],
  nodeId: SelectionContractItem["learningNodeId"],
  prefix: string,
): readonly SelectionContractItem[] => [
  { id: `${prefix}.001`, missionId, learningNodeId: nodeId, role: "core_mastery", firstRun: true },
  { id: `${prefix}.002`, missionId, learningNodeId: nodeId, role: "core_mastery", firstRun: true },
  {
    id: `${prefix}.003`,
    missionId,
    learningNodeId: nodeId,
    role: "hinted_practice",
    firstRun: true,
  },
  {
    id: `${prefix}.004`,
    missionId,
    learningNodeId: nodeId,
    role: "independent_review",
    firstRun: true,
  },
  { id: `${prefix}.005`, missionId, learningNodeId: nodeId, role: "core_mastery", firstRun: false },
  { id: `${prefix}.006`, missionId, learningNodeId: nodeId, role: "core_mastery", firstRun: false },
  { id: `${prefix}.007`, missionId, learningNodeId: nodeId, role: "core_mastery", firstRun: false },
  { id: `${prefix}.008`, missionId, learningNodeId: nodeId, role: "core_mastery", firstRun: false },
  {
    id: `${prefix}.009`,
    missionId,
    learningNodeId: nodeId,
    role: "hinted_practice",
    firstRun: false,
  },
  {
    id: `${prefix}.010`,
    missionId,
    learningNodeId: nodeId,
    role: "independent_review",
    firstRun: false,
  },
];

export const SELECTION_CONTRACT = [
  ...nodeContracts("m1", "grammar.sentence.boundaries", "slice.m1.boundaries"),
  ...nodeContracts("m2", "grammar.nouns.countability", "slice.m2.countability"),
  ...nodeContracts("m3", "vocabulary.cause_effect", "slice.m3.cause-effect"),
] as const;

export function initialResponse(question: MissionQuestion): MissionResponse {
  return question.type === "reorder"
    ? question.tokens.map((_, index) => index)
    : question.type === "choice" || question.type === "multiple_choice"
      ? []
      : "";
}

function reorderResponse(question: ReorderQuestion, response: readonly number[]): string {
  return response.map((index) => question.tokens[index]).join(" ");
}

export function isResponseComplete(question: MissionQuestion, response: MissionResponse): boolean {
  if (question.type === "reorder")
    return Array.isArray(response) && response.length === question.tokens.length;
  if (question.type === "choice" || question.type === "multiple_choice") {
    return Array.isArray(response) && response.length > 0;
  }
  return typeof response === "string" && response.trim().length > 0;
}

export function evaluateMissionAnswer(
  question: MissionQuestion,
  response: MissionResponse,
  hintUsed: boolean,
) {
  const answer =
    question.type === "reorder" && Array.isArray(response)
      ? evaluateAnswer(
          question.answerContract,
          reorderResponse(question, response as readonly number[]),
        )
      : (question.type === "choice" || question.type === "multiple_choice") &&
          Array.isArray(response)
        ? evaluateAnswer(question.answerContract, response as readonly string[])
        : evaluateAnswer(question.answerContract, typeof response === "string" ? response : "");

  return {
    isCorrect: answer?.isCorrect === true,
    practiceOnly: hintUsed,
    correction: question.correction,
    explanationVi: question.explanationVi,
    evidenceMessage: hintUsed
      ? "Lượt luyện tập — không thay đổi mức độ thành thạo."
      : "Kết quả chỉ dùng trong phiên thử nghiệm này.",
  };
}
