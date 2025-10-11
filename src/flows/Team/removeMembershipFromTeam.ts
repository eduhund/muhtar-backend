import Membership from "../../models/Membership";
import User from "../../models/User";
import { membershipService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

const membershipAccessRoles = ["guest", "user", "manager", "admin", "owner"];

async function canRemoveMembershipFromTeam(
  currentMembership: Membership,
  membership: Membership
) {
  const currentMembershipAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === currentMembership.accessRole
  );
  const newAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === membership.accessRole
  );
  if (currentMembershipAccessRoleIndex > newAccessRoleIndex) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to remove team membership"
  );
}

export default async function removeMembershipFromTeam(
  teamId: string,
  membershipId: string,
  currentUser: User
) {
  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  const membership = await membershipService.getMembershipById(membershipId);
  if (!membership) {
    throw new BusinessError("NOT_FOUND", `Membership not found`);
  }

  if (membership.teamId !== teamId) {
    throw new BusinessError(
      "FORBIDDEN",
      "Membership does not belong to this team"
    );
  }

  await canRemoveMembershipFromTeam(currentMembership, membership);

  //await membership.archive(currentMembership);
  return {};
}
