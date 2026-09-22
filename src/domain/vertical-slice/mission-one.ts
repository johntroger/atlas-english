import { evaluateAnswer, type AnswerContract, type TextAnswerContract } from "../learning/index.ts";

export type ChoiceQuestion = Readonly<{
  id: string;
  type: "choice";
  prompt: string;
  context: string;
  options: readonly Readonly<{ id: string; text: string }>[];
  answerContract: AnswerContract;
  correction: string;
  explanationVi: string;
  detail: Readonly<{ rule: string; example: string; ielts: string }>;
  hint?: string;
}>;

export type ReorderQuestion = Readonly<{
  id: string;
  type: "reorder";
  prompt: string;
  context: string;
  tokens: readonly string[];
  answerContract: TextAnswerContract;
  correction: string;
  explanationVi: string;
  detail: Readonly<{ rule: string; example: string; ielts: string }>;
}>;

export type TextQuestion = Readonly<{
  id: string;
  type: "text";
  prompt: string;
  context: string;
  answerContract: TextAnswerContract;
  correction: string;
  explanationVi: string;
  detail: Readonly<{ rule: string; example: string; ielts: string }>;
  hint?: string;
}>;

export type MissionOneQuestion = ChoiceQuestion | ReorderQuestion | TextQuestion;
export type MissionOneResponse = string | readonly number[];

export const MISSION_ONE = {
  titleVi: "Những kết nối bị vỡ",
  shortContextVi: "Hai bản tóm tắt dùng cùng dữ liệu nhưng đang tách ý sai.",
  dossierGoalVi: "Khôi phục quan hệ logic giữa các phát hiện.",
  temporaryNoticeVi: "Bản thử nghiệm nội bộ — tiến độ chỉ tồn tại trong trang này.",
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
      explanationVi: "Hai mệnh đề độc lập cần được tách rõ; dấu chấm là một lựa chọn đúng.",
      detail: {
        rule: "Two independent clauses can be separated with a full stop.",
        example: "The response rate was high. The sample was still limited.",
        ielts: "Ranh giới câu rõ giúp tránh run-on và comma splice khi viết học thuật.",
      },
    },
    {
      id: "slice.m1.boundaries.002",
      type: "reorder",
      prompt: "Reorder the parts to make one complete sentence.",
      context: "The report needs to contrast two findings without breaking the sentence.",
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
      explanationVi: "“But” nối hai mệnh đề hoàn chỉnh và giữ đúng ý tương phản.",
      detail: {
        rule: "Use a comma before but when it joins two independent clauses.",
        example: "The course was online, but students met weekly.",
        ielts: "Cấu trúc này giúp diễn đạt tương phản rõ trong phần Writing.",
      },
    },
    {
      id: "slice.m1.boundaries.003",
      type: "text",
      prompt: "Correct the sentence by adding a suitable boundary.",
      context: "The survey covered first-year students, it did not include final-year students.",
      hint: "Hai vế đều là mệnh đề hoàn chỉnh; hãy thử một liên từ chỉ tương phản.",
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
        "Dấu phẩy đơn chưa đủ để nối hai mệnh đề độc lập; “but” sửa cấu trúc và giữ ý đối lập.",
      detail: {
        rule: "A comma alone cannot join two independent clauses; add a coordinating conjunction.",
        example: "The sample was small, but the response rate was high.",
        ielts: "Sửa comma splice giúp câu tóm tắt học thuật chính xác hơn.",
      },
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
      explanationVi: "Mệnh đề bắt đầu bằng “Although” cần gắn với một mệnh đề chính.",
      detail: {
        rule: "Although introduces a dependent clause, so it cannot stand alone.",
        example: "Although the course was flexible, some students preferred campus classes.",
        ielts: "Mệnh đề nhượng bộ giúp nêu hạn chế mà không làm sai ý chính.",
      },
    },
  ] satisfies readonly MissionOneQuestion[],
} as const;

function reorderResponse(question: ReorderQuestion, response: readonly number[]): string {
  return response.map((index) => question.tokens[index]).join(" ");
}

export function isMissionOneResponseComplete(
  question: MissionOneQuestion,
  response: MissionOneResponse,
): boolean {
  if (question.type === "reorder") {
    return Array.isArray(response) && response.length === question.tokens.length;
  }

  return typeof response === "string" && response.trim().length > 0;
}

export function evaluateMissionOneAnswer(
  question: MissionOneQuestion,
  response: MissionOneResponse,
  hintUsed: boolean,
) {
  const answer =
    question.type === "reorder" && Array.isArray(response)
      ? evaluateAnswer(question.answerContract, reorderResponse(question, response))
      : question.type === "choice" && typeof response === "string"
        ? evaluateAnswer(question.answerContract, [response])
        : evaluateAnswer(question.answerContract, typeof response === "string" ? response : "");
  const isCorrect = answer?.isCorrect === true;
  const practiceOnly = hintUsed;

  return {
    isCorrect,
    practiceOnly,
    correction: question.correction,
    explanationVi: question.explanationVi,
    evidenceMessage: practiceOnly
      ? "Lượt luyện tập — không thay đổi mức độ thành thạo."
      : "Kết quả chỉ dùng trong phiên thử nghiệm này.",
  };
}
