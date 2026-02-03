import { teamService } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import { WorkRole } from "../../models/Team";

function canAddWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to add work roles to the team",
  );
}

export default async function addWorkRole(
  teamId: string,
  workRole: WorkRole,
  actorMembership: Membership,
) {
  if (actorMembership.teamId !== teamId) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  canAddWorkRole(actorMembership);

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }
  if (team.hasWorkRole(workRole)) {
    throw new BusinessError(
      "CONFLICT",
      `Work role with name ${workRole.name} already exists`,
    );
  }

  await team.addWorkRole(workRole, actorMembership);

  return {};
}
