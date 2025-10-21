import Membership from "../../models/Membership";
import User from "../../models/User";
import { membershipService, teamService } from "../../services";

export default async function getMe(actorUser: User) {
  const userId = actorUser.getId();
  const memberships = await membershipService.getMembershipsByUser(userId);
  const activeMembership = await membershipService.getActiveUserMembership(
    userId
  );
  const activeTeam = activeMembership
    ? await teamService.getTeamById(activeMembership.teamId)
    : null;

  const data = {
    ...actorUser.toJSON(),
    memberships: memberships.map((m: Membership) => m.toJSON()),
    activeMembership: activeMembership ? activeMembership.toJSON() : null,
    activeTeam: activeTeam ? activeTeam.toJSON() : null,
  };

  delete data.activeMembershipId;

  return data;
}
