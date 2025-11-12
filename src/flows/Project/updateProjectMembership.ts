import { membershipService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";
import Membership from "../../models/Membership";
import { AccessRole } from "../../utils/accessRoles";
import Project from "../../models/Project";

type MembershipParams = {
  accessRole?: AccessRole;
  workRole?: string;
  multiplier?: number;
};

async function canUpdateMemberships(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isAdmin()) return true;
  if (project.isProjectAdmin(currentMembership.getId())) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed update memberships in the project"
  );
}

export default async function updateProjectMembership(
  projectId: string,
  membershipId: string,
  update: MembershipParams,
  actorMembership: Membership
) {
  const project = await projectService.getProjectById(projectId);
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  await canUpdateMemberships(actorMembership, project);

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

  project.updateMembership(membership.getId(), update, actorMembership);
  await projectService.save(project);

  return {};
}
