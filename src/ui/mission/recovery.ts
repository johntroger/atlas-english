export type CurrentChoiceRecovery = Readonly<{
  missionIndex: number;
  questionIndex: number;
  response: string[];
  hintUsed: boolean;
  expiresAt: number;
}>;

export type StoryCheckpointRecovery = Readonly<{
  nextMissionIndex: number;
  expiresAt: number;
}>;

export const CURRENT_CHOICE_RECOVERY_KEY = "atlas_current_choice_v1";
export const STORY_CHECKPOINT_RECOVERY_KEY = "atlas_story_checkpoint_v1";
export const CURRENT_CHOICE_RECOVERY_TTL = 30 * 60 * 1000;
export const STORY_CHECKPOINT_RECOVERY_TTL = 24 * 60 * 60 * 1000;

function validIndex(value: unknown, upperBound: number): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0 && value < upperBound;
}

export function parseCurrentChoiceRecovery(
  raw: string | null,
  missionCount: number,
  questionsPerMission: number,
  now = Date.now(),
): CurrentChoiceRecovery | undefined {
  try {
    const value = JSON.parse(raw ?? "null") as Partial<CurrentChoiceRecovery> | null;
    if (
      !value ||
      !validIndex(value.missionIndex, missionCount) ||
      !validIndex(value.questionIndex, questionsPerMission) ||
      !Array.isArray(value.response) ||
      !value.response.every((option) => typeof option === "string") ||
      typeof value.hintUsed !== "boolean" ||
      typeof value.expiresAt !== "number" ||
      value.expiresAt <= now
    )
      return undefined;
    return {
      missionIndex: value.missionIndex,
      questionIndex: value.questionIndex,
      response: value.response,
      hintUsed: value.hintUsed,
      expiresAt: value.expiresAt,
    };
  } catch {
    return undefined;
  }
}

export function parseStoryCheckpointRecovery(
  raw: string | null,
  missionCount: number,
  now = Date.now(),
): StoryCheckpointRecovery | undefined {
  try {
    const value = JSON.parse(raw ?? "null") as Partial<StoryCheckpointRecovery> | null;
    if (
      !value ||
      !validIndex(value.nextMissionIndex, missionCount) ||
      typeof value.expiresAt !== "number" ||
      value.expiresAt <= now
    )
      return undefined;
    return { nextMissionIndex: value.nextMissionIndex, expiresAt: value.expiresAt };
  } catch {
    return undefined;
  }
}
