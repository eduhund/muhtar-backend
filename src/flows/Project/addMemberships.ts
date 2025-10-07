import { memberships, projects } from "../../services";
import { BusinessError } from "../../utils/Rejection";
import User from "../../models/User";
import Membership from "../../models/Membership";

type MembershipParams = { id: string; workRole?: string; multiplier?: number };
type AddMembershipsParams = {
  memberships: MembershipParams[];
};

async function canAddMemberships(currentMembership: Membership) {
  if (currentMembership.getAccessRoleIndex() >= 2) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to add users to the project"
  );
}

export default async function addMemberships(
  id: string,
  { memberships: membershipList }: AddMembershipsParams,
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

  await canAddMemberships(currentMembership);

  for (const membershipData of membershipList) {
    const membership = await memberships.getMembershipById(membershipData.id);

    if (!membership) {
      throw new BusinessError("NOT_FOUND", `Membership not found`);
    }

    if (membership.teamId !== project.teamId) {
      throw new BusinessError(
        "FORBIDDEN",
        "Membership does not belong to this project team"
      );
    }

    project.addMembership({
      membershipId: membership.getId(),
      workRole: membershipData.workRole || membership.workRole,
      multiplier: membershipData.multiplier || 1,
    });
  }

  return {};
}
