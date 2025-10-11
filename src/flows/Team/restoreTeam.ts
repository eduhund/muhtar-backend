import Membership from "../../models/Membership";
import User from "../../models/User";
import { membershipService, teamService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

async function canRestoreTeam(currentMembership: Membership) {
  if (currentMembership.isOwner()) return true;

  throw new BusinessError("FORBIDDEN", "You are not allowed to restore team");
}

export default async function restoreTeam(teamId: string, currentUser: User) {
  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  await canRestoreTeam(currentMembership);

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }

  await team.restore(currentMembership);

  return {};
}
