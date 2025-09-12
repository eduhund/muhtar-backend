import { memberships, users } from "../../services";
import Membership from "../../models/Membership";
import BussinessError from "../../utils/Rejection";
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

  throw new BussinessError(
    "FORBIDDEN",
    "You are not allowed to invite users to the team"
  );
}

export default async function inviteUsers(
  teamId: string,
  { invitees }: InviteUsersParams,
  currentUser: User
) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BussinessError("FORBIDDEN", "You are not a member of this team");
  }

  await canInvite(teamId, currentMembership);

  for (const invitee of invitees) {
    const { email, accessRole = "user" } = invitee;
    const user =
      (await users.getUserByEmail(email)) ||
      (await users.createBatchUser({ email }));
    const userId = user.getId();
    const membership =
      (await memberships.getMembership({
        userId,
        teamId,
      })) ||
      (await memberships.createMembership({
        userId,
        teamId,
        accessRole,
      }));
    membership.invite();
  }

  return {};
}
