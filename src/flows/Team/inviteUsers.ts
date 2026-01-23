import { membershipService, userService } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import User from "../../models/User";

type InviteeType = { email: string; accessRole?: string };
type InviteUsersParams = {
  invitees: InviteeType[];
};

async function canInvite(teamId: string, currentMembership: Membership) {
  if (
    teamId === currentMembership.teamId &&
    (currentMembership.isOwner() || currentMembership.isAdmin())
  )
    return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to invite users to the team",
  );
}

export default async function inviteUsers(
  teamId: string,
  { invitees }: InviteUsersParams,
  actorUser: User,
) {
  const actorMembership = await membershipService.getMembership({
    userId: actorUser.getId(),
    teamId: teamId,
  });
  if (!actorMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  await canInvite(teamId, actorMembership);
  for (const invitee of invitees) {
    const { email, accessRole = "user" } = invitee;
    const user =
      (await userService.getUserByEmail(email)) ||
      (await userService.createBatch({ email }));
    const userId = user.getId();
    const membership =
      (await membershipService.getMembership({
        userId,
        teamId,
      })) ||
      (await membershipService.createMembership({
        userId,
        teamId,
        accessRole,
      }));
    membership.invite(actorMembership);
  }

  return {};
}
