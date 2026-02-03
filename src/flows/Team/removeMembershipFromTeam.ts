import Membership from "../../models/Membership";
import { membershipService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

const membershipAccessRoles = ["guest", "user", "manager", "admin", "owner"];

async function canRemoveMembershipFromTeam(
  currentMembership: Membership,
  membership: Membership,
) {
  const currentMembershipAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === currentMembership.accessRole,
  );
  const newAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === membership.accessRole,
  );
  if (currentMembershipAccessRoleIndex > newAccessRoleIndex) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to remove team membership",
  );
}

export default async function removeMembershipFromTeam(
  teamId: string,
  membershipId: string,
  actorMembership: Membership,
) {
  if (actorMembership.teamId !== teamId) {
    throw new BusinessError("FORBIDDEN", "You are not a member of this team");
  }

  const membership = await membershipService.getMembershipById(membershipId);
  if (!membership) {
    throw new BusinessError("NOT_FOUND", `Membership not found`);
  }

  if (membership.teamId !== teamId) {
    throw new BusinessError(
      "FORBIDDEN",
      "Membership does not belong to this team",
    );
  }

  await canRemoveMembershipFromTeam(actorMembership, membership);

  //await membership.archive(actorMembership);
  return {};
}
