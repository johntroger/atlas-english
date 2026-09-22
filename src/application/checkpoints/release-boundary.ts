export const CURRENT_ROUTE_RELEASE = "vs-08.1";

export type CheckpointState = "interim_ready" | "final_first_completion" | "final_replay";

export function resolveReleaseBoundary(clientRelease: string | undefined): Readonly<{
  updatePending: boolean;
  serverRelease: string;
}> {
  return {
    updatePending: clientRelease !== undefined && clientRelease !== CURRENT_ROUTE_RELEASE,
    serverRelease: CURRENT_ROUTE_RELEASE,
  };
}

export function checkpointState(finalMission: boolean, alreadyCompleted: boolean): CheckpointState {
  if (!finalMission) return "interim_ready";
  return alreadyCompleted ? "final_replay" : "final_first_completion";
}
