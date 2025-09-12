import { memberships } from "../../services";
import Membership from "../../models/Membership";
import BussinessError from "../../utils/Rejection";
import User from "../../models/User";

function canRemoveWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;
  throw new BussinessError(
    "FORBIDDEN",
    "You are not allowed to remove work roles from the team"
  );
}

export default async function removeWorkRole(
  teamId: string,
  workRoleName: string,
  currentUser: User
) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BussinessError("FORBIDDEN", "You are not a member of this team");
  }

  canRemoveWorkRole(currentMembership);

  const team = await memberships.getTeamById(teamId);
  if (!team) {
    throw new BussinessError("NOT_FOUND", `Team not found`);
  }
  if (!team.hasWorkRole(workRoleName)) {
    throw new BussinessError(
      "CONFLICT",
      `Work role with name ${workRoleName} is not found`
    );
  }

  await team.removeWorkRole(workRoleName, currentMembership);

  return {};
}
