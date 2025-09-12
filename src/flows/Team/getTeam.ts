import Membership from "../../models/Membership";
import Team from "../../models/Team";
import User from "../../models/User";
import { memberships, teams } from "../../services";
import BussinessError from "../../utils/Rejection";

function isValidTeam(team: Team, membership: Membership): boolean {
  return (
    team &&
    team.getId() === membership.teamId &&
    (membership.accessRole === "owner" || !team.isDeleted)
  );
}

export default async function getTeam(teamId: string, currentUser: User) {
  const membership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!membership) {
    throw new BussinessError("FORBIDDEN", "You are not a member of this team");
  }

  const team = await teams.getTeamById(teamId);
  if (!isValidTeam(team, membership)) {
    throw new BussinessError("NOT_FOUND", "Team not found");
  }

  return team;
}
