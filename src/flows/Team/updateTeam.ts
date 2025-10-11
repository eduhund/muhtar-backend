import Membership from "../../models/Membership";
import User from "../../models/User";
import { membershipService, teamService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type updateTeamParams = {
  name?: string;
};

async function canUpdateTeam(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to update the team"
  );
}

export default async function updateTeam(
  teamId: string,
  { name }: updateTeamParams,
  currentUser: User
) {
  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  await canUpdateTeam(currentMembership);

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }

  //await team.update({ name }, currentMembership);

  return {};
}
