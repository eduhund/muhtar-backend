import User from "../../models/User";
import { authService, membershipService, teamService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

export default async function changeTeam(
  { teamId }: { teamId: string },
  actorUser: User
) {
  const userId = actorUser.getId();
  const team = await teamService.getTeamById(teamId);

  if (!team) {
    throw new BusinessError("NOT_FOUND", "Team not found");
  }

  const membership = await membershipService.getMembership({
    teamId,
    userId,
  });

  if (!membership) {
    throw new BusinessError("NOT_FOUND", "You are not a member of this team");
  }

  await actorUser.setActiveMembershipId(membership.getId());

  const membershipAccessToken = membership
    ? authService.generateMembershipToken(membership)
    : undefined;
  const teamAccessToken =
    membership && (membership.isOwner() || membership.isAdmin())
      ? authService.generateTeamToken(membership)
      : undefined;

  return {
    membership,
    team,
    tokens: {
      membership: membershipAccessToken,
      team: teamAccessToken,
    },
  };
}
