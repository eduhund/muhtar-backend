import Membership from "../../models/Membership";
import Time from "../../models/Time";
import User from "../../models/User";
import { memberships, time } from "../../services";
import { BusinessError } from "../../utils/Rejection";

function canGetTime(currentMembership: Membership, timeItem: Time) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  if (timeItem.membershipId === currentMembershipId) return true;
  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to get the time entry"
  );
}

export default async function getTime(id: string, currentUser: User) {
  const timeItem = await time.getTimeById(id);
  if (!timeItem) {
    throw new BusinessError("NOT_FOUND", "Time entry not found");
  }

  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: timeItem.teamId,
  });

  if (!currentMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  if (canGetTime(currentMembership, timeItem)) return timeItem;
}
