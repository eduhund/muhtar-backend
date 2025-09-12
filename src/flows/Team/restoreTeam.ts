import Membership from "../../models/Membership";
import User from "../../models/User";
import { memberships, teams } from "../../services";
import BussinessError from "../../utils/Rejection";

async function canRestoreTeam(currentMembership: Membership) {
  if (currentMembership.isOwner()) return true;

  throw new BussinessError("FORBIDDEN", "You are not allowed to restore team");
}

export default async function restoreTeam(teamId: string, currentUser: User) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BussinessError("FORBIDDEN", "You are not a member of this team");
  }

  await canRestoreTeam(currentMembership);

  const team = await teams.getTeamById(teamId);
  if (!team) {
    throw new BussinessError("NOT_FOUND", `Team not found`);
  }

  await team.restore(currentMembership);

  return {};
}
