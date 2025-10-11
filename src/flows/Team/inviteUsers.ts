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
    "You are not allowed to invite users to the team"
  );
}

export default async function inviteUsers(
  teamId: string,
  { invitees }: InviteUsersParams,
  currentUser: User
) {
  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  await canInvite(teamId, currentMembership);

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
    membership.invite(currentMembership);
  }

  return {};
}
