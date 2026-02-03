import { teamService } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import { WorkRole } from "../../models/Team";

function canUpdateWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;
  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to add work roles to the team",
  );
}

export default async function updateWorkRole(
  teamId: string,
  currentWorkRole: WorkRole,
  newData: WorkRole,
  actorMembership: Membership,
) {
  if (actorMembership.teamId !== teamId) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  canUpdateWorkRole(actorMembership);

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }
  if (!team.hasWorkRole(currentWorkRole)) {
    throw new BusinessError(
      "CONFLICT",
      `Work role with name ${currentWorkRole} is not found`,
    );
  }

  await team.updateWorkRole(currentWorkRole.name, newData, actorMembership);

  return {};
}
