import { memberships, teams } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import User from "../../models/User";
import { WorkRole } from "../../models/Team";

function canRemoveWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;
  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to remove work roles from the team"
  );
}

export default async function removeWorkRole(
  teamId: string,
  workRole: WorkRole,
  currentUser: User
) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  canRemoveWorkRole(currentMembership);

  const team = await teams.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }
  if (!team.hasWorkRole(workRole)) {
    throw new BusinessError(
      "CONFLICT",
      `Work role with name ${workRole} is not found`
    );
  }

  await team.removeWorkRole(workRole.name, currentMembership);

  return {};
}
