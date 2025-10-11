import Membership from "../../models/Membership";
import Team from "../../models/Team";
import User from "../../models/User";
import { membershipService, teamService } from "../../services";

function isValidTeam(team: Team, membership: Membership): boolean {
  return team && (membership.accessRole === "owner" || !team.isDeleted);
}

export default async function getTeams(currentUser: User) {
  const membershipsList = await membershipService.getMembershipsByUser(
    currentUser.getId()
  );

  const teamsList: Team[] = [];

  for (const membership of membershipsList) {
    const team = await teamService.getTeamById(membership.teamId);
    if (team && isValidTeam(team, membership)) {
      teamsList.push(team);
    }
  }

  return teamsList;
}
