import Membership from "../../models/Membership";
import { membershipService } from "../../services";
import { BusinessError } from "../../utils/Rejection";
import { AccessRole } from "../../utils/accessRoles";

type changeTeamMembershipParams = {
  membershipId: string;
  accessRole: AccessRole;
};

const membershipAccessRoles = ["guest", "user", "manager", "admin", "owner"];

async function canUpdateTeamMembership(
  currentMembership: Membership,
  accessRole: string,
) {
  const currentMembershipAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === currentMembership.accessRole,
  );
  const newAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === accessRole,
  );
  if (currentMembershipAccessRoleIndex > newAccessRoleIndex) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to change team membership access role",
  );
}

export default async function changeMembershipAccessRole(
  { membershipId, accessRole }: changeTeamMembershipParams,
  actorMembership: Membership,
) {
  const { teamId } = actorMembership;

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

  await canUpdateTeamMembership(actorMembership, accessRole);

  membership.changeAccessRole(accessRole, actorMembership);
  return {};
}
