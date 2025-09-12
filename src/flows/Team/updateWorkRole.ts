import { memberships } from "../../services";
import Membership from "../../models/Membership";
import BussinessError from "../../utils/Rejection";
import { WorkRole } from "../../models/Team";
import User from "../../models/User";

function canUpdateWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;
  throw new BussinessError(
    "FORBIDDEN",
    "You are not allowed to add work roles to the team"
  );
}

export default async function updateWorkRole(
  teamId: string,
  currentWorkRoleName: string,
  newData: WorkRole,
  currentUser: User
) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BussinessError("FORBIDDEN", "You are not a member of this team");
  }

  canUpdateWorkRole(currentMembership);

  const team = await memberships.getTeamById(teamId);
  if (!team) {
    throw new BussinessError("NOT_FOUND", `Team not found`);
  }
  if (!team.hasWorkRole(currentWorkRoleName)) {
    throw new BussinessError(
      "CONFLICT",
      `Work role with name ${currentWorkRoleName} is not found`
    );
  }

  await team.updateWorkRole(currentWorkRoleName, newData, currentMembership);

  return {};
}
