import Membership from "../../models/Membership";
import User from "../../models/User";
import { memberships, teams } from "../../services";
import { BusinessError } from "../../utils/Rejection";

async function canArchiveTeam(currentMembership: Membership) {
  if (currentMembership.isOwner()) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to archive the team"
  );
}

export default async function archiveTeam(teamId: string, currentUser: User) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  await canArchiveTeam(currentMembership);

  const team = await teams.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }

  await team.archive(currentMembership);

  return {};
}
