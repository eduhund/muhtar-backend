import Membership, { MembershipAccessRole } from "../../models/Membership";
import User from "../../models/User";
import { membershipService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type changeTeamMembershipParams = {
  membershipId: string;
  accessRole: MembershipAccessRole;
};

const membershipAccessRoles = ["guest", "user", "manager", "admin", "owner"];

async function canUpdateTeamMembership(
  currentMembership: Membership,
  accessRole: string
) {
  const currentMembershipAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === currentMembership.accessRole
  );
  const newAccessRoleIndex = membershipAccessRoles.findIndex(
    (role) => role === accessRole
  );
  if (currentMembershipAccessRoleIndex > newAccessRoleIndex) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to change team membership access role"
  );
}

export default async function changeMembershipAccessRole(
  teamId: string,
  { membershipId, accessRole }: changeTeamMembershipParams,
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

  await canUpdateTeamMembership(currentMembership, accessRole);

  membership.changeAccessRole(accessRole, currentMembership);
  return {};
}
