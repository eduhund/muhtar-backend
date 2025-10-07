import Membership from "../../models/Membership";
import Team from "../../models/Team";
import User from "../../models/User";
import { memberships, teams } from "../../services";

function isValidTeam(team: Team, membership: Membership): boolean {
  return team && (membership.accessRole === "owner" || !team.isDeleted);
}

export default async function getTeams(currentUser: User) {
  const membershipsList = await memberships.getMembershipsByUser(
    currentUser.getId()
  );

  const teamsList: Team[] = [];

  for (const membership of membershipsList) {
    const team = await teams.getTeamById(membership.teamId);
    if (team && isValidTeam(team, membership)) {
      teamsList.push(team);
    }
  }

  return teamsList;
}
