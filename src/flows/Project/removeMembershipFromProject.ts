import { memberships, projects } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import User from "../../models/User";

async function canRemoveMembershipsFromProject(currentMembership: Membership) {
  if (currentMembership.getAccessRoleIndex() >= 2) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to remove users from the project"
  );
}

export default async function removeMembershipFromProject(
  id: string,
  membershipId: string,
  currentUser: User
) {
  const project = await projects.getProjectById(id);
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: project.teamId,
  });
  if (!currentMembership) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  await canRemoveMembershipsFromProject(currentMembership);

  const membership = await memberships.getMembershipById(membershipId);

  if (!membership) {
    throw new BusinessError("NOT_FOUND", `Membership not found`);
  }

  if (membership.teamId !== project.teamId) {
    throw new BusinessError(
      "FORBIDDEN",
      "Membership does not belong to this project team"
    );
  }

  project.removeMembership(membership.getId());

  return {};
}
