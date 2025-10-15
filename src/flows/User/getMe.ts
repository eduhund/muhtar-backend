import Membership from "../../models/Membership";
import User from "../../models/User";
import { membershipService, teamService, userService } from "../../services";

export default async function getMe(actorUser: User) {
  const userId = actorUser.getId();
  const activeMembership = await membershipService.getActiveUserMembership(
    userId
  );
  const team = activeMembership
    ? await teamService.getTeamById(activeMembership.teamId)
    : null;
  return {
    ...actorUser.toJSON(),
    activeMembership: activeMembership
      ? {
          ...activeMembership.toJSON(),
          team: team ? team.toJSON() : null,
        }
      : null,
  };
}
