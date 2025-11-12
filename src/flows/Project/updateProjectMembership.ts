import { membershipService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";
import User from "../../models/User";
import Membership from "../../models/Membership";
import { AccessRole } from "../../utils/accessRoles";

type MembershipParams = {
  accessRole?: AccessRole;
  workRole?: string;
  multiplier?: number;
};

async function canUpdateMemberships(currentMembership: Membership) {
  if (currentMembership.getAccessRoleIndex() >= 2) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed update memberships in the project"
  );
}

export default async function updateProjectMembership(
  projectId: string,
  membershipId: string,
  update: MembershipParams,
  currentUser: User
) {
  const project = await projectService.getProjectById(projectId);
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: project.teamId,
  });
  if (!currentMembership) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  await canUpdateMemberships(currentMembership);

  const membership = await membershipService.getMembershipById(membershipId);

  if (!membership) {
    throw new BusinessError("NOT_FOUND", `Membership not found`);
  }

  if (membership.teamId !== project.teamId) {
    throw new BusinessError(
      "FORBIDDEN",
      "Membership does not belong to this project team"
    );
  }

  project.updateMembership(membership.getId(), update, currentMembership);
  await projectService.save(project);

  return {};
}
