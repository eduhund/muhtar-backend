import Membership from "../../models/Membership";
import User from "../../models/User";
import { membershipService, teamService, userService } from "../../services";

export default async function getMe(actorUser: User) {
  const userId = actorUser.getId();
  const activeMembershipId = actorUser.activeMembershipId;
  let activeMembership = null;

  if (activeMembershipId) {
    activeMembership = await membershipService.getMembershipById(
      activeMembershipId
    );
  } else {
    activeMembership = await membershipService
      .getMembershipsByUser(userId)
      .then((memberships) => memberships[0] || null);
    if (activeMembership) {
      actorUser.setActiveMembershipId(activeMembership.getId());
      await userService.save(actorUser);
    }
  }
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
